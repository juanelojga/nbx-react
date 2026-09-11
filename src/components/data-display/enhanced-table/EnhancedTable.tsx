import * as React from "react";

import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { EnhancedTableProps } from "./enhanced-table.types";

/** Table wrapper with the rounded-2xl, blurred card chrome from docs/TABLE_DESIGN_SPEC.md. */
export const EnhancedTable = React.forwardRef<
  HTMLDivElement,
  EnhancedTableProps
>(
  (
    { children, className, isLoading = false, withSpacing = true, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(withSpacing && "space-y-6", className)}
        {...props}
      >
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
          )}
          <div className="relative overflow-x-auto">
            <Table>{children}</Table>
          </div>
        </div>
      </div>
    );
  }
);
EnhancedTable.displayName = "EnhancedTable";
