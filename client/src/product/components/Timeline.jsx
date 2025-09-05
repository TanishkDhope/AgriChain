import React from "react"

const stepIcons = [
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
]

export default function Timeline({ data, darkMode }) {
  return (
    <div className={`rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-lg ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 border border-slate-700/50' 
        : 'bg-gradient-to-br from-white/90 via-blue-50/60 to-white/90 border border-blue-200/50'
    }`}>
      {/* Header */}
      <div className={`px-8 py-8 border-b relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-indigo-900/80 border-slate-700/50' 
          : 'bg-gradient-to-r from-blue-100/90 via-indigo-100/70 to-blue-200/90 border-blue-200/50'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Supply Chain Journey
            </h2>
            <p className={`text-lg mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              Track every step from farm to table
            </p>
          </div>
        </div>
      </div>
      
      {/* Timeline Content */}
      <div className="p-10 relative">
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800/40 via-transparent to-blue-900/20' 
            : 'bg-gradient-to-br from-blue-50/40 via-transparent to-white/60'
        }`}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
          {data.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Card */}
              <div className={`rounded-3xl p-8 text-center transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 backdrop-blur-lg relative overflow-hidden ${
                darkMode 
                  ? 'bg-gradient-to-br from-slate-700/90 via-slate-600/80 to-slate-700/90 border border-slate-600/50' 
                  : 'bg-gradient-to-br from-white/90 via-blue-50/60 to-white/90 border border-blue-200/50'
              }`}>
                {/* Background decoration */}
                <div className={`absolute inset-0 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-blue-900/30 via-transparent to-slate-800/30' 
                    : 'bg-gradient-to-br from-blue-100/50 via-transparent to-white/50'
                }`}></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-300/20 to-transparent rounded-3xl"></div>
                
                {/* Icon */}
                <div className="relative mx-auto mb-6 z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-xl">
                    <div className="text-white">
                      {stepIcons[index]}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-blue-600">{step.id}</span>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className={`font-bold text-xl mb-4 relative z-10 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {step.title}
                </h3>
                
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-6 shadow-lg relative z-10">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  completed
                </div>
                
                <div className={`space-y-3 mb-6 relative z-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <div className="flex items-center justify-center text-sm">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">{step.date}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="font-semibold">{step.location}</span>
                  </div>
                </div>
                
                <p className={`text-sm leading-relaxed relative z-10 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {step.desc}
                </p>
              </div>
              
              {/* Connection Arrow */}
              {index < data.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-4 z-10">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
