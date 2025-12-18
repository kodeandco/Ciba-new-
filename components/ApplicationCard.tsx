import { useState } from "react";
import toast from "react-hot-toast";
import { Users, Mail, Phone, Calendar, Download, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function ApplicationCard({ app, onUpdate, onDelete }: { app: any; onUpdate: () => void; onDelete: () => void }) {
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
        toast.success(status === "shortlisted" ? "Shortlisted!" : "Rejected");
        onUpdate();
      } else {
        toast.error(data.error || "Failed");
      }
    } catch {
      toast.error("Error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this application?")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}`, { 
        method: "DELETE"
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("Deleted!");
        onDelete();
      } else {
        toast.error(data.error || "Failed");
      }
    } catch {
      toast.error("Error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}/resume`);
      if (!res.ok) {
        toast.error("Download failed");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app.fullName}_resume.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    } catch {
      toast.error("Error");
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
          SHORTLISTED
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

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{app.fullName}</h3>
              <p className="text-sm text-blue-600 font-medium">Applied for: {app.positionTitle}</p>
              <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {new Date(app.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-blue-600" />
              {app.email}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-blue-600" />
              {app.phone}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.coverLetter}</p>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </button>
        </div>

        <div className="flex flex-col items-end gap-3">
          {getStatusBadge(app.status)}
          
          <div className="flex flex-col gap-2 w-32">
            <button
              onClick={() => updateStatus("shortlisted")}
              disabled={updating || deleting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {updating ? "..." : "Shortlist"}
            </button>
            
            <button
              onClick={() => updateStatus("rejected")}
              disabled={updating || deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {updating ? "..." : "Reject"}
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
            >
              {deleting ? "..." : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}