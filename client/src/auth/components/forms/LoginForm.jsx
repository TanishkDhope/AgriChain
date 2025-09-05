import { useState } from "react";
import { validatePhone, validateEmail, validateAadhaar } from "../../lib/validators";
import { formatPhone, formatAadhaar } from "../../lib/helpers";

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ phone: "", email: "", aadhaar: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field, value) => {
    let formattedValue = value;
    
    // Apply formatting
    if (field === "phone") {
      formattedValue = formatPhone(value);
    } else if (field === "aadhaar") {
      formattedValue = formatAadhaar(value);
    }

    setForm((prev) => ({ ...prev, [field]: formattedValue }));
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    
    // Clear API error
    if (apiError) setApiError("");
  };

  const validate = () => {
    const errs = {};
    
    if (!form.phone) {
      errs.phone = "Phone number is required";
    } else if (form.phone.length !== 10) {
      errs.phone = "Phone number must be exactly 10 digits";
    } else if (!validatePhone(form.phone)) {
      errs.phone = "Please enter a valid Indian mobile number";
    }

    if (form.email && !validateEmail(form.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!form.aadhaar) {
      errs.aadhaar = "Aadhaar number is required";
    } else if (form.aadhaar.length !== 12) {
      errs.aadhaar = "Aadhaar number must be exactly 12 digits";
    } else if (!validateAadhaar(form.aadhaar)) {
      errs.aadhaar = "Please enter a valid Aadhaar number";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     phone: form.phone,
      //     email: form.email,
      //     aadhaar: form.aadhaar
      //   })
      // });

      // if (!response.ok) {
      //   throw new Error('Invalid credentials. Please check your details.');
      // }

      // const userData = await response.json();
      
      // For demo purposes, create mock user data
      const userData = {
        phone: form.phone,
        email: form.email,
        aadhaar: form.aadhaar,
        loginTime: new Date().toISOString()
      };
      
      onSuccess(userData);
      
    } catch (error) {
      setApiError(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* API Error Display */}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span>⚠️</span>
            {apiError}
          </p>
        </div>
      )}

      {/* Phone Number */}
      <div>
        <label 
          htmlFor="phone" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-required="true"
          aria-invalid={errors.phone ? "true" : "false"}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          disabled={isSubmitting}
          maxLength="10"
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-red-500 mt-2" role="alert">
            {errors.phone}
          </p>
        )}
        {form.phone && form.phone.length === 10 && !errors.phone && (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <span>✓</span> Valid phone number
          </p>
        )}
      </div>

      {/* Email (Optional) */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email (Optional)
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500 mt-2" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Aadhaar Number */}
      <div>
        <label 
          htmlFor="aadhaar" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Aadhaar Number *
        </label>
        <input
          id="aadhaar"
          type="text"
          placeholder="Enter 12-digit Aadhaar number"
          value={form.aadhaar}
          onChange={(e) => handleChange("aadhaar", e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.aadhaar ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-required="true"
          aria-invalid={errors.aadhaar ? "true" : "false"}
          aria-describedby={errors.aadhaar ? "aadhaar-error" : undefined}
          disabled={isSubmitting}
          maxLength="12"
        />
        {errors.aadhaar && (
          <p id="aadhaar-error" className="text-sm text-red-500 mt-2" role="alert">
            {errors.aadhaar}
          </p>
        )}
        {form.aadhaar && form.aadhaar.length === 12 && !errors.aadhaar && (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <span>✓</span> Valid Aadhaar number
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 active:bg-green-800'
        } text-white shadow-lg hover:shadow-xl`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Logging in...
          </span>
        ) : (
          'Login to AgriTrack'
        )}
      </button>
    </form>
  );
}
