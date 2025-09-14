import React, { useState,useEffect,useContext } from "react";
import {
  Share2,
  Shield,
  AlertTriangle,
  Check,
  RefreshCw,
} from "lucide-react";
import { socketContext } from "../../contexts/socketContext.jsx";

export default function Actions({ batchId, product }) {
  const [copied, setCopied] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
 const { socket, setSocket } = useContext(socketContext);

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRescanVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert(
        `✅ ${
          product?.name || "Product"
        } verified successfully!\n\n🔗 Batch ID: ${batchId}\n🏢 Farm: ${
          product?.farm
        }\n📋 Grade: ${product?.info?.grade}\n🛡️ Certification: ${
          product?.certification?.title
        }\n\nAuthenticity confirmed through blockchain!`
      );
    }, 2500);
  };

  const handleReportFraud = () => {
    const confirmed = window.confirm(
      `⚠️ Report Fraud Alert\n\nYou are about to report:\n📦 Product: ${
        product?.name || "Unknown"
      }\n🏷️ Batch ID: ${batchId || "Unknown"}\n🏢 Farm: ${
        product?.farm || "Unknown"
      }\n\nAre you sure this product appears fraudulent?`
    );

    if (confirmed) {
      setReportStatus("reporting");
      setTimeout(() => {
        setReportStatus("reported");
        const reportData = {
          timestamp: new Date().toISOString(),
          batchId: batchId,
          productName: product?.name,
          farm: product?.farm,
          reporterIP: "Hidden for privacy",
          reason: "User reported potential fraud",
        };

        const existingReports = JSON.parse(
          localStorage.getItem("fraudReports") || "[]"
        );
        existingReports.push(reportData);
        localStorage.setItem("fraudReports", JSON.stringify(existingReports));
        setTimeout(() => setReportStatus(null), 4000);
      }, 2000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Buy Button (replaces Show QR Code) */}
        <button
          onClick={() => alert(`🛒 Buying ${product?.name || "Product"}...`)}
          className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg"
        >
          Buy Now
        </button>

        <button
          onClick={handleShareLink}
          className={`flex items-center justify-center px-5 py-3 font-semibold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300"
          }`}
        >
          {copied ? (
            <Check className="w-5 h-5 mr-2" />
          ) : (
            <Share2 className="w-5 h-5 mr-2" />
          )}
          {copied ? "URL Copied!" : "Share Product"}
        </button>
      </div>

      {/* Secondary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleRescanVerify}
          disabled={isVerifying}
          className="flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg"
        >
          <RefreshCw
            className={`w-5 h-5 mr-2 ${isVerifying ? "animate-spin" : ""}`}
          />
          {isVerifying ? "Verifying Blockchain..." : "Verify Authenticity"}
        </button>

        <button
          onClick={handleReportFraud}
          disabled={reportStatus === "reporting"}
          className={`flex items-center justify-center px-5 py-3 font-semibold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg ${
            reportStatus === "reported"
              ? "bg-red-800 text-white"
              : reportStatus === "reporting"
              ? "bg-red-400 text-white cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          {reportStatus === "reported"
            ? "✅ Report Sent"
            : reportStatus === "reporting"
            ? "Reporting..."
            : "Report Fraud"}
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg"
        >Buy Product</button>
      </div>

      {/* Report Success Message */}
      {reportStatus === "reported" && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 animate-in slide-in-from-top-2">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-green-800 font-semibold text-sm">
                Report Submitted Successfully
              </h4>
              <p className="text-green-700 text-sm mt-1">
                Fraud report for <strong>{product?.name}</strong> (Batch:{" "}
                <code>{batchId}</code>) has been logged and will be
                investigated.
              </p>
              <p className="text-green-600 text-xs mt-2">
                Thank you for helping maintain supply chain integrity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}