import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type {
  ActionButtonVariant,
  EnhancedTableActionButtonProps,
} from "./enhanced-table.types";

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
          "h-7 w-7 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95",
          colorClass,
          className
        )}
        {...props}
      >
        <Icon className="h-3.5 w-3.5" />
        {children}
      </Button>
    );
  }
);
EnhancedTableActionButton.displayName = "EnhancedTableActionButton";
