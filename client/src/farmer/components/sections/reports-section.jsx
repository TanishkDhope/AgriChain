import { useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { FileText, Download, TrendingUp, BarChart3, AlertCircle } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)

export default function ReportsSection({ produce: produceList, reports, onAddReport }) {
  const [showIssueForm, setShowIssueForm] = useState(false)
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
    e.target.reset()
    setShowIssueForm(false)
  }

  // Revenue Trend Chart Data - Colorful like retailer
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#3B82F6',
      },
      {
        label: 'Profit',
        data: [15000, 18000, 16000, 22000, 19000, 24000],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#10B981',
      },
    ],
  }

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
      },
      tooltip: {
        backgroundColor: '#374151',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 6,
        callbacks: {
          label: (context) => `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#6B7280', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#F3F4F6', drawBorder: false },
        border: { display: false },
        ticks: { 
          color: '#6B7280', 
          font: { size: 11 },
          callback: (value) => `₹${(value / 1000)}k`,
        },
      },
    },
  }

  // Produce Distribution Chart - Colorful pie
  const produceDistributionData = {
    labels: ['Vegetables', 'Fruits', 'Grains', 'Leafy Greens', 'Others'],
    datasets: [
      {
        data: [45, 30, 15, 25, 18],
        backgroundColor: [
          '#22C55E',  // Green
          '#FB923C',  // Orange
          '#A855F7',  // Purple
          '#3B82F6',  // Blue
          '#EC4899',  // Pink
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  const produceDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: '#374151',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 6,
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`,
        },
      },
    },
  }

  const handleExport = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <section 
      id="reports" 
      className="py-16 px-6 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50" 
      style={{ scrollMarginTop: '30px' }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Analytics & Reports</h2>
              <p className="text-gray-600">Comprehensive insights and issue tracking</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => setShowIssueForm(!showIssueForm)}
              variant="outline" 
              className="h-12 text-base"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            <Button onClick={handleExport} className="h-12 text-base">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Issue Form */}
        {showIssueForm && (
          <Card className="border-0 shadow-sm mb-10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Report an Issue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitReport} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-3">Party/Organization</Label>
                    <Input
                      name="party"
                      placeholder="Enter organization name"
                      className="h-12 border-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-3">Issue Type</Label>
                    <Select name="reason">
                      <SelectTrigger className="h-12 border-gray-200">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">Payment Delay</SelectItem>
                        <SelectItem value="quality">Quality Issues</SelectItem>
                        <SelectItem value="delivery">Delivery Problems</SelectItem>
                        <SelectItem value="contract">Contract Violation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-3">Issue Details</Label>
                  <Textarea
                    name="details"
                    placeholder="Describe the issue in detail..."
                    className="border-gray-200"
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="h-12 text-base">
                    Submit Report
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowIssueForm(false)} className="h-12 text-base">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards - Same as retailer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-50">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">₹2,45,000</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xs text-gray-500 mt-1">from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-50">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-orange-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">₹1,85,000</p>
                <p className="text-sm text-gray-600">Total Costs</p>
                <p className="text-xs text-gray-500 mt-1">from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+18%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">₹60,000</p>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-xs text-gray-500 mt-1">from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-50">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+3.2%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">24.5%</p>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-xs text-gray-500 mt-1">improvement</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section - Same layout as retailer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Revenue Trend Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Revenue & Profit Trends</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Monthly financial overview</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-50">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={revenueData} options={revenueOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Produce Distribution Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Produce Distribution</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Product category breakdown</p>
                </div>
                <div className="p-2 rounded-lg bg-green-50">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut data={produceDistributionData} options={produceDistributionOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issue Reports */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Issue Reports</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Latest support tickets and complaints</p>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No reports submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{report.party}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {report.reason}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{report.details}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
