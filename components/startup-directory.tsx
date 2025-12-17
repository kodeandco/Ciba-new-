"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import StartupSubmissionModal from "./StartupSubmissionModal";

interface Startup {
    _id: string;
    companyName: string;
    tagline: string;
    careerUrl: string;
    createdAt?: string;
}

const BACKEND_URL = "http://localhost:5000";

export default function StartupDirectory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `${BACKEND_URL}/api/admin/incubated-startups`
                );

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = await res.json();
                console.log("✅ Startups loaded:", data);

                setStartups(Array.isArray(data.startups) ? data.startups : []);
            } catch (err) {
                console.error("❌ Startup fetch failed:", err);
                setError("Failed to load startups. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStartups();
    }, []);

    if (loading) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-20 text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
                <p className="mt-4 text-gray-600">Loading startups...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-20 text-center">
                <p className="text-red-600">{error}</p>
            </section>
        );
    }

    return (
        <>
            <section className="max-w-6xl mx-auto px-4 py-20">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                        Opportunities at Our Incubated Startups
                    </h2>
                    <p className="text-gray-600">
                        Explore career opportunities at innovative startups backed by CIBA
                    </p>
                </div>

                {startups.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No startups listed yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {startups.map((startup) => (
                            <div
                                key={startup._id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-md transition-all"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {startup.companyName}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {startup.tagline}
                                </p>

                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() =>
                                        window.open(
                                            startup.careerUrl,
                                            "_blank",
                                            "noopener,noreferrer"
                                        )
                                    }
                                >
                                    View Openings
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-blue-50 border border-gray-200 rounded-xl p-10 text-center">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">
                        Are You an Incubated Startup?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        List your job openings and reach talent from the CIBA ecosystem
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Submit Your Openings
                    </Button>
                </div>
            </section>

            <StartupSubmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
