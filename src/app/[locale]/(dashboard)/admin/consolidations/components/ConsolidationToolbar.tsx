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
import type { DateRangeError } from "@/lib/validation/consolidationFilters";
import { todayISO } from "@/lib/date/todayISO";

interface ConsolidationToolbarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onClearSearch: () => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  createdAfter: string;
  createdBefore: string;
  onCreatedAfterChange: (value: string) => void;
  onCreatedBeforeChange: (value: string) => void;
  onClearDates: () => void;
  dateRangeError: DateRangeError;
  isLoading: boolean;
  isDebouncing: boolean;
}

export function ConsolidationToolbar({
  searchInput,
  onSearchInputChange,
  onClearSearch,
  statusFilter,
  onStatusFilterChange,
  createdAfter,
  createdBefore,
  onCreatedAfterChange,
  onCreatedBeforeChange,
  onClearDates,
  dateRangeError,
  isLoading,
  isDebouncing,
}: ConsolidationToolbarProps) {
  const t = useTranslations("adminConsolidations");
  const today = todayISO();

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row">
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

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="createdAfter"
              className="text-xs font-medium text-muted-foreground"
            >
              {t("createdAfterLabel")}
            </label>
            <Input
              id="createdAfter"
              type="date"
              value={createdAfter}
              onChange={(e) => onCreatedAfterChange(e.target.value)}
              max={today}
              className="w-full sm:w-[180px]"
              aria-invalid={!!dateRangeError}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="createdBefore"
              className="text-xs font-medium text-muted-foreground"
            >
              {t("createdBeforeLabel")}
            </label>
            <Input
              id="createdBefore"
              type="date"
              value={createdBefore}
              onChange={(e) => onCreatedBeforeChange(e.target.value)}
              max={today}
              className="w-full sm:w-[180px]"
              aria-invalid={!!dateRangeError}
            />
          </div>
          {(createdAfter || createdBefore) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearDates}
              className="gap-2 sm:mb-0"
            >
              <X className="h-4 w-4" />
              {t("clearDates")}
            </Button>
          )}
        </div>
        {dateRangeError && (
          <p className="text-xs text-destructive" role="alert">
            {t(dateRangeError)}
          </p>
        )}
      </div>
    </div>
  );
}
