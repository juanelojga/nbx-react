"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useConsolidationTableState } from "@/hooks/useConsolidationTableState";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BaseTable,
  type SortState,
  type PaginationState,
} from "@/components/ui/base-table";
import {
  GET_ALL_CONSOLIDATES,
  type GetAllConsolidatesResponse,
  type GetAllConsolidatesVariables,
  type ConsolidateType,
} from "@/graphql/queries/consolidations";
import { RefreshCw, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SortField } from "./components/consolidations-table.types";
import { useConsolidationSearch } from "./hooks/useConsolidationSearch";
import { useConsolidationDialogs } from "./hooks/useConsolidationDialogs";
import { ConsolidationRow } from "./components/ConsolidationRow";
import { ConsolidationToolbar } from "./components/ConsolidationToolbar";
import {
  getConsolidationColumns,
  getEmptyStateConfig,
  getPaginationLabels,
} from "./components/ConsolidationsTableConfig";
import { ConsolidationDialogs } from "./components/ConsolidationDialogs";

export default function AdminConsolidations() {
  const t = useTranslations("adminConsolidations");

  const {
    state: urlState,
    updateURL,
    getOrderBy,
  } = useConsolidationTableState({
    defaultPageSize: 10,
    defaultSortField: "delivery_date",
    defaultSortOrder: "desc",
  });

  const {
    page,
    pageSize,
    sortField,
    sortOrder,
    status: statusFilter,
  } = urlState;

  const handleSearchChange = useCallback(
    (search: string, resetPage: number) => {
      updateURL({ search, page: resetPage });
    },
    [updateURL]
  );

  const {
    searchInput,
    setSearchInput,
    debouncedSearch,
    isDebouncing,
    handleClearSearch,
  } = useConsolidationSearch({
    initialSearch: urlState.search,
    onSearchChange: handleSearchChange,
  });

  const dialogs = useConsolidationDialogs();

  const handleStatusFilterChange = useCallback(
    (newStatus: string) => {
      updateURL({ status: newStatus, page: 1 });
    },
    [updateURL]
  );

  // Build GraphQL variables
  const queryVariables: GetAllConsolidatesVariables = {
    page,
    pageSize,
    orderBy: getOrderBy(),
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

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        updateURL({ sortOrder: sortOrder === "asc" ? "desc" : "asc" });
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

  const consolidations = data?.allConsolidates.results || [];
  const totalCount = data?.allConsolidates.totalCount || 0;
  const hasNext = data?.allConsolidates.hasNext || false;
  const hasPrevious = data?.allConsolidates.hasPrevious || false;

  const columns = useMemo(() => getConsolidationColumns(t), [t]);

  const sortState: SortState = useMemo(
    () => ({ field: sortField, order: sortOrder }),
    [sortField, sortOrder]
  );

  const paginationState: PaginationState | undefined = useMemo(
    () =>
      totalCount > 0
        ? { page, pageSize, totalCount, hasNext, hasPrevious }
        : undefined,
    [page, pageSize, totalCount, hasNext, hasPrevious]
  );

  const paginationLabels = useMemo(() => getPaginationLabels(t), [t]);

  const emptyState = useMemo(
    () =>
      getEmptyStateConfig(
        t,
        searchInput,
        statusFilter,
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleClearSearch();
            updateURL({ status: "all", page: 1 });
          }}
          className="mt-8 gap-2"
        >
          <X className="h-4 w-4" />
          {t("clearSearch")}
        </Button>
      ),
    [t, searchInput, statusFilter, handleClearSearch, updateURL]
  );

  const renderRow = useCallback(
    (consolidation: ConsolidateType, index: number) => (
      <ConsolidationRow
        key={consolidation.id}
        consolidation={consolidation}
        onView={dialogs.handleViewConsolidation}
        onEdit={dialogs.handleEditConsolidation}
        onDelete={dialogs.handleDeleteConsolidation}
        animationDelay={index * 50}
      />
    ),
    [
      dialogs.handleViewConsolidation,
      dialogs.handleEditConsolidation,
      dialogs.handleDeleteConsolidation,
    ]
  );

  const toolbar = (
    <ConsolidationToolbar
      searchInput={searchInput}
      onSearchInputChange={setSearchInput}
      onClearSearch={handleClearSearch}
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusFilterChange}
      isLoading={loading}
      isDebouncing={isDebouncing}
    />
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

      <ConsolidationDialogs
        isViewDialogOpen={dialogs.isViewDialogOpen}
        onViewDialogOpenChange={dialogs.setIsViewDialogOpen}
        isEditDialogOpen={dialogs.isEditDialogOpen}
        onEditDialogOpenChange={dialogs.setIsEditDialogOpen}
        isDeleteDialogOpen={dialogs.isDeleteDialogOpen}
        onDeleteDialogOpenChange={dialogs.setIsDeleteDialogOpen}
        consolidationIdToView={dialogs.consolidationIdToView}
        consolidationToEdit={dialogs.consolidationToEdit}
        consolidationToDelete={dialogs.consolidationToDelete}
        onRefresh={handleRefresh}
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
            toolbar={toolbar}
            withTooltipProvider={true}
            className=""
          />
        </CardContent>
      </Card>
    </div>
  );
}
