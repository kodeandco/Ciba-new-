"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Clock, Calendar, Mail, Phone, User, CheckCircle, Sparkles } from 'lucide-react';

const equipmentData = [
  {
    id: 1,
    name: "iTech Battery Tester",
    model: "Model No 5101E (+/- 300V 300mohms)",
    netCost: "₹2,10,630",
    rates: {
      oneTime: "₹2,000",
      oneDay: "₹5,000",
      oneWeek: "₹15,000"
    },
    description: "Professional battery testing equipment for comprehensive analysis"
  },
  {
    id: 2,
    name: "Tektronics EMI Measurement",
    model: "EMI Test Setup Kit",
    netCost: "₹8,37,800",
    rates: {
      oneTime: "₹4,000",
      oneDay: "₹6,000",
      oneWeek: "₹30,000"
    },
    description: "Advanced EMI measurement and testing capabilities"
  },
  {
    id: 3,
    name: "Hioki 3 Phase Power Analyser",
    model: "PQ3100-94",
    netCost: "₹3,75,000",
    rates: {
      oneTime: "₹3,000",
      oneDay: "₹6,000",
      oneWeek: "₹20,000"
    },
    description: "Precision power quality analysis for three-phase systems"
  },
  {
    id: 4,
    name: "Fluke Thermal Imager",
    model: "TiS45",
    netCost: "₹1,79,360",
    rates: {
      oneTime: "₹2,000",
      oneDay: "₹5,000",
      oneWeek: "₹15,000"
    },
    description: "High-resolution thermal imaging for diagnostic applications"
  },
  {
    id: 5,
    name: "Hioki Power Meter",
    model: "PW3337",
    netCost: "₹3,25,680",
    rates: {
      oneTime: "₹2,000",
      oneDay: "₹5,000",
      oneWeek: "₹15,000"
    },
    description: "Accurate power measurement and monitoring system"
  },
  {
    id: 6,
    name: "Croma DC Electronic Load",
    model: "6320E-600-210 (600V/210A/3kW)",
    netCost: "₹6,65,520",
    rates: {
      oneTime: "₹3,000",
      oneDay: "₹6,000",
      oneWeek: "₹25,000"
    },
    description: "High-capacity DC electronic load for testing applications"
  },
  {
    id: 7,
    name: "Solar PV Emulator",
    model: "750V/30A/6kW",
    netCost: "₹7,64,000",
    rates: {
      oneTime: "₹3,000",
      oneDay: "₹6,000",
      oneWeek: "₹25,000"
    },
    description: "Solar photovoltaic system emulation for testing"
  }
];

export default function AssetsSection() {
  const [selectedEquipment, setSelectedEquipment] = useState<number | null>(null);
  const [usageType, setUsageType] = useState<'oneTime' | 'oneDay' | 'oneWeek'>('oneDay');

  return (
    <div className="w-full">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            CIBA EQUIPMENT RESOURCES
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          State-of-the-Art Testing Equipment
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Access premium laboratory equipment for your testing and development needs at Centre for Excellence in Sustainable Technology (CoE-ST)
        </p>
      </motion.div>

      {/* Usage Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-center gap-4 mb-12 flex-wrap"
      >
        <button
          onClick={() => setUsageType('oneTime')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            usageType === 'oneTime'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          One Time (2 hrs)
        </button>
        <button
          onClick={() => setUsageType('oneDay')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            usageType === 'oneDay'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          One Day (6 hrs)
        </button>
        <button
          onClick={() => setUsageType('oneWeek')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            usageType === 'oneWeek'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          One Week (5 days)
        </button>
      </motion.div>

      {/* Equipment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {equipmentData.map((equipment, index) => (
          <motion.div
            key={equipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setSelectedEquipment(equipment.id)}
            className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 ${
              selectedEquipment === equipment.id
                ? 'border-blue-500 ring-4 ring-blue-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            }`}
          >
            {/* Selected Indicator */}
            {selectedEquipment === equipment.id && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            )}

            {/* Equipment Number Badge */}
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <span className="text-blue-600 dark:text-blue-400 font-bold">{equipment.id}</span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {equipment.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {equipment.model}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {equipment.description}
            </p>

            {/* Pricing */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Net Cost</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {equipment.netCost}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {usageType === 'oneTime' && 'One Time Rate'}
                  {usageType === 'oneDay' && 'Daily Rate'}
                  {usageType === 'oneWeek' && 'Weekly Rate'}
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {equipment.rates[usageType]}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Important Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800"
      >
        
        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-blue-200 dark:border-blue-800">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              FCRIT Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dean (R&D)</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Dr. Sushil Thale</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <a
                  href="mailto:sushil.thale@fcrit.ac.in"
                  className="text-blue-600 hover:underline"
                >
                  sushil.thale@fcrit.ac.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <a href="tel:9869396998" className="text-gray-900 dark:text-white font-medium">
                  +91 98693 96998
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              CIBA Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CIBA Representative</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Mr. Sagar Ranshoor</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <a
                  href="mailto:info@ciba.in"
                  className="text-blue-600 hover:underline"
                >
                  info@ciba.in
                </a>
              </div>
            </div>
          </div>
        </div>

        
      </motion.div>
    </div>
  );
}