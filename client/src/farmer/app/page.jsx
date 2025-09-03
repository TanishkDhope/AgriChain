import { useEffect, useMemo, useRef, useState } from "react"
import Navbar from "../components/navbar"
import HomeHero from "../components/sections/home-hero"
import ProduceSection from "../components/sections/produce-section"
import MarketSection from "../components/sections/market-section"
import QnASection from "../components/sections/qna-section"
import ReportsSection from "../components/sections/reports-section"
import AccountSection from "../components/sections/account-section"
import { initialProduce } from "../lib/data"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function Page() {
  const [produce, setProduce] = useState(initialProduce)
  const [reports, setReports] = useState([])
  const sectionsRef = useRef({})

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
  }, [])

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
    <main className="min-h-screen bg-background text-foreground">
      <Navbar
        onNavigate={(id) => {
          const el = sectionsRef.current[id]
          if (el) {
            // smooth scroll handled inside Navbar via GSAP, but keep fallback
            el.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }}
      />

      <section id="home" ref={(el) => (sectionsRef.current["home"] = el)} data-section className="relative">
        <HomeHero />
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
        id="reports"
        ref={(el) => (sectionsRef.current["reports"] = el)}
        data-section
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <ReportsSection produce={produce} reports={reports} onAddReport={(r) => setReports((prev) => [r, ...prev])} />
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
        id="account"
        ref={(el) => (sectionsRef.current["account"] = el)}
        data-section
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <AccountSection reports={reports} />
      </section>
    </main>
  )
}
