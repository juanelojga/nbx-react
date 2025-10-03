"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "client";
}

export function MainLayout({ children, userRole }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={toggleSidebar} />
      <div className="flex">
        <Sidebar
          userRole={userRole}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full transition-all duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
