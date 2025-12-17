import { Building2, GraduationCap, Rocket, Mail, Plus } from "lucide-react";

export default function TabNavigation({ activeTab, onTabChange, pendingCount }: {
  activeTab: "jobs" | "internships" | "startups" | "applications";
  onTabChange: (tab: "jobs" | "internships" | "startups" | "applications") => void;
  pendingCount: number;
}) {
  const tabs: { id: "jobs" | "internships" | "startups" | "applications"; label: string; icon: any; gradient: string }[] = [
    { id: "jobs", label: "CIBA Jobs", icon: Building2, gradient: "from-blue-500 to-blue-700" },
    { id: "internships", label: "Internships", icon: GraduationCap, gradient: "from-blue-500 to-blue-700" },
    { id: "startups", label: "Startups", icon: Rocket, gradient: "from-blue-500 to-blue-700" },
    { id: "applications", label: "Applications", icon: Mail, gradient: "from-blue-500 to-blue-700" },
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
            className={`px-6 py-3 rounded-2xl text-lg font-bold transition-all shadow-lg flex items-center gap-3 ${
              isActive
                ? `bg-gradient-to-r ${tab.gradient} text-white`
                : "bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Icon className="w-6 h-6" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}