import { useState } from "react";
import {
  validatePhone,
  validateEmail,
  validateAadhaar,
  validatePassword,
} from "../../lib/validators";
import { formatPhone, formatAadhaar } from "../../lib/helpers";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase.js"; // adjust path if needed

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

    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    else if (form.fullName.trim().length < 2)
      errs.fullName = "Full name must be at least 2 characters";

    if (!form.phone) errs.phone = "Phone number is required";
    else if (!validatePhone(form.phone))
      errs.phone = "Please enter a valid Indian mobile number";

    if (!form.email) errs.email = "Email is required";
    else if (!validateEmail(form.email))
      errs.email = "Please enter a valid email address";

    if (!form.aadhaar) errs.aadhaar = "Aadhaar number is required";
    else if (!validateAadhaar(form.aadhaar))
      errs.aadhaar = "Please enter a valid Aadhaar number";

    const { isValid, errors: pwdErrors } = validatePassword(form.password);
    if (!isValid) errs.password = Object.values(pwdErrors).find(Boolean);

    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (!form.termsAccepted)
      errs.termsAccepted = "You must accept the Terms & Conditions";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);
  setApiError("");

  try {
    // 1. Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    const user = userCredential.user;

    // 2. Update display name in Firebase Auth
    await updateProfile(user, {
      displayName: form.fullName,
    });

    // 3. Save user profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      aadhaar: form.aadhaar,
      createdAt: new Date().toISOString(),
    });

    // 4. Trigger onSuccess callback (e.g., redirect or show success)
    onSuccess(user);

  } catch (error) {
    console.error("Firebase signup error:", error);
    setApiError(error.message || "Registration failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  const getPasswordStrength = (password) => {
    const { errors: pwdErrors } = validatePassword(password);
    const passedChecks = Object.values(pwdErrors).filter((err) => !err).length;

    if (passedChecks < 2)
      return { label: "Weak", color: "text-red-500", width: "w-1/4" };
    if (passedChecks < 4)
      return { label: "Fair", color: "text-yellow-500", width: "w-2/4" };
    if (passedChecks < 5)
      return { label: "Good", color: "text-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "text-green-500", width: "w-full" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">⚠️ {apiError}</p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 ${
            errors.fullName ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          id="signup-phone"
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 ${
            errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 ${
            errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Aadhaar */}
      <div>
        <label htmlFor="signup-aadhaar" className="block text-sm font-medium text-gray-700 mb-1">
          Aadhaar Number *
        </label>
        <input
          id="signup-aadhaar"
          type="text"
          placeholder="Enter 12-digit Aadhaar number"
          value={form.aadhaar}
          onChange={(e) => handleChange("aadhaar", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 ${
            errors.aadhaar ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.aadhaar && <p className="text-sm text-red-500 mt-1">{errors.aadhaar}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a strong password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-green-500 ${
              errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

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
                className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.width} ${
                  passwordStrength.label === "Weak"
                    ? "bg-red-500"
                    : passwordStrength.label === "Fair"
                    ? "bg-yellow-500"
                    : passwordStrength.label === "Good"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              />
            </div>
          </div>
        )}

        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-green-500 ${
              errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(e) => handleChange("termsAccepted", e.target.checked)}
            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
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
        {errors.termsAccepted && <p className="text-sm text-red-500 mt-1">{errors.termsAccepted}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
          isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        } text-white`}
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
