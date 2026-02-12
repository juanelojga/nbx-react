import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Truck,
  CheckCircle2,
  Clock,
  HelpCircle,
  DollarSign,
  Loader,
  XCircle,
} from "lucide-react";
import { ConsolidationStatus } from "@/lib/validation/status";

/**
 * Status Badge Component
 * Displays status with appropriate color and icon
 */

type StatusType = ConsolidationStatus;

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
  awaiting_payment: {
    color: "yellow",
    icon: DollarSign,
    bgClass: "bg-yellow-100 dark:bg-yellow-950",
    textClass: "text-yellow-800 dark:text-yellow-200",
    borderClass: "border-yellow-300 dark:border-yellow-800",
  },
  pending: {
    color: "blue",
    icon: Clock,
    bgClass: "bg-blue-100 dark:bg-blue-950",
    textClass: "text-blue-800 dark:text-blue-200",
    borderClass: "border-blue-300 dark:border-blue-800",
  },
  processing: {
    color: "purple",
    icon: Loader,
    bgClass: "bg-purple-100 dark:bg-purple-950",
    textClass: "text-purple-800 dark:text-purple-200",
    borderClass: "border-purple-300 dark:border-purple-800",
  },
  in_transit: {
    color: "orange",
    icon: Truck,
    bgClass: "bg-orange-100 dark:bg-orange-950",
    textClass: "text-orange-800 dark:text-orange-200",
    borderClass: "border-orange-300 dark:border-orange-800",
  },
  delivered: {
    color: "green",
    icon: CheckCircle2,
    bgClass: "bg-green-100 dark:bg-green-950",
    textClass: "text-green-800 dark:text-green-200",
    borderClass: "border-green-300 dark:border-green-800",
  },
  cancelled: {
    color: "red",
    icon: XCircle,
    bgClass: "bg-red-100 dark:bg-red-950",
    textClass: "text-red-800 dark:text-red-200",
    borderClass: "border-red-300 dark:border-red-800",
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
