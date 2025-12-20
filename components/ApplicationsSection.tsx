"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  Building2,
  GraduationCap,
  Rocket,
  AlertCircle,
  Phone,
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Briefcase,
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  positionTitle: string;
  positionType?: "ciba-job" | "ciba-internship" | "startup" | string;
  coverLetter?: string;
  status?: "pending" | "shortlisted" | "rejected";
  createdAt?: string;
  isJobPosting?: boolean;
  jobDetails?: {
    companyName?: string;
    jobType?: string;
    department?: string;
    location?: string;
    salary?: string;
  };
}

interface StartupSubmission {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  jobTitle: string;
  jobType: string;
  department: string;
  location: string;
  salary?: string;
  jobDescription: string;
  requirements: string;
  benefits?: string;
  status: string;
  createdAt: string;
}

function convertStartupToApplication(startup: StartupSubmission): Application {
  return {
    _id: startup._id,
    fullName: startup.contactPerson,
    email: startup.email,
    phone: startup.phone,
    positionTitle: `${startup.jobTitle} at ${startup.companyName}`,
    positionType: "startup",
    coverLetter: startup.jobDescription,
    status: startup.status === "approved" ? "shortlisted" : startup.status === "rejected" ? "rejected" : "pending",
    createdAt: startup.createdAt,
    isJobPosting: true,
    jobDetails: {
      companyName: startup.companyName,
      jobType: startup.jobType,
      department: startup.department,
      location: startup.location,
      salary: startup.salary,
    },
  };
}

