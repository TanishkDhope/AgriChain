"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductInfo from "../components/ProductInfo.jsx";
import Timeline from "../components/Timeline.jsx";
import Reviews from "../components/Reviews.jsx";
import Actions from "../components/Actions.jsx";
import ProductGallery from "../components/ProductGallery.jsx";
import { productData, timelineData, reviewsData } from "../lib/data.js";
import { Leaf, User, LogOut, Globe } from "lucide-react";
import { Button } from "../components/button.jsx";

export default function ProductPage({ onLogout }) {
  const [showQR, setShowQR] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header with AgriChain styling - Same as ConsumerHomePage */}
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
                  Farm to Table Tracking
                </p>
              </div>
            </div>

            {/* Globe Icon and User Menu - Same as ConsumerHomePage */}
            <div className="flex items-center gap-2 relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white rounded-xl hover:bg-white/20"
              >
                <Globe className="h-5 w-5" />
              </Button>
              
              {/* User Icon with Logout */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>

                {/* Logout Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ProductGallery />
          </div>
          <div className="space-y-6">
            <ProductInfo product={productData} />
            <Actions showQR={showQR} setShowQR={setShowQR} />
          </div>
        </div>
        <div className="mt-16 space-y-16">
          <Timeline data={timelineData} />
          <Reviews data={reviewsData} />
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Footer from AgriChain */}
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
