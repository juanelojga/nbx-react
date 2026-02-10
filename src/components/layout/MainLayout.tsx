"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "client";
}

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

// Rule 6.5: Prevent hydration mismatch with safe localStorage access
const getInitialSidebarState = (): boolean => {
  // Only access localStorage on client-side
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored === "true";
  } catch {
    return false;
  }
};

export function MainLayout({ children, userRole }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // Rule 6.5: Use lazy initialization to safely read localStorage without hydration mismatch
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(
    getInitialSidebarState
  );

  // Persist sidebar state to localStorage
  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newValue));
      return newValue;
    });
  };

  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={toggleMobileSidebar}
        onDesktopSidebarToggle={toggleDesktopSidebar}
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
      />
      <div className="flex">
        <Sidebar
          userRole={userRole}
          isMobileOpen={isMobileSidebarOpen}
          isDesktopCollapsed={isDesktopSidebarCollapsed}
          onMobileClose={closeMobileSidebar}
        />
        <main className="flex-1 p-6 lg:p-8 w-full transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
