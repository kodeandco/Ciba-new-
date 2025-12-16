import toast from "react-hot-toast";
import { GraduationCap, MapPin, Calendar, CheckCircle, Trash2 } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

interface Internship {
  _id: string;
  title: string;
  department: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  location?: string;
  duration?: string;
}

interface InternshipCardProps {
  internship: Internship;
  onDelete: () => void;
}

export default function InternshipCard({ internship, onDelete }: InternshipCardProps) {
  const handleDelete = async () => {
    if (!confirm("Delete this internship permanently?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/ciba-jobs/${internship._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Internship Deleted");
        onDelete();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-cyan-100 hover:shadow-2xl transition-shadow">
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{internship.title}</h3>
              <p className="text-lg text-cyan-600 font-semibold mb-3">{internship.department}</p>
              <div className="flex flex-wrap gap-3">
                {internship.location && (
                  <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {internship.location}
                  </span>
                )}
                {internship.duration && (
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {internship.duration}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Description</h4>
              <p className="text-base text-gray-700 leading-relaxed bg-cyan-50 p-4 rounded-xl">
                {internship.description}
              </p>
            </div>

            {internship.responsibilities && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Key Responsibilities</h4>
                <p className="text-base text-gray-700 leading-relaxed bg-teal-50 p-4 rounded-xl">
                  {internship.responsibilities}
                </p>
              </div>
            )}

            {internship.requirements && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Requirements</h4>
                <p className="text-base text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-xl">
                  {internship.requirements}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-2xl font-bold text-sm flex items-center gap-2 border-2 border-green-300">
            <CheckCircle className="w-5 h-5" />
            LIVE
          </span>
          <button
            onClick={handleDelete}
            className="p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}