import { useMemo, useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Package, Plus, Edit, Trash2, MapPin, BarChart3, ArrowUpRight, TrendingUp } from "lucide-react"

const produceTypes = [
  "Vegetable",
  "Fruit", 
  "Grain",
  "Leafy Greens",
  "Pulse",
  "Spice",
  "Dairy",
  "Other",
]

function emptyProduce() {
  return {
    id: "",
    name: "",
    type: "",
    quantity: 0,
    basePrice: 0,
    locality: "",
  }
}

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
  const totalValue = useMemo(() => produce.reduce((sum, p) => sum + (Number(p.quantity || 0) * Number(p.basePrice || 0)), 0), [produce])
  const avgPrice = useMemo(() => {
    if (totalQty === 0) return 0
    return (totalValue / totalQty).toFixed(2)
  }, [totalValue, totalQty])

  return (
    <section 
      id="produce" 
      className="py-16 px-6 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50" 
      style={{ scrollMarginTop: '30px' }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Produce Management</h2>
          <p className="text-gray-600">Track and manage your agricultural inventory</p>
        </div>

        {/* Stats Cards - Same structure as retailer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>SKUs</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{totalSkus}</p>
                <p className="text-sm text-gray-600 capitalize">Total Products</p>
                <p className="text-xs text-gray-500 mt-1">active inventory</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-50">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+8%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{totalQty.toLocaleString()}</p>
                <p className="text-sm text-gray-600 capitalize">Total Inventory</p>
                <p className="text-xs text-gray-500 mt-1">kg available</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-50">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-purple-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">₹{totalValue.toLocaleString()}</p>
                <p className="text-sm text-gray-600 capitalize">Total Value</p>
                <p className="text-xs text-gray-500 mt-1">market worth</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-50">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-orange-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Avg</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">₹{avgPrice}</p>
                <p className="text-sm text-gray-600 capitalize">Average Price</p>
                <p className="text-xs text-gray-500 mt-1">per kg rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product & Preview Section - Same layout as retailer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Add Product Form */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Add New Product</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-3">Product Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="h-12 border-gray-200"
                  placeholder="e.g., Organic Tomatoes"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-3">Type *</Label>
                <Select value={form.type} onValueChange={(value) => setForm({...form, type: value})}>
                  <SelectTrigger className="h-12 border-gray-200">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {produceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-3">Quantity (kg) *</Label>
                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({...form, quantity: e.target.value})}
                    className="h-12 border-gray-200"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-3">Price (₹/kg) *</Label>
                  <Input
                    type="number"
                    value={form.basePrice}
                    onChange={(e) => setForm({...form, basePrice: e.target.value})}
                    className="h-12 border-gray-200"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-3">Location *</Label>
                <Input
                  value={form.locality}
                  onChange={(e) => setForm({...form, locality: e.target.value})}
                  className="h-12 border-gray-200"
                  placeholder="Enter location"
                />
              </div>

              <Button 
                onClick={submit} 
                className="w-full h-12 text-base"
                disabled={!form.name || !form.type || !form.quantity || !form.basePrice || !form.locality}
              >
                {editing ? "Update Product" : "Add Product"}
              </Button>
            </CardContent>
          </Card>

          {/* Live Preview - Same style as retailer */}
          <Card className={`border-0 shadow-sm ${form.name && form.type && form.quantity && form.basePrice && form.locality ? 'ring-2 ring-green-100' : ''}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Product Preview</span>
                {form.name && form.type && form.quantity && form.basePrice && form.locality && (
                  <Badge className="bg-green-100 text-green-800">Ready to Add</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
                <div className="text-center pb-4 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
                  <p className="text-sm text-blue-600 mt-1">Live preview of your product</p>
                  <p className="text-xs text-gray-500 mt-1">Agricultural inventory item</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="font-semibold text-gray-900">{form.name || "Enter name..."}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Type:</span>
                    <span className="font-semibold text-gray-900">{form.type || "Select type..."}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Quantity:</span>
                    <span className="font-semibold text-gray-900">{form.quantity ? `${form.quantity} kg` : "0 kg"}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Price per kg:</span>
                    <span className="font-semibold text-gray-900">₹{form.basePrice || "0.00"}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded-lg">
                    <span className="text-gray-600 font-medium flex items-center">
                      <span className="text-green-600 mr-1">💰</span>
                      Total Value:
                    </span>
                    <span className="font-bold text-green-700 text-lg">₹{((form.quantity || 0) * (form.basePrice || 0)).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Location:</span>
                    <span className="font-semibold text-gray-900">{form.locality || "Enter location..."}</span>
                  </div>
                </div>
                
                <div className="border-t border-blue-100 pt-4">
                  <p className="text-xs text-gray-500 text-center">
                    {form.name && form.type && form.quantity && form.basePrice && form.locality
                      ? "✅ Product ready to be added to inventory"
                      : "⚠️ Complete all fields to add product"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table - Same structure as retailer */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Inventory ({produce.length})</CardTitle>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                Total Value: ₹{totalValue.toLocaleString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {produce.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No products added yet</p>
                <Button onClick={startAdd} className="h-12 text-base">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price/kg</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Value</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {produce.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                            {item.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{item.quantity} kg</td>
                        <td className="px-6 py-4 text-gray-700">₹{item.basePrice}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.locality}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-600">
                            ₹{(item.quantity * item.basePrice).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => startEdit(item)}
                              className="text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => onDelete(item.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
