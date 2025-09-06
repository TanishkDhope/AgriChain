import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Menu, X, User } from "lucide-react"
import { navItems } from "../lib/data"
import {
  BarChart3,
  Users,
  FileText,
  CreditCard,
  QrCode,
} from "lucide-react"

export default function Navigation({ activeSection, scrollToSection, showProfileModal, setShowProfileModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState(activeSection)

  const getIconComponent = (iconName) => {
    const icons = {
      BarChart3,
      Users,
      FileText,
      CreditCard,
      QrCode,
    }
    return icons[iconName] || BarChart3
  }

  // Enhanced scroll listener to detect active section with bottom detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['dashboard', 'farmers', 'contracts', 'transactions', 'qr']
      const scrollPosition = window.scrollY + 100 // Offset for header height
      const scrollHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      
      // Check if user is at or near bottom of page (within 50px)
      if ((window.pageYOffset + viewportHeight) >= (scrollHeight - 50)) {
        setCurrentSection('qr')
        return
      }
      
      // Normal section detection
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop
          const sectionBottom = sectionTop + section.offsetHeight
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setCurrentSection(sections[i])
            break
          }
        }
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    // Initial check
    handleScroll()
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Retail Dashboard title */}
          <div className="flex items-center">
            <span className="text-lg sm:text-xl font-bold text-gray-900">Retail Dashboard</span>
          </div>

          {/* Right side - Desktop Navigation + Profile */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = getIconComponent(item.icon)
              const isActive = currentSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md" // Active state - blue background
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
            
            {/* Profile Icon */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile Menu Button + Profile */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Profile Icon */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = getIconComponent(item.icon)
                const isActive = currentSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToSection(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white" // Active state for mobile
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
