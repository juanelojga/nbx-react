"use client";

import { Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRoleString } from "@/lib/utils/user-role";

interface HeaderProps {
  onMenuClick: () => void;
  onDesktopSidebarToggle: () => void;
  isDesktopSidebarCollapsed: boolean;
}

export function Header({
  onMenuClick,
  onDesktopSidebarToggle,
  isDesktopSidebarCollapsed,
}: HeaderProps) {
  const { user, logout } = useAuth();

  const isValidName = (value: string | null | undefined) =>
    !!value && value.trim().length > 0 && value.toLowerCase() !== "null";

  const getDisplayName = () => {
    if (!user) return "User";
    const first = isValidName(user.firstName) ? user.firstName.trim() : "";
    const last = isValidName(user.lastName) ? user.lastName.trim() : "";
    const full = [first, last].filter(Boolean).join(" ");
    return full || user.email;
  };

  const getInitials = () => {
    if (!user) return "U";
    const first = isValidName(user.firstName) ? user.firstName.trim() : "";
    const last = isValidName(user.lastName) ? user.lastName.trim() : "";
    if (first || last) {
      return [first[0], last[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  const isAdmin =
    user?.role !== undefined && getUserRoleString(user.role) === "admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-200/60 bg-blue-50 shadow-sm shadow-blue-900/5">
      {/* Brand accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#1976D2]/60 to-transparent" />

      <div className="flex h-16 items-center px-4 sm:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 active:scale-95"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 hidden lg:flex rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 active:scale-95"
          onClick={onDesktopSidebarToggle}
          aria-label={
            isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          aria-expanded={!isDesktopSidebarCollapsed}
          aria-controls="desktop-sidebar"
        >
          {isDesktopSidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#1976D2] flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-[#1976D2]/30 transition-all duration-200 hover:shadow-md hover:shadow-[#1976D2]/40 hover:scale-105">
              N
            </div>
            <span className="text-lg font-(family-name:--font-work-sans) font-extrabold tracking-tight text-foreground hidden sm:inline">
              NarBox
            </span>
          </div>
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1.5 hover:bg-muted transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-7 w-7 ring-2 ring-[#1976D2]/20 transition-all duration-200">
                <AvatarFallback className="bg-[#1976D2] text-white text-xs font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-foreground leading-tight max-w-40 truncate">
                  {getDisplayName()}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider leading-tight ${
                    isAdmin ? "text-[#1976D2]" : "text-muted-foreground"
                  }`}
                >
                  {isAdmin ? "Admin" : "Client"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 rounded-xl shadow-xl border border-border/50 backdrop-blur-sm"
          >
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 py-1">
                <Avatar className="h-9 w-9 ring-2 ring-[#1976D2]/20">
                  <AvatarFallback className="bg-[#1976D2] text-white text-sm font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold leading-none truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-lg">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive cursor-pointer font-semibold rounded-lg"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
