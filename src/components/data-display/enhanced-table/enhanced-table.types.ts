import type * as React from "react";
import type { LucideIcon } from "lucide-react";

import type { Button } from "@/components/ui/button";

export interface EnhancedTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional loading state shimmer effect */
  isLoading?: boolean;
  /** Additional spacing around the table */
  withSpacing?: boolean;
}

export interface EnhancedTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Optional icon to display before the header text */
  icon?: LucideIcon;
}

export interface EnhancedTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Row index for staggered animation delay */
  index?: number;
  /** Whether the row is selected */
  isSelected?: boolean;
  /** Animation delay in milliseconds (overrides index-based delay) */
  animationDelay?: number;
  /** Disable staggered fade-in animation */
  disableAnimation?: boolean;
}

export type ActionButtonVariant = "view" | "edit" | "delete" | "custom";

export interface EnhancedTableActionButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size"
> {
  /** Visual variant of the button */
  actionVariant: ActionButtonVariant;
  /** Icon component to render */
  icon: LucideIcon;
  /** Custom color classes (only used with variant="custom") */
  customColorClass?: string;
}

export interface EnhancedTableEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export interface EnhancedTableSelectionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions?: React.ReactNode;
  message?: string;
  /** Optional override for the "{count} items selected" label */
  selectedLabel?: React.ReactNode;
  /** Optional override for the clear-selection button label */
  clearLabel?: React.ReactNode;
}
