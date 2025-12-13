"use client";

import { useState } from "react";
import Button from "./Button";
import ApplicationModal from "./ApplicationModal";

interface Position {
  id: number;
  title: string;
  type?: string;
  duration?: string;
  department: string;
  description: string;
}

export default function JobListings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Hardcoded CIBA Jobs
  const cibaJobs: Position[] = [
    {
      id: 1,
      title: "Business Development Manager",
      type: "Full-time",
      department: "Operations",
      description: "Lead business development initiatives and strategic partnerships for incubated startups"
    },
    {
      id: 2,
      title: "Startup Mentor",
      type: "Part-time",
      department: "Mentorship",
      description: "Guide and mentor early-stage startups through their growth journey"
    },
    {
      id: 3,
      title: "Community Manager",
      type: "Full-time",
      department: "Engagement",
      description: "Build and nurture the CIBA startup community and organize events"
    }
  ];

  // Hardcoded CIBA Internships
  const cibaInternships: Position[] = [
    {
      id: 1,
      title: "Marketing Intern",
      duration: "3-6 months",
      department: "Marketing",
      description: "Support digital marketing campaigns and content creation for CIBA"
    },
    {
      id: 2,
      title: "Program Management Intern",
      duration: "6 months",
      department: "Operations",
      description: "Assist in organizing programs, workshops, and managing startup operations"
    },
    {
      id: 3,
      title: "Research Intern",
      duration: "3 months",
      department: "Research",
      description: "Conduct market research and analysis for incubation programs"
    }
  ];

  const handleApplyClick = (position: Position) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  return (
    <>
      {/* CIBA Jobs Section */}
      <section id="ciba-jobs" className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Current Openings at CIBA
          </h2>
          <p className="text-gray-600">Join our team and shape the future of entrepreneurship</p>
        </div>
        
        <div className="space-y-4">
          {cibaJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{job.description}</p>
                  <span className="text-sm text-gray-500">{job.department}</span>
                </div>
                <Button 
                  variant="primary" 
                  className="whitespace-nowrap"
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CIBA Internships Section */}
      <section id="ciba-internships" className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
              Internship Opportunities
            </h2>
            <p className="text-gray-600">Kickstart your career in the startup ecosystem</p>
          </div>
          
          <div className="space-y-4">
            {cibaInternships.map((internship) => (
              <div
                key={internship.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{internship.title}</h3>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {internship.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{internship.description}</p>
                    <span className="text-sm text-gray-500">{internship.department}</span>
                  </div>
                  <Button 
                    variant="primary" 
                    className="whitespace-nowrap"
                    onClick={() => handleApplyClick(internship)}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        position={selectedPosition}
      />
    </>
  );
}