import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Truck, CheckCircle2, Clock, HelpCircle } from "lucide-react";

/**
 * Status Badge Component
 * Displays status with appropriate color and icon
 */

type StatusType = "pending" | "in_transit" | "delivered";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    color: string;
    icon: React.ElementType;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  pending: {
    color: "yellow",
    icon: Clock,
    bgClass: "bg-yellow-100 dark:bg-yellow-950",
    textClass: "text-yellow-800 dark:text-yellow-200",
    borderClass: "border-yellow-300 dark:border-yellow-800",
  },
  in_transit: {
    color: "blue",
    icon: Truck,
    bgClass: "bg-blue-100 dark:bg-blue-950",
    textClass: "text-blue-800 dark:text-blue-200",
    borderClass: "border-blue-300 dark:border-blue-800",
  },
  delivered: {
    color: "green",
    icon: CheckCircle2,
    bgClass: "bg-green-100 dark:bg-green-950",
    textClass: "text-green-800 dark:text-green-200",
    borderClass: "border-green-300 dark:border-green-800",
  },
};

// Fallback configuration for unknown statuses
const defaultStatusConfig = {
  color: "gray",
  icon: HelpCircle,
  bgClass: "bg-gray-100 dark:bg-gray-950",
  textClass: "text-gray-800 dark:text-gray-200",
  borderClass: "border-gray-300 dark:border-gray-800",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status] || defaultStatusConfig;
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "border-2",
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
