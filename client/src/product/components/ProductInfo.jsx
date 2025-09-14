import React from "react";

// Skeleton Components
const ProductNameSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2 animate-pulse" />
    <div className="flex items-center">
      <div className="w-4 h-4 bg-slate-200 rounded mr-2 animate-pulse" />
      <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
    </div>
  </div>
);

const FairPriceSkeleton = () => (
  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
    <div className="flex justify-between items-center mb-3">
      <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
      <div className="text-right space-y-2">
        <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
      </div>
    </div>
    <div className="h-3 bg-slate-200 rounded w-2/3 mb-2 animate-pulse" />
    <div className="w-full bg-green-200 rounded-full h-2">
      <div className="bg-slate-300 h-2 rounded-full w-0 animate-pulse" />
    </div>
  </div>
);

const ProductInfoSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="bg-blue-50 px-4 py-3 border-b">
      <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
    </div>
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Array(4).fill(0).map((_, index) => (
          <div key={index}>
            <div className="h-3 bg-slate-200 rounded w-16 mb-1 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
          </div>
        ))}
      </div>
      <div>
        <div className="h-3 bg-slate-200 rounded w-20 mb-2 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const CertificationSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="bg-green-50 px-4 py-3 border-b">
      <div className="h-4 bg-slate-200 rounded w-40 animate-pulse" />
    </div>
    <div className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
      </div>
    </div>
  </div>
);

// Main Component with Loading States
export default function ProductInfo({ product, isLoading = false }) {

  if (isLoading || !product) {
    return (
      <div className="space-y-4 p-4">
        <ProductNameSkeleton />
        <FairPriceSkeleton />
        <ProductInfoSkeleton />
        <CertificationSkeleton />
      </div>
    );
  }

  const { name, farm, fairPrice, info, certification } = product;

  // Ensure all required data is available
  if (!name || !farm || !fairPrice || !info || !certification) {
    return (
      <div className="space-y-4 p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800 font-medium">Product information is incomplete</span>
          </div>
        </div>
      </div>
    );
  }

  const farmerSharePercentage = Math.round((fairPrice.farmer / fairPrice.retail) * 100);

  return (
    <div className="space-y-4 p-4">
      {/* Product Header */}
      <div className="bg-white p-4 rounded-lg shadow-lg animate-in slide-in-from-top-1">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Premium Organic {name}
        </h1>
        <div className="flex items-center text-gray-600">
          <svg 
            className="w-4 h-4 mr-2 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
          </svg>
          <span className="font-medium text-sm">{farm}</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-3">
        <div className="bg-blue-50 px-4 py-3 border-b">
          <h3 className="text-sm font-bold text-blue-800">Product Information</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lot ID
              </label>
              <p className="font-semibold text-gray-900 text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                {info.lotId}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Farm ID
              </label>
              <p className="font-semibold text-gray-900 text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                {info.farmId}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </label>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-sm">
                {info.grade}
              </span>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </label>
              <p className="font-bold text-base text-gray-900">{info.quantity}</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </label>
            <p className="text-gray-700 mt-1 text-sm leading-relaxed">{info.description}</p>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-4">
        <div className="bg-green-50 px-4 py-3 border-b">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-sm font-bold text-green-800">{certification.title}</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-700 text-sm leading-relaxed">{certification.details}</p>
        </div>
      </div>
    </div>
  );
}
