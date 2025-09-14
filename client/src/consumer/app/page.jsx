import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import ScanModal from "../components/ScanModal";
import LoadingOverlay from "../components/LoadingOverlay";
import Notification from "../components/Notification";
import Footer from "../components/Footer";
import Chatbot from "./Chatbot";

export default function ConsumerHomePage() {
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory");
    if (saved) setScanHistory(JSON.parse(saved));
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  // ✅ Updated to handle real QR scan result
  const handleScan = (decodedText) => {
    setShowScanModal(false);
    setIsScanning(true);

    // Simulate small delay (optional, just for UX)
    setTimeout(() => {
      const newScan = {
        id: Date.now(),
        productName: decodedText || `Unknown Product`,
        origin: "Farm Valley Co.", // you can replace with real lookup later
        date: new Date().toLocaleDateString(),
        status: Math.random() > 0.3 ? "Verified" : "Warning",
        qrCode: decodedText,
      };

      const updated = [newScan, ...scanHistory].slice(0, 10);
      setScanHistory(updated);
      localStorage.setItem("scanHistory", JSON.stringify(updated));

      setIsScanning(false);
      showNotification(`Scanned: ${newScan.productName}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Notification message={notification} />
      <LoadingOverlay isVisible={isScanning} />

      <Header scanCount={scanHistory.length} />

      <MainContent
        scanHistory={scanHistory}
        onScanClick={() => setShowScanModal(true)}
        onNotification={showNotification}
      />

      <ScanModal
        isVisible={showScanModal}
        onClose={() => setShowScanModal(false)}
        onScan={handleScan}
      />
      <Chatbot />
      <Footer />
    </div>
  );
}