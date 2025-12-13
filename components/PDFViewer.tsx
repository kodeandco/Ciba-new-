"use client"

import { X, Download, ExternalLink } from "lucide-react"

type PDFViewerProps = {
    newsletterId: string
    title: string
    onClose: () => void
}

export default function PDFViewer({ newsletterId, title, onClose }: PDFViewerProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"
    const pdfUrl = `${API_URL}/api/newsletter/${newsletterId}/file`

    const handleDownload = () => {
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = `${title}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleOpenNewTab = () => {
        window.open(pdfUrl, "_blank", "noopener,noreferrer")
    }

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-background rounded-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col animate-scale-in border-2 border-blue-200 dark:border-blue-800 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                    <h2 className="text-lg font-bold text-foreground truncate flex-1 mr-4">
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all"
                            title="Download PDF"
                        >
                            <Download size={20} className="text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                            onClick={handleOpenNewTab}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all"
                            title="Open in new tab"
                        >
                            <ExternalLink size={20} className="text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all"
                            title="Close"
                        >
                            <X size={20} className="text-blue-600 dark:text-blue-400" />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full"
                        title={title}
                        style={{ border: "none" }}
                    />
                </div>

                {/* Fallback message for browsers that don't support iframe PDF viewing */}
                <noscript>
                    <div className="p-4 text-center">
                        <p className="mb-4">Unable to display PDF. Please download it instead.</p>
                        <button
                            onClick={handleDownload}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Download PDF
                        </button>
                    </div>
                </noscript>
            </div>
        </div>
    )
}