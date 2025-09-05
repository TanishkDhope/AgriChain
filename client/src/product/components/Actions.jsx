import React, { useState } from "react"

export default function Actions({ showQR, setShowQR }) {
  const [copied, setCopied] = useState(false)

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-8 p-6 rounded-3xl backdrop-blur-lg shadow-2xl relative overflow-hidden bg-gradient-to-br from-white/90 via-slate-50/60 to-white/90 border border-slate-200/50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 via-transparent to-slate-200/50"></div>
      <div className="relative z-10">
        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => setShowQR(!showQR)}
            className="group relative overflow-hidden flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:via-emerald-700 hover:to-teal-700 text-white text-sm font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <svg className="w-5 h-5 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="relative z-10">{showQR ? 'Hide QR Code' : 'QR Code'}</span>
          </button>
          
          <button 
            onClick={handleShareLink}
            className={`group relative overflow-hidden flex items-center justify-center px-6 py-4 text-sm font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-lg ${
              copied
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border border-green-500'
                : 'bg-gradient-to-r from-white/90 to-slate-100/90 hover:from-slate-100/90 hover:to-slate-200/90 text-slate-700 border border-slate-300/50'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${
              copied 
                ? 'from-green-400/20 to-emerald-400/20'
                : 'from-slate-200/40 to-slate-300/40'
            } translate-y-full group-hover:translate-y-0 transition-transform duration-300`}></div>
            
            <svg className="w-5 h-5 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              )}
            </svg>
            <span className="relative z-10">
              {copied ? 'Link Copied!' : 'Share Link'}
            </span>
          </button>
        </div>

        {/* Secondary Action Buttons - Added more spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <button className="group relative overflow-hidden flex items-center justify-center px-6 py-4 text-sm font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-lg bg-gradient-to-r from-white/90 to-slate-100/90 hover:from-slate-100/90 hover:to-slate-200/90 text-slate-700 border border-slate-300/50">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200/40 to-slate-300/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <svg className="w-5 h-5 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="relative z-10">Rescan / Verify</span>
          </button>
          
          <button className="group relative overflow-hidden flex items-center justify-center px-6 py-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:via-red-700 hover:to-rose-800 text-white text-sm font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-red-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <svg className="w-5 h-5 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="relative z-10">Report Fraud</span>
          </button>
        </div>

        {/* QR Code Display */}
        {showQR && (
          <div className={`mt-8 p-8 border-2 border-dashed rounded-3xl text-center shadow-2xl transition-all duration-500 transform backdrop-blur-lg relative overflow-hidden bg-gradient-to-br from-white/80 to-slate-50/80 border-slate-300 ${
            showQR ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10"></div>
            
            <div className="w-48 h-48 mx-auto mb-6 rounded-3xl flex items-center justify-center border-2 shadow-xl relative overflow-hidden bg-gradient-to-br from-slate-50/80 to-white/80 border-slate-200">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10"></div>
              <svg className="w-24 h-24 relative z-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold mb-3 relative z-10 text-slate-900">
              Product Verification QR Code
            </h4>
            <p className="text-lg relative z-10 text-slate-600">
              Scan to verify authenticity and trace supply chain
            </p>
          </div>
        )}
      </div>
    </div>
  )
}