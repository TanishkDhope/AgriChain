import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Globe, Moon, Sun, LogOut, X, User, Sprout, MapPin, Phone, Mail } from "lucide-react";

// Farmer-specific profile data
const farmerProfile = {
  farmerName: "Rajesh Kumar",
  farmName: "Green Valley Farm",
  email: "farmer@agricchain.com",
  phone: "+91 9876543210",
  farmAddress: "Village Kisan Nagar, Nashik, Maharashtra 422001",
  farmSize: "5.2 acres",
  cropTypes: "Vegetables, Fruits, Grains",
  type: "Registered Farmer",
  status: "Verified",
  experience: "12 years",
};

const filterOptions = {
  languages: [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "mr", label: "Marathi" },
    { value: "gu", label: "Gujarati" },
    { value: "ta", label: "Tamil" },
  ],
  farmTypes: [
    { value: "organic", label: "Organic Farming" },
    { value: "conventional", label: "Conventional" },
    { value: "mixed", label: "Mixed Farming" },
  ],
};

export default function ProfileModal({
  isOpen,
  onClose,
  isDarkMode,
  setIsDarkMode,
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    farmerName: farmerProfile.farmerName,
    farmName: farmerProfile.farmName,
    email: farmerProfile.email,
    phone: farmerProfile.phone,
    farmAddress: farmerProfile.farmAddress,
    farmSize: farmerProfile.farmSize,
    cropTypes: farmerProfile.cropTypes,
    language: "en",
    farmType: "mixed",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = () => {
    onClose();
  };

  const handleLogout = () => {
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900">Farmer Profile</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Farm Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Sprout className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {formData.farmerName}
                  </h3>
                  <p className="text-gray-600">{farmerProfile.farmName}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {farmerProfile.status}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                      {farmerProfile.experience}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Farmer Name
                  </label>
                  <Input
                    value={formData.farmerName}
                    onChange={(e) =>
                      handleInputChange("farmerName", e.target.value)
                    }
                    className="h-12 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Farm Name
                  </label>
                  <Input
                    value={formData.farmName}
                    onChange={(e) =>
                      handleInputChange("farmName", e.target.value)
                    }
                    className="h-12 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-12 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Farm Size
                  </label>
                  <Input
                    value={formData.farmSize}
                    onChange={(e) =>
                      handleInputChange("farmSize", e.target.value)
                    }
                    className="h-12 border-gray-200"
                    placeholder="e.g., 5.2 acres"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Farm Type
                  </label>
                  <Select
                    value={formData.farmType}
                    onValueChange={(value) =>
                      handleInputChange("farmType", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.farmTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Farm Address
                </label>
                <Input
                  value={formData.farmAddress}
                  onChange={(e) =>
                    handleInputChange("farmAddress", e.target.value)
                  }
                  className="h-12 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Crop Types
                </label>
                <Input
                  value={formData.cropTypes}
                  onChange={(e) =>
                    handleInputChange("cropTypes", e.target.value)
                  }
                  className="h-12 border-gray-200"
                  placeholder="e.g., Vegetables, Fruits, Grains"
                />
              </div>

              <Button
                onClick={handleUpdateProfile}
                className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700"
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Language</span>
                </div>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    handleInputChange("language", value)
                  }
                >
                  <SelectTrigger className="w-32 h-12 border-gray-200">
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
                  <div className="p-2 rounded-lg bg-purple-50">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">Theme</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="h-12 px-6 border-gray-200 text-base"
                >
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Farm Statistics */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Farm Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">12</div>
                  <div className="text-sm text-emerald-700">Active Contracts</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">2,450</div>
                  <div className="text-sm text-blue-700">Total Produce (kg)</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">₹2,45,000</div>
                  <div className="text-sm text-purple-700">Total Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-green-100">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{farmerProfile.email}</p>
                  <p className="text-sm text-gray-600">Primary Email</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{farmerProfile.phone}</p>
                  <p className="text-sm text-gray-600">Mobile Number</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-orange-100">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{farmerProfile.farmAddress}</p>
                  <p className="text-sm text-gray-600">Farm Location</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="border-0 shadow-sm border-red-100">
            <CardHeader className="pb-4 bg-red-50/50">
              <CardTitle className="text-lg font-semibold text-red-900">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full h-12 text-base flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout from Account</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
