import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FieldA11yProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

interface FormFieldWrapperProps {
  /** Stable input id (used by labels, tests and e2e selectors). */
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  /** Helper text shown under the control. */
  hint?: ReactNode;
  className?: string;
  /** Render the control with the id/aria props wired for you. */
  children: (field: FieldA11yProps) => ReactNode;
}

/** Label + control + error message with the aria wiring done once. */
export function FormFieldWrapper({
  id,
  label,
  required = false,
  error,
  hint,
  className,
  children,
}: FormFieldWrapperProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="text-sm text-destructive font-medium flex items-center gap-1"
        >
          <span className="text-base" aria-hidden="true">
            ⚠
          </span>
          {error}
        </p>
      )}
    </div>
  );
}
