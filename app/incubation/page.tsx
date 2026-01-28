"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Upload, CheckCircle2, Loader2, Send } from "lucide-react";
import Navbar from "@/components/navbar";

export default function IncubationProgramApplication() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        founderName: "",
        coFounders: "",
        email: "",
        phone: "",
        startupName: "",
        description: "",
        industry: "",
        stage: "",
        teamSize: "",
        fundingRaised: "",
        revenue: "",
        website: "",
        pitchDeck: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert("File size must be less than 10MB");
                return;
            }

            // Validate file type
            if (file.type !== "application/pdf") {
                alert("Only PDF files are allowed");
                return;
            }

            setFormData({ ...formData, pitchDeck: file });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all required fields
        if (!formData.founderName || !formData.email || !formData.phone ||
            !formData.startupName || !formData.industry || !formData.stage ||
            !formData.teamSize || !formData.fundingRaised || !formData.revenue ||
            !formData.website || !formData.description) {
            alert("Please fill all required fields");
            return;
        }

        if (!formData.pitchDeck) {
            alert("Please upload your pitch deck");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append("founderName", formData.founderName);
            formDataToSend.append("coFounders", formData.coFounders);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("startupName", formData.startupName);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("industry", formData.industry);
            formDataToSend.append("stage", formData.stage);
            formDataToSend.append("teamSize", formData.teamSize);
            formDataToSend.append("fundingRaised", formData.fundingRaised);
            formDataToSend.append("revenue", formData.revenue);
            formDataToSend.append("website", formData.website);
            formDataToSend.append("pitchDeck", formData.pitchDeck);

            const res = await fetch("http://localhost:5000/api/incubation", {
                method: "POST",
                body: formDataToSend,
                // Don't set Content-Type header - let browser set it with boundary
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            if (data.success) {
                setFormSubmitted(true);
            } else {
                throw new Error(data.error || "Failed to submit application");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error instanceof Error ? error.message : "Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (formSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="max-w-2xl w-full text-center p-12 border-2 border-blue-500 shadow-xl rounded-xl bg-white"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                        }}
                        className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-16 h-16 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Application Received!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for applying to the CIBA Incubation Program. Our
                        selection committee will review your application and pitch deck.
                        We'll contact you within 10 business days for the next steps.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-700">
                            Confirmation email sent to <strong>{formData.email}</strong>
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                            Submit Another Application
                        </button>
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="px-6 py-3 rounded-lg text-blue-700 font-medium bg-blue-100 hover:bg-blue-200 transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="inline-block mb-4"
                        >

                        </motion.div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Incubation Program Application
                        </h1>
                        <p className="text-gray-600">24 months | Scaling startups with traction</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white border-2 rounded-xl shadow-xl p-8 space-y-6">
                        {/* Founder Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                                Founder Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Lead Founder Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.founderName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, founderName: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Co-Founders (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Names separated by commas"
                                        value={formData.coFounders}
                                        onChange={(e) =>
                                            setFormData({ ...formData, coFounders: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Startup Info */}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
                                Startup Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Startup Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.startupName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, startupName: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Industry / Sector *
                                    </label>
                                    <select
                                        required
                                        value={formData.industry}
                                        onChange={(e) =>
                                            setFormData({ ...formData, industry: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Industry</option>
                                        <option value="Fintech">Fintech</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="EdTech">EdTech</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="SaaS">SaaS</option>
                                        <option value="AI/ML">AI/ML</option>
                                        <option value="AgriTech">AgriTech</option>
                                        <option value="Clean Energy">Clean Energy</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Current Stage *
                                    </label>
                                    <select
                                        required
                                        value={formData.stage}
                                        onChange={(e) =>
                                            setFormData({ ...formData, stage: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Stage</option>
                                        <option value="MVP Ready">MVP Ready</option>
                                        <option value="Early Revenue">Early Revenue</option>
                                        <option value="Growth Stage">Growth Stage</option>
                                        <option value="Scaling">Scaling</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Team Size *
                                    </label>
                                    <select
                                        required
                                        value={formData.teamSize}
                                        onChange={(e) =>
                                            setFormData({ ...formData, teamSize: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Team Size</option>
                                        <option value="1-5">1-5 members</option>
                                        <option value="6-10">6-10 members</option>
                                        <option value="11-20">11-20 members</option>
                                        <option value="20+">20+ members</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Funding Raised So Far *
                                    </label>
                                    <select
                                        required
                                        value={formData.fundingRaised}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fundingRaised: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Amount</option>
                                        <option value="Bootstrapped">Bootstrapped (₹0)</option>
                                        <option value="<10L">Less than ₹10 Lakhs</option>
                                        <option value="10L-50L">₹10 Lakhs - ₹50 Lakhs</option>
                                        <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                                        <option value=">1Cr">More than ₹1 Crore</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Monthly Revenue *
                                    </label>
                                    <select
                                        required
                                        value={formData.revenue}
                                        onChange={(e) =>
                                            setFormData({ ...formData, revenue: e.target.value })
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Revenue</option>
                                        <option value="Pre-revenue">Pre-revenue (₹0)</option>
                                        <option value="<1L">Less than ₹1 Lakh</option>
                                        <option value="1L-5L">₹1 Lakh - ₹5 Lakhs</option>
                                        <option value="5L-10L">₹5 Lakhs - ₹10 Lakhs</option>
                                        <option value=">10L">More than ₹10 Lakhs</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Website / App Link *
                                </label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://yourwebsite.com"
                                    value={formData.website}
                                    onChange={(e) =>
                                        setFormData({ ...formData, website: e.target.value })
                                    }
                                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Describe Your Startup, Traction & Growth Strategy *
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Tell us about your startup, current traction (users/customers), key challenges, and why you're seeking incubation..."
                                />
                            </div>

                            {/* Pitch Deck Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pitch Deck (PDF) *
                                </label>
                                <label
                                    htmlFor="pitchDeck"
                                    className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-500 focus:outline-none"
                                >
                                    <span className="flex items-center space-x-2">
                                        <Upload className="w-6 h-6 text-gray-600" />
                                        <span className="font-medium text-gray-600">
                                            {formData.pitchDeck
                                                ? `✓ ${formData.pitchDeck.name}`
                                                : "Click to upload pitch deck (PDF, max 10MB)"}
                                        </span>
                                    </span>
                                    <input
                                        id="pitchDeck"
                                        type="file"
                                        accept=".pdf"
                                        required
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                {formData.pitchDeck && (
                                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                        File selected: {formData.pitchDeck.name} ({(formData.pitchDeck.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto transition-all hover:scale-105 shadow-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting Application...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" /> Submit Application
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-500 mt-3">
                                By submitting, you agree to our terms and conditions
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
}