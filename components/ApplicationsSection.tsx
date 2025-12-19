"use client"


import { useState } from "react";
import { Search, Mail, Building2, GraduationCap, Rocket, AlertCircle } from "lucide-react";

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
}

interface ApplicationsSectionProps {
  applications: Application[];
  onRefetch: () => void;
}

// ApplicationCard component (embedded)
function ApplicationCard({ app, onUpdate, onDelete }: { app: Application; onUpdate: () => void; onDelete: () => void }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateStatus = async (status: "shortlisted" | "rejected") => {
    setUpdating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert(status === "shortlisted" ? "Application Shortlisted!" : "Application Rejected");
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
    if (!confirm(`Delete application from ${app.fullName}?`)) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}`, { 
        method: "DELETE"
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert("Application deleted!");
        onDelete();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      alert("Error deleting application");
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}/resume`);
      if (!res.ok) {
        alert("Failed to download resume");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app.fullName.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      alert("Resume downloaded!");
    } catch (error) {
      alert("Error downloading resume");
      console.error("Download error:", error);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = status || "pending";
    if (s === "pending") {
      return (
        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1 whitespace-nowrap">
          PENDING
        </span>
      );
    }
    if (s === "shortlisted") {
      return (
        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 whitespace-nowrap">
          SHORTLISTED
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 whitespace-nowrap">
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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 ${getTypeBgColor(app.positionType)} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {getTypeIcon(app.positionType)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">{app.fullName || "No Name"}</h3>
              <p className="text-sm text-blue-600 font-medium truncate">
                Applied for: {app.positionTitle || "Position Not Specified"}
              </p>
              <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'No Date'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-700 min-w-0">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="truncate">{app.email || "No Email"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>📞</span>
              <span>{app.phone || "Not provided"}</span>
            </div>
          </div>

          {app.coverLetter && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-3">{app.coverLetter}</p>
            </div>
          )}

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Download Resume
          </button>
        </div>

        <div className="flex flex-col items-end gap-3 lg:min-w-[140px]">
          {getStatusBadge(app.status)}
          
          <div className="flex flex-col gap-2 w-full lg:w-36">
            <button
              onClick={() => updateStatus("shortlisted")}
              disabled={updating || deleting || app.status === "shortlisted"}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updating ? "Updating..." : "Shortlist"}
            </button>
            
            <button
              onClick={() => updateStatus("rejected")}
              disabled={updating || deleting || app.status === "rejected"}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updating ? "Updating..." : "Reject"}
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleting || updating}
              className="w-full p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="Delete application"
            >
              {deleting ? "Deleting..." : "🗑️"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsSection({ applications = [], onRefetch }: ApplicationsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Safe filtering with proper null/undefined checks
  const filteredApps = applications.filter((app) => {
    if (!app) return false;
    
    const fullName = (app.fullName || '').toLowerCase();
    const positionTitle = (app.positionTitle || '').toLowerCase();
    const email = (app.email || '').toLowerCase();
    const status = app.status || 'pending';
    const positionType = app.positionType || '';

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      positionTitle.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    const matchesType = typeFilter === "all" || positionType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Categorize applications - handle missing positionType
  const jobApps = filteredApps.filter((a) => a.positionType === "ciba-job");
  const internshipApps = filteredApps.filter((a) => a.positionType === "ciba-internship");
  const startupApps = filteredApps.filter((a) => a.positionType === "startup");
  const unknownApps = filteredApps.filter((a) => !a.positionType || (
    a.positionType !== "ciba-job" && 
    a.positionType !== "ciba-internship" && 
    a.positionType !== "startup"
  ));

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  // Debug logging
  console.log("Total applications:", applications.length);
  console.log("Filtered applications:", filteredApps.length);
  console.log("Jobs:", jobApps.length, "Internships:", internshipApps.length, "Startups:", startupApps.length, "Unknown:", unknownApps.length);
  console.log("Type Filter:", typeFilter);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, position, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="ciba-job">CIBA Job</option>
              <option value="ciba-internship">CIBA Internship</option>
              <option value="startup">Startup</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredApps.length}</span> of {applications.length} applications
          </p>
          {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Warning if no applications loaded */}
      {applications.length === 0 && (
        <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-orange-900 mb-2">No Applications Loaded</h3>
              <p className="text-sm text-orange-800 mb-2">
                Check your backend API and ensure applications are being fetched correctly.
              </p>
              <p className="text-sm text-orange-800">
                Backend URL: <code className="bg-orange-100 px-1 rounded">http://localhost:5000</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Application Lists */}
      {applications.length > 0 && (
        <>
          {/* CIBA Job Applications */}
          {jobApps.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                CIBA Job Applications ({jobApps.length})
              </h2>
              <div className="space-y-4">
                {jobApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                ))}
              </div>
            </div>
          )}
          
          {/* CIBA Internship Applications */}
          {internshipApps.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                CIBA Internship Applications ({internshipApps.length})
              </h2>
              <div className="space-y-4">
                {internshipApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                ))}
              </div>
            </div>
          )}
          
          {/* Startup Applications */}
          {startupApps.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-600" />
                Startup Applications ({startupApps.length})
              </h2>
              <div className="space-y-4">
                {startupApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                ))}
              </div>
            </div>
          )}
          
          {/* Other/Unknown Applications */}
          {unknownApps.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-600" />
                Other Applications ({unknownApps.length})
              </h2>
              <div className="space-y-4">
                {unknownApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                ))}
              </div>
            </div>
          )}
          
          {/* No results after filtering */}
          {filteredApps.length === 0 && applications.length > 0 && (
            <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg text-gray-500 mb-2">No applications match your filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}