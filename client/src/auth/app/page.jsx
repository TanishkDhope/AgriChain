import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import SignupForm from "../components/forms/SignupForm";
import RoleSelection from "../components/RoleSelection";

export default function AuthPage({ onAuthSuccess }) {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [tab, setTab] = useState("login");
  const [userData, setUserData] = useState(null);

  const handleAuthSuccess = (data) => {
    setUserData(data);
    setShowRoleSelection(true);
  };

  const handleRoleSelected = (role) => {
    const completeUserData = { ...userData, role };
    
    // Store complete user data
    localStorage.setItem('user', JSON.stringify(completeUserData));
    
    // Call parent callback if provided
    if (onAuthSuccess) {
      onAuthSuccess(completeUserData);
    }
  };

  const handleBackToLogin = () => {
    setShowRoleSelection(false);
    setUserData(null);
  };

  if (showRoleSelection) {
    return (
      <RoleSelection 
        onBack={handleBackToLogin}
        onRoleSelect={handleRoleSelected}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        
        {/* Header */}
        <header className="text-center mb-6">
          <div className="mx-auto mb-3 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
            🌱
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AgriChain</h1>
          <p className="text-sm text-gray-600">Farm to Fork Traceability System</p>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex border-b mb-6">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              tab === "login" 
                ? "border-green-500 text-green-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              tab === "signup" 
                ? "border-green-500 text-green-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </nav>

        {/* Form Content */}
        <div>
          {tab === "login" ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} />
          )}
        </div>

      </main>
    </div>
  );
}
