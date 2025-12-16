"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Briefcase, Rocket, ArrowRight } from "lucide-react";

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

// Button Component
const Button = ({ onClick, children, type = "button", variant = "primary", disabled = false, className = "" }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${variant === "primary"
        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
      } ${className}`}
  >
    {children}
  </button>
);

// Application Modal Component
const ApplicationModal = ({ isOpen, onClose, position }: any) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    linkedIn: "",
    portfolio: ""
  });

  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      setSubmitError("Please upload a PDF, DOC, or DOCX file");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setResume(file);
    setSubmitError(null);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      linkedIn: "",
      portfolio: ""
    });
    setResume(null);
    const fileInput = document.getElementById("resume") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !resume) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const data = new FormData();
      data.append("positionId", position._id);
      data.append("positionTitle", position.title);
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("coverLetter", formData.coverLetter);
      data.append("linkedIn", formData.linkedIn);
      data.append("portfolio", formData.portfolio);
      data.append("resume", resume);

      console.log("🚀 Sending application for position:", position._id);

      const response = await fetch(`${BACKEND_URL}/api/applications/apply`, {
        method: "POST",
        body: data
      });

      console.log("📡 Response Status:", response.status);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Got HTML instead of JSON:", text.substring(0, 500));
        throw new Error("Server returned an error. Please check backend console.");
      }

      const result = await response.json();
      console.log("📦 Response data:", result);

      if (result.success || result.message) {
        setSubmitSuccess(result.message || "Application submitted successfully!");
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2500);
      } else {
        setSubmitError(result.error || "Failed to submit application");
      }

    } catch (error) {
      console.error("❌ Error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Network error. Please check if backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !position) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Apply for {position.title}</h3>
              <p className="text-gray-600 mt-1">{position.department}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {submitError && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3 mb-6">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-800">Submission Failed</p>
                <p className="text-red-700 text-sm mt-1">{submitError}</p>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3 mb-6">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="font-semibold text-green-800">Success!</p>
                <p className="text-green-700 text-sm mt-1">{submitSuccess}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+91 98765 43210"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                required
                disabled={isSubmitting}
                accept=".pdf,.doc,.docx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 disabled:bg-gray-100"
              />
              {resume && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-green-600 text-xl">📄</span>
                  <p className="text-green-600 text-sm font-medium">{resume.name}</p>
                </div>
              )}
              <p className="text-gray-500 text-xs mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                required
                placeholder="Tell us why you're a great fit for this role..."
                disabled={isSubmitting}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="primary"
                disabled={isSubmitting || !resume}
                className="flex-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// All Jobs Modal Component
const AllJobsModal = ({ isOpen, onClose, jobs, onApply }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">All Job Openings</h3>
            <p className="text-gray-600 mt-1">{jobs.length} positions available</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="space-y-4">
            {jobs.map((job: Position) => (
              <div
                key={job._id}
                className="border rounded-lg p-6 flex justify-between items-center hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.department}</p>
                </div>
                <Button onClick={() => { onClose(); onApply(job); }}>
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// All Internships Modal Component
const AllInternshipsModal = ({ isOpen, onClose, internships, onApply }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">All Internship Programs</h3>
            <p className="text-gray-600 mt-1">{internships.length} programs available</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="space-y-4">
            {internships.map((internship: Position) => (
              <div
                key={internship._id}
                className="border rounded-lg p-6 flex justify-between items-center bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <h3 className="text-xl font-semibold">{internship.title}</h3>
                  <p className="text-gray-600">{internship.department}</p>
                </div>
                <Button onClick={() => { onClose(); onApply(internship); }}>
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function JobListings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [cibaJobs, setCibaJobs] = useState<Position[]>([]);
  const [cibaInternships, setCibaInternships] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllJobsModal, setShowAllJobsModal] = useState(false);
  const [showAllInternshipsModal, setShowAllInternshipsModal] = useState(false);

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const categories = [
    {
      title: "Internships at CIBA",
      description: "Gain hands-on experience in startup ecosystem management and business acceleration",
      id: "ciba-internships",
      icon: GraduationCap,
      count: `${cibaInternships.length} Programs`
    },
    {
      title: "Jobs at CIBA",
      description: "Be part of the team that empowers entrepreneurs and builds innovation",
      id: "ciba-jobs",
      icon: Briefcase,
      count: `${cibaJobs.length} Positions`
    },
    {
      title: "Join Our Startups",
      description: "Explore career opportunities at innovative startups incubated by CIBA",
      id: "startup-opportunities",
      icon: Rocket,
      count: "Coming Soon"
    }
  ];

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
      {/* Job Categories Section */}
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
              <button
                key={idx}
                onClick={() => scrollToSection(category.id)}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-500 hover:shadow-2xl transition-all duration-500 overflow-hidden text-left w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="inline-block px-3 py-1 bg-blue-50 group-hover:bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4 transition-colors">
                    {category.count}
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    Explore Opportunities
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            );
          })}
        </div>
      </section>

      {/* CIBA Jobs */}
      <section id="ciba-jobs" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-8">
        <h2 className="text-3xl font-bold mb-8">Current Openings at CIBA</h2>

        {cibaJobs.length === 0 ? (
          <p className="text-gray-600">No job openings available.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cibaJobs.slice(0, 3).map((job) => (
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

            {cibaJobs.length > 3 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAllJobsModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
                >
                  View All {cibaJobs.length} Jobs
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CIBA Internships */}
      <section id="ciba-internships" className="bg-gray-50 px-4 py-20 scroll-mt-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Internship Opportunities</h2>

          {cibaInternships.length === 0 ? (
            <p className="text-gray-600">No internships available.</p>
          ) : (
            <>
              <div className="space-y-4">
                {cibaInternships.slice(0, 3).map((internship) => (
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

              {cibaInternships.length > 3 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAllInternshipsModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
                  >
                    View All {cibaInternships.length} Internships
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Startup Opportunities Section */}
      <section id="startup-opportunities" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-8">
        <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-100">
          <Rocket className="w-20 h-20 text-blue-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            We're partnering with our startups to bring you exciting career opportunities. Stay tuned!
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg">
            Notify Me
          </button>
        </div>
      </section>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        position={selectedPosition}
      />

      <AllJobsModal
        isOpen={showAllJobsModal}
        onClose={() => setShowAllJobsModal(false)}
        jobs={cibaJobs}
        onApply={handleApplyClick}
      />

      <AllInternshipsModal
        isOpen={showAllInternshipsModal}
        onClose={() => setShowAllInternshipsModal(false)}
        internships={cibaInternships}
        onApply={handleApplyClick}
      />
    </>
  );
}