import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase"; // ✅ adjust path
import { doc, getDoc, setDoc } from "firebase/firestore";
import LoginForm from "../components/forms/LoginForm";
import SignupForm from "../components/forms/SignupForm";
import RoleSelection from "../components/RoleSelection";

export default function AuthPage({ onAuthSuccess }) {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [tab, setTab] = useState("login");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleAuthSuccess = async (data, source) => {
    setUserData(data);

    if (source === "signup") {
      // From signup -> force role selection
      setShowRoleSelection(true);
    } else if (source === "login") {
      try {
        // 🔎 Check Firestore for existing role
        const userRef = doc(db, "users", data.email || data.phone);
        const snap = await getDoc(userRef);

        if (snap.exists() && snap.data().role) {
          const completeUserData = { ...data, role: snap.data().role };
          localStorage.setItem("user", JSON.stringify(completeUserData));

          if (onAuthSuccess) onAuthSuccess(completeUserData);

          // ✅ Redirect to role-specific dashboard
          navigate(`/dashboard/${snap.data().role}`);
        } else {
          // No role found -> force Role Selection
          setShowRoleSelection(true);
        }
      } catch (err) {
        console.error("Error checking user role:", err);
        setShowRoleSelection(true); // fallback
      }
    }
  };

  const handleRoleSelected = async (role) => {
    const completeUserData = { ...userData, role };

    // ✅ Save to Firestore
    const userRef = doc(db, "users", userData.email || userData.phone);
    await setDoc(userRef, completeUserData, { merge: true });

    // ✅ Save locally
    localStorage.setItem("user", JSON.stringify(completeUserData));
    if (onAuthSuccess) onAuthSuccess(completeUserData);

    // ✅ Redirect
    navigate(`/dashboard/${role}`);
  };

  const handleBackToLogin = () => {
    navigate("/");
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="mx-auto mb-3 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
            🌱
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AgriChain</h1>
          <p className="text-sm text-gray-600">Farm to Fork Traceability System</p>
        </header>

        {/* Tabs */}
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

        {/* Forms */}
        <div>
          {tab === "login" ? (
            <LoginForm onSuccess={(data) => handleAuthSuccess(data, "login")} />
          ) : (
            <SignupForm onSuccess={(data) => handleAuthSuccess(data, "signup")} />
          )}
        </div>
      </main>
    </div>
  );
}
