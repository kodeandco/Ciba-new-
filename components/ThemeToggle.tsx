"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-20 right-6 z-[100] group relative"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative p-3 rounded-full bg-card border-2 border-border shadow-lg hover:shadow-2xl transition-all hover:scale-110 backdrop-blur-sm">
        <div className="relative w-6 h-6">
          <Sun 
            className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 ${
              theme === "dark" ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          <Moon 
            className={`absolute inset-0 w-6 h-6 text-blue-500 transition-all duration-500 ${
              theme === "dark" ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </div>
      </div>
      
      <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-card/95 backdrop-blur-sm border border-border rounded-lg text-xs text-card-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        {theme === "dark" ? 'Switch to Light' : 'Switch to Dark'}
      </div>
    </button>
  );
}