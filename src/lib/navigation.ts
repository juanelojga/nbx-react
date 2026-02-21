import {
  Home,
  Package,
  BarChart3,
  Search,
  Plus,
  User,
  UserCog,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { createNavigation } from "next-intl/navigation";
import { routing } from "../../i18n/routing";

/**
 * Locale-aware navigation utilities
 *
 * These are created by next-intl and automatically handle locale prefixes
 * Use these instead of next/navigation exports to ensure proper i18n routing
 */
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

export interface NavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { labelKey: "admin.dashboard", href: "/admin/dashboard", icon: Home },
  {
    labelKey: "admin.consolidatePackages",
    href: "/admin/packages",
    icon: Package,
  },
  { labelKey: "admin.clients", href: "/admin/clients", icon: UserCog },
  {
    labelKey: "admin.consolidations",
    href: "/admin/consolidations",
    icon: Layers,
  },
  { labelKey: "admin.reports", href: "/admin/reports", icon: BarChart3 },
];

export const clientNavItems: NavItem[] = [
  { labelKey: "client.dashboard", href: "/client/dashboard", icon: Home },
  { labelKey: "client.myPackages", href: "/client/packages", icon: Package },
  { labelKey: "client.trackPackage", href: "/client/track", icon: Search },
  { labelKey: "client.newShipment", href: "/client/new-shipment", icon: Plus },
  { labelKey: "client.profile", href: "/client/profile", icon: User },
];
