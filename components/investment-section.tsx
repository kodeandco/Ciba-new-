"use client";

import { TrendingUp, Rocket, DollarSign } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function InvestmentSection() {
  const stats = [
    { icon: DollarSign, value: "₹2.6 Cr", label: "Total Invested" },
    { icon: Rocket, value: "11", label: "Startups Funded" },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Empowering Startups Through Investment
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Supporting early-stage innovators under NIDHI, backed by DST, GoI.
          </p>
        </motion.div>

        {/* Stats - Centered with max-width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="border border-border rounded-2xl p-6 text-center bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-lg hover:shadow-primary/10 transition-all hover:scale-105 group"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Image Section - Centered with better styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="border border-border rounded-2xl p-4 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all max-w-4xl w-full">
            <div className="relative rounded-xl overflow-hidden bg-muted/20">
              <Image
                src="/investments.png"
                alt="CIBA Portfolio Startups"
                width={900}
                height={450}
                className="w-full h-auto rounded-xl object-contain"
                priority
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground font-medium">
                Our Portfolio Startups
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}