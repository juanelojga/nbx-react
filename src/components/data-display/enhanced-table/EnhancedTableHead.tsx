import * as React from "react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { EnhancedTableHeadProps } from "./enhanced-table.types";

export const EnhancedTableHead = React.forwardRef<
  HTMLTableCellElement,
  EnhancedTableHeadProps
>(({ children, className, icon: Icon, ...props }, ref) => {
  return (
    <TableHead
      ref={ref}
      className={cn(
        "text-xs font-bold uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    >
      {Icon ? (
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" />
          {children}
        </div>
      ) : (
        children
      )}
    </TableHead>
  );
});
EnhancedTableHead.displayName = "EnhancedTableHead";
