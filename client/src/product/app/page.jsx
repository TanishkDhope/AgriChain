"use client"

import React, { useState } from "react"
import ProductInfo from "../components/ProductInfo.jsx"
import Timeline from "../components/Timeline.jsx"
import Reviews from "../components/Reviews.jsx"
import Actions from "../components/Actions.jsx"
import ProductGallery from "../components/ProductGallery.jsx"
import { productData, timelineData, reviewsData } from "../lib/data.js"

export default function ProductPage() {
  const [showQR, setShowQR] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('EN')

  const languages = ['EN', 'ES', 'FR', 'DE', 'HI']

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'dark bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900/20' 
        : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'
    }`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
            : 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310b981" fill-opacity="0.2"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
        }`}></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          darkMode ? 'bg-emerald-500' : 'bg-emerald-200'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          darkMode ? 'bg-green-500' : 'bg-green-200'
        } blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 ${
          darkMode ? 'bg-teal-500' : 'bg-teal-200'
        } blur-3xl animate-pulse`} style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Header with Agricultural Theme */}
      <header className={`border-b backdrop-blur-xl sticky top-0 z-50 transition-all duration-500 relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-r from-slate-900/95 via-emerald-900/90 to-slate-900/95 border-emerald-800/50' 
          : 'bg-gradient-to-r from-emerald-100/95 via-green-200/90 to-teal-100/95 border-emerald-300/50'
      }`}>
        {/* Header Background Pattern */}
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-[url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310b981" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
            : 'bg-[url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310b981" fill-opacity="0.15"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
        }`}></div>

        {/* Organic decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Leaf decorations */}
          <div className={`absolute top-2 left-20 w-8 h-8 ${
            darkMode ? 'text-emerald-600/20' : 'text-emerald-400/30'
          } transform rotate-12`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <div className={`absolute top-4 right-32 w-6 h-6 ${
            darkMode ? 'text-green-600/20' : 'text-green-400/30'
          } transform -rotate-45`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div className={`absolute top-1 right-64 w-5 h-5 ${
            darkMode ? 'text-teal-600/20' : 'text-teal-400/30'
          } transform rotate-90`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            </svg>
          </div>

          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-r from-emerald-900/30 via-transparent to-green-900/30' 
              : 'bg-gradient-to-r from-emerald-200/40 via-transparent to-green-200/40'
          }`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              {/* Enhanced logo with agricultural theme */}
              <div className={`w-14 h-14 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                darkMode ? 'shadow-emerald-500/50' : 'shadow-emerald-600/30'
              }`}>
                <span className="text-white font-bold text-2xl drop-shadow-lg">A</span>
              </div>
              {/* Animated status indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              {/* Organic glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            </div>
            
            <div className="flex flex-col">
              <h1 className={`text-3xl font-bold tracking-tight transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg' 
                  : 'bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent'
              }`}>
                AgriTrace
              </h1>
              <div className={`text-sm font-medium flex items-center ${
                darkMode ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Farm to Table Tracking
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Enhanced Language Selector */}
            <div className="relative group">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`appearance-none px-5 py-3 rounded-2xl text-sm font-semibold border-2 transition-all cursor-pointer shadow-xl backdrop-blur-md group-hover:scale-105 ${
                  darkMode 
                    ? 'bg-slate-800/90 border-emerald-600/50 text-slate-200 hover:bg-slate-700 hover:border-emerald-500' 
                    : 'bg-white/90 border-emerald-300/50 text-slate-700 hover:bg-white hover:border-emerald-400'
                }`}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
                darkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {/* Language globe icon */}
              <div className={`absolute -top-1 -left-1 w-5 h-5 ${
                darkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Enhanced Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-500 shadow-xl hover:scale-110 backdrop-blur-md group overflow-hidden ${
                darkMode 
                  ? 'bg-slate-800/90 border-amber-400/50 text-amber-300 hover:bg-slate-700 hover:border-amber-300' 
                  : 'bg-white/90 border-slate-300/50 text-slate-600 hover:bg-white hover:border-slate-400'
              }`}
            >
              {/* Animated background */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                darkMode 
                  ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20' 
                  : 'bg-gradient-to-br from-slate-200/40 to-slate-300/40'
              } opacity-0 group-hover:opacity-100`}></div>
              
              <div className="relative z-10 transition-transform duration-500 group-hover:rotate-180">
                {darkMode ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </div>
              
              {/* Theme indicator */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
                darkMode ? 'bg-amber-400' : 'bg-slate-600'
              }`}></div>
            </button>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${
          darkMode 
            ? 'bg-gradient-to-r from-emerald-800/50 via-green-700/50 to-teal-800/50' 
            : 'bg-gradient-to-r from-emerald-400/50 via-green-400/50 to-teal-400/50'
        }`}></div>
      </header>

      {/* Rest of the component remains the same... */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ProductGallery darkMode={darkMode} />
          </div>
          <div className="space-y-6">
            <ProductInfo product={productData} darkMode={darkMode} />
            <Actions showQR={showQR} setShowQR={setShowQR} darkMode={darkMode} />
          </div>
        </div>
        <div className="mt-16 space-y-16">
          <Timeline data={timelineData} darkMode={darkMode} />
          <Reviews data={reviewsData} darkMode={darkMode} />
        </div>
      </div>
    </div>
  )
}
