"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useConsolidationTableState } from "@/hooks/useConsolidationTableState";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GET_ALL_CONSOLIDATES,
  GetAllConsolidatesResponse,
  GetAllConsolidatesVariables,
  ConsolidateType,
} from "@/graphql/queries/consolidations";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  X,
  Package as PackageIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/ui/status-badge";

// Dynamically import dialog components
const ViewConsolidationDialog = dynamic(
  () =>
    import("@/components/admin/ViewConsolidationDialog").then((mod) => ({
      default: mod.ViewConsolidationDialog,
    })),
  { ssr: false }
);
const EditConsolidationDialog = dynamic(
  () =>
    import("@/components/admin/EditConsolidationDialog").then((mod) => ({
      default: mod.EditConsolidationDialog,
    })),
  { ssr: false }
);
const DeleteConsolidationDialog = dynamic(
  () =>
    import("@/components/admin/DeleteConsolidationDialog").then((mod) => ({
      default: mod.DeleteConsolidationDialog,
    })),
  { ssr: false }
);

type SortField = "created_at" | "delivery_date" | "status";

const DEBOUNCE_DELAY = 400;
const DANGEROUS_CHARS_REGEX = /[<>{};\\\[\]]/g;

// Memoized ConsolidationRow component
interface ConsolidationRowProps {
  consolidation: ConsolidateType;
  onView: (id: string) => void;
  onEdit: (consolidation: ConsolidateType) => void;
  onDelete: (consolidation: ConsolidateType) => void;
  animationDelay?: number;
}

