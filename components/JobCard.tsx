import toast from "react-hot-toast";
import { Building2, MapPin, DollarSign, CheckCircle, Trash2 } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function JobCard({ job, onDelete }: { job: any; onDelete: () => void }) {
  const handleDelete = async () => {
    if (!confirm("Delete this position permanently?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/ciba-jobs/${job._id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted Successfully");
        onDelete();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 hover:shadow-2xl transition-shadow">
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-lg text-blue-600 font-semibold mb-3">{job.department}</p>
              <div className="flex flex-wrap gap-2">
                {job.location && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Description</h4>
              <p className="text-base text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl">{job.description}</p>
            </div>
            {job.responsibilities && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Responsibilities</h4>
                <p className="text-base text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-xl">{job.responsibilities}</p>
              </div>
            )}
            {job.requirements && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Requirements</h4>
                <p className="text-base text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-xl">{job.requirements}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-2xl font-bold text-sm flex items-center gap-2 border-2 border-green-300">
            <CheckCircle className="w-5 h-5" />
            LIVE
          </span>
          <button onClick={handleDelete} className="p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}