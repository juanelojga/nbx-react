import {
  BarChart3,
  Home,
  Layers,
  type LucideIcon,
  Package,
  PackageSearch,
  Plus,
  Search,
  Settings,
  User,
  UserCog,
} from "lucide-react";

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
    labelKey: "admin.packagesManagement",
    href: "/admin/packages-management",
    icon: PackageSearch,
  },
  {
    labelKey: "admin.consolidations",
    href: "/admin/consolidations",
    icon: Layers,
  },
  { labelKey: "admin.reports", href: "/admin/reports", icon: BarChart3 },
  {
    labelKey: "admin.settings",
    href: "/admin/settings/pricing",
    icon: Settings,
  },
];

export const clientNavItems: NavItem[] = [
  { labelKey: "client.dashboard", href: "/client/dashboard", icon: Home },
  { labelKey: "client.myPackages", href: "/client/packages", icon: Package },
  { labelKey: "client.trackPackage", href: "/client/track", icon: Search },
  { labelKey: "client.newShipment", href: "/client/new-shipment", icon: Plus },
  { labelKey: "client.profile", href: "/client/profile", icon: User },
];
