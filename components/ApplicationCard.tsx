
"use client"
import { useState } from "react";
import toast from "react-hot-toast";
import { Users, Mail, Phone, Calendar, Download, CheckCircle, XCircle, Clock, Trash2, Building2, GraduationCap, Rocket } from "lucide-react";

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

interface ApplicationCardProps {
  app: Application;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function ApplicationCard({ app, onUpdate, onDelete }: ApplicationCardProps) {
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
        toast.success(status === "shortlisted" ? "Application Shortlisted!" : "Application Rejected");
        onUpdate();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
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
        toast.success("Application deleted!");
        onDelete();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting application");
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}/resume`);
      if (!res.ok) {
        toast.error("Failed to download resume");
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
      toast.success("Resume downloaded!");
    } catch (error) {
      toast.error("Error downloading resume");
      console.error("Download error:", error);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = status || "pending";
    if (s === "pending") {
      return (
        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1 whitespace-nowrap">
          <Clock className="w-3 h-3" />
          PENDING
        </span>
      );
    }
    if (s === "shortlisted") {
      return (
        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 whitespace-nowrap">
          <CheckCircle className="w-3 h-3" />
          SHORTLISTED
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 whitespace-nowrap">
        <XCircle className="w-3 h-3" />
        REJECTED
      </span>
    );
  };

  const getTypeIcon = (type?: string) => {
    if (type === "ciba-job") return <Building2 className="w-6 h-6 text-white" />;
    if (type === "ciba-internship") return <GraduationCap className="w-6 h-6 text-white" />;
    if (type === "startup") return <Rocket className="w-6 h-6 text-white" />;
    return <Users className="w-6 h-6 text-white" />;
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
                <Calendar className="w-3 h-3" />
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
              <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
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
            <Download className="w-4 h-4" />
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
              {deleting ? "Deleting..." : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}