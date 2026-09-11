import type * as React from "react";

import type { EnhancedTableEmptyStateProps } from "./enhanced-table.types";

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
