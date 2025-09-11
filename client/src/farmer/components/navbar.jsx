import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const go = (id) => {
    gsap.to(window, {
      duration: 0.8,
      ease: "power2.out",
      scrollTo: { y: `#${id}`, offsetY: 72 },
    })
    onNavigate(id)
  }

  const linkCls =
    "text-sm md:text-base font-medium text-foreground/80 hover:text-foreground transition-colors"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled
          ? "backdrop-blur-md bg-background/60 border-b border-border"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-emerald-500" aria-hidden />
          <span className="font-semibold">AgriChain Farmer</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {["home", "produce", "market", "queries", "reports", "account"].map(
            (id) => (
              <button
                key={id}
                className={linkCls}
                onClick={() => go(id)}
                aria-label={`Go to ${id}`}
              >
                {label(id)}
              </button>
            )
          )}
        </nav>

        <div className="md:hidden">
          <Button size="sm" variant="outline" onClick={() => go("produce")}>
            Start
          </Button>
        </div>
      </div>
    </header>
  )
}

function label(id) {
  switch (id) {
    case "home":
      return "Home"
    case "produce":
      return "My Produce"
    case "market":
      return "Local Market"
    case "queries":
      return "Queries"
    case "reports":
      return "Reports"
    case "account":
      return "Account"
    default:
      return id
  }
}
