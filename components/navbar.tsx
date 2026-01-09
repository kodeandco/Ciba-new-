"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    const saved = window.localStorage.getItem("darkMode");
    
    if (saved !== null) {
      const darkMode = saved === "true";
      setIsDark(darkMode);
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("darkMode", "true");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("darkMode", "false");
    }
  };

  const scrollToSection = (id: string) => {
    if (pathname === "/") {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    } else {
      router.push(`/#${id}`);
      setIsOpen(false);
    }
  };

  const navigateToJob = () => {
    router.push("/job");
    setIsOpen(false);
  };

  const navigateToTeam = () => {
    router.push("/Ourteam");
    setIsOpen(false);
  };

  const navigateHome = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={navigateHome}
          >
            <img
              src="/dst-ciba-logo.png"
              alt="CIBA Logo"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={navigateHome}
              className={`px-5 py-2.5 text-sm font-semibold transition-all relative group rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 ${
                pathname === "/" 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Home
              {pathname === "/" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection("programs")}
              className={`px-5 py-2.5 text-sm font-semibold transition-all relative group rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 ${
                pathname.includes("#programs") 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Programs
            </button>

            <button
              onClick={navigateToTeam}
              className={`px-5 py-2.5 text-sm font-semibold transition-all relative group rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 ${
                pathname === "/Ourteam" 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Our Team
              {pathname === "/Ourteam" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
              )}
            </button>

            <button
              onClick={navigateToJob}
              className={`px-5 py-2.5 text-sm font-semibold transition-all relative group rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 ${
                pathname === "/job" 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Jobs
              {pathname === "/job" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className={`px-5 py-2.5 text-sm font-semibold transition-all relative group rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 ${
                pathname.includes("#contact") 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Contact Us
            </button>

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="ml-3 p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110 group relative"
                aria-label="Toggle dark mode"
              >
                <div className="relative w-5 h-5">
                  <Sun 
                    className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 ${
                      isDark 
                        ? 'rotate-90 scale-0 opacity-0' 
                        : 'rotate-0 scale-100 opacity-100'
                    }`}
                  />
                  <Moon 
                    className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-500 ${
                      isDark 
                        ? 'rotate-0 scale-100 opacity-100' 
                        : '-rotate-90 scale-0 opacity-0'
                    }`}
                  />
                </div>
              </button>
            )}
          </div>

          {/* Mobile Menu - Hamburger and Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                aria-label="Toggle dark mode"
              >
                <div className="relative w-5 h-5">
                  <Sun 
                    className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 ${
                      isDark 
                        ? 'rotate-90 scale-0 opacity-0' 
                        : 'rotate-0 scale-100 opacity-100'
                    }`}
                  />
                  <Moon 
                    className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-500 ${
                      isDark 
                        ? 'rotate-0 scale-100 opacity-100' 
                        : '-rotate-90 scale-0 opacity-0'
                    }`}
                  />
                </div>
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-slide-down">
            <button
              onClick={navigateHome}
              className={`block w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                pathname === "/" 
                  ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("programs")}
              className={`block w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                pathname.includes("#programs") 
                  ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Programs
            </button>

            <button
              onClick={navigateToTeam}
              className={`block w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                pathname === "/Ourteam" 
                  ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Our Team
            </button>

            <button
              onClick={navigateToJob}
              className={`block w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                pathname === "/job" 
                  ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Jobs
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className={`block w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                pathname.includes("#contact") 
                  ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Contact Us
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}