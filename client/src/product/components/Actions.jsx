import React, { useState } from "react";

export default function Actions({ showQR, setShowQR }) {
  const [copied, setCopied] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRescanVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert('✅ Product verified successfully! Authenticity confirmed.');
    }, 2000);
  };

  const handleReportFraud = () => {
    const confirmed = window.confirm('Are you sure you want to report this product as potentially fraudulent?');
    if (confirmed) {
      setReportStatus('reporting');
      setTimeout(() => {
        setReportStatus('reported');
        setTimeout(() => setReportStatus(null), 3000);
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 space-y-5">
      <div className="text-center">
        <h3 className="text-base font-bold text-gray-900 mb-2">Product Actions</h3>
        <p className="text-gray-600 text-sm">Verify authenticity and share product information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={() => setShowQR(!showQR)}
          className="flex items-center justify-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          {showQR ? 'Hide QR Code' : 'Show QR Code'}
        </button>
        
        <button 
          onClick={handleShareLink}
          className={`flex items-center justify-center px-5 py-3 font-medium rounded-lg transition-colors text-sm ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            )}
          </svg>
          {copied ? 'Link Copied!' : 'Share Link'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={handleRescanVerify}
          disabled={isVerifying}
          className="flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <svg className={`w-4 h-4 mr-2 ${isVerifying ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isVerifying ? 'Verifying...' : 'Rescan / Verify'}
        </button>
        
        <button 
          onClick={handleReportFraud}
          disabled={reportStatus === 'reporting'}
          className={`flex items-center justify-center px-5 py-3 font-medium rounded-lg transition-colors text-sm ${
            reportStatus === 'reported'
              ? 'bg-red-800 text-white'
              : reportStatus === 'reporting'
              ? 'bg-red-400 text-white cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {reportStatus === 'reported' ? 'Report Sent' : reportStatus === 'reporting' ? 'Reporting...' : 'Report Fraud'}
        </button>
      </div>

      {reportStatus === 'reported' && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 font-medium text-sm">Report submitted successfully</p>
          </div>
          <p className="text-green-700 text-xs mt-1 ml-8">Thank you for helping us maintain product authenticity.</p>
        </div>
      )}

      {showQR && (
        <div className="mt-5 p-5 border-2 border-dashed border-green-300 rounded-lg text-center bg-green-50">
          <div className="w-28 h-28 mx-auto mb-4 bg-white border-2 border-green-300 rounded-lg flex items-center justify-center">
            <svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h4 className="text-base font-bold mb-2 text-gray-900">Product Verification QR Code</h4>
          <p className="text-gray-600 text-sm mb-3">Scan this code to verify authenticity and trace the supply chain</p>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="text-xs text-gray-600">
              <div>Product ID: <span className="font-bold text-green-600">PRD-2025-ORG-TOM-001</span></div>
              <div>Blockchain Hash: <span className="font-bold text-blue-600">0xabc123...def456</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
