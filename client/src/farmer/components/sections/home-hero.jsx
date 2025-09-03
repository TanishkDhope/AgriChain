import React, { useEffect, useRef } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { gsap } from "gsap"

export default function HomeHero() {
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } })
    tl.fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(subRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")
      .fromTo(ctaRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, "-=0.1")
  }, [])

  return (
    <div className="pt-24 md:pt-28 pb-12 md:pb-16 px-4 md:px-8 lg:px-12 bg-[linear-gradient(to_bottom,transparent,rgba(16,24,16,0.08))]">
      <div className="mx-auto max-w-6xl">
        <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold text-balance">
          Farmer Portal for a Transparent Blockchain Supply Chain
        </h1>
        <p ref={subRef} className="mt-3 md:mt-4 text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Add produce, view market trends, ask questions, and generate price journey reports. Modern, farmer-friendly,
          and built with fintech-grade polish.
        </p>

        <div ref={ctaRef} className="mt-6 flex items-center gap-3">
          <a href="#produce">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Add Produce</Button>
          </a>
          <a href="#market">
            <Button variant="outline">View Market</Button>
          </a>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="backdrop-blur-xl bg-background/60 border-emerald-200/30">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Blockchain</div>
              <div className="mt-1 font-semibold">Tamper-proof certificates</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-background/60 border-emerald-200/30">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Market Insights</div>
              <div className="mt-1 font-semibold">Locality price comparisons</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-background/60 border-emerald-200/30">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Reports</div>
              <div className="mt-1 font-semibold">Downloadable transparency</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}