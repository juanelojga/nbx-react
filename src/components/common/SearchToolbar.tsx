"use client";

import { Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  /** Placeholder and accessible name of the search box. */
  placeholder: string;
  /** Accessible name of the clear button. */
  clearLabel: string;
  isLoading?: boolean;
  isDebouncing?: boolean;
  className?: string;
}

/** Search box with busy indicator and clear button shared by list pages. */
export function SearchToolbar({
  value,
  onChange,
  onClear,
  placeholder,
  clearLabel,
  isLoading = false,
  isDebouncing = false,
  className,
}: SearchToolbarProps) {
  const isBusy = isLoading || isDebouncing;

  return (
    <div className={cn("relative", className)}>
      {isBusy ? (
        <Loader2
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      ) : (
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isLoading && !value}
        className="pl-9 pr-9"
        aria-label={placeholder}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          aria-label={clearLabel}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
