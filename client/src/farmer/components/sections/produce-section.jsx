import { useMemo, useState } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Badge } from "../../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { emptyProduce, produceTypes } from "../../lib/data"

export default function ProduceSection({ produce, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProduce())

  const startAdd = () => {
    setEditing(null)
    setForm(emptyProduce())
    setOpen(true)
  }

  const startEdit = (p) => {
    setEditing(p)
    setForm(p)
    setOpen(true)
  }

  const submit = () => {
    if (editing) {
      onUpdate(form)
    } else {
      onAdd({ ...form, id: crypto.randomUUID() })
    }
    setOpen(false)
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
                    src={`/placeholder.svg?height=120&width=240&query=produce image placeholder`}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="sr-only">Open Produce Dialog</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Produce" : "Add Produce"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <LabeledInput label="Name">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Tomatoes"
              />
            </LabeledInput>
            <LabeledInput label="Type">
              <Input
                list="produce-types"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="Vegetable"
              />
              <datalist id="produce-types">
                {produceTypes.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </LabeledInput>
            <LabeledInput label="Quantity (kg)">
              <Input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                placeholder="100"
              />
            </LabeledInput>
            <LabeledInput label="Base Price (₹/kg)">
              <Input
                type="number"
                min={0}
                value={form.basePrice}
                onChange={(e) => setForm((f) => ({ ...f, basePrice: Number(e.target.value) }))}
                placeholder="25"
              />
            </LabeledInput>
            <LabeledInput label="Locality">
              <Input
                value={form.locality}
                onChange={(e) => setForm((f) => ({ ...f, locality: e.target.value }))}
                placeholder="Nashik, MH"
              />
            </LabeledInput>
            <LabeledInput label="Quality Certificate URL (optional)">
              <Input
                value={form.certificate || ""}
                onChange={(e) => setForm((f) => ({ ...f, certificate: e.target.value || undefined }))}
                placeholder="https://gateway/your-cert"
              />
            </LabeledInput>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={submit}>
              {editing ? "Save Changes" : "Add Produce"}
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