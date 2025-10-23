"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Zap, Users, TrendingUp } from "lucide-react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 gradient-blue opacity-5 blur-3xl animate-float" />
      <div
        className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-primary font-semibold text-lg mb-4 animate-slide-in-left">Welcome to CIBA Mumbai</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
            Centre for <span className="gradient-blue bg-clip-text text-transparent">Incubation</span> and Business
            Acceleration
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-in-right">
            Empowering entrepreneurs and startups in Vashi, Navi Mumbai. We provide mentorship, resources, and a vibrant
            community to accelerate your business growth.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in"
            style={{ animationDelay: "0.3s" }}
          >
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover-lift-interactive flex items-center justify-center gap-2 group">
              Apply for Incubation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group">
              CIBA Startup Clinic
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-20 max-w-2xl mx-auto">
          {[
            { value: "50+", label: "Startups", icon: Users, delay: "0s" },
            { value: "₹10Cr+", label: "Funding", icon: TrendingUp, delay: "0.1s" },
            { value: "100%", label: "Success Rate", icon: Zap, delay: "0.2s" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-effect rounded-lg p-4 animate-scale-in hover-glow-interactive interactive-card"
              style={{ animationDelay: stat.delay }}
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
