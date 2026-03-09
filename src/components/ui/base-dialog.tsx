"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { type BaseDialogProps, type BaseDialogSize } from "./base-dialog.types";

const sizeClasses: Record<BaseDialogSize, string> = {
  sm: "sm:max-w-xl",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-4xl",
  xl: "sm:max-w-6xl",
};

export function BaseDialog({
  open,
  onOpenChange,
  size = "md",
  title,
  description,
  icon: Icon,
  iconVariant = "default",
  children,
  footer,
  showCloseButton = true,
  className,
}: BaseDialogProps) {
  const isDestructive = iconVariant === "destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          "max-h-[90vh] overflow-y-auto",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader>
          {isDestructive && Icon ? (
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <Icon className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl text-left">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-left mt-2">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
          ) : (
            <>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {Icon && <Icon className="h-6 w-6" />}
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </>
          )}
        </DialogHeader>

        {children}

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export { DialogFooter } from "@/components/ui/dialog";
