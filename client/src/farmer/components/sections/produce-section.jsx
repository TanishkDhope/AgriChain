import { useMemo, useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom"
import { toast } from "react-toastify";


import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { QRCodeSVG } from "qrcode.react"; // ✅ Added for QR codes
import { emptyProduce, produceTypes } from "../../lib/data";
import {
  mint,
  getUserTokens,
  deleteFromMemory,
} from "../../../blockchain/product_registry.js";

export default function ProduceSection({ produce, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [form, setForm] = useState(emptyProduce());
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ QR popup state
  const [qrOpen, setQrOpen] = useState(false);
  const [qrToken, setQrToken] = useState(null);

  // ⚠️ Never hardcode JWT in production frontend!
  const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNmI3M2VlOS1lNzRlLTQ0YTEtODgxNi05Nzc4NWRhNjljZjYiLCJlbWFpbCI6InRhbmlzaGtkaG9wZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmU2ZjQxNWMzYjk0MmUyOTI4MzUiLCJzY29wZWRLZXlTZWNyZXQiOiI3YTQ5NjUxNjI1ZGE0YjU2MzYyYjRiNjIyOGEzM2M1MGI3MDRiM2MzZGE0MGZmMDI1M2MzY2YyMWFjNmE3YjgxIiwiZXhwIjoxNzg4NTg2Mjg3fQ.oYZeQNa7NcFKTysjoZ7O2iFbp0eeRNKUWBARJu3QW0U";

  const startAdd = () => {
    setEditing(null);
    setForm(emptyProduce());
    setSelectedImage(null);
    setOpen(true);
  };

  const startEdit = (p) => {
    setEditing(p);
    setForm(p);
    setSelectedImage(null);
    setOpen(true);
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleGetTokens = async () => {
    const result = await getUserTokens();
    setTokens(result);
  };

  useEffect(() => {
    handleGetTokens();
  }, []);

  useEffect(() => {
    if (open === false) {
      handleGetTokens();
    }
  }, [open]);

  const uploadToIPFSAndMint = async () => {
    try {
      setIsUploading(true);
      if (
        !form.name ||
        !form.type ||
        !form.quantity ||
        !form.basePrice ||
        !form.locality
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      let imageCid = null;

      // Step 1: Upload image
      if (selectedImage) {
        const imgData = new FormData();
        imgData.append("file", selectedImage);
        imgData.append("network", "public");

        const imgUpload = await fetch("https://uploads.pinata.cloud/v3/files", {
          method: "POST",
          headers: { Authorization: `Bearer ${JWT}` },
          body: imgData,
        });

        const imgRes = await imgUpload.json();
        imageCid = imgRes?.data?.cid || null;
      }

      // Step 2: Build metadata
      const metadata = {
        name: form.name,
        type: form.type,
        quantity: form.quantity,
        basePrice: form.basePrice,
        locality: form.locality,
        certificate: form.certificate || null,
        image: imageCid ? `ipfs://${imageCid}` : null,
        farmId: `FARM_${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
      };

      const fileName = `${metadata.farmId}_${Date.now()}.json`;
      const blob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      });
      const jsonFile = new File([blob], fileName, { type: "application/json" });

      const jsonData = new FormData();
      jsonData.append("file", jsonFile);
      jsonData.append("network", "public");

      // Step 3: Upload JSON metadata
      const request = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: { Authorization: `Bearer ${JWT}` },
        body: jsonData,
      });

      const response = await request.json();
      const metadataCid = response?.data?.cid;
      if (!metadataCid) throw new Error("Failed to upload metadata");

      // Step 4: Mint tokens
      const tokenURI = `ipfs://${metadataCid}`;
      const mintAmount = form.quantity;
      await mint(mintAmount, tokenURI);
      await handleGetTokens();

      const newProduceItem = {
        ...form,
        id: crypto.randomUUID(),
        ipfsCid: metadataCid,
        tokenURI,
        imageCid,
      };

      if (editing) onUpdate(newProduceItem);
      else onAdd(newProduceItem);

      toast.success(`Metadata uploaded & ${mintAmount} tokens minted!`);
      setOpen(false);
    } catch (error) {
      console.error("Upload and mint error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const submit = () => {
    if (editing && !selectedImage) {
      onUpdate(form);
      setOpen(false);
    } else {
      uploadToIPFSAndMint();
    }
  };

  const handleDeleteToken = async (tokenId, quantity) => {
    if (
      !window.confirm(
        `Delete token ID ${tokenId} and burn ${quantity} tokens?`
      )
    )
      return;
    try {
      await deleteFromMemory(quantity, tokenId);
      onDelete(tokenId);
      toast.success(`Token ${tokenId} deleted successfully.`);
      handleGetTokens();
    } catch (error) {
      console.error("Delete token error:", error);
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  const handleShowQR = (t) => {
    setQrToken(t);
    setQrOpen(true);
  };

  const totalSkus = produce.length;
  const totalQty = useMemo(
    () => produce.reduce((sum, p) => sum + Number(p.quantity || 0), 0),
    [produce]
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Produce</h2>
          <p className="text-muted-foreground">
            Manage your listed items and certificates.
          </p>
        </div>
        <Button
          onClick={startAdd}
          className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
        >
          Add Produce
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Items" value={totalSkus.toString()} />
        <Stat label="Total Quantity" value={totalQty.toString()} />
        <Stat label="Avg. Base Price" value={`₹${avgBase(produce).toFixed(2)}`} />
        <Stat
          label="Certificates"
          value={`${produce.filter((p) => !!p.certificate).length}`}
        />
      </div>

      {/* Views */}
      <Tabs defaultValue="cards" className="mt-6">
        <TabsList className="flex gap-4 bg-emerald-50/50 p-2 rounded-xl">
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        {/* Card View */}
        <TabsContent value="cards" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens?.map((t, idx) => (
              <Card key={idx}    className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{t.name}</span>
                    <Badge variant="outline">Token</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <div>ID: {t.id.toString()}</div>
                  <div>Quantity: {t.balance}</div>
                  <div>Locality: {t.metadata?.locality}</div>
                  <div>Type: {t.metadata?.type}</div>
                  <p className="text-gray-600">{t.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button className="cursor-pointer" size="sm" variant="outline" onClick={() => startEdit(t)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className=" cursor-pointer bg-emerald-600 text-white"
                    onClick={() => handleShowQR(t)}
                  >
                    Show QR
                  </Button>
                  <Button
                  className="cursor-pointer"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteToken(t.id, t.balance)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="mt-6">
          <div className="overflow-x-auto border rounded-xl">
            <Table>
              <TableHeader className="bg-emerald-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Locality</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens?.map((t, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.id.toString()}</TableCell>
                    <TableCell>{t.balance}</TableCell>
                    <TableCell>{t.metadata?.locality}</TableCell>
                    <TableCell>{t.metadata?.type}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(t)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 text-white"
                          onClick={() => handleShowQR(t)}
                        >
                          Show QR
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteToken(t.id, t.balance)}
                        >
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

      {/* QR Code Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="flex flex-col items-center gap-4">
          <DialogHeader>
            <DialogTitle>Product QR Code</DialogTitle>
          </DialogHeader>
          {qrToken && (
            <>
              <QRCodeSVG
                value={`http://localhost:5173/#/product/${qrToken.id.toString()}`}
                size={220}
                level="H"
                includeMargin
              />
              <p className="text-sm text-gray-600">
                Scan to view {qrToken.name}
              </p>
            </>
          )}
          <Button
            onClick={() => setQrOpen(false)}
            className="bg-emerald-600 text-white"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Produce Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Produce" : "Add Produce"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <LabeledInput label="Name *">
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Tomatoes"
              />
            </LabeledInput>
            <LabeledInput label="Type *">
              <Input
                list="produce-types"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                placeholder="Vegetable"
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
                value={form.quantity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
                }
              />
            </LabeledInput>
            <LabeledInput label="Base Price (₹/kg) *">
              <Input
                type="number"
                value={form.basePrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, basePrice: Number(e.target.value) }))
                }
              />
            </LabeledInput>
            <LabeledInput label="Locality *">
              <Input
                value={form.locality}
                onChange={(e) =>
                  setForm((f) => ({ ...f, locality: e.target.value }))
                }
              />
            </LabeledInput>
            <LabeledInput label="Certificate URL">
              <Input
                value={form.certificate || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    certificate: e.target.value || undefined,
                  }))
                }
              />
            </LabeledInput>
            <LabeledInput label="Produce Image">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </LabeledInput>
          </div>
          <div className="cursor-pointer mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 text-white cursor-pointer"
              onClick={submit}
              disabled={isUploading}
            >
              {isUploading
                ? "Uploading..."
                : editing
                ? "Save Changes"
                : "Add & Mint Tokens"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function LabeledInput({ label, children }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

function avgBase(list) {
  if (!list.length) return 0;
  return list.reduce((s, p) => s + Number(p.basePrice || 0), 0) / list.length;
}