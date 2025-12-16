import { useState } from "react";
import toast from "react-hot-toast";
import { Users, Mail, Phone, Calendar, Download, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function ApplicationCard({ app, onUpdate, onDelete }: { app: any; onUpdate: () => void; onDelete: () => void }) {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status: "shortlisted" | "rejected") => {
    setUpdating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(status === "shortlisted" ? "Shortlisted!" : "Rejected");
        await fetch(`${BACKEND_URL}/api/applications/${app._id}/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        onUpdate();
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this application permanently?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/${app._id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Application Deleted");
        onDelete();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = status || "pending";
    const config = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      shortlisted: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };
    const { bg, text, icon: Icon } = config[s as keyof typeof config];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
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
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>{label}</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:shadow-2xl transition-shadow">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{app.fullName}</h3>
              <p className="text-base text-green-600 font-semibold mb-2">Applied for: {app.positionTitle}</p>
              <div className="flex items-center gap-3">
                {getTypeBadge(app.positionType)}
                <span className="text-xs text-gray-600">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600" />
              {app.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-600" />
              {app.phone}
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-800 bg-gray-50 p-3 rounded-xl leading-relaxed line-clamp-3">{app.coverLetter}</p>
          <a
            href={`${BACKEND_URL}/uploads/resumes/${app.resumeFilename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </a>
        </div>
        <div className="flex flex-col items-end gap-3">
          {getStatusBadge(app.status)}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => updateStatus("shortlisted")}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700 transition-all disabled:opacity-50"
            >
              Shortlist
            </button>
            <button
              onClick={() => updateStatus("rejected")}
              disabled={updating}
              className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}