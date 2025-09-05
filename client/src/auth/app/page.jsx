import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import SignupForm from "../components/forms/SignupForm";
import RoleSelection from "../components/RoleSelection";
import "../styles/auth.css";

export default function AuthPage({ onAuthSuccess }) {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [tab, setTab] = useState("login");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleAuthSuccess = (data) => {
    setUserData(data);
    setShowRoleSelection(true);
  };

  const handleRoleSelected = (role) => {
    const completeUserData = { ...userData, role };
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(completeUserData));
    
    // Call parent callback
    onAuthSuccess(completeUserData);
    
    // Navigate to appropriate page based on role
    navigate(`/${role}`);
  };

  if (showRoleSelection) {
    return (
      <RoleSelection 
        onBack={() => setShowRoleSelection(false)}
        onRoleSelect={handleRoleSelected}
      />
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            🌱
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AgriChain</h1>
          <p className="text-sm text-gray-600 mt-1">Connecting Agriculture</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 mb-6 border rounded-lg overflow-hidden bg-gray-50">
          <button
            className={`py-3 font-medium transition-all duration-200 ${
              tab === "login" 
                ? "bg-green-600 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`py-3 font-medium transition-all duration-200 ${
              tab === "signup" 
                ? "bg-green-600 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Forms */}
        {tab === "login" ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} />
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
}
