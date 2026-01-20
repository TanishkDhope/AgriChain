// components/sections/map-section.jsx
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, TrendingUp, TrendingDown, Minus } from "lucide-react"

// ==================== PriceOverlay Component ====================
function PriceOverlay({ map, priceData, selectedProduce, onLocationSelect }) {
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    if (!map || !priceData.length) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))

    // Create new markers
    const newMarkers = priceData.map(location => {
      const price = location.prices[selectedProduce]?.retail || 0
      const color = getPriceColor(price)
      
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: `${location.city} - ₹${price}/kg`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 12
        }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(location, selectedProduce)
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
        onLocationSelect(location)
      })

      return marker
    })

    setMarkers(newMarkers)

    return () => {
      newMarkers.forEach(marker => marker.setMap(null))
    }
  }, [map, priceData, selectedProduce, onLocationSelect])

  const getPriceColor = (price) => {
    if (price <= 30) return '#10B981' // Green
    if (price <= 40) return '#F59E0B' // Yellow
    return '#EF4444' // Red
  }

  const createInfoWindowContent = (location, produce) => {
    const priceInfo = location.prices[produce]
    return `
      <div style="padding: 8px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.city}, ${location.state}</h3>
        <div><strong>Farmer Price:</strong> ₹${priceInfo?.farmer || 'N/A'}/kg</div>
        <div><strong>Wholesale Price:</strong> ₹${priceInfo?.wholesale || 'N/A'}/kg</div>
        <div><strong>Retail Price:</strong> ₹${priceInfo?.retail || 'N/A'}/kg</div>
        <div style="font-size: 12px; color: #666; margin-top: 8px;">
          Click for detailed information
        </div>
      </div>
    `
  }

  return null
}

