"use client";

import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/ThemeToggle";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeToggle />
      {children}
    </ThemeProvider>
  );
}