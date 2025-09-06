import React from "react"

export default function Reviews({ data }) {
  const averageRating = 4.7
  const totalReviews = data.length

  return (
    <div className="rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-lg bg-gradient-to-br from-white/90 via-yellow-50/60 to-white/90 border border-yellow-200/50">
      <div className="px-8 py-8 border-b relative overflow-hidden bg-gradient-to-r from-yellow-100/90 via-amber-100/70 to-yellow-200/90 border-yellow-200/50">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-amber-500/20"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-yellow-800">
              Customer Reviews
            </h2>
          </div>
        </div>
      </div>
      
      <div className="p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/40 via-transparent to-white/60"></div>
        
        {/* Rating Summary */}
        <div className="flex items-center justify-between mb-8 p-6 rounded-3xl backdrop-blur-sm shadow-xl relative z-10 overflow-hidden bg-gradient-to-r from-yellow-50/90 to-amber-50/90 border border-yellow-200/50">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10"></div>
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-8 h-8 ${
                    star <= Math.floor(averageRating)
                      ? 'text-yellow-500'
                      : star === Math.ceil(averageRating) && averageRating % 1 !== 0
                      ? 'text-yellow-500 opacity-50'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div>
              <span className="text-3xl font-bold text-slate-900">
                {averageRating}
              </span>
              <span className="text-xl ml-2 text-slate-600">
                out of 5
              </span>
            </div>
          </div>
          <div className="text-right relative z-10">
            <div className="text-2xl font-bold text-slate-900">
              {totalReviews}
            </div>
            <div className="text-slate-600">
              reviews
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {data.map((review) => (
            <div key={review.id} className="rounded-3xl p-8 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 backdrop-blur-lg relative overflow-hidden bg-gradient-to-br from-white/90 via-slate-50/60 to-white/90 border border-slate-200/50">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-slate-100/30"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-300/20 to-transparent rounded-3xl"></div>
              
              <div className="flex items-center space-x-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">
                    {review.name}
                  </h4>
                  <div className="flex items-center space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">
                    {review.date}
                  </span>
                </div>
              </div>
              
              <p className="leading-relaxed text-lg relative z-10 text-slate-700">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
