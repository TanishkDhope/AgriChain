import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Flag, Camera, Send, Upload } from "lucide-react";

export default function ReportIssuePopup({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    productId: "",
    image: null
  });
  
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle ESC key press
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Handle click outside modal
  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, handleKeyDown, handleClickOutside]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ issueType: "", description: "", productId: "", image: null });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          image: {
            file: file,
            preview: reader.result,
            name: file.name
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <Flag className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Report Issue</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Issue Type - Optional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Issue Type <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select issue type</option>
              <option value="quality">Product Quality Issue</option>
              <option value="authenticity">Authenticity Concern</option>
              <option value="supply-chain">Supply Chain Problem</option>
              <option value="labeling">Incorrect Labeling</option>
              <option value="contamination">Contamination</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Product ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product ID <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              placeholder="Enter product ID or scan code"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Image Upload - Optional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Image <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            
            {!formData.image ? (
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-colors flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload image</span>
                  <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
                </button>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={formData.image.preview}
                  alt="Upload preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-700 truncate max-w-[200px]">
                  {formData.image.name}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Please describe the issue in detail..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
