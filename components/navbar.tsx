"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  /* ---------------- THEME HANDLING ---------------- */
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(prev => !prev);
  };

  /* ---------------- NAVIGATION ---------------- */
  const navigateHome = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
    setIsOpen(false);
  };

  const scrollToSection = (id: string) => {
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
    setIsOpen(false);
  };

  const navigateToJob = () => {
    router.push("/job");
    setIsOpen(false);
  };

  const navigateToTeam = () => {
    router.push("/Ourteam");
    setIsOpen(false);
  };

  const navigateToStartup = () => {
    router.push("/startups");
    setIsOpen(false);
  };

  /* ---------------- JSX ---------------- */
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div
            onClick={navigateHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/dst-ciba-logo.png"
              alt="CIBA Logo"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavButton active={pathname === "/"} onClick={navigateHome} label="Home" />
            <NavButton onClick={() => scrollToSection("programs")} label="Programs" />
            <NavButton onClick={navigateToStartup} label="Startups" />
            <NavButton active={pathname === "/Ourteam"} onClick={navigateToTeam} label="Our Team" />
            <NavButton active={pathname === "/job"} onClick={navigateToJob} label="Jobs" />
            <NavButton onClick={() => scrollToSection("contact")} label="Contact Us" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg hover:bg-primary/10 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-primary/10 rounded-lg"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-primary/10 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
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
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-up">
            <MobileButton onClick={navigateHome} label="Home" />
            <MobileButton onClick={() => scrollToSection("programs")} label="Programs" />
            <MobileButton onClick={navigateToStartup} label="Startups" />
            <MobileButton onClick={navigateToTeam} label="Our Team" />
            <MobileButton onClick={navigateToJob} label="Jobs" />
            <MobileButton onClick={() => scrollToSection("contact")} label="Contact Us" />
          </div>
        )}
      </div>
    </nav>
  );
}

/* ---------------- REUSABLE BUTTONS ---------------- */

function NavButton({
  label,
  onClick,
  active = false,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium rounded-lg transition-all hover:bg-primary/5 ${
        active ? "text-primary" : "text-foreground hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function MobileButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all"
    >
      {label}
    </button>
  );
}
