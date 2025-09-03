import { useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MarginBreakdownChart from "../charts/margin-breakdown-chart"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Textarea } from "../../../components/ui/textarea"
import { exportElementToPDF } from "../../lib/pdf"

export default function ReportsSection({ produce: produceList, reports, onAddReport }) {
  const formRef = useRef(null)
  const reportRef = useRef(null)

  const submitReport = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const entry = {
      id: crypto.randomUUID(),
      party: fd.get("party") || "",
      reason: fd.get("reason") || "",
      details: fd.get("details") || "",
      createdAt: new Date().toISOString(),
    }
    onAddReport(entry)
    formRef.current?.reset()
  }

  const items = produceList ?? []
  const produceNames = useMemo(() => Array.from(new Set(items.map((p) => p.name))), [items])
  const [selectedProduce, setSelectedProduce] = useState(produceNames[0] ?? "Tomatoes")

  const selectedItems = useMemo(() => items.filter((p) => p.name === selectedProduce), [items, selectedProduce])
  const availableLocalities = useMemo(
    () => Array.from(new Set(selectedItems.map((p) => p.locality))).sort(),
    [selectedItems]
  )
  const [selectedLocs, setSelectedLocs] = useState("ALL")

  function hashString(s) {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
    return Math.abs(h)
  }

  function averageBasePrice(list) {
    if (!list.length) return 0
    return list.reduce((acc, p) => acc + p.basePrice, 0) / list.length
  }

  const basePrice = useMemo(() => {
    const pool = selectedLocs === "ALL" ? selectedItems : selectedItems.filter((p) => selectedLocs.includes(p.locality))
    return Number(averageBasePrice(pool).toFixed(2))
  }, [selectedItems, selectedLocs])

  const trendData = useMemo(() => {
    const days = 8
    const seed = hashString(selectedProduce)
    const rows = Array.from({ length: days }).map((_, idx) => {
      const i = days - idx - 1
      const variance = ((seed + i) % 7) - 3 // -3..+3
      const price = Math.max(0, basePrice + variance)
      const cost = Number(Math.max(0, price * 0.7).toFixed(2))
      const ts = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const date = `${String(ts.getMonth() + 1).padStart(2, "0")}-${String(ts.getDate()).padStart(2, "0")}`
      return { date, price: Number(price.toFixed(2)), cost }
    })
    return rows
  }, [basePrice, selectedProduce])

  const localityComparison = useMemo(() => {
    if (!availableLocalities.length) return []
    return availableLocalities.map((loc) => {
      const adj = ((hashString(loc) + hashString(selectedProduce)) % 5) - 2 // -2..+2
      const price = Math.max(0, basePrice + adj)
      return { locality: loc, price: Number(price.toFixed(2)) }
    })
  }, [availableLocalities, basePrice, selectedProduce])

  const marginSummary = useMemo(() => {
    if (!trendData.length) return { avgPrice: 0, avgCost: 0, margin: 0, marginPct: 0 }
    const avgPrice = trendData.reduce((a, b) => a + b.price, 0) / trendData.length
    const avgCost = trendData.reduce((a, b) => a + b.cost, 0) / trendData.length
    const margin = avgPrice - avgCost
    const marginPct = avgPrice ? (margin / avgPrice) * 100 : 0
    return {
      avgPrice: Number(avgPrice.toFixed(2)),
      avgCost: Number(avgCost.toFixed(2)),
      margin: Number(margin.toFixed(2)),
      marginPct: Number(marginPct.toFixed(1)),
    }
  }, [trendData])

  return (
    <div>
      <h2 className="text-2xl font-bold">Reports & Transparency</h2>
      <p className="text-muted-foreground">Log issues with partners and review an interactive price journey.</p>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1 bg-background/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Report a Distributor/Retailer</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={submitReport} className="grid gap-3">
              <Labeled label="Party">
                <Input name="party" placeholder="ABC Distributors" required />
              </Labeled>
              <Labeled label="Reason">
                <Select name="reason" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unfair-pricing">Unfair Pricing</SelectItem>
                    <SelectItem value="delayed-payments">Delayed Payments</SelectItem>
                    <SelectItem value="fraudulent-activities">Fraudulent Activities</SelectItem>
                  </SelectContent>
                </Select>
              </Labeled>
              <Labeled label="Details">
                <Textarea name="details" placeholder="Describe the issue..." />
              </Labeled>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card ref={reportRef} className="lg:col-span-2 bg-background/60 backdrop-blur">
          <CardHeader>
            <CardTitle>
              Price Journey {selectedProduce ? `for ${selectedProduce}` : ""} (Farmer → Distributor → Retailer →
              Consumer)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="produce-select" className="text-sm">
                  Produce
                </Label>
                <Select
                  value={selectedProduce}
                  onValueChange={(v) => {
                    setSelectedProduce(v)
                    setSelectedLocs("ALL")
                  }}
                >
                  <SelectTrigger id="produce-select" className="w-48">
                    <SelectValue placeholder="Select produce" />
                  </SelectTrigger>
                  <SelectContent>
                    {produceNames.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availableLocalities.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Localities:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant={selectedLocs === "ALL" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLocs("ALL")}
                      aria-pressed={selectedLocs === "ALL"}
                    >
                      All
                    </Button>
                    {availableLocalities.map((loc) => {
                      const active = selectedLocs !== "ALL" && selectedLocs.includes(loc)
                      return (
                        <Button
                          key={loc}
                          type="button"
                          variant={active ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedLocs((prev) => {
                              if (prev === "ALL") return [loc]
                              const s = new Set(prev)
                              if (s.has(loc)) s.delete(loc)
                              else s.add(loc)
                              const arr = Array.from(s)
                              return arr.length ? arr : "ALL"
                            })
                          }}
                          aria-pressed={active}
                        >
                          {loc}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <MarginBreakdownChart />

            <div className="mt-2">
              <Button variant="outline" onClick={() => exportElementToPDF(reportRef.current, "price-journey.pdf")}>
                Download Report as PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="bg-background/60 backdrop-blur">
          <CardHeader>
            <CardTitle>My Report History</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports yet.</p>
            ) : (
              <ul className="grid gap-2">
                {reports.map((r) => (
                  <li key={r.id} className="border rounded-md p-3">
                    <div className="text-sm">
                      <span className="font-medium">Party:</span> {r.party}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Reason:</span> {prettyReason(r.reason)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Details:</span> {r.details || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Labeled({ label, children }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}

function prettyReason(v) {
  switch (v) {
    case "unfair-pricing":
      return "Unfair Pricing"
    case "delayed-payments":
      return "Delayed Payments"
    case "fraudulent-activities":
      return "Fraudulent Activities"
    default:
      return v
  }
}

function Metric({ label, value }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-medium">{value}</div>
    </div>
  )
}