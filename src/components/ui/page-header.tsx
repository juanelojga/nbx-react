import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="font-[family-name:var(--font-work-sans)] text-2xl font-extrabold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>
        )}
      </div>
      <Separator />
    </div>
  );
}
