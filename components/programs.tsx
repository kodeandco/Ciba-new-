"use client";

import { CheckCircle2, Sprout, Rocket, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedSection from "./animated-section";


const programs = [
  {
    id: 1,
    title: "NIDHI SSP (Seed Program)",
    description: "Perfect for early-stage startups with innovative ideas",
    duration: "6 months",
    benefits: [
      "Mentorship from industry experts",
      "Access to funding network",
      "Co-working space",
      "Legal & compliance support",
    ],
    icon: Sprout,
    link: "/seed-program",
  },
  {
    id: 2,
    title: "Incubation Program",
    description: "Comprehensive support for scaling your startup",
    duration: "24 months",
    benefits: [
      "Dedicated mentor",
      "Pitch deck preparation",
      "Investor connections",
      "Marketing & branding support",
    ],
    icon: Rocket,
    link: "/incubation",
  },
  {
    id: 3,
    title: "Startup Clinic",
    description: "Book 20-min sessions with mentors to get guidance for your startup",
    duration: "Every Tuesday & Thursday",
    benefits: [
      "Personalized mentor guidance",
      "Startup idea feedback",
      "Funding advice",
      "Networking tips",
    ],
    icon: Zap,
    link: "/clinic",
  },
];

export default function Programs() {
  const router = useRouter();

  return (
    <section id="programs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Programs</h2>
        <p className="text-lg text-muted-foreground">Choose the program that fits your startup stage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {programs.map((program, index) => (
          <AnimatedSection
            key={program.id}
            direction="up"
            delay={index * 0.2} // stagger cards
          >
            <div className="glass-effect rounded-2xl p-8 h-full flex flex-col hover-lift-interactive interactive-card group">
              <program.icon className="w-12 h-12 text-primary mb-4 group-hover:animate-pulse-glow" />
              <h3 className="text-2xl font-bold text-foreground mb-2">{program.title}</h3>
              <p className="text-sm text-primary font-semibold mb-3">{program.duration}</p>
              <p className="text-muted-foreground mb-6 flex-grow">{program.description}</p>

              <div className="space-y-3">
                {program.benefits.map((benefit, idx) => (
                  <AnimatedSection
                    key={idx}
                    direction="up"
                    delay={0.1 * idx} // stagger benefits
                  >
                    <div className="flex items-start gap-3 group/benefit">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <button
                onClick={() => router.push(program.link)}
                className="mt-6 w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift-interactive transition-all"
              >
                Learn More
              </button>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
