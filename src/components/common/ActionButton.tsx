"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EnhancedTableActionButton } from "@/components/ui/enhanced-table";
import { ActionVariant, TableAction } from "./table-action-buttons.types";
import { icons, tooltipStyles } from "./table-action-buttons.constants";

export function ActionButton({
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
