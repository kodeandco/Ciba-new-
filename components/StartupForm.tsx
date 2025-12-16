import { useState } from "react";
import toast from "react-hot-toast";
import { Rocket } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function StartupForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    companyName: "",
    tagline: "",
    careerUrl: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.companyName || !form.tagline || !form.careerUrl) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/incubated-startups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Startup Added to Directory!");
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to add startup");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-100">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
        <Rocket className="w-8 h-8 text-purple-600" />
        Add Incubated Startup
      </h3>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Company Name *</label>
            <input
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="e.g. TechVenture AI"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Short Tagline *</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="e.g. Revolutionizing AI for enterprises"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Career Page URL *</label>
          <input
            value={form.careerUrl}
            onChange={(e) => setForm({ ...form, careerUrl: e.target.value })}
            placeholder="https://company.com/careers"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Brief description of the startup..."
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-700 text-white py-3 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add to Directory"}
        </button>
      </div>
    </div>
  );
}