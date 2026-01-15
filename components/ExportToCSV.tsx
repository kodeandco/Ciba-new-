import { Download } from "lucide-react";

interface CSVColumn<T> {
    header: string;
    accessor: (item: T) => string | number | boolean;
}

interface ExportToCSVProps<T> {
    data: T[];
    columns: CSVColumn<T>[];
    filename?: string;
    buttonText?: string;
    className?: string;
    variant?: "primary" | "secondary" | "outline";
}

export default function ExportToCSV<T>({
    data,
    columns,
    filename,
    buttonText = "Export to CSV",
    className = "",
    variant = "primary",
}: ExportToCSVProps<T>) {
    const handleExport = () => {
        const headers = columns.map((col) => col.header);

        const rows = data.map((item) =>
            columns.map((col) => {
                const value = col.accessor(item);
                return value !== null && value !== undefined ? String(value) : "";
            })
        );

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        const defaultFilename = `export_${new Date().toISOString().split("T")[0]
            }.csv`;

        link.setAttribute("href", url);
        link.setAttribute("download", filename || defaultFilename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getButtonStyles = () => {
        const baseStyles =
            "px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed";

        const variantStyles = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
            outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        };

        return `${baseStyles} ${variantStyles[variant]} ${className}`;
    };

    return (
        <button
            onClick={handleExport}
            disabled={data.length === 0}
            className={getButtonStyles()}
            title={data.length === 0 ? "No data to export" : "Export to CSV"}
        >
            <Download className="w-5 h-5" />
            {buttonText}
        </button>
    );
}