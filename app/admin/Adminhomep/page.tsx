"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { 
  Rocket, 
  Users, 
  UserCheck,
  Image,
  Mail,
  Building2,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Stats {
  applications: number;
  startups: number;
  mentors: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  icon: "rocket" | "building" | "user";
}

export default function AdminHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    applications: 0,
    startups: 0,
    mentors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch incubation applications
      const incubationRes = await fetch("http://localhost:5000/api/incubation");
      const incubationData = await incubationRes.json();
      
      // You can add more API calls here for startups, mentors
      // For now using mock data for others
      
      setStats({
        applications: incubationData.success ? incubationData.applications.length : 0,
        startups: 156, // Replace with actual API call
        mentors: 42 // Replace with actual API call
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Upload Gallery",
      description: "Add new images",
      icon: Image,
      path: "/admin/gallery-upload"
    },
    {
      title: "Send Newsletter",
      description: "Upload newsletter",
      icon: Mail,
      path: "/admin/newsletter-upload"
    },
    {
      title: "Manage Applications",
      description: "Review incubation apps",
      icon: Rocket,
      path: "/admin/incubation-applications"
    },
    {
      title: "Add Startup",
      description: "Upload startup info",
      icon: TrendingUp,
      path: "/admin/startups-upload"
    },
    {
      title: "Add Mentor",
      description: "Upload mentor profile",
      icon: UserCheck,
      path: "/admin/upload-mentors"
    },
    {
      title: "Add Partners",
      description: "Upload partner info",
      icon: Users,
      path: "/admin/partners-upload"
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "application",
      title: "New incubation application received",
      subtitle: "TechStart Inc. - 2 hours ago",
      time: "2h ago",
      icon: "rocket"
    },
    {
      id: "2",
      type: "clinic",
      title: "Startup clinic application submitted",
      subtitle: "InnovateLab - 5 hours ago",
      time: "5h ago",
      icon: "building"
    },
    {
      id: "3",
      type: "mentor",
      title: "New mentor profile added",
      subtitle: "Dr. Sarah Johnson - 1 day ago",
      time: "1d ago",
      icon: "user"
    }
  ];

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case "rocket":
        return <Rocket className="w-5 h-5 text-primary" />;
      case "building":
        return <Building2 className="w-5 h-5 text-primary" />;
      case "user":
        return <UserCheck className="w-5 h-5 text-primary" />;
      default:
        return <Rocket className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Admin
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button 
                  key={index}
                  onClick={() => router.push(action.path)}
                  className="flex items-center gap-3 px-4 py-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all text-left group"
                >
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        
      </main>
    </div>
  );
}