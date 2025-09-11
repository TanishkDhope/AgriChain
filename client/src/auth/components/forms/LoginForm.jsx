import { useState } from "react";
import {
  validatePhone,
  validateEmail,
  validateAadhaar,
} from "../../lib/validators";
import { formatPhone, formatAadhaar } from "../../lib/helpers";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase.js"; // adjust path if needed
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorBoundary from "../ui/ErrorBoundary";

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ 
    phone: "", 
    aadhaar: "" 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field, value) => {
    const formattedValue = field === "phone" 
      ? value.replace(/\D/g, "").slice(0, 10)
      : field === "aadhaar" 
      ? value.replace(/\D/g, "").slice(0, 12)
      : value;

    setForm(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (apiError) setApiError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      errs.email = "Email is required for login";
    } else if (!validateEmail(form.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!form.password) {
      errs.password = "Password is required";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Enter valid 10-digit mobile number";
    }

    if (!form.aadhaar) {
      newErrors.aadhaar = "Aadhaar number is required";
    } else if (!validateAadhaar(form.aadhaar)) {
      newErrors.aadhaar = "Enter valid 12-digit Aadhaar number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      // 1. Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // 2. Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("User profile not found. Please contact support.");
      }

      const userData = userDoc.data();

      // 3. Extra checks (phone & Aadhaar match)
      if (userData.phone !== form.phone || userData.aadhaar !== form.aadhaar) {
        throw new Error("Phone or Aadhaar number does not match our records.");
      }

      // 4. Success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess({
        ...userData,
        loginTime: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Login error:", error);
      setApiError(
        error.code === "auth/user-not-found"
          ? "No account found with this email."
          : error.code === "auth/wrong-password"
          ? "Incorrect password."
          : error.message || "Login failed. Please try again."
      );
      setApiError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit(e);
    }
  };

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* API Error Alert */}
        {apiError && (
          <div 
            role="alert" 
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-medium" aria-hidden="true">⚠️</span>
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        )}

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.phone ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
          }`}
          disabled={isSubmitting}
          maxLength="10"
        /> 
        {errors.phone && <p className="text-sm text-red-500 mt-2">{errors.phone}</p>}
      </div>

      {/* Aadhaar */}
      <div>
        <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-2">
          Aadhaar Number *
        </label>
        <input
          id="aadhaar"
          type="text"
          placeholder="Enter 12-digit Aadhaar number"
          value={form.aadhaar}
          onChange={(e) => handleChange("aadhaar", e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.aadhaar ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
          }`}
          disabled={isSubmitting}
          maxLength="12"
        />
        {errors.aadhaar && <p className="text-sm text-red-500 mt-2">{errors.aadhaar}</p>}
      </div>
        {/* Phone Number */}
        <div>
          <label 
            htmlFor="login-phone" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number *
          </label>
          <input
            id="login-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter 10-digit mobile number"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            disabled={isSubmitting}
            maxLength="10"
            aria-required="true"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : "phone-help"}
          />
          {!errors.phone && (
            <div id="phone-help" className="text-xs text-gray-500 mt-1">
              Enter your registered mobile number
            </div>
          )}
          {errors.phone && (
            <div 
              id="phone-error" 
              role="alert" 
              className="text-sm text-red-500 mt-1"
              aria-live="polite"
            >
              {errors.phone}
            </div>
          )}
        </div>

        {/* Aadhaar Number */}
        <div>
          <label 
            htmlFor="login-aadhaar" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Aadhaar Number *
          </label>
          <input
            id="login-aadhaar"
            name="aadhaar"
            type="text"
            autoComplete="off"
            placeholder="Enter 12-digit Aadhaar number"
            value={form.aadhaar}
            onChange={(e) => handleChange("aadhaar", e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              errors.aadhaar ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            disabled={isSubmitting}
            maxLength="12"
            aria-required="true"
            aria-invalid={errors.aadhaar ? "true" : "false"}
            aria-describedby={errors.aadhaar ? "aadhaar-error" : "aadhaar-help"}
          />
          {!errors.aadhaar && (
            <div id="aadhaar-help" className="text-xs text-gray-500 mt-1">
              Your Aadhaar information is secure and encrypted
            </div>
          )}
          {errors.aadhaar && (
            <div 
              id="aadhaar-error" 
              role="alert" 
              className="text-sm text-red-500 mt-1"
              aria-live="polite"
            >
              {errors.aadhaar}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all focus:ring-4 focus:ring-green-200 focus:outline-none ${
            isSubmitting 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
          }`}
          aria-describedby="submit-help"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Logging in...</span>
            </span>
          ) : (
            "Login to AgriChain"
          )}
        </button>
        <div id="submit-help" className="sr-only">
          Press Enter or click to login
        </div>
      </form>
    </ErrorBoundary>
  );
}
