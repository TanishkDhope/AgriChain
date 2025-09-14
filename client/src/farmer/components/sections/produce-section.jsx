import { useMemo, useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Badge } from "../../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { emptyProduce, produceTypes } from "../../lib/data"
import { mint, getUserTokens } from "../../../blockchain/product_registry.js"

export default function ProduceSection({ produce, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [tokens, setTokens] = useState([]);
  const [form, setForm] = useState(emptyProduce())
  const [selectedImage, setSelectedImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // ⚠️ Never hardcode JWT in production frontend!
  const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNmI3M2VlOS1lNzRlLTQ0YTEtODgxNi05Nzc4NWRhNjljZjYiLCJlbWFpbCI6InRhbmlzaGtkaG9wZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmU2ZjQxNWMzYjk0MmUyOTI4MzUiLCJzY29wZWRLZXlTZWNyZXQiOiI3YTQ5NjUxNjI1ZGE0YjU2MzYyYjRiNjIyOGEzM2M1MGI3MDRiM2MzZGE0MGZmMDI1M2MzY2YyMWFjNmE3YjgxIiwiZXhwIjoxNzg4NTg2Mjg3fQ.oYZeQNa7NcFKTysjoZ7O2iFbp0eeRNKUWBARJu3QW0U"

  const startAdd = () => {
    setEditing(null)
    setForm(emptyProduce())
    setSelectedImage(null)
    setOpen(true)
  }

  const startEdit = (p) => {
    setEditing(p)
    setForm(p)
    setSelectedImage(null)
    setOpen(true)
  }

  // Handle file input
  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0])
  }

  const handleGetTokens = async () => {
    const result = await getUserTokens();
    setTokens(result);
  };

  useEffect(() => {
    handleGetTokens()
  }, [])

  // Upload to IPFS and mint tokens
  const uploadToIPFSAndMint = async () => {
    try {
      setIsUploading(true)
      
      if (!form.name || !form.type || !form.quantity || !form.basePrice || !form.locality) {
        alert("Please fill in all required fields.")
        return
      }

      let imageCid = null

      // Step 1: Upload image first (if provided)
      if (selectedImage) {
        const imgData = new FormData()
        imgData.append("file", selectedImage)
        imgData.append("network", "public")

        const imgUpload = await fetch("https://uploads.pinata.cloud/v3/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: imgData,
        })

        const imgRes = await imgUpload.json()
        console.log("Image upload response:", imgRes)
        imageCid = imgRes?.data?.cid || null
      }

      // Step 2: Build JSON metadata including image CID and produce details
      const metadata = {
        name: form.name,
        type: form.type,
        quantity: form.quantity,
        basePrice: form.basePrice,
        locality: form.locality,
        certificate: form.certificate || null,
        image: imageCid ? `ipfs://${imageCid}` : null,
        farmId: `FARM_${crypto.randomUUID()}`, // Generate unique farm ID
        createdAt: new Date().toISOString(),
      }

      // Generate unique filename: farmId + timestamp
      const fileName = `${metadata.farmId}_${Date.now()}.json`

      const blob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      })
      const jsonFile = new File([blob], fileName, {
        type: "application/json",
      })

      const jsonData = new FormData()
      jsonData.append("file", jsonFile)
      jsonData.append("network", "public")

      // Step 3: Upload JSON metadata to IPFS
      const request = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: jsonData,
      })

      const response = await request.json()
      console.log("Metadata upload response:", response)
      
      const metadataCid = response?.data?.cid
      if (!metadataCid) {
        throw new Error("Failed to get metadata CID from IPFS upload")
      }

      // Step 4: Mint tokens with the metadata CID as URI
      const tokenURI = `ipfs://${metadataCid}`
      const mintAmount = form.quantity // Use quantity as the amount of tokens to mint
      
      console.log("Minting tokens with:", { amount: mintAmount, uri: tokenURI })
      await mint(mintAmount, tokenURI)
      
      // Step 5: Update local state with the new produce item
      const newProduceItem = {
        ...form,
        id: crypto.randomUUID(),
        ipfsCid: metadataCid,
        tokenURI: tokenURI,
        imageCid: imageCid,
      }

      if (editing) {
        onUpdate(newProduceItem)
      } else {
        onAdd(newProduceItem)
      }

      // Step 6: Refresh user tokens
      try {
        await getUserTokens()
      } catch (error) {
        console.log("Note: Could not refresh user tokens:", error)
      }

      alert(`Success! Metadata uploaded to IPFS (CID: ${metadataCid}) and ${mintAmount} tokens minted!`)
      setOpen(false)
      
    } catch (error) {
      console.error("Upload and mint error:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const submit = () => {
    if (editing && !selectedImage) {
      // For editing without new image, just update locally
      onUpdate(form)
      setOpen(false)
    } else {
      // For new items or editing with new image, upload to IPFS and mint
      uploadToIPFSAndMint()
    }
  }

  const totalSkus = produce.length
  const totalQty = useMemo(() => produce.reduce((sum, p) => sum + Number(p.quantity || 0), 0), [produce])

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Produce</h2>
          <p className="text-muted-foreground">Manage your listed items and certificates.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={startAdd} className="bg-emerald-600 hover:bg-emerald-700">
            Add Produce
          </Button>
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Items" value={totalSkus.toString()} />
        <Stat label="Total Quantity" value={totalQty.toString()} />
        <Stat label="Avg. Base Price" value={`₹${avgBase(produce).toFixed(2)}`} />
        <Stat label="Certificates" value={`${produce.filter((p) => !!p.certificate).length}`} />
      </div>

      <Tabs defaultValue="cards" className="mt-6">
        <TabsList>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {produce.map((p) => (
              <Card
                key={p.id}
                className="bg-background/60 backdrop-blur border-emerald-200/30 hover:shadow-sm transition"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{p.name}</span>
                    <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                      Blockchain
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <img
                    src={p.imageCid ? `https://gateway.pinata.cloud/ipfs/${p.imageCid}` : `/placeholder.svg?height=120&width=240&query=produce image placeholder`}
                    alt={`${p.name} image`}
                    className="w-full h-28 object-cover rounded-md border"
                  />
                  <div className="text-sm text-muted-foreground">Type: {p.type}</div>
                  <div className="text-sm text-muted-foreground">Qty: {p.quantity}</div>
                  <div className="text-sm text-muted-foreground">Base Price: ₹{p.basePrice}</div>
                  <div className="text-sm text-muted-foreground">Locality: {p.locality}</div>
                  <div className="text-sm text-muted-foreground">
                    Certificate: {p.certificate ? "Available" : "—"}
                  </div>
                  {p.ipfsCid && (
                    <div className="text-xs text-blue-600">
                      IPFS CID: {p.ipfsCid.slice(0, 10)}...
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(p.id)}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Locality</TableHead>
                  <TableHead>Certificate</TableHead>
                  <TableHead>IPFS CID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produce.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.type}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>₹{p.basePrice}</TableCell>
                    <TableCell>{p.locality}</TableCell>
                    <TableCell>{p.certificate ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-xs">
                      {p.ipfsCid ? `${p.ipfsCid.slice(0, 10)}...` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        {tokens?.map((t, idx) => (
          <div key={idx} className="token-card">
            <img src={t.image} alt={t.name} />
            <h3>{t.name}</h3>
            <p>ID: {t.id.toString()}</p>
            <p>Quantity: {t.balance}</p>
            <p>Locality: {t.metadata.locality}</p>
            <p>Type: {t.metadata.type}</p>
            <p>{t.description}</p>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="sr-only">Open Produce Dialog</span>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Produce" : "Add Produce"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <LabeledInput label="Name *">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Tomatoes"
                required
              />
            </LabeledInput>
            <LabeledInput label="Type *">
              <Input
                list="produce-types"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="Vegetable"
                required
              />
              <datalist id="produce-types">
                {produceTypes.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </LabeledInput>
            <LabeledInput label="Quantity (kg) *">
              <Input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                placeholder="100"
                required
              />
            </LabeledInput>
            <LabeledInput label="Base Price (₹/kg) *">
              <Input
                type="number"
                min={0}
                value={form.basePrice}
                onChange={(e) => setForm((f) => ({ ...f, basePrice: Number(e.target.value) }))}
                placeholder="25"
                required
              />
            </LabeledInput>
            <LabeledInput label="Locality *">
              <Input
                value={form.locality}
                onChange={(e) => setForm((f) => ({ ...f, locality: e.target.value }))}
                placeholder="Nashik, MH"
                required
              />
            </LabeledInput>
            <LabeledInput label="Quality Certificate URL (optional)">
              <Input
                value={form.certificate || ""}
                onChange={(e) => setForm((f) => ({ ...f, certificate: e.target.value || undefined }))}
                placeholder="https://gateway/your-cert"
              />
            </LabeledInput>
            <LabeledInput label="Produce Image">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {selectedImage && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {selectedImage.name}
                </p>
              )}
            </LabeledInput>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700" 
              onClick={submit}
              disabled={isUploading}
            >
              {isUploading ? "Uploading & Minting..." : (editing ? "Save Changes" : "Add & Mint Tokens")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <Card className="bg-background/60 backdrop-blur">
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

function LabeledInput({ label, children }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}

function avgBase(list) {
  if (!list.length) return 0
  return list.reduce((s, p) => s + Number(p.basePrice || 0), 0) / list.length
}