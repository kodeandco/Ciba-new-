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
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{internship.title}</h3>
              <p className="text-lg text-blue-600 font-semibold mb-3">{internship.department}</p>
              <div className="flex flex-wrap gap-3">
                {internship.location && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {internship.location}
                  </span>
                )}
                {internship.duration && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {internship.duration}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                Description
              </h4>
              <p className="text-base text-gray-700 leading-relaxed bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                {internship.description}
              </p>
            </div>

            {internship.responsibilities && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                  Key Responsibilities
                </h4>
                <p className="text-base text-gray-700 leading-relaxed bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  {internship.responsibilities}
                </p>
              </div>
            )}

            {internship.requirements && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                  Requirements
                </h4>
                <p className="text-base text-gray-700 leading-relaxed bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  {internship.requirements}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm flex items-center gap-2 border border-blue-200">
            <CheckCircle className="w-5 h-5" />
            LIVE
          </span>
          <button
            onClick={handleDelete}
            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}