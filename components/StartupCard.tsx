"use client"
import toast from "react-hot-toast";
import { Rocket, Globe, Trash2, ExternalLink, CheckCircle } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

interface Startup {
  _id: string;
  companyName: string;
  tagline: string;
  careerUrl: string;
  description?: string;
}

interface StartupCardProps {
  startup: Startup;
  onDelete: () => void;
}

export default function StartupCard({ startup, onDelete }: StartupCardProps) {
  const handleDelete = async () => {
    if (!confirm("Remove this startup permanently?")) return;
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/incubated-startups/${startup._id}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        toast.success("Startup Removed");
        onDelete();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg p-8 border border-border hover:shadow-xl hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-md">
              <Rocket className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">{startup.companyName}</h3>
              <p className="text-lg text-primary font-semibold mb-3 italic">"{startup.tagline}"</p>
            </div>
          </div>

          <div className="space-y-5">
            {startup.description && (
              <div>
                <h4 className="text-lg font-bold text-card-foreground mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  About
                </h4>
                <p className="text-base text-muted-foreground leading-relaxed bg-muted/50 p-5 rounded-xl border border-border">
                  {startup.description}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-lg font-bold text-card-foreground mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                Career Opportunities
              </h4>
              <a
                href={startup.careerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-all border border-primary/30 hover:border-primary/50"
              >
                <Globe className="w-4 h-4" />
                View Career Page
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm flex items-center gap-2 border border-primary/30">
            <CheckCircle className="w-5 h-5" />
            ACTIVE
          </span>
          <button
            onClick={handleDelete}
            className="p-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-all border border-destructive/30"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}