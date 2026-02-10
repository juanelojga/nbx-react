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
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  X,
  Package,
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

const DEBOUNCE_DELAY = 400; // milliseconds

// Rule 7.9: Hoist RegExp creation to module level
const DANGEROUS_CHARS_REGEX = /[<>{};\\\[\]]/g;

// Empty state icon
const EMPTY_STATE_ICON = (
  <svg
    className="h-16 w-16 text-primary/60"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

interface ConsolidationRowProps {
  consolidation: ConsolidateType;
  onView: (id: string) => void;
  onEdit: (consolidation: ConsolidateType) => void;
  onDelete: (consolidation: ConsolidateType) => void;
  t: (key: string) => string;
  tStatus: (key: string) => string;
}

const ConsolidationRow = memo(function ConsolidationRow({
  consolidation,
  onView,
  onEdit,
  onDelete,
  t,
  tStatus,
}: ConsolidationRowProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return tStatus("statusPending");
      case "in_transit":
        return tStatus("statusInTransit");
      case "delivered":
        return tStatus("statusDelivered");
      default:
        return status;
    }
  };

  return (
    <TableRow key={consolidation.id}>
      <TableCell className="font-mono font-medium">
        <div className="max-w-[100px] truncate" title={consolidation.id}>
          {consolidation.id}
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[200px] truncate"
          title={consolidation.client.fullName}
        >
          {consolidation.client.fullName}
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[250px] truncate"
          title={consolidation.description}
        >
          {consolidation.description}
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
        <div className="flex items-center gap-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span>{consolidation.packages.length}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="whitespace-nowrap">
          {consolidation.deliveryDate
            ? new Date(consolidation.deliveryDate).toLocaleDateString()
            : "-"}
        </div>
      </TableCell>
      <TableCell>
        <div className="whitespace-nowrap">
          {new Date(consolidation.createdAt).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                onClick={() => onView(consolidation.id)}
                aria-label={`View ${consolidation.description}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("viewConsolidation")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                onClick={() => onEdit(consolidation)}
                aria-label={`Edit ${consolidation.description}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("editConsolidation")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                onClick={() => onDelete(consolidation)}
                aria-label={`Delete ${consolidation.description}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("deleteConsolidation")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
});

// Pagination button component
interface PaginationButtonProps {
  pageNumber: number;
  isActive: boolean;
  onClick: (page: number) => void;
  t: (key: string, values?: Record<string, string | number | Date>) => string;
}

const PaginationButton = memo(function PaginationButton({
  pageNumber,
  isActive,
  onClick,
  t,
}: PaginationButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={() => onClick(pageNumber)}
      className="h-8 w-8 p-0"
      aria-label={t("goToPage", { page: pageNumber })}
      aria-current={isActive ? "page" : undefined}
    >
      {pageNumber}
    </Button>
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

  // Local state for search input (not synced to URL until debounced)
  const [searchInput, setSearchInput] = useState(urlState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(urlState.search);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Destructure URL state for easier access
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

  // Rule 7.9: Input sanitization function using hoisted regex
  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous characters
    return input.replace(DANGEROUS_CHARS_REGEX, "").trim();
  };

  // Sync search input from URL when it changes (e.g., browser back/forward)
  useEffect(() => {
    if (urlState.search !== searchInput && !isDebouncing) {
      setSearchInput(urlState.search);
      setDebouncedSearch(urlState.search);
    }
  }, [urlState.search, searchInput, isDebouncing]);

  // Debounce search input and update URL
  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsDebouncing(true);
    }

    const timer = setTimeout(() => {
      const sanitized = sanitizeInput(searchInput);
      setDebouncedSearch(sanitized);
      // Update URL with new search and reset to page 1
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

  // Only include search if it has a valid value
  if (debouncedSearch) {
    queryVariables.search = debouncedSearch;
  }

  // Only include status if it's not "all"
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

  // Rule 5.9: Use functional setState updates & Rule 5.6: Narrow effect dependencies with useCallback
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        // Toggle sort order
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        updateURL({ sortOrder: newSortOrder });
      } else {
        // Change sort field, default to ascending
        updateURL({ sortField: field, sortOrder: "asc" });
      }
    },
    [sortField, sortOrder, updateURL]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      // Update page size and reset to page 1
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

  // Rule 5.1: Calculate derived state during rendering
  const totalCount = data?.allConsolidates.totalCount || 0;
  const hasNext = data?.allConsolidates.hasNext || false;
  const hasPrevious = data?.allConsolidates.hasPrevious || false;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Memoize consolidations from API response
  const consolidations = useMemo(
    () => data?.allConsolidates.results || [],
    [data?.allConsolidates.results]
  );

  // Apply client-side filtering for client (backend doesn't support this yet)
  const filteredConsolidations = useMemo(() => {
    if (clientFilter === "all") {
      return consolidations;
    }
    return consolidations.filter((c) => c.client.id === clientFilter);
  }, [consolidations, clientFilter]);

  // Get unique clients for filter dropdown
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

  // Rule 5.8: Subscribe to derived state with useMemo
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page <= 3) {
        // Near the beginning
        for (let i = 2; i <= Math.min(maxVisiblePages, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push(ellipsis);
      } else if (page >= totalPages - 2) {
        // Near the end
        pages.push(ellipsis);
        for (let i = totalPages - maxVisiblePages + 1; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle section
        pages.push(ellipsis);
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push(ellipsis);
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  // Helper function to get sort icon for a column
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

  // Helper function to get ARIA sort attribute
  const getAriaSort = (
    field: SortField
  ): "ascending" | "descending" | "none" => {
    if (sortField !== field) return "none";
    return sortOrder === "asc" ? "ascending" : "descending";
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader title={t("title")} description={t("description")} />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="sm:w-auto"
            >
              <div className={loading ? "animate-spin mr-2" : "mr-2"}>
                <RefreshCw className="h-4 w-4" />
              </div>
              {t("refresh")}
            </Button>
          </div>
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
              {/* Search Input */}
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

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder={t("filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatuses")}</SelectItem>
                  <SelectItem value="pending">{t("statusPending")}</SelectItem>
                  <SelectItem value="in_transit">
                    {t("statusInTransit")}
                  </SelectItem>
                  <SelectItem value="delivered">
                    {t("statusDelivered")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Client Filter */}
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

            {/* Error State */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {t("loadingError", { error: error.message })}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin">
                    <Loader2 className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredConsolidations.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                <div className="mb-6 rounded-full bg-primary/10 p-6">
                  {EMPTY_STATE_ICON}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {searchInput ||
                  statusFilter !== "all" ||
                  clientFilter !== "all"
                    ? t("noMatchingConsolidations")
                    : t("noConsolidationsFound")}
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
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
                    className="mt-4"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t("clearSearch")}
                  </Button>
                )}
              </div>
            )}

            {/* Table */}
            {!loading && !error && filteredConsolidations.length > 0 && (
              <>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("id")}</TableHead>
                        <TableHead>{t("client")}</TableHead>
                        <TableHead>{t("description")}</TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-accent/50 transition-colors"
                          onClick={() => handleSort("status")}
                          aria-sort={getAriaSort("status")}
                        >
                          <div className="flex items-center gap-2">
                            {t("status")}
                            {getSortIcon("status")}
                          </div>
                        </TableHead>
                        <TableHead>{t("packagesCount")}</TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-accent/50 transition-colors"
                          onClick={() => handleSort("delivery_date")}
                          aria-sort={getAriaSort("delivery_date")}
                        >
                          <div className="flex items-center gap-2">
                            {t("deliveryDate")}
                            {getSortIcon("delivery_date")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-accent/50 transition-colors"
                          onClick={() => handleSort("created_at")}
                          aria-sort={getAriaSort("created_at")}
                        >
                          <div className="flex items-center gap-2">
                            {t("createdAt")}
                            {getSortIcon("created_at")}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">
                          {t("actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConsolidations.map((consolidation) => (
                        <ConsolidationRow
                          key={consolidation.id}
                          consolidation={consolidation}
                          onView={handleViewConsolidation}
                          onEdit={handleEditConsolidation}
                          onDelete={handleDeleteConsolidation}
                          t={t}
                          tStatus={t}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
                  {/* Results info and page size selector */}
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

                  {/* Page navigation */}
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
                            <PaginationButton
                              key={pageNum}
                              pageNumber={pageNum as number}
                              isActive={page === pageNum}
                              onClick={(p) => updateURL({ page: p })}
                              t={t}
                            />
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
