"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BaseTable,
  type SortState,
  type PaginationState,
} from "@/components/ui/base-table";
import {
  RESOLVE_ALL_PACKAGES,
  type ResolveAllPackagesResponse,
  type ResolveAllPackagesVariables,
  type PackageType,
} from "@/graphql/queries/packages";
import { Plus, RefreshCw, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SortField } from "./components/packages-table.types";
import { usePackageSearch } from "./hooks/usePackageSearch";
import { usePackageDialogs } from "./hooks/usePackageDialogs";
import { usePackageTableState } from "./hooks/usePackageTableState";
import { PackageRow } from "./components/PackageRow";
import { PackageSearchToolbar } from "./components/PackageSearchToolbar";
import {
  getPackageColumns,
  getEmptyStateConfig,
  getPaginationLabels,
} from "./components/PackagesTableConfig";
import { PackageDialogs } from "./components/PackageDialogs";

export default function AdminPackagesManagement() {
  const t = useTranslations("adminPackagesManagement");

  const {
    state: urlState,
    updateURL,
    getOrderBy,
  } = usePackageTableState({
    defaultPageSize: 10,
    defaultSortField: "created_at",
    defaultSortOrder: "desc",
  });

  const { page, pageSize, sortField, sortOrder } = urlState;

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
  } = usePackageSearch({
    initialSearch: urlState.search,
    onSearchChange: handleSearchChange,
  });

  const dialogs = usePackageDialogs();

  const queryVariables: ResolveAllPackagesVariables = {
    page,
    page_size: pageSize,
    order_by: getOrderBy(),
    notInConsolidate: true,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  };

  const { data, loading, error, refetch } = useQuery<
    ResolveAllPackagesResponse,
    ResolveAllPackagesVariables
  >(RESOLVE_ALL_PACKAGES, {
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

  const packages = data?.allPackages.results || [];
  const totalCount = data?.allPackages.totalCount || 0;
  const hasNext = data?.allPackages.hasNext || false;
  const hasPrevious = data?.allPackages.hasPrevious || false;

  const columns = useMemo(() => getPackageColumns(t), [t]);

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
        debouncedSearch,
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSearch}
          className="mt-8 gap-2"
        >
          <X className="h-4 w-4" />
          {t("clearSearch")}
        </Button>
      ),
    [t, debouncedSearch, handleClearSearch]
  );

  const renderRow = useCallback(
    (pkg: PackageType, index: number) => (
      <PackageRow
        key={pkg.id}
        pkg={pkg}
        onView={dialogs.handleViewPackage}
        onEdit={dialogs.handleEditPackage}
        onDelete={dialogs.handleDeletePackage}
        animationDelay={index * 50}
      />
    ),
    [
      dialogs.handleViewPackage,
      dialogs.handleEditPackage,
      dialogs.handleDeletePackage,
    ]
  );

  const searchToolbar = (
    <PackageSearchToolbar
      searchInput={searchInput}
      onSearchInputChange={setSearchInput}
      onClearSearch={handleClearSearch}
      isLoading={loading}
      isDebouncing={isDebouncing}
    />
  );

  return (
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
          <Button
            onClick={() => dialogs.setIsAddDialogOpen(true)}
            className="sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("addPackage")}
          </Button>
        </div>
      </div>

      <PackageDialogs
        isAddDialogOpen={dialogs.isAddDialogOpen}
        onAddDialogOpenChange={dialogs.setIsAddDialogOpen}
        isEditDialogOpen={dialogs.isEditDialogOpen}
        onEditDialogOpenChange={dialogs.setIsEditDialogOpen}
        isDeleteDialogOpen={dialogs.isDeleteDialogOpen}
        onDeleteDialogOpenChange={dialogs.setIsDeleteDialogOpen}
        isViewDialogOpen={dialogs.isViewDialogOpen}
        onViewDialogOpenChange={dialogs.setIsViewDialogOpen}
        packageIdToEdit={dialogs.packageIdToEdit}
        packageToDelete={dialogs.packageToDelete}
        packageIdToView={dialogs.packageIdToView}
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

          <BaseTable
            columns={columns}
            data={packages}
            getRowKey={(pkg) => pkg.id}
            isLoading={loading}
            skeletonRowCount={pageSize}
            renderRow={renderRow}
            sort={sortState}
            onSortChange={handleSort}
            pagination={paginationState}
            onPageChange={(p) => updateURL({ page: p })}
            onPageSizeChange={handlePageSizeChange}
            paginationLabels={paginationLabels}
            emptyState={emptyState}
            toolbar={searchToolbar}
            withTooltipProvider={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
