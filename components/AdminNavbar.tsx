"use client";

import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  Home, 
  Image, 
  Rocket, 
  Mail, 
  Users, 
  Building2, 
  FileText, 
  UserCheck,
  ChevronDown,
  Sun,
  Moon,
  LogOut
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Check if dark mode is enabled on mount
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const adminPages = [
    { 
      id: 'adminhomep', 
      label: 'Dashboard', 
      icon: Home,
      path: '/admin'
    },
    { 
      id: 'gallery-upload', 
      label: 'Gallery', 
      icon: Image,
      path: '/admin/gallery-upload'
    },
    { 
      id: 'incubation-applications', 
      label: 'Incubation Apps', 
      icon: Rocket,
      path: '/admin/incubation-applications'
    },
    { 
      id: 'newsletter-upload', 
      label: 'Newsletter', 
      icon: Mail,
      path: '/admin/newsletter-upload'
    },
    { 
      id: 'partners-upload', 
      label: 'Partners', 
      icon: Users,
      path: '/admin/partners-upload'
    },
    { 
      id: 'startup-clinic-applications', 
      label: 'Startup Clinic', 
      icon: Building2,
      path: '/admin/startup-clinic-applications'
    },
    { 
      id: 'startups-upload', 
      label: 'Startups', 
      icon: Rocket,
      path: '/admin/startups-upload'
    },
    { 
      id: 'testimonials-upload', 
      label: 'Testimonials', 
      icon: FileText,
      path: '/admin/testimonials-upload'
    },
    { 
      id: 'upload-mentors', 
      label: 'Mentors', 
      icon: UserCheck,
      path: '/admin/upload-mentors'
    }
  ];

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    // Add your logout logic here
    router.push('/login');
    setIsOpen(false);
  };

  // Prevent hydration mismatch by not rendering theme toggle until mounted
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-card/95 border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img
                src="/dst-ciba-logo.png"
                alt="CIBA Logo"
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Management Dashboard</p>
              </div>
            </div>
            <div className="h-10 w-32" /> {/* Placeholder to prevent layout shift */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-card/95 border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigateTo('/admin')}
          >
            <img
              src="/dst-ciba-logo.png"
              alt="CIBA Logo"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Management Dashboard</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => navigateTo('/admin/Adminhomep')}
              className={`px-4 py-2 text-foreground hover:text-primary transition-all font-medium rounded-lg hover:bg-primary/5 ${
                pathname === '/admin' ? 'text-primary bg-primary/5' : ''
              }`}
            >
              Dashboard
            </button>

            {/* Pages Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 text-foreground hover:text-primary transition-all font-medium rounded-lg hover:bg-primary/5 flex items-center gap-1"
              >
                Pages
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute top-full mt-2 left-0 w-64 bg-card border border-border rounded-lg shadow-xl py-2 max-h-96 overflow-y-auto z-20">
                    {adminPages.slice(1).map(page => {
                      const Icon = page.icon;
                      return (
                        <button
                          key={page.id}
                          onClick={() => navigateTo(page.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-all hover:text-primary ${
                            pathname === page.path ? 'bg-primary/5 text-primary' : ''
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {page.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg hover:bg-primary/10 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 text-foreground hover:text-primary transition-all font-medium rounded-lg hover:bg-primary/5 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Right Section */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Theme Toggle Button - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-primary/10 rounded-lg transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-slide-up">
            <button
              onClick={() => navigateTo('/admin')}
              className={`block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary ${
                pathname === '/admin' ? 'bg-primary/5 text-primary' : ''
              }`}
            >
              Dashboard
            </button>

            <div className="border-t border-border pt-2 mt-2">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">ADMIN PAGES</p>
              {adminPages.slice(1).map(page => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => navigateTo(page.path)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary ${
                      pathname === page.path ? 'bg-primary/5 text-primary' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {page.label}
                  </button>
                );
              })}
            </div>

            {/* Logout in Mobile Menu */}
            <div className="border-t border-border pt-2 mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}