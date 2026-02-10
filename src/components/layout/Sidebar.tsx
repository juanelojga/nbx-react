"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { adminNavItems, clientNavItems, type NavItem } from "@/lib/navigation";
import { X, Package } from "lucide-react";
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
  const t = useTranslations("navigation");
  const navItems: NavItem[] =
    userRole === "admin" ? adminNavItems : clientNavItems;

  return (
    <>
      {/* Mobile overlay with glassmorphism */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Glassmorphism Design */}
      <aside
        id="desktop-sidebar"
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70",
          "border-r border-white/20 dark:border-white/10 shadow-lg shadow-black/5",
          "transition-all duration-300 ease-out",
          "lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isDesktopCollapsed && "lg:hidden"
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-white/10 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 flex items-center justify-center shadow-sm">
              <Package
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                strokeWidth={2}
              />
            </div>
            <span className="text-lg font-semibold tracking-tight">NarBox</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            aria-label="Close menu"
            className="h-8 w-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Role badge */}
        <div className="px-4 pt-5 pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                userRole === "admin" ? "bg-emerald-500" : "bg-blue-500"
              )}
            />
            <span className="text-xs font-medium uppercase tracking-wide">
              {t(`role.${userRole}`)}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                    : "hover:backdrop-blur-sm hover:bg-black/5 dark:hover:bg-white/5 hover:scale-[1.02]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 flex-shrink-0",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-sm">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
