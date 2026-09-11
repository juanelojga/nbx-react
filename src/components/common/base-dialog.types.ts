import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

export type BaseDialogSize = "sm" | "md" | "lg" | "xl";

export interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: BaseDialogSize;
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  iconVariant?: "default" | "destructive";
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  className?: string;
}
