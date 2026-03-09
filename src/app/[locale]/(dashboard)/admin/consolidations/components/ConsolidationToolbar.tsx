"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, X } from "lucide-react";

interface ConsolidationToolbarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onClearSearch: () => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  isLoading: boolean;
  isDebouncing: boolean;
}

export function ConsolidationToolbar({
  searchInput,
  onSearchInputChange,
  onClearSearch,
  statusFilter,
  onStatusFilterChange,
  isLoading,
  isDebouncing,
}: ConsolidationToolbarProps) {
  const t = useTranslations("adminConsolidations");

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
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

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder={t("filterByStatus")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allStatuses")}</SelectItem>
          <SelectItem value="awaiting_payment">
            {t("statusAwaitingPayment")}
          </SelectItem>
          <SelectItem value="pending">{t("statusPending")}</SelectItem>
          <SelectItem value="processing">{t("statusProcessing")}</SelectItem>
          <SelectItem value="in_transit">{t("statusInTransit")}</SelectItem>
          <SelectItem value="delivered">{t("statusDelivered")}</SelectItem>
          <SelectItem value="cancelled">{t("statusCancelled")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
