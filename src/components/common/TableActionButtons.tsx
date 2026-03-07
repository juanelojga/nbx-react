"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { TableCell } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EnhancedTableActionButton } from "@/components/ui/enhanced-table";

interface TableAction {
  onClick: () => void;
  ariaLabel: string;
  tooltip: string;
}

interface TableActionButtonsProps {
  onView?: TableAction;
  onEdit?: TableAction;
  onDelete?: TableAction;
}

const tooltipStyles = {
  view: "rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-medium text-blue-50",
  edit: "rounded-lg bg-amber-950 px-3 py-1.5 text-xs font-medium text-amber-50",
  delete: "rounded-lg bg-red-950 px-3 py-1.5 text-xs font-medium text-red-50",
} as const;

const icons = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
} as const;

type ActionVariant = "view" | "edit" | "delete";

function ActionButton({
  variant,
  action,
}: {
  variant: ActionVariant;
  action: TableAction;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <EnhancedTableActionButton
          actionVariant={variant}
          icon={icons[variant]}
          onClick={action.onClick}
          aria-label={action.ariaLabel}
        />
      </TooltipTrigger>
      <TooltipContent side="top" className={tooltipStyles[variant]}>
        <p>{action.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function TableActionButtons({
  onView,
  onEdit,
  onDelete,
}: TableActionButtonsProps) {
  return (
    <TableCell>
      <div className="flex items-center justify-end gap-1.5">
        {onView && <ActionButton variant="view" action={onView} />}
        {onEdit && <ActionButton variant="edit" action={onEdit} />}
        {onDelete && <ActionButton variant="delete" action={onDelete} />}
      </div>
    </TableCell>
  );
}
