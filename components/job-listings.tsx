"use client";

import { useState, useEffect } from "react";
import Button from "./Button";
import ApplicationModal from "./ApplicationModal";

interface Position {
  _id: string;
  title: string;
  type: string;
  duration?: string;
  department: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  location?: string;
  salary?: string;
}

const BACKEND_URL = "http://localhost:5000";

export default function JobListings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [cibaJobs, setCibaJobs] = useState<Position[]>([]);
  const [cibaInternships, setCibaInternships] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch CIBA Jobs
        const jobsResponse = await fetch(
          `${BACKEND_URL}/api/admin/ciba-jobs?type=job`
        );
        if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
        const jobsData = await jobsResponse.json();
        setCibaJobs(jobsData.jobs || jobsData);

        // ✅ Fetch CIBA Internships
        const internshipsResponse = await fetch(
          `${BACKEND_URL}/api/admin/ciba-jobs?type=internship`
        );
        if (!internshipsResponse.ok)
          throw new Error("Failed to fetch internships");
        const internshipsData = await internshipsResponse.json();
        setCibaInternships(internshipsData.jobs || internshipsData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load opportunities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyClick = (position: Position) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600">Loading opportunities...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <>
      {/* CIBA Jobs */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8">Current Openings at CIBA</h2>

        {cibaJobs.length === 0 ? (
          <p className="text-gray-600">No job openings available.</p>
        ) : (
          <div className="space-y-4">
            {cibaJobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.department}</p>
                </div>
                <Button onClick={() => handleApplyClick(job)}>
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CIBA Internships */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Internship Opportunities</h2>

          {cibaInternships.length === 0 ? (
            <p className="text-gray-600">No internships available.</p>
          ) : (
            <div className="space-y-4">
              {cibaInternships.map((internship) => (
                <div
                  key={internship._id}
                  className="border rounded-lg p-6 flex justify-between items-center bg-white"
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      {internship.title}
                    </h3>
                    <p className="text-gray-600">
                      {internship.department}
                    </p>
                  </div>
                  <Button onClick={() => handleApplyClick(internship)}>
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        position={selectedPosition}
      />
    </>
  );
}
