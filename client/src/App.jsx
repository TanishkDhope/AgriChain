import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import FarmerPage from "./farmer/app/page.jsx";
import AuthPage from "./auth/app/page.jsx";
import ProductPage from "./product/app/page.jsx";
import RoleSelection from "./auth/components/RoleSelection.jsx";
import ConsumerHomePage from "./consumer/app/page.jsx";
import RetailerPage from "./retailer/app/page.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboards */}
        <Route path="/dashboard/farmer" element={<FarmerPage />} />
        <Route path="/dashboard/retailer" element={<RetailerPage />} />
        <Route path="/dashboard/consumer" element={<ConsumerHomePage />} />

        {/* Product Routes */}
        <Route
          path="/product/:batchId/:productName"
          element={<ProductPage />}
        />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/track/:batchId" element={<ProductPage />} />

        <Route path="/rs" element={<RoleSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
