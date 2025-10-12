"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNavItems, clientNavItems, type NavItem } from "@/lib/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  userRole: "admin" | "client";
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  userRole,
  isMobileOpen,
  isDesktopCollapsed,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const navItems: NavItem[] =
    userRole === "admin" ? adminNavItems : clientNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="desktop-sidebar"
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-background border-r border-border/50 shadow-lg transition-all duration-300 ease-in-out",
          "lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:shadow-none",
          // Mobile state
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop collapsed state - hide it completely so it doesn't take up space
          isDesktopCollapsed && "lg:hidden"
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-3 border-b border-border/50 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#1976D2] flex items-center justify-center font-bold text-white shadow-sm text-sm">
              N
            </div>
            <span className="text-lg font-bold tracking-tight">NarBox</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            aria-label="Close menu"
            className="hover:bg-accent transition-all duration-200 active:scale-95"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group text-sm",
                  "hover:bg-accent hover:shadow-sm active:scale-[0.98]",
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary font-semibold shadow-sm"
                    : "hover:translate-x-1"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 flex-shrink-0",
                    isActive ? "scale-110" : "group-hover:scale-105"
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
