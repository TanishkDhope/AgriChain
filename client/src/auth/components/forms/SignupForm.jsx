import { useState } from "react";
import { validatePhone, validateEmail, validateAadhaar } from "../../lib/validators";

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

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (form.fullName.length < 3) errs.fullName = "Full name too short";
    if (!validatePhone(form.phone)) errs.phone = "Phone must be 10 digits";
    if (!validateEmail(form.email)) errs.email = "Invalid email";
    if (!validateAadhaar(form.aadhaar)) errs.aadhaar = "Aadhaar must be 12 digits";
    if (form.password.length < 6) errs.password = "Password min 6 chars";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords don’t match";
    if (!form.termsAccepted) errs.termsAccepted = "You must accept terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSuccess();
  };

  return (
    <div className="space-y-5">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
        <input
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={form.phone}
          onChange={(e) =>
            handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email *</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Aadhaar */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Aadhaar *</label>
        <input
          type="text"
          placeholder="Enter 12-digit Aadhaar number"
          value={form.aadhaar}
          onChange={(e) =>
            handleChange("aadhaar", e.target.value.replace(/\D/g, "").slice(0, 12))
          }
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {errors.aadhaar && <p className="text-sm text-red-500">{errors.aadhaar}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Password *</label>
        <input
          type="password"
          placeholder="Enter password (min 6 characters)"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={form.termsAccepted}
          onChange={(e) => handleChange("termsAccepted", e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm">I accept the Terms & Conditions *</span>
      </div>
      {errors.termsAccepted && (
        <p className="text-sm text-red-500">{errors.termsAccepted}</p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
      >
        Sign Up
      </button>
    </div>
  );
}
