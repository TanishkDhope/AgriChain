import React, { useState, useEffect } from "react"

const imagePool = [
  "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&h=600&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=600&h=600&fit=crop&auto=format&q=80"
]
export default function ProductGallery({ darkMode }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [images, setImages] = useState([])

  useEffect(() => {
    // Shuffle images on component mount
    const shuffled = [...imagePool].sort(() => Math.random() - 0.5)
    setImages(shuffled)
  }, [])

  // Auto-change images every 4 seconds
  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) return null

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className={`relative aspect-square rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 group backdrop-blur-lg ${
        darkMode 
          ? 'bg-slate-800/80 border border-slate-700/50' 
          : 'bg-white/80 border border-white/50'
      }`}>
        <img
          src={images[currentImageIndex]}
          alt="Premium Organic Tomatoes"
          className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
        />
        
        {/* Navigation Arrows - Only show on hover */}
        <button 
          onClick={prevImage}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-md hover:scale-110 opacity-0 group-hover:opacity-100 ${
            darkMode 
              ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600/50' 
              : 'bg-white/90 hover:bg-white text-slate-600 border border-white/50'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextImage}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-md hover:scale-110 opacity-0 group-hover:opacity-100 ${
            darkMode 
              ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600/50' 
              : 'bg-white/90 hover:bg-white text-slate-600 border border-white/50'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image Counter */}
        <div className={`absolute bottom-4 right-4 px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-md shadow-lg ${
          darkMode 
            ? 'bg-slate-800/90 text-slate-200 border border-slate-600/50' 
            : 'bg-white/90 text-slate-700 border border-white/50'
        }`}>
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Image dots indicator */}
      <div className="flex justify-center space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 scale-125'
                : darkMode 
                  ? 'bg-slate-600 hover:bg-slate-500' 
                  : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
