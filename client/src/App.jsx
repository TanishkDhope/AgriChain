import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import FarmerPage from "./farmer/app/page.jsx";
import AuthPage from "./auth/app/page.jsx";
import ProductPage from "./product/app/page.jsx";
import ConsumerHomePage from "./consumer/app/page.jsx";
import RoleSelection from "./auth/components/RoleSelection.jsx"; // 👈 if you want role selection page

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<AuthPage />} />

        {/* Auth */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* Dashboards */}
        <Route path="/dashboard/farmer" element={<FarmerPage />} />
        <Route path="/dashboard/retailer" element={<ProductPage />} />
        <Route path="/dashboard/consumer" element={<ConsumerHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
