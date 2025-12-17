"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Briefcase,
  Plus,
  GraduationCap,
  Rocket,
} from "lucide-react";

import StatsGrid from "@/components/StatsGrid";
import TabNavigation from "@/components/TabNavigation";

import JobForm from "@/components/JobForm";
import InternshipForm from "@/components/InternshipForm";
import StartupForm from "@/components/StartupForm";

import JobCard from "@/components/JobCard";
import InternshipCard from "@/components/InternshipCard";
import StartupCard from "@/components/StartupCard";

import ApplicationsSection from "@/components/ApplicationsSection";


const BACKEND_URL = "http://localhost:5000";

export default function AdminJobsDashboard() {
  const [tab, setTab] = useState<"jobs" | "internships" | "startups" | "applications">("jobs");

  // New: Clean state for form visibility
  const [showJobForm, setShowJobForm] = useState(false);
  const [showInternshipForm, setShowInternshipForm] = useState(false);
  const [showStartupForm, setShowStartupForm] = useState(false);

  const [cibaJobs, setCibaJobs] = useState<any[]>([]);
  const [cibaInternships, setCibaInternships] = useState<any[]>([]);
  const [startups, setStartups] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = "";
      if (tab === "jobs") url = `${BACKEND_URL}/api/admin/ciba-jobs?type=job`;
      else if (tab === "internships") url = `${BACKEND_URL}/api/admin/ciba-jobs?type=internship`;
      else if (tab === "startups") url = `${BACKEND_URL}/api/admin/incubated-startups`;
      else url = `${BACKEND_URL}/api/applications/all`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      if (tab === "jobs") setCibaJobs(data.jobs || []);
      else if (tab === "internships") setCibaInternships(data.jobs || []);
      else if (tab === "startups") setStartups(data.startups || []);
      else setApplications(data || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const stats = {
    cibaJobs: cibaJobs.length,
    cibaInternships: cibaInternships.length,
    startups: startups.length,
    totalApps: applications.length,
    pendingApps: applications.filter((a) => !a.status || a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl mb-6 shadow-xl">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Jobs Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Manage all career opportunities</p>
          </div>

          <StatsGrid data={stats} />
          <TabNavigation activeTab={tab} onTabChange={setTab} pendingCount={stats.pendingApps} />

          {/* Jobs Tab */}
          {tab === "jobs" && (
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowJobForm(!showJobForm)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  {showJobForm ? "Cancel" : "Add CIBA Job"}
                </button>
              </div>

              {showJobForm && <JobForm onClose={() => setShowJobForm(false)} onSuccess={fetchData} />}

              <div className="space-y-6">
                {cibaJobs.length === 0 ? (
                  <div className="bg-white rounded-2xl p-16 shadow-lg text-center border-2 border-dashed border-gray-300">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 font-medium">No CIBA job positions posted yet</p>
                  </div>
                ) : (
                  cibaJobs.map((job) => <JobCard key={job._id} job={job} onDelete={fetchData} />)
                )}
              </div>
            </>
          )}

          {/* Internships Tab */}
          {tab === "internships" && (
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowInternshipForm(!showInternshipForm)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-700 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  {showInternshipForm ? "Cancel" : "Add Internship"}
                </button>
              </div>

              {showInternshipForm && <InternshipForm onClose={() => setShowInternshipForm(false)} onSuccess={fetchData} />}

              <div className="space-y-6">
                {cibaInternships.length === 0 ? (
                  <div className="bg-white rounded-2xl p-16 shadow-lg text-center border-2 border-dashed border-gray-300">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 font-medium">No internship positions posted yet</p>
                  </div>
                ) : (
                  cibaInternships.map((internship) => (
                    <InternshipCard key={internship._id} internship={internship} onDelete={fetchData} />
                  ))
                )}
              </div>
            </>
          )}

          {/* Startups Tab */}
          {tab === "startups" && (
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowStartupForm(!showStartupForm)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  {showStartupForm ? "Cancel" : "Add Startup"}
                </button>
              </div>

              {showStartupForm && <StartupForm onClose={() => setShowStartupForm(false)} onSuccess={fetchData} />}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startups.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl p-16 shadow-lg text-center border-2 border-dashed border-gray-300">
                    <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 font-medium">No startups in directory yet</p>
                  </div>
                ) : (
                  startups.map((startup) => <StartupCard key={startup._id} startup={startup} onDelete={fetchData} />)
                )}
              </div>
            </>
          )}

          {/* Applications Tab */}
          {tab === "applications" && <ApplicationsSection applications={applications} onRefetch={fetchData} />}
        </div>
      </div>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}