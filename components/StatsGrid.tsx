import { Building2, GraduationCap, Rocket, Mail, Clock, CheckCircle, XCircle } from "lucide-react";

export default function StatsGrid({ data }: { data: any }) {
  const stats = [
    { label: "CIBA Jobs", value: data.cibaJobs, icon: Building2, color: "blue" },
    { label: "Internships", value: data.cibaInternships, icon: GraduationCap, color: "cyan" },
    { label: "Startups", value: data.startups, icon: Rocket, color: "purple" },
    { label: "Total Apps", value: data.totalApps, icon: Mail, color: "indigo" },
    { label: "Pending", value: data.pendingApps, icon: Clock, color: "yellow" },
    { label: "Shortlisted", value: data.shortlisted, icon: CheckCircle, color: "green" },
    { label: "Rejected", value: data.rejected, icon: XCircle, color: "red" },
  ];

  const colorMap: Record<string, { border: string; text: string; bg: string }> = {
    blue: { border: "border-blue-200", text: "text-blue-600", bg: "bg-blue-50" },
    cyan: { border: "border-cyan-200", text: "text-cyan-600", bg: "bg-cyan-50" },
    purple: { border: "border-purple-200", text: "text-purple-600", bg: "bg-purple-50" },
    indigo: { border: "border-indigo-200", text: "text-indigo-600", bg: "bg-indigo-50" },
    yellow: { border: "border-yellow-200", text: "text-yellow-600", bg: "bg-yellow-50" },
    green: { border: "border-green-200", text: "text-green-600", bg: "bg-green-50" },
    red: { border: "border-red-200", text: "text-red-600", bg: "bg-red-50" },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = colorMap[stat.color];
        return (
          <div
            key={stat.label}
            className={`bg-white rounded-2xl p-4 shadow-lg border-2 ${colors.border} hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${colors.text}`} />
              <p className={`text-sm font-bold ${colors.text}`}>{stat.label}</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}