"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useConsolidationTableState } from "@/hooks/useConsolidationTableState";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BaseTable,
  type ColumnDef,
  type SortState,
  type PaginationState,
  type EmptyStateConfig,
  type PaginationLabels,
} from "@/components/ui/base-table";
import {
  GET_ALL_CONSOLIDATES,
  GetAllConsolidatesResponse,
  GetAllConsolidatesVariables,
  ConsolidateType,
} from "@/graphql/queries/consolidations";
import {
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

type SortField = "delivery_date" | "status";

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
        <div className="relative">
          <div
            className="font-mono text-xs font-semibold tracking-wide text-foreground transition-colors duration-300"
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
      </TableCell>
      <TableCell>
        <div className="relative max-w-[200px]">
          <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300 truncate">
            {consolidation.client.fullName}
          </p>
        </div>
      </TableCell>
      <TableCell className="whitespace-normal">
        <div className="relative max-w-xs">
          {consolidation.description ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs transition-colors duration-300 line-clamp-3 text-muted-foreground group-hover:text-foreground cursor-default">
                  {consolidation.description}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-sm text-[11px]">
                {consolidation.description}
              </TooltipContent>
            </Tooltip>
          ) : (
            <p className="text-xs transition-colors duration-300 text-muted-foreground/40 italic">
              {"\u2014"}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge
          status={consolidation.status}
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
                : "\u2014"}
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
    defaultSortField: "delivery_date",
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
    (field: string) => {
      if (sortField === field) {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        updateURL({ sortOrder: newSortOrder });
      } else {
        updateURL({ sortField: field as SortField, sortOrder: "asc" });
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

  const consolidations = useMemo(
    () => data?.allConsolidates.results || [],
    [data?.allConsolidates.results]
  );

  const columns: ColumnDef<ConsolidateType>[] = useMemo(
    () => [
      {
        id: "id",
        header: t("id"),
        cell: () => null,
        skeletonWidth: "8rem",
      },
      {
        id: "client",
        header: t("client"),
        cell: () => null,
        skeletonWidth: "9rem",
      },
      {
        id: "description",
        header: t("description"),
        cell: () => null,
        skeletonWidth: "10rem",
      },
      {
        id: "status",
        header: t("status"),
        cell: () => null,
        sortable: true,
        sortField: "status",
        skeletonWidth: "5rem",
        skeletonVariant: "badge",
      },
      {
        id: "packagesCount",
        header: t("packagesCount"),
        cell: () => null,
        skeletonWidth: "3rem",
        skeletonVariant: "date",
      },
      {
        id: "deliveryDate",
        header: t("deliveryDate"),
        cell: () => null,
        sortable: true,
        sortField: "delivery_date",
        skeletonWidth: "7rem",
        skeletonVariant: "date",
      },
      {
        id: "actions",
        header: t("actions"),
        cell: () => null,
        align: "right",
        skeletonVariant: "actions",
        skeletonActionCount: 3,
      },
    ],
    [t]
  );

  const sortState: SortState = useMemo(
    () => ({
      field: sortField,
      order: sortOrder,
    }),
    [sortField, sortOrder]
  );

  const paginationState: PaginationState | undefined = useMemo(
    () =>
      totalCount > 0
        ? { page, pageSize, totalCount, hasNext, hasPrevious }
        : undefined,
    [page, pageSize, totalCount, hasNext, hasPrevious]
  );

  const paginationLabels: PaginationLabels = useMemo(
    () => ({
      showing: (start: number, end: number, total: number) =>
        t("showingResults", { start, end, total }),
      rowsPerPage: `${t("itemsPerPage")}:`,
      previousPage: t("previousPage"),
      nextPage: t("nextPage"),
      goToPage: (pageNum: number | string) => t("goToPage", { page: pageNum }),
    }),
    [t]
  );

  const emptyState: EmptyStateConfig = useMemo(
    () => ({
      icon: PackageIcon,
      title:
        searchInput || statusFilter !== "all"
          ? t("noMatchingConsolidations")
          : t("noConsolidationsFound"),
      description: searchInput
        ? t("noMatchingConsolidationsDescription", { search: searchInput })
        : t("noConsolidationsFoundDescription"),
      action:
        searchInput || statusFilter !== "all" ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchInput("");
              updateURL({ search: "", status: "all", page: 1 });
            }}
            className="mt-8 gap-2"
          >
            <X className="h-4 w-4" />
            {t("clearSearch")}
          </Button>
        ) : undefined,
    }),
    [t, searchInput, statusFilter, updateURL]
  );

  const renderRow = useCallback(
    (consolidation: ConsolidateType, index: number, _isSelected: boolean) => (
      <ConsolidationRow
        key={consolidation.id}
        consolidation={consolidation}
        onView={handleViewConsolidation}
        onEdit={handleEditConsolidation}
        onDelete={handleDeleteConsolidation}
        animationDelay={index * 50}
      />
    ),
    [
      handleViewConsolidation,
      handleEditConsolidation,
      handleDeleteConsolidation,
    ]
  );

  const searchAndFilterToolbar = (
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

      <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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

  return (
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
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {t("loadingError", { error: error.message })}
              </AlertDescription>
            </Alert>
          )}

          <BaseTable<ConsolidateType>
            columns={columns}
            data={consolidations}
            getRowKey={(c) => c.id}
            isLoading={loading}
            renderRow={renderRow}
            sort={sortState}
            onSortChange={handleSort}
            pagination={paginationState}
            onPageChange={(p) => updateURL({ page: p })}
            onPageSizeChange={handlePageSizeChange}
            paginationLabels={paginationLabels}
            emptyState={emptyState}
            toolbar={searchAndFilterToolbar}
            withTooltipProvider={true}
            className=""
          />
        </CardContent>
      </Card>
    </div>
  );
}
