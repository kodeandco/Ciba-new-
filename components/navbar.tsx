"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
    router.push("/Our_team");
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
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={navigateHome}
          >
            <img
              src="/dst-ciba-logo.png"
              alt="CIBA Logo"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={navigateHome}
              className={`px-4 py-2 text-foreground hover:text-primary transition-all font-medium relative group rounded-lg hover:bg-primary/5 ${
                pathname === "/" ? "text-primary" : ""
              }`}
            >
              Home
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/20" />
            </button>

            <button
              onClick={() => scrollToSection("programs")}
              className={`px-4 py-2 text-foreground hover:text-primary transition-all font-medium relative group rounded-lg hover:bg-primary/5 ${
                pathname.includes("#programs") ? "text-primary" : ""
              }`}
            >
              Programs
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/20" />
            </button>

            <button
              onClick={() => scrollToSection("startups")}
              className={`px-4 py-2 text-foreground hover:text-primary transition-all font-medium relative group rounded-lg hover:bg-primary/5 ${
                pathname.includes("#startups") ? "text-primary" : ""
              }`}
            >
              Startups
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/20" />
            </button>

            {/* Our Team - Navigate to separate page */}
            <button
              onClick={navigateToTeam}
              className={`px-4 py-2 text-foreground hover:text-primary transition-all font-medium relative group rounded-lg hover:bg-primary/5 ${
                pathname === "/Our_team" ? "text-primary" : ""
              }`}
            >
              Our Team
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/20" />
            </button>

            <button
              onClick={navigateToJob}
              className={`px-4 py-2 text-foreground hover:text-primary transition-all font-medium relative group rounded-lg hover:bg-primary/5 ${
                pathname === "/job" ? "text-primary" : ""
              }`}
            >
              Jobs
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/20" />
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className={`px-4 py-2 text-foreground hover:text-primary transition-all font-medium relative group rounded-lg hover:bg-primary/5 ${
                pathname.includes("#contact") ? "text-primary" : ""
              }`}
            >
              Contact Us
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/20" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-all hover:shadow-md hover:shadow-primary/20"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-up">
            <button
              onClick={navigateHome}
              className={`block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary hover:shadow-md hover:shadow-primary/20 ${
                pathname === "/" ? "bg-primary/5 text-primary" : ""
              }`}
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("programs")}
              className={`block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary hover:shadow-md hover:shadow-primary/20 ${
                pathname.includes("#programs") ? "bg-primary/5 text-primary" : ""
              }`}
            >
              Programs
            </button>

            <button
              onClick={() => scrollToSection("startups")}
              className={`block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary hover:shadow-md hover:shadow-primary/20 ${
                pathname.includes("#startups") ? "bg-primary/5 text-primary" : ""
              }`}
            >
              Startups
            </button>

            {/* Our Team - Navigate to separate page */}
            <button
              onClick={navigateToTeam}
              className={`block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary hover:shadow-md hover:shadow-primary/20 ${
                pathname === "/Our_team" ? "bg-primary/5 text-primary" : ""
              }`}
            >
              Our Team
            </button>

            <button
              onClick={navigateToJob}
              className={`block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary hover:shadow-md hover:shadow-primary/20 ${
                pathname === "/job" ? "bg-primary/5 text-primary" : ""
              }`}
            >
              Jobs
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className={`block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all hover:text-primary hover:shadow-md hover:shadow-primary/20 ${
                pathname.includes("#contact") ? "bg-primary/5 text-primary" : ""
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