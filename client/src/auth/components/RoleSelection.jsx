import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const roles = [
    {
      id: "farmer",
      title: "Farmer",
      subtitle: "Grow & Sell",
      icon: "🌾",
      description:
        "Manage your crops, set competitive prices, and track sales directly to retailers and consumers.",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      buttonGradient:
        "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      iconBg: "bg-green-100",
      features: [
        { icon: "🌱", text: "Crop Management" },
        { icon: "💰", text: "Price Setting" },
        { icon: "📊", text: "Sales Analytics" },
        { icon: "🤝", text: "Direct Sales" },
      ],
      stats: { users: "50K+", growth: "25%", rating: "4.8" },
    },
    {
      id: "retailer",
      title: "Retailer",
      subtitle: "Connect & Trade",
      icon: "🏪",
      description:
        "Browse quality produce, negotiate contracts, and manage your supply chain efficiently.",
      bgGradient: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      buttonGradient:
        "from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700",
      iconBg: "bg-amber-100",
      features: [
        { icon: "🛍️", text: "Browse Products" },
        { icon: "📋", text: "Contract Management" },
        { icon: "🚚", text: "Delivery Tracking" },
        { icon: "📦", text: "Inventory Control" },
      ],
      stats: { users: "25K+", growth: "35%", rating: "4.7" },
    },
    {
      id: "consumer",
      title: "Consumer",
      subtitle: "Buy & Trace",
      icon: "🛒",
      description:
        "Scan QR codes to verify freshness and trace your food's complete farm-to-table journey.",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      buttonGradient:
        "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
      iconBg: "bg-blue-100",
      features: [
        { icon: "📱", text: "QR Code Scanning" },
        { icon: "🔍", text: "Product Traceability" },
        { icon: "🥬", text: "Fresh Produce" },
        { icon: "🔒", text: "Secure Shopping" },
      ],
      stats: { users: "100K+", growth: "45%", rating: "4.9" },
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setIsNavigating(true);

    // Simulate loading, then navigate
    setTimeout(() => {
      navigate(`/dashboard/${roleId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            disabled={isNavigating}
            className="inline-flex items-center gap-2 text-green-600 font-medium mb-8 px-4 py-2 rounded-lg hover:bg-green-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Login
          </button>

          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6 shadow-lg">
              <span className="text-3xl">🌱</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Choose Your Role
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users transforming agriculture through
              technology. Select your role to unlock personalized features and
              start your journey.
            </p>
          </div>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className={`relative group bg-gradient-to-br ${role.bgGradient} rounded-3xl p-8 border-2 ${role.borderColor} shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                selectedRole === role.id
                  ? "ring-4 ring-green-300 scale-105"
                  : "hover:scale-105"
              }`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Role Header */}
              <div className="text-center mb-6">
                <div
                  className={`w-24 h-24 rounded-full ${role.iconBg} flex items-center justify-center text-5xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {role.icon}
                </div>
                <h2 className={`text-3xl font-bold ${role.textColor} mb-1`}>
                  {role.title}
                </h2>
                <p className="text-gray-600 font-medium">{role.subtitle}</p>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-center mb-6 leading-relaxed">
                {role.description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {role.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-gray-700 bg-white bg-opacity-50 rounded-lg p-2"
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex justify-between text-center mb-6 bg-white bg-opacity-30 rounded-xl p-3">
                <div>
                  <div className="font-bold text-gray-800">
                    {role.stats.users}
                  </div>
                  <div className="text-xs text-gray-600">Users</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">
                    +{role.stats.growth}
                  </div>
                  <div className="text-xs text-gray-600">Growth</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-600">
                    ★ {role.stats.rating}
                  </div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRoleSelect(role.id)}
                disabled={isNavigating}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 bg-gradient-to-r ${role.buttonGradient} disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-opacity-50 shadow-lg hover:shadow-xl transform active:scale-95`}
              >
                {isNavigating && selectedRole === role.id ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Continue as {role.title}
                    <CheckCircle
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </span>
                )}
              </button>

              {/* Loading Overlay */}
              {isNavigating && selectedRole === role.id && (
                <div className="absolute inset-0 bg-white bg-opacity-90 rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm">
                  <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Preparing Your Dashboard
                  </h3>
                  <p className="text-gray-600 text-center px-4">
                    Setting up personalized features for your{" "}
                    {role.title.toLowerCase()} experience...
                  </p>
                  <div className="mt-4 flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
