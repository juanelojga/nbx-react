import * as React from "react";

import { TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/** Header section that applies the gradient background to its TableRow children. */
export const EnhancedTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, className, ...props }, ref) => {
  return (
    <TableHeader ref={ref} className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TableRow) {
          const childElement = child as React.ReactElement<
            React.HTMLAttributes<HTMLTableRowElement>
          >;
          return React.cloneElement(childElement, {
            className: cn(
              "border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm transition-colors hover:from-muted/60 hover:to-muted/30",
              childElement.props.className
            ),
          });
        }
        return child;
      })}
    </TableHeader>
  );
});
EnhancedTableHeader.displayName = "EnhancedTableHeader";
