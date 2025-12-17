import toast from "react-hot-toast";
import { Rocket, Globe, Trash2 } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function StartupCard({ startup, onDelete }: { startup: any; onDelete: () => void }) {
  const handleDelete = async () => {
    if (!confirm("Remove this startup permanently?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/incubated-startups/${startup._id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Startup Removed");
        onDelete();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100 hover:shadow-2xl transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{startup.companyName}</h3>
          <p className="text-base text-purple-600 italic">"{startup.tagline}"</p>
        </div>
      </div>
      {startup.description && (
        <p className="text-sm text-gray-700 mb-4 leading-relaxed bg-purple-50 p-3 rounded-xl">{startup.description}</p>
      )}
      <a
        href={startup.careerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-600 text-sm font-bold hover:underline mb-4"
      >
        <Globe className="w-4 h-4" />
        View Career Page
      </a>
      <button
        onClick={handleDelete}
        className="w-full p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all flex items-center justify-center gap-2 text-sm font-bold"
      >
        <Trash2 className="w-4 h-4" />
        Remove Startup
      </button>
    </div>
  );
}