'use client'

import { useState } from 'react'
import MentorsSection from './mentors-section'
import StartupsSection from './startups-section'
import AssetsSection from './assets-section'
import PartnersSection from './partners-section'
import CoworkingSection from './360 Panorama/coworking-section'

export default function SectionTabs() {
  const [activeTab, setActiveTab] = useState('mentors')

  const tabs = [
    { id: 'mentors', title: 'Mentorships', component: MentorsSection },
    { id: 'assets', title: 'Assets', component: AssetsSection },
    { id: 'partners', title: 'Growth Partners', component: PartnersSection },
    { id: 'incubated', title: 'Investments', component: StartupsSection },
    { id: 'coworking', title: 'Coworking', component: CoworkingSection }
  ]

  const ActiveComponent =
    tabs.find(tab => tab.id === activeTab)?.component || MentorsSection

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20 dark:from-muted/10 dark:via-background dark:to-muted/5 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Mentorship & Startup Spotlight
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8">
            Navigate through our ecosystem of innovation and growth
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center justify-center gap-6 md:gap-10 border-b border-border mb-10 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-4 text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.title}

              {/* Active underline */}
              {activeTab === tab.id && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          <ActiveComponent />
        </div>

      </div>
    </section>
  )
}