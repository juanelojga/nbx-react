import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  const spinner = (
    // Rule 6.1: Animate wrapper div instead of SVG for better performance
    <div className="animate-spin" role="status" aria-label="Loading">
      <div
        className={cn(
          "border-[#1976D2] border-t-transparent rounded-full",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
