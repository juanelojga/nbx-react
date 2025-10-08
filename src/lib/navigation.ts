import {
  Home,
  Package,
  Users,
  BarChart3,
  Settings,
  Search,
  Plus,
  User,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Home },
  { label: "All Packages", href: "/admin/packages", icon: Package },
  { label: "Clients", href: "/admin/clients", icon: UserCog },
  { label: "Users Management", href: "/admin/users", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const clientNavItems: NavItem[] = [
  { label: "Dashboard", href: "/client/dashboard", icon: Home },
  { label: "My Packages", href: "/client/packages", icon: Package },
  { label: "Track Package", href: "/client/track", icon: Search },
  { label: "New Shipment", href: "/client/new-shipment", icon: Plus },
  { label: "Profile", href: "/client/profile", icon: User },
];
