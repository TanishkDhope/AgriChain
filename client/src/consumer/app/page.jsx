import React, { useState, useEffect } from "react";
import { LanguageProvider } from "../i18n/config";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import ScanModal from "../components/ScanModal";
import LoadingOverlay from "../components/LoadingOverlay";
import Notification from "../components/Notification";
import Footer from "../components/Footer";
import Chatbot from "./Chatbot";

function ConsumerHomePageContent() {
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

  const handleScan = (decodedText) => {
    window.location.href = decodedText;
    setShowScanModal(false);
    setIsScanning(true);

    setTimeout(() => {
      const newScan = {
        id: Date.now(),
        productName: decodedText || `Unknown Product`,
        origin: "Farm Valley Co.",
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
      <Header scanCount={scanHistory.length} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <MainContent
          scanHistory={scanHistory}
          onScanClick={() => setShowScanModal(true)}
          onNotification={showNotification}
        />
      </main>
      <Footer />
      <ScanModal
        isVisible={showScanModal}
        onClose={() => setShowScanModal(false)}
        onScan={handleScan}
      />
      <LoadingOverlay isVisible={isScanning} />
      <Notification message={notification} />
      <Chatbot />
    </div>
  );
}

export default function ConsumerHomePage() {
  return (
    <LanguageProvider>
      <ConsumerHomePageContent />
    </LanguageProvider>
  );
}
