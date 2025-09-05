import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  QrCode,
  History,
  Flag,
  Globe,
  Leaf,
  Star,
  Shield,
  Truck,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { mockTransactions } from "../lib/data";
import "../styles/product.css";

export default function ConsumerHomePage() {
  const [showScanModal, setShowScanModal] = useState(false);

  const handleScanQR = () => {
    setShowScanModal(true);
  };

  const handleCameraClick = () => {
    console.log("Opening camera...");
    // Add camera functionality here
    setShowScanModal(false);
  };

  const handleUploadClick = () => {
    console.log("Opening file upload...");
    // Add file upload functionality here
    setShowScanModal(false);
  };

  const handleViewProduct = (productId) => {
    console.log(`Viewing product ${productId}...`);
  };

  const handleReportIssue = () => {
    console.log("Opening report issue form...");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f0fdf4, #ecfdf5, #f7fee7)",
      }}
    >
      {/* Header */}
      <header
        className="text-white shadow-2xl sticky top-0 z-50"
        style={{
          background: "linear-gradient(to right, #16a34a, #059669, #16a34a)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Leaf className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  AgriChain
                </h1>
                <p
                  className="text-xs sm:text-sm hidden sm:block"
                  style={{ color: "#bbf7d0" }}
                >
                  Supply Chain Transparency
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white rounded-xl hover:bg-white/20"
              >
                <Globe className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Desktop Only */}
      <div
        className="hidden lg:block text-white py-12"
        style={{ background: "linear-gradient(to right, #16a34a, #059669)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Track Your Food's Journey
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "#bbf7d0" }}
            >
              From farm to table, ensure authenticity and quality with
              blockchain-powered traceability
            </p>
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <span>Verified Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-6 w-6" />
                <span>Full Traceability</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6" />
                <span>Quality Assured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* QR Scanner Card - Main CTA */}
            <Card
              className="card-hover border-2"
              style={{
                borderColor: "rgba(163, 230, 53, 0.6)",
                background:
                  "linear-gradient(135deg, #ffffff, rgba(240, 253, 244, 0.3))",
              }}
            >
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div
                  className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #ecfdf5, #dcfce7)",
                  }}
                >
                  <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-lime-600" />
                </div>
                <CardTitle className="gradient-text text-2xl sm:text-3xl">
                  Scan Product QR Code
                </CardTitle>
                <CardDescription className="text-base sm:text-lg">
                  Verify authenticity and trace your product's journey from farm
                  to table
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleScanQR}
                  className="w-full font-bold py-4 sm:py-6 text-base sm:text-lg shadow-xl"
                  style={{
                    background: "linear-gradient(to right, #84cc16, #22c55e)",
                    color: "#1e293b",
                  }}
                  size="lg"
                >
                  <QrCode className="mr-3 h-6 w-6" />
                  Scan Now
                </Button>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <History className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">
                      Recent Scans
                    </CardTitle>
                    <CardDescription>
                      Your previously scanned products and their status
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => handleViewProduct(transaction.id)}
                    className="flex items-center justify-between p-4 sm:p-6 rounded-xl border border-slate-100 cursor-pointer transition-all duration-300 group hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-base sm:text-lg text-slate-900 group-hover:text-green-700 transition-colors">
                        {transaction.productName}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {transaction.origin}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {transaction.date}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Badge
                        variant={
                          transaction.warranty === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs sm:text-sm px-3 py-1"
                      >
                        {transaction.warranty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Secondary Actions */}
          <div className="space-y-6 sm:space-y-8">
            {/* Report Issues */}
            <Card
              className="card-hover border-red-200"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff, rgba(254, 242, 242, 0.3))",
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <Flag className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      Report an Issue
                    </CardTitle>
                    <CardDescription>
                      Help us maintain supply chain integrity
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleReportIssue}
                  variant="outline"
                  className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                  size="lg"
                >
                  <Flag className="mr-2 h-5 w-5" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>

            {/* Info Cards - Desktop Only */}
            <div className="hidden lg:block space-y-6">
              <Card
                className="card-hover"
                style={{
                  background: "linear-gradient(135deg, #eff6ff, #e0f2fe)",
                }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-blue-800">
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <span>Scan the QR code on your product</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <span>View complete supply chain history</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <span>Verify authenticity and quality</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Scan Options Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Choose Scan Method
              </h3>
              <button
                onClick={() => setShowScanModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Button
                onClick={handleCameraClick}
                className="w-full py-4 text-base font-semibold rounded-xl"
                style={{
                  background: "linear-gradient(to right, #16a34a, #059669)",
                  color: "white",
                }}
                size="lg"
              >
                <Camera className="mr-3 h-6 w-6" />
                Take Photo
              </Button>

              <Button
                onClick={handleUploadClick}
                variant="outline"
                className="w-full py-4 text-base font-semibold border-2 border-green-300 text-green-700 hover:bg-green-50 rounded-xl"
                size="lg"
              >
                <Upload className="mr-3 h-6 w-6" />
                Upload Image
              </Button>
            </div>
            <div className="px-6 pb-6">
              <p className="text-sm text-gray-500 text-center">
                Choose how you'd like to scan the QR code on your product
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              <button className="hover:text-green-400 transition-colors text-sm sm:text-base">
                Privacy Policy
              </button>
              <button className="hover:text-green-400 transition-colors text-sm sm:text-base">
                Terms of Service
              </button>
              <button className="hover:text-green-400 transition-colors text-sm sm:text-base">
                Contact Support
              </button>
              <button className="hover:text-green-400 transition-colors text-sm sm:text-base">
                About Us
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs sm:text-sm text-slate-400">
                © 2025 AgriChain. All rights reserved. Building trust through
                transparency.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
