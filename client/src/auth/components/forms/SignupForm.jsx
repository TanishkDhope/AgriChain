import { useState } from "react";
import { validatePhone, validateEmail, validateAadhaar, validatePassword } from "../../lib/validators";
import { formatPhone, formatAadhaar } from "../../lib/helpers";

export default function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    aadhaar: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    
    if (!form.fullName.trim()) {
      errs.fullName = "Full name is required";
    } else if (form.fullName.trim().length < 2) {
      errs.fullName = "Full name must be at least 2 characters";
    }

    if (!form.phone) {
      errs.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      errs.phone = "Phone number must be exactly 10 digits";
    }

    if (!form.email) {
      errs.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!form.aadhaar) {
      errs.aadhaar = "Aadhaar number is required";
    } else if (!validateAadhaar(form.aadhaar)) {
      errs.aadhaar = "Aadhaar number must be exactly 12 digits";
    }

    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      errs.password = Object.values(passwordValidation.errors).filter(Boolean)[0];
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (!form.termsAccepted) {
      errs.termsAccepted = "You must accept the Terms & Conditions";
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, replace with actual API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone,
          email: form.email,
          aadhaar: form.aadhaar,
          password: form.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const userData = await response.json();
      onSuccess(userData);
      
    } catch (error) {
      setApiError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password) => {
    const validation = validatePassword(password);
    const strength = Object.values(validation.errors).filter(error => !error).length;
    
    if (strength < 2) return { label: "Weak", color: "text-red-500", width: "w-1/4" };
    if (strength < 4) return { label: "Fair", color: "text-yellow-500", width: "w-2/4" };
    if (strength < 5) return { label: "Good", color: "text-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "text-green-500", width: "w-full" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* API Error Display */}
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span>⚠️</span>
            {apiError}
          </p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label 
          htmlFor="fullName" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          aria-required="true"
          aria-invalid={errors.fullName ? "true" : "false"}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p id="fullName-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label 
          htmlFor="signup-phone" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number *
        </label>
        <input
          id="signup-phone"
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          aria-required="true"
          aria-invalid={errors.phone ? "true" : "false"}
          aria-describedby={errors.phone ? "signup-phone-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p id="signup-phone-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label 
          htmlFor="signup-email" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address *
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          aria-required="true"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p id="signup-email-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Aadhaar Number */}
      <div>
        <label 
          htmlFor="signup-aadhaar" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Aadhaar Number *
        </label>
        <input
          id="signup-aadhaar"
          type="text"
          placeholder="Enter 12-digit Aadhaar number"
          value={form.aadhaar}
          onChange={(e) => handleChange("aadhaar", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
            errors.aadhaar ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          aria-required="true"
          aria-invalid={errors.aadhaar ? "true" : "false"}
          aria-describedby={errors.aadhaar ? "signup-aadhaar-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.aadhaar && (
          <p id="signup-aadhaar-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.aadhaar}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a strong password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            aria-required="true"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : "password-help"}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {form.password && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Password strength:</span>
              <span className={`text-xs font-medium ${passwordStrength.color}`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  passwordStrength.label === 'Weak' ? 'bg-red-500' :
                  passwordStrength.label === 'Fair' ? 'bg-yellow-500' :
                  passwordStrength.label === 'Good' ? 'bg-blue-500' : 'bg-green-500'
                } ${passwordStrength.width}`}
              ></div>
            </div>
          </div>
        )}
        
        {!errors.password && form.password && (
          <p id="password-help" className="text-xs text-gray-500 mt-1">
            Password must contain: 8+ characters, uppercase, lowercase, number, special character
          </p>
        )}
        
        {errors.password && (
          <p id="password-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label 
          htmlFor="confirmPassword" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
              errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            aria-required="true"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(e) => handleChange("termsAccepted", e.target.checked)}
            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            aria-required="true"
            aria-invalid={errors.termsAccepted ? "true" : "false"}
            aria-describedby={errors.termsAccepted ? "terms-error" : undefined}
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="/terms" className="text-green-600 hover:text-green-700 underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-green-600 hover:text-green-700 underline">
              Privacy Policy
            </a>{" "}
            *
          </span>
        </label>
        {errors.termsAccepted && (
          <p id="terms-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.termsAccepted}
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
            : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200'
        } text-white`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}
