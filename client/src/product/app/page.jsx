"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProductDetails from "../components/ProductDetails.jsx";
import Timeline from "../components/Timeline.jsx";
import Reviews from "../components/Reviews.jsx";
import Actions from "../components/Actions.jsx";
import Notification from "../components/Notification.jsx";
import Chatbot from "../../consumer/app/Chatbot.jsx"
import {
  productData,
  timelineData,
  reviewsData,
  getProductData,
  getTimelineData,
  getReviewsData,
} from "../lib/data.js";

export default function ProductPage({ onLogout }) {
  const { batchId, productName } = useParams();
  const navigate = useNavigate();

  const [showQR, setShowQR] = useState(false);
  const [notification, setNotification] = useState("");
  const [currentProduct, setCurrentProduct] = useState(productData);
  const [currentTimeline, setCurrentTimeline] = useState(timelineData);
  const [currentReviews, setCurrentReviews] = useState(reviewsData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (batchId) {
      setLoading(true);

      const product = getProductData(batchId);
      const timeline = getTimelineData(batchId);
      const reviews = getReviewsData(batchId);

      setCurrentProduct(product);
      setCurrentTimeline(timeline);
      setCurrentReviews(reviews);

      const expectedSlug = product.name.toLowerCase().replace(/\s+/g, "-");
      if (productName && productName !== expectedSlug) {
        const correctUrl = `/product/${batchId}/${expectedSlug}`;
        navigate(correctUrl, { replace: true });
      }

      setNotification(`✅ Tracking: ${product.name} (${batchId})`);
      setLoading(false);
    } else {
      setCurrentProduct(productData);
      setCurrentTimeline(timelineData);
      setCurrentReviews(reviewsData);
      setNotification("📋 Sample Product View");
    }
  }, [batchId, productName, navigate]);

  const handleLogoutWithNotification = () => {
    setNotification("Logged out successfully ✅");
    if (onLogout) onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Loading Product Details
          </h3>
          <p className="text-green-600">Fetching supply chain information...</p>
          {batchId && (
            <p className="text-sm text-gray-600 mt-3 font-mono bg-white px-3 py-1 rounded-full inline-block">
              Batch: {batchId}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      <Header
        onLogout={handleLogoutWithNotification}
        batchId={batchId}
        showBackButton={!!batchId}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Product Details (now handles left image + right details internally) */}
        <ProductDetails
          product={currentProduct}
          batchId={batchId}
          productName={productName}
        />

        {/* Actions Section */}
        <div id="actions-section" className="pt-4">
          <Actions
            showQR={showQR}
            setShowQR={setShowQR}
            batchId={batchId}
            product={currentProduct}
          />
        </div>

        {/* Timeline + Reviews */}
        <div className="mt-16 space-y-16">
          <div className="border-t border-gray-200 pt-16">
            <Timeline data={currentTimeline} batchId={batchId} />
          </div>

          <div className="border-t border-gray-200 pt-16">
            <Reviews data={currentReviews} batchId={batchId} />
          </div>
        </div>
      </div>
      <Chatbot />
      <Footer />
      <Notification message={notification} />
    </div>
  );
}
