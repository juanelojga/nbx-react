import * as React from "react";

import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { EnhancedTableRowProps } from "./enhanced-table.types";

export const EnhancedTableRow = React.forwardRef<
  HTMLTableRowElement,
  EnhancedTableRowProps
>(
  (
    {
      children,
      className,
      index = 0,
      isSelected = false,
      animationDelay,
      disableAnimation = false,
      style,
      ...props
    },
    ref
  ) => {
    const delay = animationDelay ?? index * 50;

    return (
      <TableRow
        ref={ref}
        className={cn(
          "table-row-optimized group relative transition-all duration-300",
          isSelected
            ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/15 hover:via-primary/8 border-l-4 border-l-primary"
            : "hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent",
          className
        )}
        style={{
          ...style,
          ...(disableAnimation
            ? {}
            : {
                animation: isSelected
                  ? "subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                  : "fade-in 0.4s ease-out forwards",
                animationDelay: `${delay}ms`,
              }),
        }}
        {...props}
      >
        {children}
      </TableRow>
    );
  }
);
EnhancedTableRow.displayName = "EnhancedTableRow";
