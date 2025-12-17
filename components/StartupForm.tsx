import { useState } from "react";
import toast from "react-hot-toast";
import { Rocket } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

interface StartupFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function StartupForm({ onClose, onSuccess }: StartupFormProps) {
  const [form, setForm] = useState({
    companyName: "",
    tagline: "",
    careerUrl: "",
    description: "",
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.companyName || !form.tagline || !form.careerUrl) {
      toast.error("Please fill all required fields");
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
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        Add Incubated Startup
      </h3>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Company Name <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="e.g. TechVenture AI"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Short Tagline <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="e.g. Revolutionizing AI for enterprises"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Career Page URL <span className="text-blue-600">*</span>
          </label>
          <input
            type="url"
            value={form.careerUrl}
            onChange={(e) => setForm({ ...form, careerUrl: e.target.value })}
            placeholder="https://company.com/careers"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Brief description of the startup and what they do..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white hover:border-blue-300"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding..." : "Add to Directory"}
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