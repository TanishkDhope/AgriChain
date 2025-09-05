"use client";

import React, { useState } from "react";
import ProductInfo from "../components/ProductInfo.jsx";
import Timeline from "../components/Timeline.jsx";
import Reviews from "../components/Reviews.jsx";
import Actions from "../components/Actions.jsx";
import ProductGallery from "../components/ProductGallery.jsx";
import { productData, timelineData, reviewsData } from "../lib/data.js";
import { Leaf } from "lucide-react";

export default function ProductPage() {
  const [showQR, setShowQR] = useState(false);
  const [language, setLanguage] = useState("EN");

  const languages = ["EN", "ES", "FR", "DE", "HI"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header with AgriChain styling */}
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
                  AgriTrace
                </h1>
                <p
                  className="text-xs sm:text-sm hidden sm:block"
                  style={{ color: "#bbf7d0" }}
                >
                  Farm to Table Tracking
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none px-5 py-3 rounded-2xl text-sm font-semibold border-2 cursor-pointer shadow-xl backdrop-blur-md group-hover:scale-105 bg-white/90 border-white/30 text-slate-700 hover:bg-white hover:border-white/50"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
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
                © 2025 AgriTrace. All rights reserved. Building trust through
                transparency.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
