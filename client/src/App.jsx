import { useState } from "react";
import "./App.css";

// Import farmer page
import FarmerPage from "./farmer/app/page.jsx";

// Import auth page
import AuthPage from "./auth/app/page.jsx";

function App() {
  const [showAuth, setShowAuth] = useState(true); // toggle between auth & farmer

  return (
    <>
      {showAuth ? (
        <AuthPage />
      ) : (
        <FarmerPage />
      )}
    </>
  );
}

export default App;