const ConsolidationRow = memo(function ConsolidationRow({
  consolidation,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}: ConsolidationRowProps) {
  const t = useTranslations("adminConsolidations");
  const tStatus = useTranslations("adminConsolidations");
  const [isHovered, setIsHovered] = useState(false);

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "awaiting_payment":
        return tStatus("statusAwaitingPayment");
      case "pending":
        return tStatus("statusPending");
      case "processing":
        return tStatus("statusProcessing");
      case "in_transit":
        return tStatus("statusInTransit");
      case "delivered":
        return tStatus("statusDelivered");
      case "cancelled":
        return tStatus("statusCancelled");
      default:
        return status;
    }
  };

  return (
    <TableRow
      className="group relative transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent hover:border-l-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationName: "fade-in",
        animationDuration: "0.4s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`transition-all duration-500 ${
              isHovered ? "scale-110 rotate-3" : "scale-100"
            }`}
          >
            <PackageIcon className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
          </div>
          <div className="relative">
            <div
              className="font-mono text-sm font-semibold tracking-wide text-foreground transition-colors duration-300"
              style={{ fontVariantNumeric: "tabular-nums" }}
              title={consolidation.id}
            >
              <div className="max-w-[120px] truncate">{consolidation.id}</div>
            </div>
            <div
              className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 ${
                isHovered ? "w-full opacity-100" : "w-0 opacity-0"
              }`}
            />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="relative max-w-[200px]">
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 truncate">
            {consolidation.client.fullName}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="relative max-w-md">
          <p
            className={`text-sm transition-colors duration-300 truncate ${
              consolidation.description
                ? "text-muted-foreground group-hover:text-foreground"
                : "text-muted-foreground/40 italic"
            }`}
          >
            {consolidation.description || "—"}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge
          status={
            consolidation.status as "pending" | "in_transit" | "delivered"
          }
          label={getStatusLabel(consolidation.status)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <span className="text-xs font-medium text-foreground/80">
              {consolidation.packages.length}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <time
              className="text-xs font-medium text-foreground/80 whitespace-nowrap"
              dateTime={consolidation.deliveryDate || undefined}
            >
              {consolidation.deliveryDate
                ? new Date(consolidation.deliveryDate).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )
                : "—"}
            </time>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <time
              className="text-xs font-medium text-foreground/80 whitespace-nowrap"
              dateTime={consolidation.createdAt}
            >
              {new Date(consolidation.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 shadow-sm ring-1 ring-blue-200/50 transition-all duration-300 hover:scale-110 hover:from-blue-100 hover:to-blue-200/50 hover:text-blue-700 hover:shadow-md hover:ring-blue-300/50 active:scale-95 dark:from-blue-950/30 dark:to-blue-900/20 dark:ring-blue-800/30 dark:hover:from-blue-900/40"
                onClick={() => onView(consolidation.id)}
                aria-label={`View ${consolidation.description}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-medium text-blue-50"
            >
              <p>{t("viewConsolidation")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 shadow-sm ring-1 ring-amber-200/50 transition-all duration-300 hover:scale-110 hover:from-amber-100 hover:to-amber-200/50 hover:text-amber-700 hover:shadow-md hover:ring-amber-300/50 active:scale-95 dark:from-amber-950/30 dark:to-amber-900/20 dark:ring-amber-800/30 dark:hover:from-amber-900/40"
                onClick={() => onEdit(consolidation)}
                aria-label={`Edit ${consolidation.description}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-amber-950 px-3 py-1.5 text-xs font-medium text-amber-50"
            >
              <p>{t("editConsolidation")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 shadow-sm ring-1 ring-red-200/50 transition-all duration-300 hover:scale-110 hover:from-red-100 hover:to-red-200/50 hover:text-red-700 hover:shadow-md hover:ring-red-300/50 active:scale-95 dark:from-red-950/30 dark:to-red-900/20 dark:ring-red-800/30 dark:hover:from-red-900/40"
                onClick={() => onDelete(consolidation)}
                aria-label={`Delete ${consolidation.description}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-red-950 px-3 py-1.5 text-xs font-medium text-red-50"
            >
              <p>{t("deleteConsolidation")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
});

export default function AdminConsolidations() {
  const t = useTranslations("adminConsolidations");

  // URL state synchronization
  const {
    state: urlState,
    updateURL,
    getOrderBy,
  } = useConsolidationTableState({
    defaultPageSize: 10,
    defaultSortField: "created_at",
    defaultSortOrder: "desc",
  });

  // Local state for search input
  const [searchInput, setSearchInput] = useState(urlState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(urlState.search);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const {
    page,
    pageSize,
    sortField,
    sortOrder,
    status: statusFilter,
  } = urlState;
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [consolidationIdToView, setConsolidationIdToView] = useState<
    string | null
  >(null);
  const [consolidationToEdit, setConsolidationToEdit] =
    useState<ConsolidateType | null>(null);
  const [consolidationToDelete, setConsolidationToDelete] = useState<{
    id: string;
    description: string;
    client: {
      fullName: string;
      email: string;
    };
    packagesCount: number;
  } | null>(null);

  const orderBy = getOrderBy();

  const sanitizeInput = (input: string): string => {
    return input.replace(DANGEROUS_CHARS_REGEX, "").trim();
  };

  // Sync search input from URL
  useEffect(() => {
    if (urlState.search !== searchInput && !isDebouncing) {
      setSearchInput(urlState.search);
      setDebouncedSearch(urlState.search);
    }
  }, [urlState.search, searchInput, isDebouncing]);

  // Debounce search input
  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsDebouncing(true);
    }

    const timer = setTimeout(() => {
      const sanitized = sanitizeInput(searchInput);
      setDebouncedSearch(sanitized);
      updateURL({ search: sanitized, page: 1 });
      setIsDebouncing(false);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Build GraphQL variables
  const queryVariables: GetAllConsolidatesVariables = {
    page,
    pageSize,
    orderBy,
  };

  if (debouncedSearch) {
    queryVariables.search = debouncedSearch;
  }

  if (statusFilter !== "all") {
    queryVariables.status = statusFilter;
  }

  const { data, loading, error, refetch } = useQuery<
    GetAllConsolidatesResponse,
    GetAllConsolidatesVariables
  >(GET_ALL_CONSOLIDATES, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
  });

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        updateURL({ sortOrder: newSortOrder });
      } else {
        updateURL({ sortField: field, sortOrder: "asc" });
      }
    },
    [sortField, sortOrder, updateURL]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      updateURL({ pageSize: newSize, page: 1 });
    },
    [updateURL]
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    updateURL({ search: "", page: 1 });
  }, [updateURL]);

  const handleStatusFilterChange = useCallback(
    (newStatus: string) => {
      updateURL({ status: newStatus, page: 1 });
    },
    [updateURL]
  );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleViewConsolidation = useCallback((id: string) => {
    setConsolidationIdToView(id);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditConsolidation = useCallback(
    (consolidation: ConsolidateType) => {
      setConsolidationToEdit(consolidation);
      setIsEditDialogOpen(true);
    },
    []
  );

  const handleDeleteConsolidation = useCallback(
    (consolidation: ConsolidateType) => {
      setConsolidationToDelete({
        id: consolidation.id,
        description: consolidation.description,
        client: consolidation.client,
        packagesCount: consolidation.packages.length,
      });
      setIsDeleteDialogOpen(true);
    },
    []
  );

  const totalCount = data?.allConsolidates.totalCount || 0;
  const hasNext = data?.allConsolidates.hasNext || false;
  const hasPrevious = data?.allConsolidates.hasPrevious || false;
  const totalPages = Math.ceil(totalCount / pageSize);

  const consolidations = useMemo(
    () => data?.allConsolidates.results || [],
    [data?.allConsolidates.results]
  );

  const filteredConsolidations = useMemo(() => {
    if (clientFilter === "all") {
      return consolidations;
    }
    return consolidations.filter((c) => c.client.id === clientFilter);
  }, [consolidations, clientFilter]);

  const uniqueClients = useMemo(() => {
    if (!consolidations.length) return [];
    const clientsMap = new Map();
    consolidations.forEach((c) => {
      if (!clientsMap.has(c.client.id)) {
        clientsMap.set(c.client.id, c.client);
      }
    });
    return Array.from(clientsMap.values());
  }, [consolidations]);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page <= 3) {
        for (let i = 2; i <= Math.min(maxVisiblePages, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push(ellipsis);
      } else if (page >= totalPages - 2) {
        pages.push(ellipsis);
        for (let i = totalPages - maxVisiblePages + 1; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(ellipsis);
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push(ellipsis);
      }

      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getAriaSort = (
    field: SortField
  ): "ascending" | "descending" | "none" => {
    if (sortField !== field) return "none";
    return sortOrder === "asc" ? "ascending" : "descending";
  };

  // Loading skeleton
  if (loading) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PageHeader title={t("title")} description={t("description")} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("id")}
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("client")}
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("description")}
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("status")}
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("packagesCount")}
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("deliveryDate")}
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("createdAt")}
                    </TableHead>
                    <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow
                      key={index}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: "fade-in 0.6s ease-out forwards",
                        opacity: 0,
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 animate-pulse rounded bg-muted/60"></div>
                          <div className="h-4 w-32 animate-pulse rounded-md bg-muted/60"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-36 animate-pulse rounded-md bg-muted/60"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-48 animate-pulse rounded-md bg-muted/60"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-20 animate-pulse rounded-full bg-muted/60"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-12 animate-pulse rounded-md bg-muted/60"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-28 animate-pulse rounded-md bg-muted/60"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-28 animate-pulse rounded-md bg-muted/60"></div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1.5">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="h-9 w-9 animate-pulse rounded-lg bg-muted/60"
                              style={{ animationDelay: `${i * 50}ms` }}
                            ></div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Empty state
  if (!loading && !error && filteredConsolidations.length === 0) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PageHeader title={t("title")} description={t("description")} />
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("refresh")}
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9 pr-9"
                    aria-label={t("searchPlaceholder")}
                  />
                  {searchInput && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearSearch}
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                      aria-label={t("clearSearch")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder={t("filterByStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allStatuses")}</SelectItem>
                    <SelectItem value="awaiting_payment">
                      {t("statusAwaitingPayment")}
                    </SelectItem>
                    <SelectItem value="pending">
                      {t("statusPending")}
                    </SelectItem>
                    <SelectItem value="processing">
                      {t("statusProcessing")}
                    </SelectItem>
                    <SelectItem value="in_transit">
                      {t("statusInTransit")}
                    </SelectItem>
                    <SelectItem value="delivered">
                      {t("statusDelivered")}
                    </SelectItem>
                    <SelectItem value="cancelled">
                      {t("statusCancelled")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder={t("filterByClient")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allClients")}</SelectItem>
                    {uniqueClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 via-background to-muted/20 py-24 text-center shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
                <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-8 inline-flex rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-inner ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <PackageIcon className="h-20 w-20 text-primary/60 transition-all duration-500 group-hover:text-primary" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                    {searchInput ||
                    statusFilter !== "all" ||
                    clientFilter !== "all"
                      ? t("noMatchingConsolidations")
                      : t("noConsolidationsFound")}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                    {searchInput
                      ? t("noMatchingConsolidationsDescription", {
                          search: searchInput,
                        })
                      : t("noConsolidationsFoundDescription")}
                  </p>
                  {(searchInput ||
                    statusFilter !== "all" ||
                    clientFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchInput("");
                        setClientFilter("all");
                        updateURL({ search: "", status: "all", page: 1 });
                      }}
                      className="mt-8 gap-2"
                    >
                      <X className="h-4 w-4" />
                      {t("clearSearch")}
                    </Button>
                  )}
                  <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/30" />
                    <span>Ready to start</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/30" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader title={t("title")} description={t("description")} />
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <div className={loading ? "animate-spin mr-2" : "mr-2"}>
              <RefreshCw className="h-4 w-4" />
            </div>
            {t("refresh")}
          </Button>
        </div>

        <ViewConsolidationDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          consolidationId={consolidationIdToView}
        />

        <EditConsolidationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          consolidation={consolidationToEdit}
          onConsolidationUpdated={handleRefresh}
        />

        <DeleteConsolidationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          consolidation={consolidationToDelete}
          onConsolidationDeleted={handleRefresh}
        />

        <Card>
          <CardContent className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 pr-9"
                  aria-label={t("searchPlaceholder")}
                />
                {searchInput && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSearch}
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    aria-label={t("clearSearch")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder={t("filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatuses")}</SelectItem>
                  <SelectItem value="awaiting_payment">
                    {t("statusAwaitingPayment")}
                  </SelectItem>
                  <SelectItem value="pending">{t("statusPending")}</SelectItem>
                  <SelectItem value="processing">
                    {t("statusProcessing")}
                  </SelectItem>
                  <SelectItem value="in_transit">
                    {t("statusInTransit")}
                  </SelectItem>
                  <SelectItem value="delivered">
                    {t("statusDelivered")}
                  </SelectItem>
                  <SelectItem value="cancelled">
                    {t("statusCancelled")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder={t("filterByClient")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allClients")}</SelectItem>
                  {uniqueClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  {t("loadingError", { error: error.message })}
                </AlertDescription>
              </Alert>
            )}

            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <div className="relative overflow-x-auto">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-card/80 to-transparent" />
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm transition-colors hover:from-muted/60 hover:to-muted/30">
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("id")}
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("client")}
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("description")}
                      </TableHead>
                      <TableHead
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:bg-accent/50 transition-colors"
                        onClick={() => handleSort("status")}
                        aria-sort={getAriaSort("status")}
                      >
                        <div className="flex items-center gap-2">
                          {t("status")}
                          {getSortIcon("status")}
                        </div>
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("packagesCount")}
                      </TableHead>
                      <TableHead
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:bg-accent/50 transition-colors"
                        onClick={() => handleSort("delivery_date")}
                        aria-sort={getAriaSort("delivery_date")}
                      >
                        <div className="flex items-center gap-2">
                          {t("deliveryDate")}
                          {getSortIcon("delivery_date")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:bg-accent/50 transition-colors"
                        onClick={() => handleSort("created_at")}
                        aria-sort={getAriaSort("created_at")}
                      >
                        <div className="flex items-center gap-2">
                          {t("createdAt")}
                          {getSortIcon("created_at")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsolidations.map((consolidation, index) => (
                      <ConsolidationRow
                        key={consolidation.id}
                        consolidation={consolidation}
                        onView={handleViewConsolidation}
                        onEdit={handleEditConsolidation}
                        onDelete={handleDeleteConsolidation}
                        animationDelay={index * 50}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <p className="text-sm text-muted-foreground">
                  {t("showingResults", {
                    start: (page - 1) * pageSize + 1,
                    end: Math.min(page * pageSize, totalCount),
                    total: totalCount,
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("itemsPerPage")}:
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) =>
                      handlePageSizeChange(parseInt(value, 10))
                    }
                  >
                    <SelectTrigger className="h-8 w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateURL({ page: page - 1 })}
                    disabled={!hasPrevious}
                    aria-label={t("previousPage")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {pageNumbers.map((pageNum, idx) =>
                      pageNum === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-muted-foreground"
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateURL({ page: pageNum as number })}
                          className="h-8 w-8 p-0"
                          aria-label={t("goToPage", { page: pageNum })}
                          aria-current={page === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateURL({ page: page + 1 })}
                    disabled={!hasNext}
                    aria-label={t("nextPage")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
