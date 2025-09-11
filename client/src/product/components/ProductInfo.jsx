import React from "react";

export default function ProductInfo({ product }) {
  const { name, farm, fairPrice, info, certification } = product;

  return (
    <div className="space-y-4 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Premium Organic {name}</h1>
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="font-medium text-sm">{farm}</span>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-green-800">Fair Price Indicator</h3>
          <div className="text-right">
            <div className="text-green-700 text-sm">Farmer: <span className="font-bold">₹{fairPrice.farmer}</span></div>
            <div className="text-green-700 text-sm">Retail: <span className="font-bold">₹{fairPrice.retail}</span></div>
          </div>
        </div>
        <div className="mb-2 text-green-700 text-xs">
          Farmer receives {Math.round((fairPrice.farmer / fairPrice.retail) * 100)}% of retail price
        </div>
        <div className="w-full bg-green-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(fairPrice.farmer / fairPrice.retail) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-50 px-4 py-3 border-b">
          <h3 className="text-sm font-bold text-blue-800">Product Information</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Lot ID</label>
              <p className="font-semibold text-gray-900 text-sm">{info.lotId}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Farm ID</label>
              <p className="font-semibold text-gray-900 text-sm">{info.farmId}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Grade</label>
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                {info.grade}
              </span>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Quantity</label>
              <p className="font-bold text-base text-gray-900">{info.quantity}</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
            <p className="text-gray-700 mt-1 text-sm">{info.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-50 px-4 py-3 border-b">
          <h3 className="text-sm font-bold text-green-800">{certification.title}</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-700 text-sm">{certification.details}</p>
        </div>
      </div>
    </div>
  );
}
