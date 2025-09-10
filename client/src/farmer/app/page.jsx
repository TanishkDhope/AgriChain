import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import HomeHero from "../components/sections/home-hero"
import ProduceSection from "../components/sections/produce-section"
import MarketSection from "../components/sections/market-section"
import QnASection from "../components/sections/qna-section"
import ReportsSection from "../components/sections/reports-section"
import Footer from "../components/Footer"
import ProfileModal from "../components/ProfileModal"  // Add ProfileModal import
import { initialProduce } from "../lib/data"

export default function FarmerPage({ onLogout }) {
  const [produce, setProduce] = useState(initialProduce)
  const [reports, setReports] = useState([])
  const [activeSection, setActiveSection] = useState("home")
  const [showProfileModal, setShowProfileModal] = useState(false)  // Add ProfileModal state
  const [isDarkMode, setIsDarkMode] = useState(false)  // Add dark mode state
  const sectionsRef = useRef({})
  const navigate = useNavigate()

  const userData = JSON.parse(localStorage.getItem('user') || '{}')

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      setActiveSection(sectionId)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'produce', 'market', 'queries', 'reports']
      const scrollPosition = window.scrollY + 80
      const scrollHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight

      if ((window.pageYOffset + viewportHeight) >= (scrollHeight - 50)) {
        setActiveSection('reports')
        return
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop
          const sectionBottom = sectionTop + section.offsetHeight
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate("/")
  }

  const marketData = useMemo(() => {
    const now = Date.now()
    return produce.map((p) => {
      const fluctuation = ((now / 60000 + p.name.length) % 7) - 3
      const consumerPrice = Math.max(0, p.basePrice + fluctuation)
      return { id: p.id, name: p.name, consumerPrice, locality: p.locality }
    })
  }, [produce])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      <Navbar 
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        onLogout={handleLogout}
        showProfileModal={showProfileModal}          
        setShowProfileModal={setShowProfileModal}    
      />
      
      <main className="pt-20">
        {/* All sections remain the same */}
        <section id="home" className="relative">
          <HomeHero />
        </section>

        <section id="produce" className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
          <ProduceSection
            produce={produce}
            onAdd={(item) => setProduce((prev) => [...prev, item])}
            onUpdate={(next) => setProduce((prev) => prev.map((p) => (p.id === next.id ? next : p)))}
            onDelete={(id) => setProduce((prev) => prev.filter((p) => p.id !== id))}
          />
        </section>

        <section id="market" className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
          <MarketSection produce={produce} marketData={marketData} />
        </section>

        <section id="queries" className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 bg-white">
          <QnASection />
        </section>

        <section id="reports" className="px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
          <ReportsSection
            produce={produce}
            reports={reports}
            onAddReport={(r) => setReports((prev) => [r, ...prev])}
          />
        </section>
      </main>

      <Footer />

      {/* Add ProfileModal component */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  )
}
