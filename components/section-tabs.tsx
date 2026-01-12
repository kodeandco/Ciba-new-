'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Import your existing sections
import MentorsSection from './mentors-section'
import StartupsSection from './startups-section'
import AssetsSection from './assets-section'
import PartnersSection from './partners-section'
import InvestmentSection from './investment-section'

// ✅ Client-only Panorama (KEY FIX)
const CoworkingSection = dynamic(
  () => import('./360 Panorama/PanoramaTour'),
  { ssr: false }
)

export default function SectionTabs() {
  const [activeTab, setActiveTab] = useState('mentors')

  const tabs = [
    { id: 'mentors', title: 'Mentorships', component: MentorsSection },
    { id: 'assets', title: 'Assets', component: AssetsSection },
    { id: 'partners', title: 'Growth Partners', component: PartnersSection },
    { id: 'investment', title: 'investment', component: InvestmentSection },
    { id: 'coworking', title: 'Coworking', component: CoworkingSection }
  ]

  const ActiveComponent =
    tabs.find(tab => tab.id === activeTab)?.component || MentorsSection

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">
            Ecosystem & Innovation Hub
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8">
            Navigate through our comprehensive support system for startups
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 md:gap-6 border-b border-border mb-10 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-4 px-2 text-sm md:text-base font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.title}
              {activeTab === tab.id && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary animate-slide-in-left" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="animate-fade-in"
          style={{
            height: activeTab === 'coworking' ? '600px' : 'auto',
            minHeight: activeTab === 'coworking' ? '600px' : 'auto',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* ✅ key forces panorama re-init */}
          <ActiveComponent key={activeTab} />
        </div>

      </div>
    </section>
  )
}