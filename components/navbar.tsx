"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/app/hooks/UseTheme";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme, mounted } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

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
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={navigateHome}
            className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
          >
            <img
              src="/dst-ciba-logo.png"
              alt="CIBA Logo"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavButton
              onClick={navigateHome}
              label="Home"
              active={pathname === "/"}
            />
            <NavButton
              onClick={() => scrollToSection("programs")}
              label="Programs"
              active={pathname.includes("#programs")}
            />
            <NavButton
              onClick={navigateToStartup}
              label="Startups"
              active={pathname === "/startups"}
            />
            <NavButton
              onClick={navigateToTeam}
              label="Our Team"
              active={pathname === "/Ourteam"}
            />
            <NavButton
              onClick={navigateToJob}
              label="Jobs"
              active={pathname === "/job"}
            />
            <NavButton
              onClick={() => scrollToSection("contact")}
              label="Contact Us"
              active={pathname.includes("#contact")}
            />

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="ml-3 p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-all hover:scale-110"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-muted rounded-lg transition-all"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-all hover:shadow-md hover:shadow-primary/20"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-up">
            <MobileButton
              onClick={navigateHome}
              label="Home"
              active={pathname === "/"}
            />
            <MobileButton
              onClick={() => scrollToSection("programs")}
              label="Programs"
              active={pathname.includes("#programs")}
            />
            <MobileButton
              onClick={navigateToStartup}
              label="Startups"
              active={pathname === "/startups"}
            />
            <MobileButton
              onClick={navigateToTeam}
              label="Our Team"
              active={pathname === "/Ourteam"}
            />
            <MobileButton
              onClick={navigateToJob}
              label="Jobs"
              active={pathname === "/job"}
            />
            <MobileButton
              onClick={() => scrollToSection("contact")}
              label="Contact Us"
              active={pathname.includes("#contact")}
            />
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
      className={`px-4 py-2 text-foreground hover:text-primary transition-all font-medium relative group rounded-lg hover:bg-primary/5 ${active ? "text-primary" : ""
        }`}
    >
      {label}
      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/20" />
    </button>
  );
}

function MobileButton({
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
      className={`block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary hover:shadow-md hover:shadow-primary/20 ${active ? "bg-primary/5 text-primary" : ""
        }`}
    >
      {label}
    </button>
  );
}