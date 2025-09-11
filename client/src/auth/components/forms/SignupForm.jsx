import { useState } from "react";
import { validatePhone, validateEmail, validateAadhaar } from "../../lib/validators";

export default function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    aadhaar: "",
    password: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.aadhaar) {
      newErrors.aadhaar = "Aadhaar number is required";
    } else if (!validateAadhaar(form.aadhaar)) {
      newErrors.aadhaar = "Invalid Aadhaar number";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.termsAccepted) {
      newErrors.termsAccepted = "Please accept the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess({
        fullName: form.fullName.trim(),
        phone: form.phone,
        email: form.email,
        aadhaar: form.aadhaar,
        signupTime: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            errors.fullName ? "border-red-300" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          placeholder="Enter 10-digit number"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            errors.phone ? "border-red-300" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            errors.email ? "border-red-300" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Aadhaar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Aadhaar Number *
        </label>
        <input
          type="text"
          placeholder="Enter 12-digit Aadhaar"
          value={form.aadhaar}
          onChange={(e) => handleChange("aadhaar", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            errors.aadhaar ? "border-red-300" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.aadhaar && <p className="text-sm text-red-500 mt-1">{errors.aadhaar}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          type="password"
          placeholder="Enter password (min 6 characters)"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            errors.password ? "border-red-300" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(e) => handleChange("termsAccepted", e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-700">
            I agree to the Terms & Conditions *
          </span>
        </label>
        {errors.termsAccepted && <p className="text-sm text-red-500 mt-1">{errors.termsAccepted}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
