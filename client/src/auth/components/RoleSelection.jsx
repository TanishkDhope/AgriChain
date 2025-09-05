import { ArrowLeft } from "lucide-react";

export default function RoleSelection({ onBack }) {
  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Back Button */}
        <div
          className="inline-flex items-center gap-2 text-emerald-600 font-medium mb-6 cursor-pointer hover:text-emerald-700 transition"
          onClick={onBack}
        >
          <ArrowLeft size={18} /> Back to Login
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2">Choose Your Role</h1>
        <p className="text-center text-gray-500 mb-10">
          Select your role to get started with our agricultural platform
        </p>

        {/* Role Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Farmer */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">
              🌾
            </div>
            <h2 className="text-lg font-bold text-green-700 mb-2">Farmer</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Manage crops, set prices, and track sales. Connect directly with
              retailers and consumers.
            </p>
            <button className="w-full py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition">
              Continue as Farmer
            </button>
          </div>

          {/* Retailer */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-3xl mx-auto mb-4">
              🏪
            </div>
            <h2 className="text-lg font-bold text-amber-700 mb-2">Retailer</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Browse lots, sign contracts, and track delivery. Bridge the gap
              between farmers and consumers.
            </p>
            <button className="w-full py-3 rounded-lg font-semibold text-white bg-amber-600 hover:bg-amber-700 transition">
              Continue as Retailer
            </button>
          </div>

          {/* Consumer */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl mx-auto mb-4">
              🛒
            </div>
            <h2 className="text-lg font-bold text-blue-700 mb-2">Consumer</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Scan QR to verify farm-to-table journey. Purchase fresh, traceable
              produce with confidence.
            </p>
            <button className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition">
              Continue as Consumer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
