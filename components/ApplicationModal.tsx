"use client";

import { useState } from "react";
import Button from "./Button";

interface Position {
  _id: string;  // ✅ Changed from id: number
  title: string;
  department: string;
  type?: string;
  duration?: string;
  description?: string;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position | null;
}

export default function ApplicationModal({ isOpen, onClose, position }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    linkedIn: "",
    portfolio: ""
  });

  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      setSubmitError("Please upload a PDF, DOC, or DOCX file");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setResume(file);
    setSubmitError(null);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      linkedIn: "",
      portfolio: ""
    });
    setResume(null);
    const fileInput = document.getElementById("resume") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!position || !resume) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const data = new FormData();
      data.append("positionId", position._id);  // ✅ Changed from position.id.toString()
      data.append("positionTitle", position.title);
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("coverLetter", formData.coverLetter);
      data.append("linkedIn", formData.linkedIn);
      data.append("portfolio", formData.portfolio);
      data.append("resume", resume);

      console.log("🚀 Sending application for position:", position._id);

      const response = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        body: data
      });

      console.log("📡 Response Status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Got HTML instead of JSON:", text.substring(0, 500));
        throw new Error("Server returned an error. Please check backend console.");
      }

      const result = await response.json();
      console.log("📦 Response data:", result);

      if (result.success || result.message) {
        setSubmitSuccess(result.message || "Application submitted successfully!");
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2500);
      } else {
        setSubmitError(result.error || "Failed to submit application");
      }

    } catch (error) {
      console.error("❌ Error:", error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : "Network error. Please check if backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !position) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Apply for {position.title}</h3>
              <p className="text-gray-600 mt-1">{position.department}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitError && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-800">Submission Failed</p>
                <p className="text-red-700 text-sm mt-1">{submitError}</p>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="font-semibold text-green-800">Success!</p>
                <p className="text-green-700 text-sm mt-1">{submitSuccess}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="John Doe"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+91 98765 43210"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              required
              disabled={isSubmitting}
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 disabled:bg-gray-100"
            />
            {resume && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-600 text-xl">📄</span>
                <p className="text-green-600 text-sm font-medium">{resume.name}</p>
              </div>
            )}
            <p className="text-gray-500 text-xs mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              required
              placeholder="Tell us why you're a great fit for this role..."
              disabled={isSubmitting}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !resume}
              className="flex-1"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}