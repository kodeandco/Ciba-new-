import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function JobHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white">
      {/* Subtle animated overlays */}
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-800/20 via-transparent to-purple-800/15 animate-gradient-flow" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(147,197,253,0.12),transparent_60%)] animate-pulse-slow" />

      {/* Floating orb accents - soft blues and purples */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-gradient-to-br from-blue-500/20 to-cyan-400/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-tl from-purple-500/18 to-indigo-600/12 rounded-full blur-3xl animate-float-delay" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 text-center">
        {/* Heading with light, glowing blue-purple shimmer */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight animate-reveal">
          Build Your Career in{' '}
          <span className="inline-block bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer drop-shadow-lg">
            Mumbai's Vibrant Startup Ecosystem
          </span>
        </h1>

        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto opacity-95 animate-reveal animation-delay-200">
          Join CIBA or discover opportunities at our innovative incubated startups
        </p>

        {/* Optional CTA - uncomment if you want it */}
        {/* <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 hover:border-white/40 transition-all hover:shadow-2xl hover:scale-105">
          Explore Opportunities
          <ArrowRight className="w-6 h-6" />
        </button> */}
      </div>
    </section>
  );
}