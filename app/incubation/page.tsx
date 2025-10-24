"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Upload, CheckCircle2, Loader2, Send } from "lucide-react";

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
            setFormData({ ...formData, pitchDeck: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        // WhatsApp notification
        const whatsappMessage = encodeURIComponent(
            `🚀 New Incubation Program Application\n\n` +
            `Founder: ${formData.founderName}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone}\n` +
            `Startup: ${formData.startupName}\n` +
            `Industry: ${formData.industry}\n` +
            `Stage: ${formData.stage}\n` +
            `Team Size: ${formData.teamSize}`
        );

        const cibaWhatsApp = "919876543210";
        window.open(
            `https://wa.me/${cibaWhatsApp}?text=${whatsappMessage}`,
            "_blank"
        );

        setFormSubmitted(true);
        setIsSubmitting(false);
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
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
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
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <Rocket className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Incubation Program Application
                    </h1>
                    <p className="text-gray-600">12 months | Scaling startups</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border-2 rounded-xl shadow-xl p-8 space-y-6"
                >
                    {/* Founder Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
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
                                    className="mt-1 w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Co-Founders (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.coFounders}
                                    onChange={(e) =>
                                        setFormData({ ...formData, coFounders: e.target.value })
                                    }
                                    className="mt-1 w-full border rounded-md p-2"
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
                                    className="mt-1 w-full border rounded-md p-2"
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
                                    className="mt-1 w-full border rounded-md p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Startup Info */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Startup Information
                        </h3>
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
                                className="mt-1 w-full border rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Website / App Link *
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.website}
                                onChange={(e) =>
                                    setFormData({ ...formData, website: e.target.value })
                                }
                                className="mt-1 w-full border rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Describe Your Startup & Growth Strategy *
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="mt-1 w-full border rounded-md p-2"
                                placeholder="Tell us about your startup, traction, challenges, and why you're seeking incubation..."
                            />
                        </div>

                        {/* Pitch Deck Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pitch Deck (PDF) *
                            </label>
                            <label
                                htmlFor="pitchDeck"
                                className="flex items-center justify-center w-full h-32 px-4 mt-2 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-500 focus:outline-none"
                            >
                                <span className="flex items-center space-x-2">
                                    <Upload className="w-6 h-6 text-gray-600" />
                                    <span className="font-medium text-gray-600">
                                        {formData.pitchDeck
                                            ? formData.pitchDeck.name
                                            : "Click to upload or drag and drop (PDF)"}
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
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center justify-center mx-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" /> Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
