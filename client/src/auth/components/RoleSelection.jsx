import { ArrowLeft, User, Store, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection({ onBack, onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    {
      id: "farmer",
      title: "Farmer",
      description: "Manage crops, set prices, and sell directly to buyers",
      icon: User,
      color: "green",
      features: ["Crop Management", "Direct Sales", "Price Control"],
      stats: { users: "50K+", growth: "25%", rating: "4.8" }
    },
    {
      id: "retailer", 
      title: "Retailer",
      description: "Source quality produce and manage your supply chain",
      icon: Store,
      color: "blue",
      features: ["Product Sourcing", "Inventory Management", "Order Tracking"],
      stats: { users: "25K+", growth: "35%", rating: "4.7" }
    },
    {
      id: "consumer",
      title: "Consumer", 
      description: "Buy fresh produce and trace its journey from farm",
      icon: ShoppingCart,
      color: "orange",
      features: ["QR Code Scanning", "Product Traceability", "Fresh Guarantee"],
      stats: { users: "100K+", growth: "45%", rating: "4.9" }
    }
  ];

  const handleRoleSelect = async (roleId) => {
    setSelectedRole(roleId);
    setIsLoading(true);
    
    try {
      // Store user role data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...userData, role: roleId };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Call parent callback if provided
      if (onRoleSelect) {
        onRoleSelect(roleId);
      }
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the appropriate dashboard
      navigate(`/dashboard/${roleId}`);
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsLoading(false);
    }
  };

  const getColorClasses = (color, isSelected) => {
    const colors = {
      green: {
        bg: isSelected ? 'bg-green-50 border-green-500 ring-2 ring-green-200' : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md',
        button: 'bg-green-600 hover:bg-green-700 focus:ring-green-200',
        icon: 'text-green-600',
        text: 'text-green-700'
      },
      blue: {
        bg: isSelected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md',
        button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-700'
      },
      orange: {
        bg: isSelected ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200' : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md',
        button: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-200',
        icon: 'text-orange-600',
        text: 'text-orange-700'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 p-2 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50 transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Choose Your Role
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select how you'll participate in the agricultural ecosystem
            </p>
          </div>
        </header>

        {/* Role Cards */}
        <section className="grid md:grid-cols-3 gap-8 mb-10">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            const colorClasses = getColorClasses(role.color, isSelected);
            const IconComponent = role.icon;

            return (
              <article
                key={role.id}
                className={`border-2 rounded-xl p-6 transition-all cursor-pointer transform hover:scale-105 ${colorClasses.bg} ${
                  isSelected ? 'scale-105' : ''
                }`}
                onClick={() => !isLoading && handleRoleSelect(role.id)}
              >
                <header className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 mb-4 ${colorClasses.icon}`}>
                    <IconComponent size={28} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${colorClasses.text}`}>
                    {role.title}
                  </h3>
                  <p className="text-gray-600">
                    {role.description}
                  </p>
                </header>

                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-3">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-60"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="bg-white bg-opacity-70 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-bold text-gray-800">{role.stats.users}</div>
                      <div className="text-xs text-gray-500">Users</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-600">+{role.stats.growth}</div>
                      <div className="text-xs text-gray-500">Growth</div>
                    </div>
                    <div>
                      <div className="font-bold text-yellow-600">★ {role.stats.rating}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  disabled={isLoading}
                  className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition-all focus:ring-4 focus:outline-none disabled:opacity-50 ${colorClasses.button}`}
                >
                  {isLoading && isSelected ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Setting up...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Continue as {role.title}
                      <ArrowLeft size={16} className="rotate-180" />
                    </span>
                  )}
                </button>
              </article>
            );
          })}
        </section>

        {/* Footer */}
        <footer className="text-center">
          <div className="mt-2 text-xs text-gray-400">
            Secure • Government Compliant • Accessible
          </div>
        </footer>
      </div>
    </div>
  );
}
