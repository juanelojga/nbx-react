import type * as React from "react";

import { Button } from "@/components/ui/button";

import type { EnhancedTableSelectionBarProps } from "./enhanced-table.types";

export const EnhancedTableSelectionBar: React.FC<
  EnhancedTableSelectionBarProps
> = ({
  selectedCount,
  onClearSelection,
  actions,
  message,
  selectedLabel,
  clearLabel,
}) => {
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
              {selectedLabel ??
                `${selectedCount} ${selectedCount === 1 ? "item" : "items"} selected`}
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
          {clearLabel ?? "Clear Selection"}
        </Button>
      </div>
    </div>
  );
};
EnhancedTableSelectionBar.displayName = "EnhancedTableSelectionBar";
