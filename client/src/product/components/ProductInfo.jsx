import React from "react"

export default function ProductInfo({ product }) {
  const { name, farm, fairPrice, info, certification } = product;

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="space-y-4 p-6 rounded-3xl backdrop-blur-lg shadow-2xl relative overflow-hidden bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 border border-emerald-200/50">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-transparent to-teal-100/40"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold leading-tight text-slate-900">
            Premium <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">Organic</span> {name}
          </h1>
          
          <div className="flex items-center mt-4 text-slate-600">
            <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{farm}</span>
          </div>
        </div>
      </div>

      {/* Fair Price Indicator */}
      <div className="rounded-3xl p-6 shadow-2xl transition-all duration-300 backdrop-blur-lg relative overflow-hidden bg-gradient-to-br from-emerald-100/90 via-green-100/80 to-teal-100/90 border border-emerald-200/50">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/50 via-transparent to-green-200/50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white text-xl font-bold">$</span>
              </div>
              <span className="font-bold text-xl text-emerald-800">
                Fair Price Indicator
              </span>
            </div>
            <div className="text-right">
              <div className="text-emerald-700">
                Farmer: <span className="text-2xl font-bold">${fairPrice.farmer}</span>
              </div>
              <div className="text-emerald-700">
                Retail: <span className="text-2xl font-bold">${fairPrice.retail}</span>
              </div>
            </div>
          </div>
          <div className="mb-4 font-semibold text-emerald-700">
            Farmer receives {Math.round((fairPrice.farmer / fairPrice.retail) * 100)}% of retail price
          </div>
          <div className="w-full rounded-full h-3 shadow-inner backdrop-blur-sm bg-emerald-200/50">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 h-3 rounded-full shadow-lg transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${(fairPrice.farmer / fairPrice.retail) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-lg bg-gradient-to-br from-white/90 via-blue-50/60 to-white/90 border border-blue-200/50">
        <div className="px-6 py-4 border-b relative overflow-hidden bg-gradient-to-r from-blue-100/90 via-indigo-100/70 to-blue-100/90 border-blue-200/50">
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800">
              Product Information
            </h3>
          </div>
        </div>
        
        <div className="p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-white/40"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lot ID
              </label>
              <p className="font-bold text-lg text-slate-900">
                {info.lotId}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Farm ID
              </label>
              <p className="font-bold text-lg text-slate-900">
                {info.farmId}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Grade
              </label>
              <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl">
                {info.grade}
              </span>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quantity
              </label>
              <p className="font-bold text-2xl text-slate-900">
                {info.quantity}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Description
            </label>
            <p className="leading-relaxed mt-2 text-slate-700">
              {info.description}
            </p>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-lg bg-gradient-to-br from-white/90 via-emerald-50/60 to-white/90 border border-emerald-200/50">
        <div className="px-6 py-4 border-b relative overflow-hidden bg-gradient-to-r from-emerald-100/90 via-green-100/70 to-emerald-100/90 border-emerald-200/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-400/30 to-transparent rounded-3xl"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-emerald-800">
              {certification.title}
            </h3>
          </div>
        </div>
        
        <div className="p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-green-50/40"></div>
          
          <div className="flex items-start space-x-4 relative z-10">
            <svg className="w-8 h-8 text-emerald-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <div>
              <p className="leading-relaxed text-slate-700">
                {certification.details}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}