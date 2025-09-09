import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { QrCode, Camera, Upload, CheckCircle, AlertTriangle } from "lucide-react"
import { farmers } from "../lib/data"

export default function QRScanner() {
  // Mock recent scans based on farmers data
  const [scanHistory, setScanHistory] = useState([
    { 
      id: 1, 
      name: farmers[0].produce, 
      farmer: farmers[0].name, 
      time: "2 hours ago", 
      verified: farmers[0].verified,
      farmerId: farmers[0].id,
      location: farmers[0].location,
      rating: farmers[0].rating
    },
    { 
      id: 2, 
      name: farmers[1].produce, 
      farmer: farmers[1].name, 
      time: "4 hours ago", 
      verified: farmers[1].verified,
      farmerId: farmers[1].id,
      location: farmers[1].location,
      rating: farmers[1].rating
    },
    { 
      id: 3, 
      name: farmers[2].produce, 
      farmer: farmers[2].name, 
      time: "6 hours ago", 
      verified: farmers[2].verified,
      farmerId: farmers[2].id,
      location: farmers[2].location,
      rating: farmers[2].rating
    },
    { 
      id: 4, 
      name: farmers[4].produce, 
      farmer: farmers[4].name, 
      time: "8 hours ago", 
      verified: farmers[4].verified,
      farmerId: farmers[4].id,
      location: farmers[4].location,
      rating: farmers[4].rating
    },
  ])
  
  const [showWebcam, setShowWebcam] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)

  // Check camera permissions
  const checkCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' })
      
      if (permission.state === 'granted') {
        return true
      } else if (permission.state === 'prompt') {
        return true
      } else {
        console.log('Camera access is blocked.')
        return false
      }
    } catch (err) {
      console.log('Permissions API not supported, using getUserMedia fallback')
      return true
    }
  }

  // Start camera stream
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
      setShowWebcam(true)
      return true
    } catch (err) {
      console.error("Camera access error:", err)
      return false
    }
  }

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowWebcam(false)
    setIsCapturing(false)
  }

  // Handle take photo button click
  const handleTakePhoto = async () => {
    const hasPermission = await checkCameraPermission()
    if (!hasPermission) return
    
    const cameraStarted = await startCamera()
    if (!cameraStarted) return
  }

  // Capture photo from video
  const capturePhoto = useCallback(() => {
    if (videoRef.current && !isCapturing) {
      setIsCapturing(true)
      
      const canvas = document.createElement('canvas')
      const video = videoRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" })
          const imageUrl = canvas.toDataURL('image/jpeg', 0.8)
          
          stopCamera()
          
          // Create a mock scan result and add to history
          const newScan = {
            id: scanHistory.length + 1,
            name: "Scanned Product",
            farmer: "Camera Capture",
            time: "Just now",
            verified: true,
            capturedImage: imageUrl,
            capturedFile: file,
            mode: 'camera'
          }
          
          setScanHistory(prev => [newScan, ...prev])
        }
        setIsCapturing(false)
      }, 'image/jpeg', 0.8)
    }
  }, [scanHistory])

  // Handle upload photo
  const handleUploadPhoto = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = false
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          console.log('Invalid image file')
          return
        }
        
        if (file.size > 10 * 1024 * 1024) {
          console.log('File too large')
          return
        }
        
        const imageUrl = URL.createObjectURL(file)
        
        // Create a mock scan result and add to history
        const newScan = {
          id: scanHistory.length + 1,
          name: "Uploaded Product",
          farmer: "File Upload",
          time: "Just now", 
          verified: true,
          uploadedFile: file,
          uploadedImageUrl: imageUrl,
          fileName: file.name,
          mode: 'upload'
        }
        
        setScanHistory(prev => [newScan, ...prev])
      }
    }
    
    input.click()
  }

  // Handle scan click
  const handleScanClick = (scan) => {
    console.log('Viewing scan details:', scan)
  }

  // Clear scan history
  const clearScanHistory = () => {
    setScanHistory([])
  }

  return (
    <section 
      id="qr" 
      className="py-16 px-6"
      style={{ scrollMarginTop: '30px' }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Product Scanner</h2>
          <p className="text-gray-600">Scan or upload product images for verification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT SIDE - Image & Action Buttons */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-center">
                {showWebcam ? "Camera View" : "Product Image Scanner"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                
                {showWebcam ? (
                  // Camera Interface
                  <div className="w-full max-w-sm">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-48 rounded-xl border-2 border-gray-300 object-cover bg-black"
                    />
                    <div className="flex space-x-3 mt-4">
                      <Button 
                        className="flex-1"
                        onClick={capturePhoto}
                        disabled={isCapturing}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {isCapturing ? "Capturing..." : "Capture Photo"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={stopCamera}
                        disabled={isCapturing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Default Interface
                  <>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl w-full max-w-sm h-48 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">Product Image</p>
                        <p className="text-sm text-gray-500 mt-1">Take or upload a photo to scan</p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 w-full max-w-sm">
                      <Button 
                        className="w-full h-11 text-base"
                        onClick={handleTakePhoto}
                      >
                        <Camera className="w-5 h-5 mr-3" />
                        Take Photo
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-11 text-base"
                        onClick={handleUploadPhoto}
                      >
                        <Upload className="w-5 h-5 mr-3" />
                        Upload Photo
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RIGHT SIDE - Recent Scans */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Scans</CardTitle>
                {scanHistory.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearScanHistory}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <div className="text-center py-12">
                  <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Scans</h3>
                  <p className="text-gray-600">Your scan history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {scanHistory.map((scan) => (
                    <div 
                      key={scan.id}
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleScanClick(scan)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{scan.name}</h4>
                          {scan.verified ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">by {scan.farmer}</p>
                        <p className="text-xs text-gray-500">{scan.time}</p>
                        {scan.location && (
                          <p className="text-xs text-gray-400">{scan.location}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Badge variant={scan.verified ? "default" : "secondary"}>
                          {scan.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
