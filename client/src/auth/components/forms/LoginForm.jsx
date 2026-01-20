import { useState } from "react";
import { validatePhone, validateAadhaar } from "../../lib/validators";
import OtpModal from "./OtpModal";

// 🔹 Import Firebase (auth & db)
import { auth, db } from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginForm({ onSuccess }) {
  const [currentStep, setCurrentStep] = useState("login");
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    aadhaar: "",
    captcha: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaId, setCaptchaId] = useState(Date.now());
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");

  // 🔹 Handle input change
  const handleChange = (field, value) => {
    const formattedValue =
      field === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : field === "aadhaar"
        ? value.replace(/\D/g, "").slice(0, 12)
        : value;

    setForm((prev) => ({ ...prev, [field]: formattedValue }));

    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (apiError) setApiError("");
  };

  // 🔹 Validate login fields
  const validateLogin = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.aadhaar) {
      newErrors.aadhaar = "Aadhaar number is required";
    } else if (!validateAadhaar(form.aadhaar)) {
      newErrors.aadhaar = "Invalid Aadhaar number";
    }

    if (!form.captcha) {
      newErrors.captcha = "Captcha verification is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Refresh captcha
  const refreshCaptcha = () => {
    setCaptchaId(Date.now());
    setForm((prev) => ({ ...prev, captcha: "" }));
    if (errors.captcha) setErrors((prev) => ({ ...prev, captcha: "" }));
  };

  // 🔹 Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Open OTP modal (mock for now)
      setCurrentStep("otp");
      setShowOtpModal(true);
    } catch (error) {
      console.error(error);
      setApiError("Login failed. Please check your credentials.");
      refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Handle OTP Verify (Role-based support added here)
  const handleOtpVerify = async (otp) => {
    setIsSubmitting(true);
    setOtpError("");

    try {
      // Mock OTP delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userRef = doc(db, "users", form.email);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // New user → save Aadhaar & phone, but no role yet
        await setDoc(userRef, {
          email: form.email,
          phone: "+91" + form.phone,
          aadhaar: form.aadhaar,
          loginTime: new Date().toISOString(),
          role: null, // 🚨 no role yet
        });

        // Send user to role selection
        onSuccess({ step: "role-selection", email: form.email, phone: "+91" + form.phone });
        return;
      }

      const userData = userSnap.data();

      if (!userData.role) {
        // Existing user but no role → go to role selection
        onSuccess({ step: "role-selection", email: form.email, phone: "+91" + form.phone });
      } else {
        // Existing user with role → go to role dashboard
        onSuccess({
          email: form.email,
          phone: "+91" + form.phone,
          aadhaar: userData.aadhaar,
          role: userData.role,
          loginTime: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(error);
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

  return (
    <>
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      {currentStep === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
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
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
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
            {errors.aadhaar && (
              <p className="text-sm text-red-500 mt-1">{errors.aadhaar}</p>
            )}
          </div>

          {/* Captcha */}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      )}

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setCurrentStep("login");
        }}
        onVerify={handleOtpVerify}
        phoneNumber={form.phone}
        title="Verify Login OTP"
        isSubmitting={isSubmitting}
        error={otpError}
        onResendOtp={handleResendOtp}
      />
    </>
  );
}
