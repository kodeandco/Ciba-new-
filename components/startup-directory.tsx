"use client";

import { useState } from "react";
import Button from "./Button";
import StartupSubmissionModal from "./StartupSubmissionModal";

interface Startup {
  id: number;
  name: string;
  sector: string;
  hiring: boolean;
  careerUrl: string;
}

export default function StartupDirectory() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hardcoded incubated startups
  const incubatedStartups: Startup[] = [
    { 
      id: 1, 
      name: "TechVenture AI", 
      sector: "Artificial Intelligence", 
      hiring: true, 
      careerUrl: "#" 
    },
    { 
      id: 2, 
      name: "GreenEco Solutions", 
      sector: "Sustainability", 
      hiring: true, 
      careerUrl: "#" 
    },
    { 
      id: 3, 
      name: "HealthTech Plus", 
      sector: "Healthcare Technology", 
      hiring: false, 
      careerUrl: "#" 
    },
    { 
      id: 4, 
      name: "FinWise", 
      sector: "Financial Technology", 
      hiring: true, 
      careerUrl: "#" 
    },
    { 
      id: 5, 
      name: "EduLearn", 
      sector: "Education Technology", 
      hiring: false, 
      careerUrl: "#" 
    },
    { 
      id: 6, 
      name: "SmartLogistics", 
      sector: "Supply Chain", 
      hiring: true, 
      careerUrl: "#" 
    }
  ];

  const handleSubmitOpenings = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section id="startup-opportunities" className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Opportunities at Our Incubated Startups
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore career opportunities at innovative startups backed by CIBA
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {incubatedStartups.map((startup) => (
            <div
              key={startup.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{startup.name}</h3>
                  <p className="text-sm text-gray-500">{startup.sector}</p>
                </div>
                {startup.hiring && (
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded text-xs font-medium whitespace-nowrap">
                    Hiring
                  </span>
                )}
              </div>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  if (startup.careerUrl && startup.careerUrl !== '#') {
                    window.open(startup.careerUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                View Openings
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white border border-gray-200 rounded-xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-3 text-gray-900">Are You an Incubated Startup?</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            List your job openings on our platform and reach talented candidates from the CIBA community
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleSubmitOpenings}
          >
            Submit Your Openings
          </Button>
        </div>
      </section>

      <StartupSubmissionModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}