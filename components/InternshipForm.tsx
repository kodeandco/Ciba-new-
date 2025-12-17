import { useState } from "react";
import toast from "react-hot-toast";
import { GraduationCap } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

interface InternshipFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function InternshipForm({ onClose, onSuccess }: InternshipFormProps) {
  const [form, setForm] = useState({
    title: "",
    department: "",
    description: "",
    responsibilities: "",
    requirements: "",
    location: "Mumbai, India",
    duration: "3-6 months",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.department || !form.description) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/ciba-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "internship" }),
      });

      if (res.ok) {
        toast.success("Internship Added Successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to add internship");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        Add New Internship
      </h3>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Internship Title <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Software Development Intern"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Department <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="e.g. Engineering, Design, Marketing"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Mumbai, India (or Remote)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g. 3-6 months"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Internship Description <span className="text-blue-600">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            placeholder="Provide a brief overview of the internship role and what the intern will work on..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Key Responsibilities</label>
          <textarea
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            rows={4}
            placeholder="List key tasks and responsibilities..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Requirements & Qualifications</label>
          <textarea
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            rows={4}
            placeholder="Required skills, year of study, qualifications..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Publishing..." : "Publish Internship"}
          </button>

          <button
            onClick={onClose}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}