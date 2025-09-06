import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Globe, Moon, Sun, LogOut, X, User } from "lucide-react"
import { retailerProfile, filterOptions } from "../lib/data"

export default function ProfileModal({ isOpen, onClose, isDarkMode, setIsDarkMode }) {
  if (!isOpen) return null

  const [formData, setFormData] = useState({
    organizationName: retailerProfile.organizationName,
    contactPerson: retailerProfile.contactPerson,
    email: retailerProfile.email,
    phone: retailerProfile.phone,
    businessAddress: retailerProfile.businessAddress,
    language: "en"
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdateProfile = () => {
    // Simply close modal - no alerts
    onClose()
  }

  const handleLogout = () => {
    // Direct redirect to homepage
    window.location.href = "http://localhost:5173/#/"
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Profile Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Profile Header */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{formData.organizationName}</h3>
                  <p className="text-gray-600">{retailerProfile.type}</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">
                    {retailerProfile.status}
                  </Badge>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <Input 
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    className="h-10 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <Input 
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="h-10 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-10 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-10 border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <Input 
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  className="h-10 border-gray-200"
                />
              </div>

              <Button 
                onClick={handleUpdateProfile}
                className="w-full h-10 mt-4"
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Language</span>
                </div>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => handleInputChange('language', value)}
                >
                  <SelectTrigger className="w-20 h-9 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="font-medium">Theme</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="h-9 px-4 border-gray-200"
                >
                  {isDarkMode ? "Dark" : "Light"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full h-10 flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
