/**
 * Enhanced Table Components
 *
 * Reusable table components implementing the NBX "Warehouse Tech-Luxe" design system.
 * See docs/TABLE_DESIGN_SYSTEM.md for full documentation.
 *
 * @example
 * ```tsx
 * <EnhancedTable>
 *   <EnhancedTableHeader>
 *     <TableRow>
 *       <EnhancedTableHead>Name</EnhancedTableHead>
 *     </TableRow>
 *   </EnhancedTableHeader>
 *   <TableBody>
 *     {data.map((item, index) => (
 *       <EnhancedTableRow key={item.id} index={index}>
 *         <TableCell>{item.name}</TableCell>
 *       </EnhancedTableRow>
 *     ))}
 *   </TableBody>
 * </EnhancedTable>
 * ```
 */

import * as React from "react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/* ============================================================================
 * EnhancedTable - Main table wrapper with premium styling
 * ========================================================================== */

export interface EnhancedTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional loading state shimmer effect
   */
  isLoading?: boolean;
  /**
   * Additional spacing around the table
   */
  withSpacing?: boolean;
}

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

/* ============================================================================
 * EnhancedTableHeader - Table header with gradient background
 * ========================================================================== */

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

/* ============================================================================
 * EnhancedTableHead - Table header cell with proper typography
 * ========================================================================== */

export interface EnhancedTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Optional icon to display before the header text
   */
  icon?: LucideIcon;
}

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

/* ============================================================================
 * EnhancedTableRow - Table row with animations and interactions
 * ========================================================================== */

export interface EnhancedTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Row index for staggered animation delay
   */
  index?: number;
  /**
   * Whether the row is selected
   */
  isSelected?: boolean;
  /**
   * Animation delay in milliseconds (overrides index-based delay)
   */
  animationDelay?: number;
  /**
   * Disable staggered fade-in animation
   */
  disableAnimation?: boolean;
}

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

/* ============================================================================
 * EnhancedTableActionButton - Styled action buttons (view/edit/delete)
 * ========================================================================== */

export type ActionButtonVariant = "view" | "edit" | "delete" | "custom";

export interface EnhancedTableActionButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size"
> {
  /**
   * Visual variant of the button
   */
  actionVariant: ActionButtonVariant;
  /**
   * Icon component to render
   */
  icon: LucideIcon;
  /**
   * Custom color classes (only used with variant="custom")
   */
  customColorClass?: string;
}

const actionVariantClasses: Record<ActionButtonVariant, string> = {
  view: "bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 shadow-sm ring-1 ring-blue-200/50 hover:from-blue-100 hover:to-blue-200/50 hover:text-blue-700 hover:shadow-md hover:ring-blue-300/50 dark:from-blue-950/30 dark:to-blue-900/20 dark:ring-blue-800/30 dark:hover:from-blue-900/40",
  edit: "bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 shadow-sm ring-1 ring-amber-200/50 hover:from-amber-100 hover:to-amber-200/50 hover:text-amber-700 hover:shadow-md hover:ring-amber-300/50 dark:from-amber-950/30 dark:to-amber-900/20 dark:ring-amber-800/30 dark:hover:from-amber-900/40",
  delete:
    "bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 shadow-sm ring-1 ring-red-200/50 hover:from-red-100 hover:to-red-200/50 hover:text-red-700 hover:shadow-md hover:ring-red-300/50 dark:from-red-950/30 dark:to-red-900/20 dark:ring-red-800/30 dark:hover:from-red-900/40",
  custom: "",
};

export const EnhancedTableActionButton = React.forwardRef<
  HTMLButtonElement,
  EnhancedTableActionButtonProps
>(
  (
    {
      actionVariant,
      icon: Icon,
      customColorClass,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const colorClass =
      actionVariant === "custom"
        ? customColorClass
        : actionVariantClasses[actionVariant];

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95",
          colorClass,
          className
        )}
        {...props}
      >
        <Icon className="h-4 w-4" />
        {children}
      </Button>
    );
  }
);
EnhancedTableActionButton.displayName = "EnhancedTableActionButton";

/* ============================================================================
 * EnhancedTableEmptyState - Empty state with blur orbs
 * ========================================================================== */

export interface EnhancedTableEmptyStateProps {
  /**
   * Icon to display
   */
  icon: LucideIcon;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description: string;
  /**
   * Optional action button
   */
  action?: React.ReactNode;
}

export const EnhancedTableEmptyState: React.FC<
  EnhancedTableEmptyStateProps
> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 via-background to-muted/20 py-24 text-center shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
      <div className="relative">
        <div className="mb-8 inline-flex rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-inner ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-20 w-20 text-primary/60 transition-all duration-500 group-hover:text-primary" />
        </div>
        <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
          {description}
        </p>
        {action && <div className="mt-8">{action}</div>}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/30" />
          <span>Ready to start</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/30" />
        </div>
      </div>
    </div>
  );
};
EnhancedTableEmptyState.displayName = "EnhancedTableEmptyState";

/* ============================================================================
 * EnhancedTableSelectionBar - Sticky selection bar
 * ========================================================================== */

export interface EnhancedTableSelectionBarProps {
  /**
   * Number of selected items
   */
  selectedCount: number;
  /**
   * Callback to clear selection
   */
  onClearSelection: () => void;
  /**
   * Optional additional actions
   */
  actions?: React.ReactNode;
  /**
   * Optional message to display
   */
  message?: string;
}

export const EnhancedTableSelectionBar: React.FC<
  EnhancedTableSelectionBarProps
> = ({ selectedCount, onClearSelection, actions, message }) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className="sticky bottom-4 z-10 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background p-5 shadow-2xl backdrop-blur-md animate-slide-up"
      style={{
        animation: "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <span className="text-lg font-bold text-primary-foreground">
              {selectedCount}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
            </div>
            {message && (
              <div className="text-xs text-muted-foreground">{message}</div>
            )}
          </div>
          {actions && <div className="ml-4">{actions}</div>}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          className="gap-2 rounded-xl border-2 border-border/50 bg-background/80 font-semibold shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive hover:shadow-md active:scale-95"
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
};
EnhancedTableSelectionBar.displayName = "EnhancedTableSelectionBar";