// ApplicationCard Component
function ApplicationCard({
  app,
  onUpdate,
  onDelete,
}: {
  app: Application;
  onUpdate: () => void;
  onDelete: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateStatus = async (status: "shortlisted" | "rejected") => {
    setUpdating(true);
    try {
      const endpoint =
        app.positionType === "startup"
          ? `${BACKEND_URL}/api/startups/${app._id}/status`
          : `${BACKEND_URL}/api/applications/${app._id}/status`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(status === "shortlisted" ? "✅ Approved!" : "❌ Rejected");
        onUpdate();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      alert("Error updating status");
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${app.isJobPosting ? "job posting" : "application"} from ${app.fullName}?`)) return;

    setDeleting(true);
    try {
      const endpoint =
        app.positionType === "startup"
          ? `${BACKEND_URL}/api/startups/${app._id}`
          : `${BACKEND_URL}/api/applications/${app._id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Deleted successfully!");
        onDelete();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      alert("Error deleting");
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (app.isJobPosting) {
      alert("This is a job posting, not an application. No resume available.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}/resume`);
      if (!res.ok) {
        alert("Failed to download resume");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${app.fullName.replace(/\s+/g, "_")}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      alert("✅ Resume downloaded!");
    } catch (error) {
      alert("Error downloading resume");
      console.error("Download error:", error);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = status || "pending";
    if (s === "pending") {
      return (
        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          PENDING
        </span>
      );
    }
    if (s === "shortlisted") {
      return (
        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-800 border border-green-300 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          APPROVED
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        REJECTED
      </span>
    );
  };

  const getTypeIcon = (type?: string) => {
    if (type === "ciba-job") return <Building2 className="w-6 h-6 text-white" />;
    if (type === "ciba-internship") return <GraduationCap className="w-6 h-6 text-white" />;
    if (type === "startup") return <Rocket className="w-6 h-6 text-white" />;
    return <Mail className="w-6 h-6 text-white" />;
  };

  const getTypeBgColor = (type?: string) => {
    if (type === "ciba-job") return "bg-blue-600";
    if (type === "ciba-internship") return "bg-purple-600";
    if (type === "startup") return "bg-orange-600";
    return "bg-gray-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 ${getTypeBgColor(app.positionType)} rounded-lg flex items-center justify-center`}>
              {getTypeIcon(app.positionType)}
            </div>
            <div className="flex-1">
              {app.isJobPosting && (
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded mb-2">
                  JOB POSTING
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900">{app.fullName}</h3>
              <p className="text-base text-blue-600 font-medium mt-1">
                {app.isJobPosting ? "Job: " : "Applied for: "}
                {app.positionTitle}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <Calendar className="w-4 h-4" />
                {app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "No Date"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{app.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{app.phone || "Not provided"}</span>
            </div>
          </div>

          {app.jobDetails && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><strong>Company:</strong> {app.jobDetails.companyName}</div>
                <div><strong>Type:</strong> {app.jobDetails.jobType}</div>
                <div><strong>Department:</strong> {app.jobDetails.department}</div>
                <div><strong>Location:</strong> {app.jobDetails.location}</div>
                {app.jobDetails.salary && (
                  <div className="col-span-2"><strong>Salary:</strong> {app.jobDetails.salary}</div>
                )}
              </div>
            </div>
          )}

          {app.coverLetter && (
            <div className="mt-4">
              <p className="font-semibold text-gray-700">Description:</p>
              <p className="text-gray-600 mt-1 line-clamp-3">{app.coverLetter}</p>
            </div>
          )}

          <div className="mt-6">
            {!app.isJobPosting ? (
              <button
                onClick={handleDownload}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </button>
            ) : (
              <div className="text-gray-500 italic flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job Posting — No resume attached
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 min-w-[160px]">
          {getStatusBadge(app.status)}

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => updateStatus("shortlisted")}
              disabled={updating || deleting || app.status === "shortlisted"}
              className="w-full px-5 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : app.isJobPosting ? "Approve" : "Shortlist"}
            </button>

            <button
              onClick={() => updateStatus("rejected")}
              disabled={updating || deleting || app.status === "rejected"}
              className="w-full px-5 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Reject"}
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting || updating}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
              title="Delete"
            >
              {deleting ? "Deleting..." : <Trash2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
interface ApplicationsSectionProps {
  applications: Application[];
  onRefetch: () => void;
}

export default function ApplicationsSection({ applications, onRefetch }: ApplicationsSectionProps) {
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchAllApplications();
  }, [applications]);

  const fetchAllApplications = async () => {
    setLoading(true);
    try {
      const startupsResponse = await fetch(`${BACKEND_URL}/api/startups`);
      const startupsData = await startupsResponse.json();

      const startupSubmissions = Array.isArray(startupsData.submissions)
        ? startupsData.submissions.map(convertStartupToApplication)
        : Array.isArray(startupsData)
        ? startupsData.map(convertStartupToApplication)
        : [];

      const combined = [...applications, ...startupSubmissions];
      setAllApplications(combined);
    } catch (err) {
      console.error("Error fetching startup data:", err);
      setAllApplications(applications);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = allApplications.filter((app) => {
    if (!app) return false;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (app.fullName || "").toLowerCase().includes(searchLower) ||
      (app.positionTitle || "").toLowerCase().includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || (app.status || "pending") === statusFilter;
    const matchesType = typeFilter === "all" || app.positionType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const jobApps = filteredApps.filter((a) => a.positionType === "ciba-job");
  const internshipApps = filteredApps.filter((a) => a.positionType === "ciba-internship");
  const startupApps = filteredApps.filter((a) => a.positionType === "startup");
  const unknownApps = filteredApps.filter(
    (a) =>
      !a.positionType ||
      !["ciba-job", "ciba-internship", "startup"].includes(a.positionType)
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="space-y-10">
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search by name, job title, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white"
            >
              <option value="all">All Types</option>
              <option value="ciba-job">CIBA Jobs</option>
              <option value="ciba-internship">CIBA Internships</option>
              <option value="startup">Startup Postings</option>
            </select>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-gray-700 font-medium">
            Showing <span className="text-blue-600 font-bold text-xl">{filteredApps.length}</span> items
          </p>
          {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
            <button onClick={clearFilters} className="text-blue-600 hover:underline font-medium">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* No Data */}
      {allApplications.length === 0 && !loading && (
        <div className="text-center py-20">
          <AlertCircle className="w-20 h-20 text-orange-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Applications Found</h3>
          <p className="text-gray-600">Check your backend or wait for submissions.</p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-16">
        {jobApps.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <Building2 className="w-10 h-10 text-blue-600" />
              CIBA Job Applications ({jobApps.length})
            </h2>
            <div className="space-y-8">
              {jobApps.map((app) => (
                <ApplicationCard key={app._id} app={app} onUpdate={fetchAllApplications} onDelete={fetchAllApplications} />
              ))}
            </div>
          </section>
        )}

        {internshipApps.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <GraduationCap className="w-10 h-10 text-purple-600" />
              CIBA Internship Applications ({internshipApps.length})
            </h2>
            <div className="space-y-8">
              {internshipApps.map((app) => (
                <ApplicationCard key={app._id} app={app} onUpdate={fetchAllApplications} onDelete={fetchAllApplications} />
              ))}
            </div>
          </section>
        )}

        {startupApps.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <Rocket className="w-10 h-10 text-orange-600" />
              Startup Job Postings ({startupApps.length})
            </h2>
            <div className="space-y-8">
              {startupApps.map((app) => (
                <ApplicationCard key={app._id} app={app} onUpdate={fetchAllApplications} onDelete={fetchAllApplications} />
              ))}
            </div>
          </section>
        )}

        {unknownApps.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <Mail className="w-10 h-10 text-gray-600" />
              Other Applications ({unknownApps.length})
            </h2>
            <div className="space-y-8">
              {unknownApps.map((app) => (
                <ApplicationCard key={app._id} app={app} onUpdate={fetchAllApplications} onDelete={fetchAllApplications} />
              ))}
            </div>
          </section>
        )}

        {filteredApps.length === 0 && allApplications.length > 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <Mail className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 mb-4">No matching results</h3>
            <button
              onClick={clearFilters}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}