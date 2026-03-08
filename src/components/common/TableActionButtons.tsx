"use client";

import { TableCell } from "@/components/ui/table";
import { ActionButton } from "./ActionButton";
import { TableActionButtonsProps } from "./table-action-buttons.types";

export type {
  TableAction,
  ActionVariant,
  TableActionButtonsProps,
} from "./table-action-buttons.types";

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
