// ============================================
// FILE: components/job-stats.tsx
// ============================================

"use client";
import { Zap, Users, Heart, TrendingUp } from "lucide-react";

export default function JobStats() {
  const stats = [
    { value: "50+", label: "Startups Incubated", icon: TrendingUp },
    { value: "200+", label: "Jobs Created", icon: Users },
    { value: "150+", label: "Interns Trained", icon: Zap },
    { value: "₹100Cr+", label: "Funding Raised", icon: Heart }
  ];

  const benefits = [
    {
      title: "Learn & Grow",
      description: "Work alongside experienced mentors and gain exposure to diverse startup challenges",
      icon: "📚"
    },
    {
      title: "Network",
      description: "Connect with entrepreneurs, investors, and industry leaders in Mumbai's ecosystem",
      icon: "🤝"
    },
    {
      title: "Impact",
      description: "Contribute to building the next generation of successful Indian startups",
      icon: "🚀"
    }
  ];

  return (
    <>
      {/* Stats Section - Minimal & Clean */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative text-center p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300"
                >
                  {/* Subtle icon */}
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  {/* Value with counter effect feel */}
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Unique Card Design */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Join the <span className="text-blue-600">CIBA Ecosystem?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Build your career at the heart of Mumbai's innovation hub
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Emoji Icon - Large & Centered */}
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                
                {/* Decorative dot pattern */}
                <div className="absolute bottom-4 right-4 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="grid grid-cols-4 gap-1">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-blue-600 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}