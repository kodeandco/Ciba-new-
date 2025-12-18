"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation"; // import useRouter

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // initialize router

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };
  const navigateToStartups = () => {
    router.push("/startups"); // navigate to the /startups page
    setIsOpen(false);    // close mobile menu if open
  }
  const navigateToJob = () => {
    router.push("/job"); // navigate to the /job page
    setIsOpen(false);    // close mobile menu if open
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cag4bDIMFGmh8LtfD2mQmy1l7r0nsD.png"
              alt="CIBA Logo"
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-foreground hover:text-primary transition-all font-medium relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </button>
            <button
              onClick={() => scrollToSection("programs")}
              className="text-foreground hover:text-primary transition-all font-medium relative group"
            >

              Programs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </button>
            <button
              onClick={navigateToStartups}
              className="text-foreground hover:text-primary transition-all font-medium relative group"
            >
              Startups
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </button>
            <button
              onClick={navigateToJob}
              className="text-foreground hover:text-primary transition-all font-medium relative group"
            >
              Jobs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-all"
            >
              Home
            </button>
            <button
              onClick={navigateToStartups}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-all"
            >
              Startups            </button>
            <button
              onClick={() => scrollToSection("programs")}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-all"
            >
              Programs
            </button>
            <button
              onClick={navigateToJob}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-all"
            >
              Jobs
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
