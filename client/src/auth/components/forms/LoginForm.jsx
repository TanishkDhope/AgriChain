import { useState } from "react";
import { validatePhone, validateEmail, validateAadhaar } from "../../lib/validators";

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ phone: "", email: "", aadhaar: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!validatePhone(form.phone)) errs.phone = "Phone must be 10 digits";
    if (form.email && !validateEmail(form.email)) errs.email = "Invalid email";
    if (!validateAadhaar(form.aadhaar)) errs.aadhaar = "Aadhaar must be 12 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSuccess();
  };

  return (
    <div className="space-y-5">
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
        <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
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
        <label className="block text-sm font-medium text-gray-700">Aadhaar Number *</label>
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

      {/* Captcha */}
      <div>
        <label className="block text-sm font-medium text-gray-700">CAPTCHA</label>
        <div className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-center text-gray-500">
          CAPTCHA Placeholder
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
      >
        Login
      </button>
    </div>
  );
}
