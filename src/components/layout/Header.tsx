"use client";

import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-[#1976D2] text-white shadow-md backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 sm:px-6 transition-all duration-200">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden hover:bg-white/20 text-white transition-all duration-200 active:scale-95"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center font-bold shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/30">
              N
            </div>
            <span className="text-xl font-bold hidden sm:inline tracking-tight">
              NarBox
            </span>
          </div>
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-3 hover:bg-white/20 text-white transition-all duration-200 active:scale-95"
            >
              <Avatar className="h-9 w-9 ring-2 ring-white/30 transition-all duration-200 hover:ring-white/50">
                <AvatarFallback className="bg-white/20 text-white font-semibold backdrop-blur-sm">
                  {user
                    ? getInitials(`${user.firstName} ${user.lastName}`)
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start gap-1">
                <span className="text-sm font-semibold">
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </span>
                <Badge
                  variant={user?.role === "admin" ? "destructive" : "secondary"}
                  className="text-xs h-5 px-2"
                >
                  {user?.role === "admin" ? "Admin" : "Client"}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 shadow-lg">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-semibold leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive cursor-pointer font-semibold"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
