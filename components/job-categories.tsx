// ============================================
// FILE: components/job-categories.tsx
// ============================================

"use client";
import { GraduationCap, Briefcase, Rocket, ArrowRight } from "lucide-react";

export default function JobCategories() {
  const categories = [
    {
      title: "Internships at CIBA",
      description: "Gain hands-on experience in startup ecosystem management and business acceleration",
      link: "#ciba-internships",
      icon: GraduationCap,
      count: "6 Programs"
    },
    {
      title: "Jobs at CIBA",
      description: "Be part of the team that empowers entrepreneurs and builds innovation",
      link: "#ciba-jobs",
      icon: Briefcase,
      count: "3 Positions"
    },
    {
      title: "Join Our Startups",
      description: "Explore career opportunities at innovative startups incubated by CIBA",
      link: "#startup-opportunities",
      icon: Rocket,
      count: "15+ Openings"
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          Your Career Path Awaits
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Explore <span className="text-blue-600">Opportunities</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose your path in the CIBA ecosystem and start your journey today
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <a
              key={idx}
              href={category.link}
              className="group relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-500 hover:shadow-2xl transition-all duration-500 overflow-hidden block"
            >
              {/* Subtle blue gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating blue orb effect */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
              
              <div className="relative z-10">
                {/* Icon with blue gradient */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Count badge */}
                <div className="inline-block px-3 py-1 bg-blue-50 group-hover:bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4 transition-colors">
                  {category.count}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                {/* CTA with arrow */}
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  Explore Opportunities
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              
              {/* Bottom blue shine effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          );
        })}
      </div>
      
      {/* Bottom CTA */}
      
    </section>
  );
}