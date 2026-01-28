"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";

const equipmentData = [
  { id: 1, name: "iTech Battery Tester", model: "5101E (±300V)", description: "Battery voltage & resistance analysis", image: "https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0?w=800&q=80" },
  { id: 2, name: "Tektronix EMI Kit", model: "EMI Test Setup", description: "EMI pre-compliance testing", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80" },
  { id: 3, name: "Hioki Power Analyser", model: "PQ3100-94", description: "3-phase power quality", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" },
  { id: 4, name: "Fluke Thermal Imager", model: "TiS45", description: "Thermal hotspot detection", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80" },
  { id: 5, name: "Hioki Power Meter", model: "PW3337", description: "AC/DC power measurement", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80" },
  { id: 6, name: "Chroma DC Load", model: "6320E 600V/210A", description: "High-power load testing", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80" },
  { id: 7, name: "Solar PV Emulator", model: "750V/30A", description: "PV inverter & MPPT testing", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80" },
];

export default function AssetsSection() {
  return (
    <div className="w-full bg-gray-950 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto relative">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/30 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              CIBA LAB
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Testing <span className="text-blue-500">Equipment</span>
          </h2>
          <p className="text-sm text-gray-500">
            Advanced instruments at CoE-ST
          </p>
        </motion.div>

        {/* Compact Cards (unchanged from last small version) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
          {equipmentData.map((eq, i) => (
            <motion.div
              key={eq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="h-[220px] perspective-[1000px]"
            >
              <div
                className="group relative h-full transition-transform duration-700 hover:rotate-y-180 cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="absolute inset-0 rounded-lg bg-gray-900 border border-gray-800 p-4 flex flex-col justify-between text-sm shadow-md group-hover:shadow-lg group-hover:shadow-blue-950/30"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                      {eq.name}
                    </h3>
                    <p className="text-xs text-blue-400 mb-2">{eq.model}</p>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {eq.description}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mt-auto text-right opacity-70">
                    hover →
                  </p>
                </div>

                <div
                  className="absolute inset-0 rounded-lg overflow-hidden shadow-md"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <img
                    src={eq.image}
                    alt={eq.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-semibold text-white mb-0.5">{eq.name}</h3>
                    <p className="text-xs text-blue-300">{eq.model}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enlarged & Nicer Contact Section (back to more substantial look) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-white">
              Book Equipment
            </h3>
            <p className="mt-2 text-base text-gray-400">
              Contact us to reserve testing time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
            {/* FCRIT - larger & nicer */}
            <div className="flex flex-col items-center md:items-start gap-5 bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 hover:border-blue-700/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-950/50">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xl font-medium text-white">FCRIT Contact</h4>
                  <p className="text-sm text-gray-400">Dr. Sushil Thale (Dean R&D)</p>
                </div>
              </div>

              <div className="space-y-3 text-base w-full">
                <a
                  href="mailto:sushil.thale@fcrit.ac.in"
                  className="block text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  sushil.thale@fcrit.ac.in
                </a>
                <a
                  href="tel:+919869396998"
                  className="block text-gray-300 hover:text-gray-200 transition-colors font-medium"
                >
                  +91 98693 96998
                </a>
              </div>
            </div>

            {/* CIBA - larger & nicer */}
            <div className="flex flex-col items-center md:items-start gap-5 bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 hover:border-gray-500/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800/50">
                  <User className="h-6 w-6 text-gray-300" />
                </div>
                <div>
                  <h4 className="text-xl font-medium text-white">CIBA Contact</h4>
                  <p className="text-sm text-gray-400">Mr. Sagar Ranshoor</p>
                </div>
              </div>

              <div className="space-y-3 text-base w-full">
                <a
                  href="mailto:info@ciba.in"
                  className="block text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  info@ciba.in
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}