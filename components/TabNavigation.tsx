import { Building2, GraduationCap, Rocket, Mail, Plus } from "lucide-react";

export default function TabNavigation({ activeTab, onTabChange, pendingCount }: {
  activeTab: "jobs" | "internships" | "startups" | "applications";
  onTabChange: (tab: "jobs" | "internships" | "startups" | "applications") => void;
  pendingCount: number;
}) {
  const tabs: { id: "jobs" | "internships" | "startups" | "applications"; label: string; icon: any; gradient: string }[] = [
    { id: "jobs", label: "CIBA Jobs", icon: Building2, gradient: "from-blue-600 to-indigo-700" },
    { id: "internships", label: "Internships", icon: GraduationCap, gradient: "from-cyan-600 to-teal-700" },
    { id: "startups", label: "Startups", icon: Rocket, gradient: "from-purple-600 to-pink-700" },
    { id: "applications", label: "Applications", icon: Mail, gradient: "from-green-600 to-emerald-700" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-10">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 rounded-2xl text-lg font-bold transition-all shadow-lg flex items-center gap-3 relative ${
              isActive
                ? `bg-gradient-to-r ${tab.gradient} text-white`
                : "bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Icon className="w-6 h-6" />
            {tab.label}
            {tab.id === "applications" && pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}