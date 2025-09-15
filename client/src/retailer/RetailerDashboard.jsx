"use client";
import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import Farmers from "./components/Farmers";
import Contracts from "./components/Contracts";
import Transactions from "./components/Transactions";
import QRScanner from "./components/QRScanner";
import ProfileModal from "./components/ProfileModal";
import Chatbot from "./Chatbot";
import Footer from "./components/Footer";

export default function RetailerDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Smooth scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Height of your sticky nav (h-20 = 80px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update active section immediately for better UX
      setActiveSection(sectionId);
    }
  };

  // Auto-detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "dashboard",
        "farmers",
        "contracts",
        "transactions",
        "qr",
      ];
      const scrollPosition = window.scrollY + 80; // Match navigation offset
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      // Check if user is at or near bottom of page (within 50px)
      if (window.pageYOffset + viewportHeight >= scrollHeight - 50) {
        setActiveSection("qr");
        return;
      }

      // Normal section detection
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once to set initial active section

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection} // Add this prop
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />

      <main className="pt-20">
        {" "}
        {/* Increased to match h-20 header */}
        {/* Dashboard Section */}
        <section id="dashboard">
          <Dashboard />
        </section>
        {/* Farmers Section */}
        <section id="farmers">
          <Farmers />
        </section>
        {/* Contracts Section */}
        <section id="contracts">
          <Contracts />
        </section>
        {/* Transactions Section */}
        <section id="transactions">
          <Transactions />
        </section>
        {/* QR Scanner Section */}
        <section id="qr">
          <QRScanner />
        </section>
      </main>
      <Chatbot />
      <Footer />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  );
}
