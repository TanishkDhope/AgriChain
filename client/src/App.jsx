import { useState } from "react";
import "./App.css";
import FarmerPage from "./farmer/app/page.jsx";
import AuthPage from "./auth/app/page.jsx";
import ProductPage from "./product/app/page"
import ConsumerHomePage from "./consumer/app/page.jsx";

function App() {
  return (
    <>
      <ConsumerHomePage />
    </>
  );
}

export default App;
