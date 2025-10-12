"use client";

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "client";
}

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export function MainLayout({ children, userRole }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      setIsDesktopSidebarCollapsed(stored === "true");
    }
  }, []);

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
