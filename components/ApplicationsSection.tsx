import { useState } from "react";
import { Search, Mail, Building2, GraduationCap, Rocket } from "lucide-react";
import ApplicationCard from "./ApplicationCard";

export default function ApplicationsSection({ applications, onRefetch }: { applications: any[]; onRefetch: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.positionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const jobApps = filteredApps.filter((a) => a.positionType === "ciba-job");
  const internshipApps = filteredApps.filter((a) => a.positionType === "ciba-internship");
  const startupApps = filteredApps.filter((a) => a.positionType === "startup");
  const unknownApps = filteredApps.filter((a) => !a.positionType);

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, position, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
            >
              <option value="all">All Types</option>
              <option value="ciba-job">CIBA Job</option>
              <option value="ciba-internship">CIBA Internship</option>
              <option value="startup">Startup</option>
            </select>
          </div>
        </div>
      </div>

      {typeFilter === "all" ? (
        <>
          {jobApps.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                CIBA Job Applications ({jobApps.length})
              </h2>
              <div className="space-y-4">
                {jobApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                ))}
              </div>
            </div>
          )}
          {internshipApps.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-cyan-600" />
                CIBA Internship Applications ({internshipApps.length})
              </h2>
              <div className="space-y-4">
                {internshipApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                ))}
              </div>
            </div>
          )}
          {startupApps.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Rocket className="w-6 h-6 text-purple-600" />
                Startup Applications ({startupApps.length})
              </h2>
              <div className="space-y-4">
                {startupApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                ))}
              </div>
            </div>
          )}
          {unknownApps.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6 text-gray-600" />
                Other Applications ({unknownApps.length})
              </h2>
              <div className="space-y-4">
                {unknownApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                ))}
              </div>
            </div>
          )}
          {filteredApps.length === 0 && (
            <div className="bg-white rounded-2xl p-16 shadow-lg text-center border-2 border-dashed border-gray-300">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-medium">No applications found</p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 shadow-lg text-center border-2 border-dashed border-gray-300">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-medium">No applications found</p>
            </div>
          ) : (
            filteredApps.map((app) => <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />)
          )}
        </div>
      )}
    </div>
  );
}