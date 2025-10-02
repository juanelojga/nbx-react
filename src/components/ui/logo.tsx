import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { width: 80, height: 32 },
  md: { width: 120, height: 48 },
  lg: { width: 160, height: 64 },
  xl: { width: 200, height: 80 },
};

export function Logo({ size = "md", className }: LogoProps) {
  const dimensions = sizeMap[size];

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/images/narbox-logo.png"
        alt="NarBox Logo"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="object-contain"
      />
    </div>
  );
}

// Text-only version for when logo image is not available
export function LogoText({ size = "md", className }: LogoProps) {
  const textSizeMap = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "font-bold tracking-tight",
          textSizeMap[size],
          "text-primary"
        )}
      >
        Nar<span className="text-secondary">Box</span>
      </div>
    </div>
  );
}
