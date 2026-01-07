"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // Default to dark
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has a saved preference
    const saved = window.localStorage.getItem("darkMode");
    
    if (saved !== null) {
      // User has a preference saved
      const darkMode = saved === "true";
      setIsDark(darkMode);
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // No saved preference, default to dark
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

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-[100] group"
      aria-label="Toggle dark mode"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all hover:scale-110 backdrop-blur-sm">
        <div className="relative w-6 h-6">
          {/* Sun Icon */}
          <Sun 
            className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 ${
              isDark 
                ? 'rotate-90 scale-0 opacity-0' 
                : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          
          {/* Moon Icon */}
          <Moon 
            className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-500 ${
              isDark 
                ? 'rotate-0 scale-100 opacity-100' 
                : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </div>
    </button>
  );
}