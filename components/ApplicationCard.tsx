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
        toast.success(status === "shortlisted" ? "Shortlisted!" : "Rejected!", {
          style: { background: "#1e40af", color: "white", borderRadius: "12px" }
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
        toast.success("Deleted", { style: { background: "#1e40af", color: "white" } });
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
      pending: { bg: "bg-blue-50", text: "text-blue-800", icon: Clock },
      shortlisted: { bg: "bg-green-50", text: "text-green-800", icon: CheckCircle },
      rejected: { bg: "bg-red-50", text: "text-red-800", icon: XCircle },
    };
    const { bg, text, icon: Icon } = config[s as keyof typeof config];
    return (
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${bg} ${text} border border-blue-200`}>
        <Icon className="w-4 h-4" />
        {s.toUpperCase()}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const config = {
      "ciba-job": { bg: "bg-blue-100", text: "text-blue-800", label: "CIBA Job" },
      "ciba-internship": { bg: "bg-indigo-100", text: "text-indigo-800", label: "CIBA Internship" },
      startup: { bg: "bg-purple-100", text: "text-purple-800", label: "Startup" },
    };
    const { bg, text, label } = config[type as keyof typeof config] || config["ciba-job"];
    return <span className={`px-3 py-1 rounded-full text-sm font-bold ${bg} ${text}`}>{label}</span>;
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100 
                    hover:shadow-2xl hover:border-blue-300 transition-all duration-300 group">
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{app.fullName}</h3>
              <p className="text-lg text-blue-700 font-semibold mb-3">Applied for: {app.positionTitle}</p>
              <div className="flex items-center gap-4 flex-wrap">
                {getTypeBadge(app.positionType)}
                <span className="text-sm text-blue-600 flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-blue-800 bg-blue-50/50 p-4 rounded-2xl hover:bg-blue-100 transition-colors">
              <Mail className="w-5 h-5 text-blue-600" />
              {app.email}
            </div>
            <div className="flex items-center gap-3 text-blue-800 bg-blue-50/50 p-4 rounded-2xl hover:bg-blue-100 transition-colors">
              <Phone className="w-5 h-5 text-blue-600" />
              {app.phone}
            </div>
          </div>

          <p className="text-base text-blue-800 bg-blue-50/30 p-5 rounded-2xl leading-relaxed line-clamp-3 mb-6">
            {app.coverLetter}
          </p>

          <a
            href={`${BACKEND_URL}/api/applications/${app._id}/resume`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold text-sm hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </a>
        </div>

        <div className="flex flex-col items-end gap-4">
          {getStatusBadge(app.status)}
          <div className="flex flex-col gap-3 w-44">
            <button
              onClick={() => updateStatus("shortlisted")}
              disabled={updating}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-60 shadow-md hover:shadow-lg"
            >
              Shortlist
            </button>
            <button
              onClick={() => updateStatus("rejected")}
              disabled={updating}
              className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:opacity-60 shadow-md hover:shadow-lg"
            >
              Reject
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all shadow-md hover:shadow-lg"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}