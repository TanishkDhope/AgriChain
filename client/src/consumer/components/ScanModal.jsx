import React, { useState, useEffect, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanModal({ isVisible, onClose, onScan }) {
  const [mode, setMode] = useState(null); // "camera" or "upload"
  const cameraRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (mode === "camera") {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      scannerRef.current = new Html5Qrcode("camera-preview");

      scannerRef.current
        .start({ facingMode: "environment" }, config, (decodedText) => {
          onScan(decodedText); // Pass scanned QR value back
          stopScanner();
        })
        .catch((err) => console.error("Camera error:", err));
    }

    return () => stopScanner();
  }, [mode]);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const tempId = `upload-preview-${Date.now()}`;
    const tempDiv = document.createElement("div");
    tempDiv.id = tempId;
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);

    const html5QrCode = new Html5Qrcode(tempId);

    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      if (decodedText) {
        onScan(decodedText);
        onClose();
      } else {
        alert("No QR code found in this image.");
      }
    } catch (err) {
      console.error("QR scan error:", err);
      alert("No QR code found in this image.");
    } finally {
      try {
        await html5QrCode.clear();
      } catch (e) {
        console.error("Failed to clear Html5Qrcode instance:", e);
      }
      document.body.removeChild(tempDiv);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Choose Scan Method</h3>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Main content */}
        <div className="p-6 space-y-4">
          {!mode && (
            <>
              <button
                onClick={() => setMode("camera")}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Camera className="mr-3 h-5 w-5" />
                Use Camera
              </button>
              <label className="w-full border-2 border-green-300 text-green-700 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center cursor-pointer">
                <Upload className="mr-3 h-5 w-5" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </>
          )}

          {mode === "camera" && (
            <div>
              <div id="camera-preview" className="w-full h-64 bg-gray-200 rounded-lg"></div>
              <button
                onClick={() => setMode(null)}
                className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Stop Camera
              </button>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500 text-center">
            {mode ? "Scanning for QR code..." : "Choose how you'd like to scan the QR code"}
          </p>
        </div>
      </div>
    </div>
  );
}
