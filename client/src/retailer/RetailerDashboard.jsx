"use client"
import { useState } from "react"
import Navigation from "./components/Navigation"
import Dashboard from "./components/Dashboard"
import Farmers from "./components/Farmers"
import Contracts from "./components/Contracts"
import Transactions from "./components/Transactions"
import QRScanner from "./components/QRScanner"
import ProfileModal from "./components/ProfileModal"

export default function RetailerDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Calculate position with 30px header offset
      const headerHeight = 30
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
      
      setActiveSection(sectionId)
    }
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        activeSection={activeSection} 
        scrollToSection={scrollToSection}
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
      
      <main className="pt-16">
        <Dashboard />
        <Farmers />
        <Contracts />
        <Transactions />
        <QRScanner />
      </main>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  )
}
