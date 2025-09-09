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

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ phone: "", email: "", aadhaar: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field, value) => {
    const formattedValue =
      field === "phone"
        ? formatPhone(value)
        : field === "aadhaar"
        ? formatAadhaar(value)
        : value;

    setForm((prev) => ({ ...prev, [field]: formattedValue }));

    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (apiError) setApiError("");
  };

  const validate = () => {
    const errs = {};

    if (!form.email) {
      errs.email = "Email is required for login";
    } else if (!validateEmail(form.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!form.password) {
      errs.password = "Password is required";
    }

    if (!form.phone) {
      errs.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      errs.phone = "Please enter a valid Indian mobile number";
    }

    if (!form.aadhaar) {
      errs.aadhaar = "Aadhaar number is required";
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">⚠️ {apiError}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
          }`}
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.password ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
          }`}
          disabled={isSubmitting}
        />
        {errors.password && <p className="text-sm text-red-500 mt-2">{errors.password}</p>}
      </div>

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

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 active:bg-green-800"
        } text-white shadow-lg hover:shadow-xl`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Logging in...
          </span>
        ) : (
          "Login to AgriTrack"
        )}
      </button>
    </form>
  );
}
