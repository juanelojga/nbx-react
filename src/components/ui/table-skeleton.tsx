"use client";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  EnhancedTable,
  EnhancedTableHeader,
  EnhancedTableHead,
} from "@/components/ui/enhanced-table";
import { cn } from "@/lib/utils";
import { ColumnDef } from "./base-table.types";

export const skeletonVariantClasses: Record<string, string> = {
  text: "h-4 rounded-md",
  badge: "h-6 rounded-full",
  date: "h-8 rounded-md",
  actions: "h-9 w-9 rounded-lg",
};

export function TableSkeleton<T>({
  columns,
  rowCount,
  hasSelection,
}: {
  columns: ColumnDef<T>[];
  rowCount: number;
  hasSelection: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
        <EnhancedTable withSpacing={false}>
          <EnhancedTableHeader>
            <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20">
              {hasSelection && (
                <EnhancedTableHead className="w-12 pl-4">
                  <div className="h-4 w-4 animate-pulse rounded bg-muted/60" />
                </EnhancedTableHead>
              )}
              {columns.map((col) => (
                <EnhancedTableHead
                  key={col.id}
                  className={cn(
                    col.align === "right" && "text-right",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </EnhancedTableHead>
              ))}
            </TableRow>
          </EnhancedTableHeader>
          <TableBody>
            {[...Array(rowCount)].map((_, index) => (
              <TableRow
                key={index}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fade-in 0.6s ease-out forwards",
                  opacity: 0,
                }}
              >
                {hasSelection && (
                  <TableCell className="pl-4">
                    <div className="h-4 w-4 animate-pulse rounded bg-muted/60" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.skeletonVariant === "actions" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        {[...Array(col.skeletonActionCount || 3)].map(
                          (_, i) => (
                            <div
                              key={i}
                              className="h-9 w-9 animate-pulse rounded-lg bg-muted/60"
                              style={{ animationDelay: `${i * 50}ms` }}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "animate-pulse bg-muted/60",
                          skeletonVariantClasses[col.skeletonVariant || "text"]
                        )}
                        style={{
                          width: col.skeletonWidth || "8rem",
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </EnhancedTable>
      </div>
    </div>
  );
}