// ==================== PriceInfoCard Component ====================
function PriceInfoCard({ location, selectedProduce, onClose }) {
  const priceInfo = location.prices[selectedProduce]
  
  const calculateMargin = (from, to) => {
    if (!from || !to) return 0
    return ((to - from) / from * 100).toFixed(1)
  }

  const getTrendIcon = (margin) => {
    const marginNum = parseFloat(margin)
    if (marginNum > 20) return <TrendingUp className="w-4 h-4 text-red-500" />
    if (marginNum < 10) return <TrendingDown className="w-4 h-4 text-green-500" />
    return <Minus className="w-4 h-4 text-yellow-500" />
  }

  return (
    <Card className="bg-background/60 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            📍 {location.city}, {location.state}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Farmer Price */}
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Farmer Price</div>
            <div className="text-2xl font-bold text-green-600">₹{priceInfo?.farmer}</div>
            <div className="text-xs text-muted-foreground">/kg</div>
          </div>

          {/* Wholesale Price */}
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Wholesale Price</div>
            <div className="text-2xl font-bold text-yellow-600">₹{priceInfo?.wholesale}</div>
            <div className="text-xs text-muted-foreground">/kg</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {getTrendIcon(calculateMargin(priceInfo?.farmer, priceInfo?.wholesale))}
              <span className="text-xs">
                +{calculateMargin(priceInfo?.farmer, priceInfo?.wholesale)}%
              </span>
            </div>
          </div>

          {/* Retail Price */}
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Retail Price</div>
            <div className="text-2xl font-bold text-red-600">₹{priceInfo?.retail}</div>
            <div className="text-xs text-muted-foreground">/kg</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {getTrendIcon(calculateMargin(priceInfo?.wholesale, priceInfo?.retail))}
              <span className="text-xs">
                +{calculateMargin(priceInfo?.wholesale, priceInfo?.retail)}%
              </span>
            </div>
          </div>
        </div>

        {/* Price Analysis */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-3">Price Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Markup:</span>
              <Badge variant="outline" className="ml-2">
                +{calculateMargin(priceInfo?.farmer, priceInfo?.retail)}%
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Price Category:</span>
              <Badge 
                variant="outline" 
                className={`ml-2 ${
                  priceInfo?.retail <= 30 ? 'text-green-600' : 
                  priceInfo?.retail <= 40 ? 'text-yellow-600' : 'text-red-600'
                }`}
              >
                {priceInfo?.retail <= 30 ? 'Low' : 
                 priceInfo?.retail <= 40 ? 'Medium' : 'High'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== MapControls Component ====================
function MapControls({ selectedProduce, onProduceChange, priceData, loading }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")

  const produceOptions = [
    { value: "tomatoes", label: "Tomatoes", icon: "🍅" },
    { value: "onions", label: "Onions", icon: "🧅" },
    { value: "potatoes", label: "Potatoes", icon: "🥔" },
    { value: "carrots", label: "Carrots", icon: "🥕" }
  ]

  const getPriceRange = () => {
    if (!priceData.length) return { min: 0, max: 0, avg: 0 }
    
    const prices = priceData
      .map(location => location.prices[selectedProduce]?.retail || 0)
      .filter(price => price > 0)
    
    if (!prices.length) return { min: 0, max: 0, avg: 0 }
    
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    
    return { min, max, avg: Math.round(avg) }
  }

  const priceStats = getPriceRange()

  return (
    <div className="space-y-4">
      <Card className="bg-background/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Map Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Produce Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Produce</Label>
            <Select value={selectedProduce} onValueChange={onProduceChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {produceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search Location</Label>
            <Input
              placeholder="Search city or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Price Range Filter</Label>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Low (₹20-30)</SelectItem>
                <SelectItem value="medium">Medium (₹31-40)</SelectItem>
                <SelectItem value="high">High (₹41-50)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Price Statistics */}
      <Card className="bg-background/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg capitalize">
            {selectedProduce} Price Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lowest:</span>
                <Badge variant="outline" className="text-green-600">
                  ₹{priceStats.min}/kg
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Highest:</span>
                <Badge variant="outline" className="text-red-600">
                  ₹{priceStats.max}/kg
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average:</span>
                <Badge variant="outline" className="text-blue-600">
                  ₹{priceStats.avg}/kg
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-background/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Price Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Low Price (≤₹30)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Average Price (₹31-40)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">High Price (≥₹41)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== Main MapSection Component ====================
export default function MapSection() {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedProduce, setSelectedProduce] = useState("tomatoes")
  const [priceData, setPriceData] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock price data
  const mockPriceData = [
    {
      id: 1,
      city: "Mumbai",
      state: "Maharashtra", 
      lat: 19.0760,
      lng: 72.8777,
      prices: {
        tomatoes: { farmer: 25, wholesale: 35, retail: 45 },
        onions: { farmer: 18, wholesale: 28, retail: 38 },
        potatoes: { farmer: 15, wholesale: 25, retail: 35 },
        carrots: { farmer: 30, wholesale: 40, retail: 50 }
      }
    },
    {
      id: 2,
      city: "Delhi",
      state: "Delhi",
      lat: 28.6139,
      lng: 77.2090,
      prices: {
        tomatoes: { farmer: 22, wholesale: 32, retail: 42 },
        onions: { farmer: 20, wholesale: 30, retail: 40 },
        potatoes: { farmer: 18, wholesale: 28, retail: 38 },
        carrots: { farmer: 28, wholesale: 38, retail: 48 }
      }
    },
    {
      id: 3,
      city: "Bangalore",
      state: "Karnataka",
      lat: 12.9716,
      lng: 77.5946,
      prices: {
        tomatoes: { farmer: 20, wholesale: 30, retail: 40 },
        onions: { farmer: 16, wholesale: 26, retail: 36 },
        potatoes: { farmer: 14, wholesale: 24, retail: 34 },
        carrots: { farmer: 26, wholesale: 36, retail: 46 }
      }
    },
    {
      id: 4,
      city: "Kolkata",
      state: "West Bengal",
      lat: 22.5726,
      lng: 88.3639,
      prices: {
        tomatoes: { farmer: 24, wholesale: 34, retail: 44 },
        onions: { farmer: 19, wholesale: 29, retail: 39 },
        potatoes: { farmer: 16, wholesale: 26, retail: 36 },
        carrots: { farmer: 29, wholesale: 39, retail: 49 }
      }
    },
    {
      id: 5,
      city: "Chennai",
      state: "Tamil Nadu",
      lat: 13.0827,
      lng: 80.2707,
      prices: {
        tomatoes: { farmer: 23, wholesale: 33, retail: 43 },
        onions: { farmer: 17, wholesale: 27, retail: 37 },
        potatoes: { farmer: 17, wholesale: 27, retail: 37 },
        carrots: { farmer: 27, wholesale: 37, retail: 47 }
      }
    },
    {
      id: 6,
      city: "Pune",
      state: "Maharashtra",
      lat: 18.5204,
      lng: 73.8567,
      prices: {
        tomatoes: { farmer: 21, wholesale: 31, retail: 41 },
        onions: { farmer: 15, wholesale: 25, retail: 35 },
        potatoes: { farmer: 13, wholesale: 23, retail: 33 },
        carrots: { farmer: 25, wholesale: 35, retail: 45 }
      }
    },
    {
      id: 7,
      city: "Hyderabad",
      state: "Telangana",
      lat: 17.3850,
      lng: 78.4867,
      prices: {
        tomatoes: { farmer: 26, wholesale: 36, retail: 46 },
        onions: { farmer: 21, wholesale: 31, retail: 41 },
        potatoes: { farmer: 19, wholesale: 29, retail: 39 },
        carrots: { farmer: 31, wholesale: 41, retail: 51 }
      }
    },
    {
      id: 8,
      city: "Ahmedabad",
      state: "Gujarat",
      lat: 23.0225,
      lng: 72.5714,
      prices: {
        tomatoes: { farmer: 19, wholesale: 29, retail: 39 },
        onions: { farmer: 14, wholesale: 24, retail: 34 },
        potatoes: { farmer: 12, wholesale: 22, retail: 32 },
        carrots: { farmer: 24, wholesale: 34, retail: 44 }
      }
    }
  ]

  useEffect(() => {
    setPriceData(mockPriceData)
    setLoading(false)
  }, [])

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    const initMap = () => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })
      setMap(mapInstance)
    }

    if (window.google && window.google.maps) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`
      script.async = true
      script.defer = true
      window.initMap = initMap
      document.head.appendChild(script)
    }
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Regional Price Map</h2>
        <p className="text-muted-foreground">
          Explore real-time fruit and vegetable prices across different regions in India
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <div className="lg:col-span-1">
          <MapControls
            selectedProduce={selectedProduce}
            onProduceChange={setSelectedProduce}
            priceData={priceData}
            loading={loading}
          />
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="capitalize">
                {selectedProduce} Prices Across India
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-[500px] rounded-lg border"
                />
                {map && !loading && (
                  <PriceOverlay
                    map={map}
                    priceData={priceData}
                    selectedProduce={selectedProduce}
                    onLocationSelect={setSelectedLocation}
                  />
                )}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading map data...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="mt-6">
          <PriceInfoCard
            location={selectedLocation}
            selectedProduce={selectedProduce}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}
    </div>
  )
}