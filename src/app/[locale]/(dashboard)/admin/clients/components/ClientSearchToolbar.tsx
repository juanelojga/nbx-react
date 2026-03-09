"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X } from "lucide-react";

interface ClientSearchToolbarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onClearSearch: () => void;
  isLoading: boolean;
  isDebouncing: boolean;
}

export function ClientSearchToolbar({
  searchInput,
  onSearchInputChange,
  onClearSearch,
  isLoading,
  isDebouncing,
}: ClientSearchToolbarProps) {
  const t = useTranslations("adminClients");

  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        {isLoading || isDebouncing ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          disabled={isLoading && !searchInput}
          className="pl-9 pr-9"
          aria-label={t("searchPlaceholder")}
        />
        {searchInput && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSearch}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            aria-label={t("clearSearch")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
