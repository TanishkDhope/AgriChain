import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import ProfileModal from "../components/ProfileModal"
import HomeHero from "../components/sections/home-hero"
import ProduceSection from "../components/sections/produce-section"
import MarketSection from "../components/sections/market-section"
import QnASection from "../components/sections/qna-section"
import ReportsSection from "../components/sections/reports-section"
// import AccountSection from "../components/sections/account-section"
import MapSection from "../components/sections/map-section"
import Footer from "../components/Footer";
import { initialProduce } from "../lib/data"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Chatbot from "../../consumer/app/Chatbot.jsx"

export default function FarmerPage({ onLogout }) {
  const [produce, setProduce] = useState(initialProduce)
  const [reports, setReports] = useState([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const sectionsRef = useRef({})
  const navigate = useNavigate()

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Section reveal animations
    const sections = document.querySelectorAll("[data-section]")
    sections.forEach((sec) => {
      gsap.fromTo(
        sec,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: sec, start: "top 80%" },
        }
      )
    })

    // Track active section for navbar highlighting
    const handleScroll = () => {
      const sections = ["home", "produce", "market", "queries", "reports", "map"]
      let current = "home"
      
      sections.forEach((sectionId) => {
        const element = sectionsRef.current[sectionId]
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = sectionId
          }
        }
      })
      
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle logout functionality
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate("/")
  }

  // Handle navigation from navbar
  const handleNavigate = (id) => {
    setActiveSection(id)
    const el = sectionsRef.current[id]
    if (el) {
      // GSAP smooth scroll is handled in the Navbar component
      // This is just a fallback
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Derived pricing data for market insights (mock "real-time")
  const marketData = useMemo(() => {
    const now = Date.now()
    return produce.map((p) => {
      const fluctuation = ((now / 60000 + p.name.length) % 7) - 3 // -3..+3
      const consumerPrice = Math.max(0, p.basePrice + fluctuation)
      return { id: p.id, name: p.name, consumerPrice, locality: p.locality }
    })
  }, [produce])

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 text-foreground">
      <Navbar
        userData={userData}
        activeSection={activeSection}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />

      <section id="home" ref={(el) => (sectionsRef.current["home"] = el)} data-section className="relative">
        <HomeHero userData={userData} />
      </section>

      <section
        id="produce"
        ref={(el) => (sectionsRef.current["produce"] = el)}
        data-section
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <ProduceSection
          produce={produce}
          onAdd={(item) => setProduce((prev) => [...prev, item])}
          onUpdate={(next) => setProduce((prev) => prev.map((p) => (p.id === next.id ? next : p)))}
          onDelete={(id) => setProduce((prev) => prev.filter((p) => p.id !== id))}
        />
      </section>

      <section
        id="market"
        ref={(el) => (sectionsRef.current["market"] = el)}
        data-section
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <MarketSection produce={produce} marketData={marketData} />
      </section>

      <section
        id="queries"
        ref={(el) => (sectionsRef.current["queries"] = el)}
        data-section
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <QnASection />
      </section>

      <section
        id="reports"
        ref={(el) => (sectionsRef.current["reports"] = el)}
        data-section
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <ReportsSection 
          produce={produce} 
          reports={reports} 
          onAddReport={(r) => setReports((prev) => [r, ...prev])} 
        />
      </section>

      <section
        id="map"
        ref={(el) => (sectionsRef.current["map"] = el)}
        data-section
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <MapSection produce={produce} />
      </section>

      {/* <section
        id="account"
        ref={(el) => (sectionsRef.current["account"] = el)}
        data-section
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <AccountSection 
          reports={reports} 
          userData={userData}
          onLogout={handleLogout}
        />
      </section> */}
      <Chatbot/>
      <Footer />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </main>
  )
}
