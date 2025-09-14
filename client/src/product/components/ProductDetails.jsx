import React, { useState, useEffect } from "react";
import { getProductData } from "../lib/data";

export default function ProductDetails({ batchId = "LOT12345", isLoading = false }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const loadProductData = async () => {
      setIsDataLoading(true);
      const productData = getProductData(batchId);
      const productImages =
        productData.gallery?.length > 0 ? productData.gallery : [productData.image];

      setImages(productImages);
      setCurrentImageIndex(0);

      const initialLoadingStates = {};
      productImages.forEach((_, index) => {
        initialLoadingStates[index] = true;
      });
      setImageLoadingStates(initialLoadingStates);
      setIsDataLoading(false);
    };

    loadProductData();
  }, [batchId]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageLoad = (index) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isDataLoading || images.length === 0 || isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading product...</div>;
  }

  const productData = getProductData(batchId);
  const { name, farm, info, certification } = productData;
  const hasMultipleImages = images.length > 1;
  const currentImageLoading = imageLoadingStates[currentImageIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start p-6">
      {/* Left: Product Gallery */}
      <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl bg-white">
        {currentImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={images[currentImageIndex]}
          className={`w-full h-full object-cover transition-all duration-700 ${
            currentImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => handleImageLoad(currentImageIndex)}
          alt={`Product image ${currentImageIndex + 1}`}
        />

        {/* Prev/Next buttons */}
        {hasMultipleImages && !currentImageLoading && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Right: Details */}
      <div className="space-y-6">
        {/* Product Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
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
            <span className="font-medium">{farm}</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 border-b">
            <h3 className="text-sm font-bold text-blue-800">Product Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase">Lot ID</label>
                <p className="font-mono text-sm">{info.lotId}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Farm ID</label>
                <p className="font-mono text-sm">{info.farmId}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Grade</label>
                <span className="inline-block px-3 py-1 rounded-full text-xs bg-blue-600 text-white">
                  {info.grade}
                </span>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Quantity</label>
                <p className="font-bold">{info.quantity}</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Description</label>
              <p className="text-gray-700 mt-1">{info.description}</p>
            </div>
          </div>
        </div>

        {/* Certification */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-50 px-4 py-3 border-b flex items-center">
            <svg
              className="w-4 h-4 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4"
              />
            </svg>
            <h3 className="text-sm font-bold text-green-800">
              {certification.title}
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700">{certification.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
}