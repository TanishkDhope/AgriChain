import React, { useState, useEffect } from "react";
import { getProductData } from "../lib/data";
import { useParams } from "react-router-dom";
import { getTokenMetadata } from "../../blockchain/product_registry.js";

export default function ProductDetails({
  batchId = "LOT12345",
  isLoading = false,
}) {
  const [image, setImage] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { tokenId } = useParams(); // /product/:tokenId
  const [metadata, setMetadata] = useState(null);
  const [isMetaLoading, setIsMetaLoading] = useState(true); // 👈 new

  // Load local product data
  useEffect(() => {
    const loadProductData = async () => {
      const productData = getProductData(batchId);

      const productImage =
        productData.gallery?.[1] ||
        productData.image ||
        productData.gallery?.[0] ||
        null;

      setImage(productImage);
      setIsImageLoading(true);
      setIsDataLoading(false);
    };

    loadProductData();
  }, [batchId]);

  // Load blockchain metadata
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setIsMetaLoading(true); // 👈 start loading
        const metaData = await getTokenMetadata(tokenId);
        console.log("Fetched metadata:", metaData);
           // Resolve ipfs:// to https://
      let metaImage = null;
      if (metaData?.image) {
        if (metaData.image.startsWith("ipfs://")) {
          metaImage = `https://ipfs.io/ipfs/${metaData.image.replace("ipfs://", "")}`;
        } else {
          metaImage = metaData.image;
        }
      }

      // If blockchain metadata has image, override productData image
      if (metaImage) {
        setImage(metaImage);
        setIsImageLoading(true);
      }
        setMetadata(metaData);
      } catch (err) {
        console.error("Error loading metadata:", err);
      } finally {
        setIsMetaLoading(false); // 👈 stop loading
      }
    };

    if (tokenId) {
      loadMetadata();
    }
  }, [tokenId]);

  if (isDataLoading || isLoading || isMetaLoading) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span>Loading product...</span>
      </div>
    );
  }

  const productData = getProductData(batchId);
  const { name, farm, info, certification } = productData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start p-6">
      {/* Left: Single Product Image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl bg-white">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {image && (
          <img
            src={image}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            alt="Product"
          />
        )}
      </div>

      {/* Right: Product Details */}
      <div className="space-y-6">
        {/* Header */}
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
            <h3 className="text-sm font-bold text-blue-800">
              Product Information
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase">Lot ID</label>
                <p className="font-mono text-sm">{info.lotId}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Farm ID</label>
                <p className="font-mono text-sm">{metadata.farmId}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase mr-2">
                  Grade
                </label>
                <span className="inline-block px-3 py-1 rounded-full text-xs bg-blue-600 text-white">
                  {info.grade}
                </span>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">
                  Quantity
                </label>
                <p className="font-bold">{metadata.quantity}</p>
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

        {/* Example showing blockchain metadata */}
        {metadata && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-purple-50 px-4 py-3 border-b">
              <h3 className="text-sm font-bold text-purple-800">Blockchain Metadata</h3>
            </div>
            <div className="p-6">
              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
