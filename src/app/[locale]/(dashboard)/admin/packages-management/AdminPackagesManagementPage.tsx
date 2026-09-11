"use client";

import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { ListPageShell } from "@/components/common/ListPageShell";
import { RefreshButton } from "@/components/common/RefreshButton";
import { SearchToolbar } from "@/components/common/SearchToolbar";
import { BaseTable } from "@/components/data-display/base-table";
import { Button } from "@/components/ui/button";
import {
  GET_ALL_PACKAGES,
  type GetAllPackagesResponse,
  type GetAllPackagesVariables,
  type PackageType,
} from "@/graphql/queries/packages";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { toListConnection } from "@/lib/graphql/toListConnection";

import { PackageDialogs } from "./components/PackageDialogs";
import { PackageRow } from "./components/PackageRow";
import { SORT_FIELDS, type SortField } from "./components/packages-table.types";
import {
  getEmptyStateConfig,
  getPackageColumns,
  getPaginationLabels,
} from "./components/PackagesTableConfig";
import { usePackageDialogs } from "./hooks/usePackageDialogs";

const DEFAULT_SORT = { field: "created_at", order: "desc" } as const;

const buildVariables = (state: {
  page: number;
  pageSize: number;
  orderBy: string;
  search: string;
}): GetAllPackagesVariables => ({
  page: state.page,
  pageSize: state.pageSize,
  orderBy: state.orderBy,
  notInConsolidate: true,
  ...(state.search ? { search: state.search } : {}),
});

const selectConnection = (data: GetAllPackagesResponse | undefined) =>
  toListConnection(data?.allPackages);

export function AdminPackagesManagementPage() {
  const t = useTranslations("adminPackagesManagement");
  const dialogs = usePackageDialogs();

  const list = useAdminListPage<
    GetAllPackagesResponse,
    GetAllPackagesVariables,
    PackageType,
    SortField
  >({
    query: GET_ALL_PACKAGES,
    sortFields: SORT_FIELDS,
    defaultSort: DEFAULT_SORT,
    buildVariables,
    selectConnection,
  });

  const columns = useMemo(() => getPackageColumns(t), [t]);
  const paginationLabels = useMemo(() => getPaginationLabels(t), [t]);
  const emptyState = useMemo(
    () =>
      getEmptyStateConfig(
        t,
        list.search.debounced,
        <Button
          variant="outline"
          size="sm"
          onClick={list.search.clear}
          className="mt-8 gap-2"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          {t("clearSearch")}
        </Button>
      ),
    [t, list.search.debounced, list.search.clear]
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

  const getRowKey = useCallback((pkg: PackageType) => pkg.id, []);

  return (
    <ListPageShell
      title={t("title")}
      description={t("description")}
      errorMessage={
        list.errorMessage
          ? t("loadingError", { error: list.errorMessage })
          : null
      }
      actions={
        <>
          <RefreshButton
            onClick={list.refresh}
            loading={list.loading}
            label={t("refresh")}
          />
          <Button
            onClick={() => dialogs.setIsAddDialogOpen(true)}
            className="sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            {t("addPackage")}
          </Button>
        </>
      }
    >
      <PackageDialogs dialogs={dialogs} onRefresh={list.refresh} />

      <BaseTable
        columns={columns}
        data={list.items}
        getRowKey={getRowKey}
        isLoading={list.loading}
        skeletonRowCount={list.table.skeletonRowCount}
        renderRow={renderRow}
        sort={list.table.sort}
        onSortChange={list.table.onSortChange}
        pagination={list.table.pagination}
        onPageChange={list.table.onPageChange}
        onPageSizeChange={list.table.onPageSizeChange}
        paginationLabels={paginationLabels}
        emptyState={emptyState}
        toolbar={
          <SearchToolbar
            className="mb-6 max-w-md"
            value={list.search.input}
            onChange={list.search.setInput}
            onClear={list.search.clear}
            placeholder={t("searchPlaceholder")}
            clearLabel={t("clearSearch")}
            isLoading={list.loading}
            isDebouncing={list.search.isDebouncing}
          />
        }
      />
    </ListPageShell>
  );
}
