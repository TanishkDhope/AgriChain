import { useState } from "react";
import {
  validatePhone,
  validateEmail,
  validateAadhaar,
} from "../../lib/validators";
import OtpModal from "./OtpModal";
import { auth, db, storage } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SignupForm({ onSuccess }) {
  const [phoneVerificationStep, setPhoneVerificationStep] = useState("input");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    aadhaar: "",
    password: "",
    confirmPassword: "",
    aadhaarFile: null,
    captcha: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaId, setCaptchaId] = useState(Date.now());
  const [otpError, setOtpError] = useState("");

  const handleChange = (field, value) => {
    const formattedValue =
      field === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : field === "aadhaar"
        ? value.replace(/\D/g, "").slice(0, 12)
        : value;

    setForm((prev) => ({ ...prev, [field]: formattedValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          aadhaarFile: "File size must be less than 5MB",
        }));
        return;
      }

      if (
        !["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
          file.type
        )
      ) {
        setErrors((prev) => ({
          ...prev,
          aadhaarFile: "Only JPG, PNG, and PDF files are allowed",
        }));
        return;
      }

      setForm((prev) => ({ ...prev, aadhaarFile: file }));
      if (errors.aadhaarFile) {
        setErrors((prev) => ({ ...prev, aadhaarFile: "" }));
      }
    }
  };

  const refreshCaptcha = () => {
    setCaptchaId(Date.now());
    setForm((prev) => ({ ...prev, captcha: "" }));
    if (errors.captcha) {
      setErrors((prev) => ({ ...prev, captcha: "" }));
    }
  };

  const handlePhoneVerify = async () => {
    if (!form.phone) {
      setErrors({ phone: "Phone number is required" });
      return;
    }
    if (!validatePhone(form.phone)) {
      setErrors({ phone: "Invalid phone number" });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowOtpModal(true);
      setErrors({});
    } catch (error) {
      setErrors({ phone: "Failed to send OTP. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerify = async (otp) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPhoneVerificationStep("verified");
      setShowOtpModal(false);
      setErrors({});
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpError("");
    } catch (error) {
      setOtpError("Failed to resend OTP.");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (phoneVerificationStep !== "verified") {
      newErrors.phone = "Please verify your phone number first";
    }

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
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

    if (!form.aadhaarFile) {
      newErrors.aadhaarFile = "Please upload Aadhaar document";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.captcha) {
      newErrors.captcha = "Captcha verification is required";
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
      // 1️⃣ Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;



      // 3️⃣ Save user details in Firestore
      await setDoc(doc(db, "users", user.email), {
        fullName: form.fullName.trim(),
        phone: form.phone,
        email: form.email,
        aadhaar: form.aadhaar,
        signupTime: new Date().toISOString(),
        walletAddress: "",
      });

      // 4️⃣ Notify parent
      onSuccess({
        fullName: form.fullName.trim(),
        phone: form.phone,
        email: form.email,
        aadhaar: form.aadhaar,
        signupTime: new Date().toISOString(),
        walletAddress: "",
      });
    } catch (error) {
      console.error("Signup failed:", error);
      setErrors({ email: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.phone ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting || phoneVerificationStep === "verified"}
            />
            {phoneVerificationStep === "input" && (
              <button
                type="button"
                onClick={handlePhoneVerify}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium whitespace-nowrap"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Verify"
                )}
              </button>
            )}
            {phoneVerificationStep === "verified" && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium whitespace-nowrap">
                ✓ Verified
              </span>
            )}
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

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
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aadhaar Number *
          </label>
          <input
            type="text"
            placeholder="Enter your Aadhaar number"
            value={form.aadhaar}
            onChange={(e) => handleChange("aadhaar", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.aadhaar ? "border-red-300" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.aadhaar && (
            <p className="text-sm text-red-500 mt-1">{errors.aadhaar}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Aadhaar Document *
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="aadhaar-upload"
              disabled={isSubmitting}
            />
            <label
              htmlFor="aadhaar-upload"
              className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                errors.aadhaarFile ? "border-red-300" : "border-gray-300"
              }`}
            >
              <span
                className={form.aadhaarFile ? "text-gray-900" : "text-gray-500"}
              >
                {form.aadhaarFile
                  ? form.aadhaarFile.name
                  : "Choose file (JPG, PNG, PDF)"}
              </span>
              <span className="text-gray-400">📁</span>
            </label>
          </div>
          {!errors.aadhaarFile && (
            <p className="text-xs text-gray-500 mt-1">
              Upload Aadhaar card (max 5MB)
            </p>
          )}
          {errors.aadhaarFile && (
            <p className="text-sm text-red-500 mt-1">{errors.aadhaarFile}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.password ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.confirmPassword ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Security Verification *
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter text from image"
              value={form.captcha}
              onChange={(e) => handleChange("captcha", e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.captcha ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            <div className="bg-gray-200 border border-gray-300 rounded-lg p-3 min-w-[120px] h-12 flex items-center justify-center">
              <img
                src={`https://via.placeholder.com/120x40/4A90E2/FFFFFF?text=CAPTCHA&_=${captchaId}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              🔄
            </button>
          </div>
          {errors.captcha && (
            <p className="text-sm text-red-500 mt-1">{errors.captcha}</p>
          )}
        </div>

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
          {errors.termsAccepted && (
            <p className="text-sm text-red-500 mt-1">{errors.termsAccepted}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || phoneVerificationStep !== "verified"}
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            phoneVerificationStep !== "verified"
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </span>
          ) : phoneVerificationStep !== "verified" ? (
            "Verify Phone Number First"
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerify}
        phoneNumber={form.phone}
        title="Verify Phone Number"
        isSubmitting={isSubmitting}
        error={otpError}
        onResendOtp={handleResendOtp}
      />
    </>
  );
}
