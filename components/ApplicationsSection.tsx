import { useState } from "react";
import { Search, Mail, Building2, GraduationCap, Rocket } from "lucide-react";
import ApplicationCard from "./ApplicationCard";

export default function ApplicationsSection({ applications, onRefetch }: { applications: any[]; onRefetch: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  console.log("Total applications:", applications.length);
  console.log("Applications data:", applications);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.positionTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.positionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  console.log("Filtered applications:", filteredApps.length);

  const jobApps = filteredApps.filter((a) => a.positionType === "ciba-job");
  const internshipApps = filteredApps.filter((a) => a.positionType === "ciba-internship");
  const startupApps = filteredApps.filter((a) => a.positionType === "startup");
  const unknownApps = filteredApps.filter((a) => !a.positionType || a.positionType === "unknown");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, position, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="ciba-job">CIBA Job</option>
              <option value="ciba-internship">CIBA Internship</option>
              <option value="startup">Startup</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredApps.length}</span> of {applications.length} applications
          </p>
        </div>
      </div>

      {/* Application Lists */}
      <div className="w-full">
        {typeFilter === "all" ? (
          <div className="space-y-8">
            {/* CIBA Jobs */}
            {jobApps.length > 0 && (
              <div className="w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  CIBA Job Applications ({jobApps.length})
                </h2>
                <div className="space-y-4 w-full">
                  {jobApps.map((app) => (
                    <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                  ))}
                </div>
              </div>
            )}
            
            {/* CIBA Internships */}
            {internshipApps.length > 0 && (
              <div className="w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  CIBA Internship Applications ({internshipApps.length})
                </h2>
                <div className="space-y-4 w-full">
                  {internshipApps.map((app) => (
                    <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Startups */}
            {startupApps.length > 0 && (
              <div className="w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  Startup Applications ({startupApps.length})
                </h2>
                <div className="space-y-4 w-full">
                  {startupApps.map((app) => (
                    <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Unknown/Other */}
            {unknownApps.length > 0 && (
              <div className="w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-600" />
                  Other Applications ({unknownApps.length})
                </h2>
                <div className="space-y-4 w-full">
                  {unknownApps.map((app) => (
                    <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
                  ))}
                </div>
              </div>
            )}
            
            {/* No Results */}
            {filteredApps.length === 0 && (
              <div className="w-full bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg text-gray-500">No applications found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {filteredApps.length === 0 ? (
              <div className="w-full bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg text-gray-500">No applications found</p>
              </div>
            ) : (
              filteredApps.map((app) => (
                <ApplicationCard key={app._id} app={app} onUpdate={onRefetch} onDelete={onRefetch} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}