import { useState } from "react";
import toast from "react-hot-toast";
import { Building2, Plus } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function JobForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: "",
    department: "",
    description: "",
    responsibilities: "",
    requirements: "",
    location: "Mumbai, India",
    salary: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.department || !form.description) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/ciba-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "job" }),
      });
      if (res.ok) {
        toast.success("Job Added Successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to add job");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-100">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
        <Building2 className="w-8 h-8 text-blue-600" />
        Add New CIBA Job
      </h3>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Job Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior Product Manager"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Department *</label>
            <input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="e.g. Product, Engineering"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Mumbai, India"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Salary Range</label>
            <input
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              placeholder="e.g. ₹15-25 LPA"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Job Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Brief overview of the role..."
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Key Responsibilities</label>
          <textarea
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            rows={4}
            placeholder="List key responsibilities..."
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Requirements & Qualifications</label>
          <textarea
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            rows={4}
            placeholder="Required skills, experience, qualifications..."
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {submitting ? "Publishing..." : "Publish Job Position"}
        </button>
      </div>
    </div>
  );
}