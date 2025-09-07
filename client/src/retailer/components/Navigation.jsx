import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, User, LogOut, Leaf } from "lucide-react";
import { navItems } from "../lib/data";
import { BarChart3, Users, FileText, CreditCard, QrCode } from "lucide-react";

export default function Navigation({
  activeSection,
  scrollToSection,
  showProfileModal,
  setShowProfileModal,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getIconComponent = (iconName) => {
    const icons = {
      BarChart3,
      Users,
      FileText,
      CreditCard,
      QrCode,
    };
    return icons[iconName] || BarChart3;
  };

  // Enhanced scroll listener with proper offset
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "dashboard",
        "farmers",
        "contracts",
        "transactions",
        "qr",
      ];
      const scrollPosition = window.scrollY + 80; // Proper offset for header
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      // Check if user is at or near bottom of page (within 50px)
      if (window.pageYOffset + viewportHeight >= scrollHeight - 50) {
        setCurrentSection("qr");
        return;
      }

      // Normal section detection
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setCurrentSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("scanHistory");
    localStorage.removeItem("userSession");
    localStorage.removeItem("issueReports");

    setShowUserMenu(false);

    setTimeout(() => {
      window.location.href = "/#/";
    }, 500);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side - AgriChain Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Leaf className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  AgriChain Retail
                </h1>
                <p className="text-green-200 text-sm hidden sm:block">
                  Supply Chain Transparency
                </p>
              </div>
            </div>

            {/* Center - Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = getIconComponent(item.icon);
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-white text-green-700 shadow-md font-semibold"
                        : "text-white hover:text-green-100 hover:bg-white/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right side - User Menu Only (Removed Contract Count) */}
            <div className="flex items-center gap-4">
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-medium text-gray-900">Retailer</p>
                      <p className="text-xs text-gray-500">
                        retail@agricchain.com
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:bg-white/20"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-green-500/30 py-4">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = getIconComponent(item.icon);
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-white text-green-700 font-semibold"
                          : "text-white hover:text-green-100 hover:bg-white/20"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}
