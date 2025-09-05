import { useState } from "react";
import LoginForm from "../components/forms/LoginForm";
import SignupForm from "../components/forms/SignupForm";
import RoleSelection from "../components/RoleSelection";
import "../styles/auth.css";

export default function AuthPage() {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [tab, setTab] = useState("login"); // login | signup

  if (showRoleSelection) {
    return <RoleSelection onBack={() => setShowRoleSelection(false)} />;
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            🌱
          </div>
          <h1 className="text-2xl font-bold">AgriTrack</h1>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 mb-6 border rounded-lg overflow-hidden">
          <button
            className={`py-2 font-medium ${tab === "login" ? "bg-green-600 text-white" : ""}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`py-2 font-medium ${tab === "signup" ? "bg-green-600 text-white" : ""}`}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Conditional Forms */}
        {tab === "login" ? (
          <LoginForm onSuccess={() => setShowRoleSelection(true)} />
        ) : (
          <SignupForm onSuccess={() => setShowRoleSelection(true)} />
        )}
      </div>
    </div>
  );
}
