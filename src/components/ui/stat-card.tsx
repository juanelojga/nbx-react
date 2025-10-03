import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  primary: "border-primary/20 bg-primary/5",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
  destructive: "border-destructive/20 bg-destructive/5",
};

const iconVariantStyles = {
  default: "text-muted-foreground/70",
  primary: "text-primary/80",
  success: "text-success/80",
  warning: "text-warning/80",
  destructive: "text-destructive/80",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        variantStyles[variant],
        "transition-all duration-200 hover:shadow-xl",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          {label}
        </CardTitle>
        {Icon && <Icon className={cn("h-5 w-5", iconVariantStyles[variant])} />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold mt-2",
              trend.isPositive ? "text-success" : "text-destructive"
            )}
          >
            {trend.isPositive ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
