'use client';

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import { Briefcase, Send, Sparkles, TrendingUp, Users, Rocket } from "lucide-react";

export default function JobPage() {
  const handleApplyNow = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpO7db72RBkw9JEOc3zN-JYiVqeNltb2xUgc69mnFfo-GoLA/viewform', '_blank');
  };

  const highlights = [
    {
      icon: Rocket,
      title: "Fast-Growing Startups",
      description: "Work with innovative companies shaping the future"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Accelerate your professional journey with mentorship"
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Join Mumbai's premier startup ecosystem"
    }
  ];

  return (
    <>
      <Navbar />
      {/* FIXED: Changed from bg-gradient-subtle to bg-background to respect dark mode */}
      <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-6 text-xs font-semibold text-primary tracking-wider">
            <Briefcase className="w-4 h-4" />
            CIBA JOBS
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
            Build Your Career with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Innovation
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join startups incubated at CIBA Mumbai and be part of something extraordinary
          </p>

          <motion.button
            onClick={handleApplyNow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-3 py-4 px-10 rounded-xl font-bold text-lg text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-xl hover:shadow-2xl transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Apply Now
            <Send className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-card rounded-2xl shadow-lg border border-border p-6 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12"
        >
          <div className="space-y-8">
            {/* About Section */}
            <div>
              <h2 className="text-3xl font-black text-card-foreground mb-6">
                Why Choose CIBA?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-card-foreground mb-1">Innovation Hub</h4>
                      <p className="text-sm text-muted-foreground">Mumbai's premier startup incubation center</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-card-foreground mb-1">Diverse Opportunities</h4>
                      <p className="text-sm text-muted-foreground">Roles in tech, marketing, design, and business</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-card-foreground mb-1">Real Impact</h4>
                      <p className="text-sm text-muted-foreground">Shape products used by thousands of users</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-card-foreground mb-1">Growth Mindset</h4>
                      <p className="text-sm text-muted-foreground">Learn from experienced mentors and founders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>
            Questions? Reach out at{" "}
            <a href="mailto:support@cibamumbai.com" className="text-primary hover:underline font-medium">
              support@cibamumbai.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
    </>
  );
}