// app/admin/jobs/page.tsx
"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Briefcase,
  Building2,
  Mail,
  Phone,
  Loader2,
  Plus,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Search,
  Filter,
  Eye,
  X,
  Users,
  FileText,
  Calendar,
  GraduationCap,
  Rocket,
  MapPin,
  DollarSign,
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

interface CIBAJob {
  _id: string;
  title: string;
  type: "job" | "internship";
  department: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  location?: string;
  salary?: string;
  duration?: string;
}

interface IncubatedStartup {
  _id: string;
  companyName: string;
  tagline: string;
  careerUrl: string;
  description?: string;
}

interface Application {
  _id: string;
  positionTitle: string;
  positionType: "ciba-job" | "ciba-internship" | "startup";
  fullName: string;
  email: string;
  phone: string;
  resumeFilename: string;
  coverLetter: string;
  status?: "pending" | "shortlisted" | "rejected";
  createdAt: string;
}

export default function AdminJobsDashboard() {
  const [tab, setTab] = useState<"jobs" | "internships" | "startups" | "applications">("jobs");
  const [cibaJobs, setCibaJobs] = useState<CIBAJob[]>([]);
  const [cibaInternships, setCibaInternships] = useState<CIBAJob[]>([]);
  const [startups, setStartups] = useState<IncubatedStartup[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showInternshipForm, setShowInternshipForm] = useState(false);
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    description: "",
    responsibilities: "",
    requirements: "",
    location: "Mumbai, India",
    salary: "",
  });

  const [internshipForm, setInternshipForm] = useState({
    title: "",
    department: "",
    description: "",
    responsibilities: "",
    requirements: "",
    location: "Mumbai, India",
    duration: "3-6 months",
  });

  const [startupForm, setStartupForm] = useState({
    companyName: "",
    tagline: "",
    careerUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, [tab]);

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

  const handleAddJob = async () => {
    if (!jobForm.title || !jobForm.department || !jobForm.description) {
      toast.error("Required fields missing");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/ciba-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...jobForm, type: "job" }),
      });
      if (res.ok) {
        toast.success("Job Added Successfully!");
        setJobForm({ title: "", department: "", description: "", responsibilities: "", requirements: "", location: "Mumbai, India", salary: "" });
        setShowJobForm(false);
        fetchData();
      } else {
        toast.error("Failed to add job");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleAddInternship = async () => {
    if (!internshipForm.title || !internshipForm.department || !internshipForm.description) {
      toast.error("Required fields missing");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/ciba-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...internshipForm, type: "internship" }),
      });
      if (res.ok) {
        toast.success("Internship Added Successfully!");
        setInternshipForm({ title: "", department: "", description: "", responsibilities: "", requirements: "", location: "Mumbai, India", duration: "3-6 months" });
        setShowInternshipForm(false);
        fetchData();
      } else {
        toast.error("Failed to add internship");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleAddStartup = async () => {
    if (!startupForm.companyName || !startupForm.tagline || !startupForm.careerUrl) {
      toast.error("Required fields missing");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/incubated-startups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(startupForm),
      });
      if (res.ok) {
        toast.success("Startup Added to Directory!");
        setStartupForm({ companyName: "", tagline: "", careerUrl: "", description: "" });
        setShowStartupForm(false);
        fetchData();
      } else {
        toast.error("Failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this position permanently?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/ciba-jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted Successfully");
        fetchData();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const deleteStartup = async (id: string) => {
    if (!confirm("Remove this startup permanently?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/incubated-startups/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Startup Removed");
        fetchData();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const updateApplicationStatus = async (id: string, status: "shortlisted" | "rejected") => {
    setUpdatingStatus(id);
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(status === "shortlisted" ? "Shortlisted" : "Rejected");
        fetchData();
      } else {
        toast.error("Failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm("Delete this application permanently?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Application Deleted");
        fetchData();
        if (selectedApp?._id === id) setSelectedApp(null);
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.positionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status?: string) => {
    const s = status || "pending";
    const config = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      shortlisted: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };
    const { bg, text, icon: Icon } = config[s as keyof typeof config];
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${bg} ${text}`}>
        <Icon className="w-4 h-4" />
        {s.toUpperCase()}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const config = {
      "ciba-job": { bg: "bg-blue-100", text: "text-blue-800", label: "CIBA Job" },
      "ciba-internship": { bg: "bg-cyan-100", text: "text-cyan-800", label: "CIBA Internship" },
      startup: { bg: "bg-purple-100", text: "text-purple-800", label: "Startup" },
    };
    const { bg, text, label } = config[type as keyof typeof config] || config["ciba-job"];
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  const stats = {
    cibaJobs: cibaJobs.length,
    cibaInternships: cibaInternships.length,
    startups: startups.length,
    totalApps: applications.length,
    pendingApps: applications.filter(a => !a.status || a.status === "pending").length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-20 h-20 animate-spin text-indigo-600 mx-auto mb-6" />
          <p className="text-2xl font-medium text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl mb-8 shadow-2xl">
              <Briefcase className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Jobs Admin Dashboard</h1>
            <p className="text-2xl text-gray-600">Professional control center for all career opportunities</p>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-6 mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-200 hover:shadow-3xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <p className="text-lg font-bold text-blue-700">CIBA Jobs</p>
              </div>
              <p className="text-5xl font-bold text-gray-900">{stats.cibaJobs}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-cyan-200 hover:shadow-3xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="w-8 h-8 text-cyan-600" />
                <p className="text-lg font-bold text-cyan-700">Internships</p>
              </div>
              <p className="text-5xl font-bold text-gray-900">{stats.cibaInternships}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-200 hover:shadow-3xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Rocket className="w-8 h-8 text-purple-600" />
                <p className="text-lg font-bold text-purple-700">Startups</p>
              </div>
              <p className="text-5xl font-bold text-gray-900">{stats.startups}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-indigo-200 hover:shadow-3xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-8 h-8 text-indigo-600" />
                <p className="text-lg font-bold text-indigo-700">Total Apps</p>
              </div>
              <p className="text-5xl font-bold text-gray-900">{stats.totalApps}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-yellow-200 hover:shadow-3xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <p className="text-lg font-bold text-yellow-700">Pending</p>
              </div>
              <p className="text-5xl font-bold text-gray-900">{stats.pendingApps}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-green-200 hover:shadow-3xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <p className="text-lg font-bold text-green-700">Shortlisted</p>
              </div>
              <p className="text-5xl font-bold text-gray-900">{stats.shortlisted}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-red-200 hover:shadow-3xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <p className="text-lg font-bold text-red-700">Rejected</p>
              </div>
              <p className="text-5xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>

          {/* Premium Tabs */}
          <div className="flex justify-center gap-8 mb-16">
            <button
              onClick={() => setTab("jobs")}
              className={`px-16 py-8 rounded-3xl text-3xl font-bold transition-all shadow-2xl flex items-center gap-6 ${
                tab === "jobs" ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white" : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Building2 className="w-12 h-12" />
              CIBA Jobs
            </button>
            <button
              onClick={() => setTab("internships")}
              className={`px-16 py-8 rounded-3xl text-3xl font-bold transition-all shadow-2xl flex items-center gap-6 ${
                tab === "internships" ? "bg-gradient-to-r from-cyan-600 to-teal-700 text-white" : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <GraduationCap className="w-12 h-12" />
              Internships
            </button>
            <button
              onClick={() => setTab("startups")}
              className={`px-16 py-8 rounded-3xl text-3xl font-bold transition-all shadow-2xl flex items-center gap-6 ${
                tab === "startups" ? "bg-gradient-to-r from-purple-600 to-pink-700 text-white" : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Rocket className="w-12 h-12" />
              Startups
            </button>
            <button
              onClick={() => setTab("applications")}
              className={`px-16 py-8 rounded-3xl text-3xl font-bold transition-all shadow-2xl flex items-center gap-6 relative ${
                tab === "applications" ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white" : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Mail className="w-12 h-12" />
              Applications
              {stats.pendingApps > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {stats.pendingApps}
                </span>
              )}
            </button>
          </div>

          {/* CIBA Jobs Tab */}
          {tab === "jobs" && (
            <div>
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setShowJobForm(!showJobForm)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all flex items-center gap-4"
                >
                  {showJobForm ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                  {showJobForm ? "Cancel" : "Add CIBA Job"}
                </button>
              </div>

              {showJobForm && (
                <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16 border-2 border-blue-100">
                  <h3 className="text-4xl font-bold mb-10 text-gray-900 flex items-center gap-4">
                    <Building2 className="w-12 h-12 text-blue-600" />
                    Add New CIBA Job
                  </h3>
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Job Title *</label>
                        <input
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          placeholder="e.g. Senior Product Manager"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Department *</label>
                        <input
                          value={jobForm.department}
                          onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                          placeholder="e.g. Product, Engineering"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Location</label>
                        <input
                          value={jobForm.location}
                          onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                          placeholder="e.g. Mumbai, India"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Salary Range</label>
                        <input
                          value={jobForm.salary}
                          onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                          placeholder="e.g. ₹15-25 LPA"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Job Description *</label>
                      <textarea
                        value={jobForm.description}
                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                        rows={5}
                        placeholder="Brief overview of the role..."
                        className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Key Responsibilities</label>
                      <textarea
                        value={jobForm.responsibilities}
                        onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                        rows={5}
                        placeholder="List key responsibilities..."
                        className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Requirements & Qualifications</label>
                      <textarea
                        value={jobForm.requirements}
                        onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                        rows={5}
                        placeholder="Required skills, experience, qualifications..."
                        className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <button
                      onClick={handleAddJob}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 rounded-2xl font-bold text-2xl hover:shadow-2xl transition-all"
                    >
                      Publish Job Position
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-10">
                {cibaJobs.length === 0 ? (
                  <div className="bg-white rounded-3xl p-24 shadow-2xl text-center border-2 border-dashed border-gray-300">
                    <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                    <p className="text-3xl text-gray-500 font-medium">No CIBA job positions posted yet</p>
                  </div>
                ) : (
                  cibaJobs.map((job) => (
                    <div key={job._id} className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-blue-100 hover:shadow-3xl transition-shadow">
                      <div className="flex justify-between items-start gap-12">
                        <div className="flex-1">
                          <div className="flex items-start gap-6 mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
                              <Building2 className="w-10 h-10 text-white" />
                            </div>
                            <div>
                              <h3 className="text-4xl font-bold text-gray-900 mb-3">{job.title}</h3>
                              <p className="text-2xl text-blue-600 font-semibold mb-4">{job.department}</p>
                              <div className="flex flex-wrap gap-4">
                                {job.location && (
                                  <span className="px-5 py-2 bg-blue-50 text-blue-700 rounded-xl text-lg flex items-center gap-3">
                                    <MapPin className="w-6 h-6" />
                                    {job.location}
                                  </span>
                                )}
                                {job.salary && (
                                  <span className="px-5 py-2 bg-green-50 text-green-700 rounded-xl text-lg flex items-center gap-3">
                                    <DollarSign className="w-6 h-6" />
                                    {job.salary}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-8">
                            <div>
                              <h4 className="text-2xl font-bold text-gray-900 mb-4">Description</h4>
                              <p className="text-xl text-gray-700 leading-relaxed bg-blue-50 p-8 rounded-2xl">{job.description}</p>
                            </div>
                            {job.responsibilities && (
                              <div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h4>
                                <p className="text-xl text-gray-700 leading-relaxed bg-indigo-50 p-8 rounded-2xl">{job.responsibilities}</p>
                              </div>
                            )}
                            {job.requirements && (
                              <div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h4>
                                <p className="text-xl text-gray-700 leading-relaxed bg-purple-50 p-8 rounded-2xl">{job.requirements}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-8">
                          <span className="px-8 py-4 bg-green-100 text-green-700 rounded-3xl font-bold text-xl flex items-center gap-4 border-2 border-green-300">
                            <CheckCircle className="w-10 h-10" />
                            LIVE
                          </span>
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="p-6 bg-red-100 text-red-600 rounded-3xl hover:bg-red-200 transition-all"
                          >
                            <Trash2 className="w-10 h-10" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Internships Tab */}
          {tab === "internships" && (
            <div>
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setShowInternshipForm(!showInternshipForm)}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-700 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all flex items-center gap-4"
                >
                  {showInternshipForm ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                  {showInternshipForm ? "Cancel" : "Add Internship"}
                </button>
              </div>

              {showInternshipForm && (
                <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16 border-2 border-cyan-100">
                  <h3 className="text-4xl font-bold mb-10 text-gray-900 flex items-center gap-4">
                    <GraduationCap className="w-12 h-12 text-cyan-600" />
                    Add New Internship
                  </h3>
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Internship Title *</label>
                        <input
                          value={internshipForm.title}
                          onChange={(e) => setInternshipForm({ ...internshipForm, title: e.target.value })}
                          placeholder="e.g. Marketing Intern"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Department *</label>
                        <input
                          value={internshipForm.department}
                          onChange={(e) => setInternshipForm({ ...internshipForm, department: e.target.value })}
                          placeholder="e.g. Marketing, Operations"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Location</label>
                        <input
                          value={internshipForm.location}
                          onChange={(e) => setInternshipForm({ ...internshipForm, location: e.target.value })}
                          placeholder="e.g. Mumbai, India"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Duration</label>
                        <input
                          value={internshipForm.duration}
                          onChange={(e) => setInternshipForm({ ...internshipForm, duration: e.target.value })}
                          placeholder="e.g. 3-6 months"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Internship Description *</label>
                      <textarea
                        value={internshipForm.description}
                        onChange={(e) => setInternshipForm({ ...internshipForm, description: e.target.value })}
                        rows={5}
                        placeholder="Brief overview of the internship..."
                        className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Key Responsibilities</label>
                      <textarea
                        value={internshipForm.responsibilities}
                        onChange={(e) => setInternshipForm({ ...internshipForm, responsibilities: e.target.value })}
                        rows={5}
                        placeholder="What the intern will do..."
                        className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Requirements</label>
                      <textarea
                        value={internshipForm.requirements}
                        onChange={(e) => setInternshipForm({ ...internshipForm, requirements: e.target.value })}
                        rows={5}
                        placeholder="Skills and qualifications needed..."
                        className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition"
                      />
                    </div>
                    <button
                      onClick={handleAddInternship}
                      className="w-full bg-gradient-to-r from-cyan-600 to-teal-700 text-white py-6 rounded-2xl font-bold text-2xl hover:shadow-2xl transition-all"
                    >
                      Publish Internship
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-10">
                {cibaInternships.length === 0 ? (
                  <div className="bg-white rounded-3xl p-24 shadow-2xl text-center border-2 border-dashed border-gray-300">
                    <GraduationCap className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                    <p className="text-3xl text-gray-500 font-medium">No internship positions posted yet</p>
                  </div>
                ) : (
                  cibaInternships.map((job) => (
                    <div key={job._id} className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-cyan-100 hover:shadow-3xl transition-shadow">
                      <div className="flex justify-between items-start gap-12">
                        <div className="flex-1">
                          <div className="flex items-start gap-6 mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
                              <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <div>
                              <h3 className="text-4xl font-bold text-gray-900 mb-3">{job.title}</h3>
                              <p className="text-2xl text-cyan-600 font-semibold mb-4">{job.department}</p>
                              <div className="flex flex-wrap gap-4">
                                {job.location && (
                                  <span className="px-5 py-2 bg-cyan-50 text-cyan-700 rounded-xl text-lg flex items-center gap-3">
                                    <MapPin className="w-6 h-6" />
                                    {job.location}
                                  </span>
                                )}
                                {job.duration && (
                                  <span className="px-5 py-2 bg-teal-50 text-teal-700 rounded-xl text-lg flex items-center gap-3">
                                    <Calendar className="w-6 h-6" />
                                    {job.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-8">
                            <div>
                              <h4 className="text-2xl font-bold text-gray-900 mb-4">Description</h4>
                              <p className="text-xl text-gray-700 leading-relaxed bg-cyan-50 p-8 rounded-2xl">{job.description}</p>
                            </div>
                            {job.responsibilities && (
                              <div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h4>
                                <p className="text-xl text-gray-700 leading-relaxed bg-teal-50 p-8 rounded-2xl">{job.responsibilities}</p>
                              </div>
                            )}
                            {job.requirements && (
                              <div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h4>
                                <p className="text-xl text-gray-700 leading-relaxed bg-purple-50 p-8 rounded-2xl">{job.requirements}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-8">
                          <span className="px-8 py-4 bg-green-100 text-green-700 rounded-3xl font-bold text-xl flex items-center gap-4 border-2 border-green-300">
                            <CheckCircle className="w-10 h-10" />
                            LIVE
                          </span>
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="p-6 bg-red-100 text-red-600 rounded-3xl hover:bg-red-200 transition-all"
                          >
                            <Trash2 className="w-10 h-10" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Startups Tab */}
          {tab === "startups" && (
            <div>
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setShowStartupForm(!showStartupForm)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all flex items-center gap-4"
                >
                  {showStartupForm ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                  {showStartupForm ? "Cancel" : "Add Startup"}
                </button>
              </div>

              {showStartupForm && (
                <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16 border-2 border-purple-100">
                  <h3 className="text-4xl font-bold mb-10 text-gray-900 flex items-center gap-4">
                    <Rocket className="w-12 h-12 text-purple-600" />
                    Add Incubated Startup
                  </h3>
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Company Name *</label>
                        <input
                          value={startupForm.companyName}
                          onChange={(e) => setStartupForm({ ...startupForm, companyName: e.target.value })}
                          placeholder="e.g. TechVenture AI"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Short Tagline *</label>
                        <input
                          value={startupForm.tagline}
                          onChange={(e) => setStartupForm({ ...startupForm, tagline: e.target.value })}
                          placeholder="e.g. Revolutionizing AI for enterprises"
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Career Page URL *</label>
                      <input
                        value={startupForm.careerUrl}
                        onChange={(e) => setStartupForm({ ...startupForm, careerUrl: e.target.value })}
                        placeholder="https://company.com/careers"
                        className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Description (Optional)</label>
                      <textarea
                        value={startupForm.description}
                        onChange={(e) => setStartupForm({ ...startupForm, description: e.target.value })}
                        rows={4}
                        placeholder="Brief description of the startup..."
                        className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition"
                      />
                    </div>
                    <button
                      onClick={handleAddStartup}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-700 text-white py-6 rounded-2xl font-bold text-2xl hover:shadow-2xl transition-all"
                    >
                      Add to Directory
                    </button>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {startups.length === 0 ? (
                  <div className="col-span-full bg-white rounded-3xl p-24 shadow-2xl text-center border-2 border-dashed border-gray-300">
                    <Rocket className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                    <p className="text-3xl text-gray-500 font-medium">No startups in directory yet</p>
                  </div>
                ) : (
                  startups.map((s) => (
                    <div key={s._id} className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-purple-100 hover:shadow-3xl transition-shadow">
                      <div className="flex items-start gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl">
                          <Rocket className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-4xl font-bold text-gray-900 mb-3">{s.companyName}</h3>
                          <p className="text-2xl text-purple-600 italic">"{s.tagline}"</p>
                        </div>
                      </div>
                      {s.description && (
                        <p className="text-xl text-gray-700 mb-8 leading-relaxed bg-purple-50 p-6 rounded-2xl">{s.description}</p>
                      )}
                      <a
                        href={s.careerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 text-blue-600 text-xl font-bold hover:underline mb-8"
                      >
                        <Globe className="w-8 h-8" />
                        View Career Page
                      </a>
                      <button
                        onClick={() => deleteStartup(s._id)}
                        className="w-full p-6 bg-red-100 text-red-600 rounded-3xl hover:bg-red-200 transition-all flex items-center justify-center gap-4"
                      >
                        <Trash2 className="w-10 h-10" />
                        Remove Startup
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {tab === "applications" && (
            <div>
              <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 relative">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 w-8 h-8" />
                    <input
                      type="text"
                      placeholder="Search by name, position, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-20 pr-8 py-6 border-2 border-gray-200 rounded-3xl text-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition"
                    />
                  </div>
                  <div className="flex gap-6">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-12 py-6 border-2 border-gray-200 rounded-3xl text-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-12 py-6 border-2 border-gray-200 rounded-3xl text-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition"
                    >
                      <option value="all">All Types</option>
                      <option value="ciba-job">CIBA Job</option>
                      <option value="ciba-internship">CIBA Internship</option>
                      <option value="startup">Startup</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                {filteredApps.length === 0 ? (
                  <div className="bg-white rounded-3xl p-24 shadow-2xl text-center border-2 border-dashed border-gray-300">
                    <Mail className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                    <p className="text-3xl text-gray-500 font-medium">No applications found</p>
                  </div>
                ) : (
                  filteredApps.map((app) => (
                    <div key={app._id} className="bg-white rounded-3xl shadow-2xl p-16 border-2 border-gray-100 hover:shadow-3xl transition-shadow">
                      <div className="flex justify-between items-start gap-16">
                        <div className="flex-1">
                          <div className="flex items-start gap-8 mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
                              <Users className="w-10 h-10 text-white" />
                            </div>
                            <div>
                              <h3 className="text-5xl font-bold text-gray-900 mb-4">{app.fullName}</h3>
                              <p className="text-3xl text-green-600 font-semibold mb-6">Applied for: {app.positionTitle}</p>
                              <div className="flex items-center gap-8">
                                {getTypeBadge(app.positionType)}
                                <span className="text-xl text-gray-600">
                                  <Calendar className="w-6 h-6 inline mr-2" />
                                  {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-16 mt-12 text-2xl">
                            <div className="flex items-center gap-6">
                              <Mail className="w-12 h-12 text-gray-600" />
                              {app.email}
                            </div>
                            <div className="flex items-center gap-6">
                              <Phone className="w-12 h-12 text-gray-600" />
                              {app.phone}
                            </div>
                          </div>
                          <p className="mt-16 text-2xl text-gray-800 bg-gray-50 p-12 rounded-3xl leading-relaxed">
                            {app.coverLetter}
                          </p>
                          <a
                            href={`${BACKEND_URL}/uploads/resumes/${app.resumeFilename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-8 mt-12 px-16 py-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-3xl font-bold text-3xl hover:shadow-2xl transition-all"
                          >
                            <Download className="w-12 h-12" />
                            Download Resume
                          </a>
                        </div>
                        <div className="flex flex-col items-end gap-12">
                          {getStatusBadge(app.status)}
                          <div className="flex gap-8">
                            <button
                              onClick={() => updateApplicationStatus(app._id, "shortlisted")}
                              className="px-16 py-10 bg-green-600 text-white rounded-3xl font-bold text-3xl hover:bg-green-700 transition-all"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app._id, "rejected")}
                              className="px-16 py-10 bg-red-600 text-white rounded-3xl font-bold text-3xl hover:bg-red-700 transition-all"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => deleteApplication(app._id)}
                              className="p-10 bg-gray-200 text-gray-700 rounded-3xl hover:bg-gray-300 transition-all"
                            >
                              <Trash2 className="w-12 h-12" />
                            </button>
                          </div>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-16 py-10 bg-purple-600 text-white rounded-3xl font-bold text-3xl hover:bg-purple-700 transition-all"
                          >
                            <Eye className="w-12 h-12" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50" onClick={() => setSelectedApp(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-12 border-b-2 border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-5xl font-bold text-gray-900">Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-12 h-12" />
              </button>
            </div>
            <div className="p-12 space-y-16">
              <div>
                <h3 className="text-4xl font-bold mb-10 text-gray-900">Candidate Information</h3>
                <div className="grid grid-cols-2 gap-12 text-2xl">
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Full Name</p>
                    <p className="font-bold text-gray-900">{selectedApp.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Position Applied</p>
                    <p className="font-bold text-gray-900">{selectedApp.positionTitle}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Email</p>
                    <p className="font-bold text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Phone</p>
                    <p className="font-bold text-gray-900">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Application Type</p>
                    <p className="font-bold text-gray-900">{getTypeBadge(selectedApp.positionType).props.children[1]}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-2">Applied On</p>
                    <p className="font-bold text-gray-900">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-4xl font-bold mb-10 text-gray-900">Cover Letter</h3>
                <p className="text-2xl text-gray-800 bg-gray-50 p-12 rounded-3xl leading-relaxed whitespace-pre-wrap">
                  {selectedApp.coverLetter}
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-bold mb-10 text-gray-900">Resume</h3>
                <a
                  href={`${BACKEND_URL}/uploads/resumes/${selectedApp.resumeFilename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-8 px-20 py-10 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-3xl font-bold text-3xl hover:shadow-3xl transition-all"
                >
                  <Download className="w-14 h-14" />
                  Download Resume
                </a>
              </div>

              <div>
                <h3 className="text-4xl font-bold mb-10 text-gray-900">Update Status</h3>
                <div className="flex gap-12">
                  <button
                    onClick={() => updateApplicationStatus(selectedApp._id, "shortlisted")}
                    disabled={updatingStatus === selectedApp._id}
                    className="px-20 py-12 bg-green-600 text-white rounded-3xl font-bold text-3xl hover:bg-green-700 disabled:opacity-70 transition-all"
                  >
                    Shortlist Candidate
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApp._id, "rejected")}
                    disabled={updatingStatus === selectedApp._id}
                    className="px-20 py-12 bg-red-600 text-white rounded-3xl font-bold text-3xl hover:bg-red-700 disabled:opacity-70 transition-all"
                  >
                    Reject Candidate
                  </button>
                  <button
                    onClick={() => deleteApplication(selectedApp._id)}
                    className="px-20 py-12 bg-gray-600 text-white rounded-3xl font-bold text-3xl hover:bg-gray-700 transition-all"
                  >
                    Delete Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" toastOptions={{ duration: 5000, style: { fontSize: "18px", padding: "20px" } }} />
    </>
  );
}