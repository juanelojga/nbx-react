import { Eye, Pencil, Trash2 } from "lucide-react";
import { ActionVariant } from "./table-action-buttons.types";

export const tooltipStyles: Record<ActionVariant, string> = {
  view: "rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-medium text-blue-50",
  edit: "rounded-lg bg-amber-950 px-3 py-1.5 text-xs font-medium text-amber-50",
  delete: "rounded-lg bg-red-950 px-3 py-1.5 text-xs font-medium text-red-50",
} as const;

export const icons: Record<ActionVariant, typeof Eye> = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
} as const;
