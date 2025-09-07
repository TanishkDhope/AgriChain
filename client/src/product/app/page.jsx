"use client";

import React, { useState, useEffect } from "react";
import { User, LogOut, Leaf } from "lucide-react";
import ProductInfo from "../components/ProductInfo.jsx";
import Timeline from "../components/Timeline.jsx";
import Reviews from "../components/Reviews.jsx";
import Actions from "../components/Actions.jsx";
import ProductGallery from "../components/ProductGallery.jsx";
import Notification from "../components/Notification.jsx";
import { productData, timelineData, reviewsData } from "../lib/data.js";

export default function ProductPage({ onLogout }) {
  const [showQR, setShowQR] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notification, setNotification] = useState("");
  const [isGallerySticky, setIsGallerySticky] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("scanHistory");
    localStorage.removeItem("userSession");
    localStorage.removeItem("issueReports");

    setShowUserMenu(false);
    setNotification("You have been logged out successfully ✅");

    setTimeout(() => {
      if (onLogout) onLogout();
      window.location.href = "/";
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const actionsSection = document.getElementById('actions-section');
      if (actionsSection) {
        const rect = actionsSection.getBoundingClientRect();
        // Stop sticky behavior when Actions section reaches top of viewport
        setIsGallerySticky(rect.bottom > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Leaf className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AgriChain</h1>
                <p className="text-green-200 text-sm">Supply Chain Transparency</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <User className="h-6 w-6" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-medium text-gray-900 text-sm">Consumer</p>
                    <p className="text-xs text-gray-500">demo@agricchain.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Product Gallery with conditional sticky behavior */}
          <div className="xl:col-span-2">
            <div className={`${isGallerySticky ? 'sticky top-24' : 'relative'} transition-all duration-300`}>
              <ProductGallery />
            </div>
          </div>
          
          {/* Right Column Content */}
          <div className="xl:col-span-3 space-y-5">
            <ProductInfo product={productData} />
            {/* Actions section - gallery stops being sticky here */}
            <div id="actions-section">
              <Actions showQR={showQR} setShowQR={setShowQR} />
            </div>
          </div>
        </div>
        
        {/* Full width sections */}
        <div className="mt-12 space-y-12">
          <Timeline data={timelineData} />
          <Reviews data={reviewsData} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center">
            <div className="flex justify-center gap-6 mb-5">
              <button className="hover:text-green-400 transition-colors text-sm">Privacy</button>
              <button className="hover:text-green-400 transition-colors text-sm">Terms</button>
              <button className="hover:text-green-400 transition-colors text-sm">Support</button>
              <button className="hover:text-green-400 transition-colors text-sm">About</button>
            </div>
            <p className="text-sm text-gray-400">© 2025 AgriChain. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Notification message={notification} />
    </div>
  );
}
