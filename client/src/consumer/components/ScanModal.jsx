import React from "react";
import { Camera, Upload, X } from "lucide-react";

export default function ScanModal({ isVisible, onClose, onScan }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Choose Scan Method</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <button
            onClick={() => onScan('camera')}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <Camera className="inline mr-3 h-5 w-5" />
            Use Camera
          </button>
          <button
            onClick={() => onScan('upload')}
            className="w-full border-2 border-green-300 text-green-700 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors"
          >
            <Upload className="inline mr-3 h-5 w-5" />
            Upload Image
          </button>
        </div>
        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500 text-center">
            Choose how you'd like to scan the QR code
          </p>
        </div>
      </div>
    </div>
  );
}
