"use client";

import { TrendingUp, Rocket, DollarSign } from "lucide-react";
import Image from "next/image";

export default function InvestmentSection() {
  const stats = [
    { icon: DollarSign, value: "₹2.6 Cr", label: "Total Invested" },
    { icon: Rocket, value: "11", label: "Startups Funded" },
    { icon: TrendingUp, value: "₹20 Lakhs", label: "This Year" },
  ];

  return (
    <section className="py-8 bg-background">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold mb-1">
            Empowering Startups Through Investment
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Supporting early-stage innovators under NIDHI, backed by DST, GoI.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 text-center bg-card"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
              <div className="text-xl font-semibold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <div className="border rounded-xl p-3 bg-card max-w-3xl w-full">
            <Image
              src="/investments.png"
              alt="CIBA Portfolio Startups"
              width={900}
              height={450}
              className="w-full h-auto rounded-lg object-contain"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
