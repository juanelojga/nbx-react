"use client";

import type { ComponentProps } from "react";

import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataRowShellProps extends Omit<
  ComponentProps<typeof TableRow>,
  "style"
> {
  /** Stagger for the row fade-in, in milliseconds. */
  animationDelay?: number;
}

/**
 * Row chrome from docs/TABLE_DESIGN_SPEC.md: left accent border, gradient
 * hover and staggered fade-in. Compose cells (and `DataRowPrimaryCell`) inside.
 */
export function DataRowShell({
  animationDelay = 0,
  className,
  children,
  ...props
}: DataRowShellProps) {
  return (
    <TableRow
      className={cn(
        "group relative animate-row-in border-l-4 border-l-transparent transition-all duration-300 hover:border-l-primary hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      {...props}
    >
      {children}
    </TableRow>
  );
}
