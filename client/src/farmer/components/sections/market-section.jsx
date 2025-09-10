import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
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
  Filler
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

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
  Filler
)

export default function MarketSection({ produce, marketData }) {
  const [selectedId, setSelectedId] = useState(produce[0]?.id || "")
  
  const selected = useMemo(
    () => marketData.find((m) => m.id === selectedId) || marketData[0],
    [marketData, selectedId]
  )

  // Calculate market stats
  const avgPrice = useMemo(() => {
    if (!marketData.length) return 0
    return (marketData.reduce((sum, item) => sum + item.consumerPrice, 0) / marketData.length).toFixed(2)
  }, [marketData])

  const highestPrice = useMemo(() => {
    if (!marketData.length) return 0
    return Math.max(...marketData.map(item => item.consumerPrice)).toFixed(2)
  }, [marketData])

  const lowestPrice = useMemo(() => {
    if (!marketData.length) return 0
    return Math.min(...marketData.map(item => item.consumerPrice)).toFixed(2)
  }, [marketData])

  // Price Trend Chart Data - Colorful like retailer
  const priceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Market Price',
        data: [22, 25, 28, 30, 35, 42],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }

  const priceTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#374151',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.parsed.y}/kg`,
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
          callback: (value) => `₹${value}`,
        },
      },
    },
  }

  // Locality Comparison Chart Data - Colorful bars
  const localityComparisonData = {
    labels: ['Mumbai', 'Pune', 'Nashik', 'Kolhapur', 'Nagpur'],
    datasets: [
      {
        label: 'Price',
        data: [40, 45, 35, 28, 22],
        backgroundColor: [
          '#22C55E',  // Green
          '#3B82F6',  // Blue  
          '#A855F7',  // Purple
          '#FB923C',  // Orange
          '#EC4899',  // Pink
        ],
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 24,
      },
    ],
  }

  const localityComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#374151',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.parsed.y}/kg`,
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
          callback: (value) => `₹${value}`,
        },
      },
    },
  }

  return (
    <section 
      id="market" 
      className="py-16 px-6 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50" 
      style={{ scrollMarginTop: '30px' }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Market Analytics</h2>
          <p className="text-gray-600">Real-time prices and market insights</p>
        </div>

        {/* Market Stats - Same structure as retailer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5.2%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">₹{avgPrice}</p>
                <p className="text-sm text-gray-600">Average Price</p>
                <p className="text-xs text-gray-500 mt-1">from last week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-50">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Best</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">₹{highestPrice}</p>
                <p className="text-sm text-gray-600">Highest Price</p>
                <p className="text-xs text-gray-500 mt-1">market rate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-red-50">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span>Min</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">₹{lowestPrice}</p>
                <p className="text-sm text-gray-600">Lowest Price</p>
                <p className="text-xs text-gray-500 mt-1">market minimum</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-50">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+18%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{marketData.length * 150}</p>
                <p className="text-sm text-gray-600">Market Volume</p>
                <p className="text-xs text-gray-500 mt-1">kg daily trading</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Selector - Same as retailer */}
        <Card className="border-0 shadow-sm mb-10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <Select value={selectedId} onValueChange={setSelectedId}>
                  <SelectTrigger className="h-12 border-gray-200">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {produce.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - {p.locality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full sm:w-auto h-12 text-base">
                Analyze Trends
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section - Same layout as retailer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Price Trend Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Price Trends</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Monthly price movements</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-50">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={priceTrendData} options={priceTrendOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Locality Comparison Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Price by Locality</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Regional price comparison</p>
                </div>
                <div className="p-2 rounded-lg bg-green-50">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={localityComparisonData} options={localityComparisonOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Insights - Same as retailer style */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Market Insights</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Latest market intelligence and recommendations</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Positive Trend</span>
                </div>
                <p className="text-sm text-green-700">Market showing positive trends for {selected?.name || 'selected products'}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-800">Best Market</span>
                </div>
                <p className="text-sm text-blue-700">Best selling locality: {selected?.locality || 'Mumbai'}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm font-medium text-purple-800">Price Range</span>
                </div>
                <p className="text-sm text-purple-700">Recommended: ₹{(parseFloat(avgPrice) - 5).toFixed(2)} - ₹{(parseFloat(avgPrice) + 5).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
