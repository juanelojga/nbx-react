"use client";

import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ListPageShell } from "@/components/common/ListPageShell";
import { RefreshButton } from "@/components/common/RefreshButton";
import { BaseTable } from "@/components/data-display/base-table";
import { Button } from "@/components/ui/button";
import {
  type ConsolidateType,
  GET_ALL_CONSOLIDATES,
  type GetAllConsolidatesResponse,
  type GetAllConsolidatesVariables,
} from "@/graphql/queries/consolidations";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import {
  type DateRangeError,
  validateDateRange,
} from "@/lib/validation/consolidationFilters";

import { ConsolidationDialogs } from "./components/ConsolidationDialogs";
import { ConsolidationRow } from "./components/ConsolidationRow";
import {
  SORT_FIELDS,
  type SortField,
} from "./components/consolidations-table.types";
import {
  getConsolidationColumns,
  getEmptyStateConfig,
  getPaginationLabels,
} from "./components/ConsolidationsTableConfig";
import { ConsolidationToolbar } from "./components/ConsolidationToolbar";
import {
  type ConsolidationExtraParams,
  consolidationExtraParams,
} from "./hooks/consolidationExtraParams";
import { useConsolidationDialogs } from "./hooks/useConsolidationDialogs";

const DEFAULT_SORT = { field: "created_at", order: "desc" } as const;

const buildVariables = (
  state: ConsolidationExtraParams & {
    page: number;
    pageSize: number;
    orderBy: string;
    search: string;
  }
): GetAllConsolidatesVariables => ({
  page: state.page,
  pageSize: state.pageSize,
  orderBy: state.orderBy,
  ...(state.search ? { search: state.search } : {}),
  ...(state.status !== "all" ? { status: state.status } : {}),
  ...(state.createdAfter ? { createdAfter: state.createdAfter } : {}),
  ...(state.createdBefore ? { createdBefore: state.createdBefore } : {}),
});

const selectConnection = (data: GetAllConsolidatesResponse | undefined) =>
  data?.allConsolidates;

export function AdminConsolidationsPage() {
  const t = useTranslations("adminConsolidations");
  const dialogs = useConsolidationDialogs();

  const list = useAdminListPage<
    GetAllConsolidatesResponse,
    GetAllConsolidatesVariables,
    ConsolidateType,
    SortField,
    ConsolidationExtraParams
  >({
    query: GET_ALL_CONSOLIDATES,
    sortFields: SORT_FIELDS,
    defaultSort: DEFAULT_SORT,
    extra: consolidationExtraParams,
    buildVariables,
    selectConnection,
  });
  const { updateURL } = list;
  const { input: searchInput, clear: clearSearch } = list.search;
  const { status: statusFilter, createdAfter, createdBefore } = list.urlState;

  // Draft state so the date inputs reflect typing immediately; only valid
  // ranges are pushed to the URL/query.
  const [createdAfterInput, setCreatedAfterInput] = useState(createdAfter);
  const [createdBeforeInput, setCreatedBeforeInput] = useState(createdBefore);
  const [dateRangeError, setDateRangeError] = useState<DateRangeError>(null);

  const commitDateRange = useCallback(
    (nextAfter: string, nextBefore: string) => {
      const error = validateDateRange(nextAfter, nextBefore);
      setDateRangeError(error);
      if (error) return;
      updateURL({
        createdAfter: nextAfter,
        createdBefore: nextBefore,
        page: 1,
      });
    },
    [updateURL]
  );

  const handleCreatedAfterChange = useCallback(
    (value: string) => {
      setCreatedAfterInput(value);
      commitDateRange(value, createdBeforeInput);
    },
    [commitDateRange, createdBeforeInput]
  );

  const handleCreatedBeforeChange = useCallback(
    (value: string) => {
      setCreatedBeforeInput(value);
      commitDateRange(createdAfterInput, value);
    },
    [commitDateRange, createdAfterInput]
  );

  // On first mount, persist the defaulted today/today range into the URL so
  // the active filter is visible and shareable.
  const rawSearchParams = useSearchParams();
  const didSyncDefaults = useRef(false);
  useEffect(() => {
    if (didSyncDefaults.current) return;
    didSyncDefaults.current = true;
    if (
      !rawSearchParams.has("createdAfter") &&
      !rawSearchParams.has("createdBefore") &&
      createdAfter &&
      createdBefore
    ) {
      updateURL({ createdAfter, createdBefore });
    }
  }, [rawSearchParams, createdAfter, createdBefore, updateURL]);

  const handleClearDates = useCallback(() => {
    setCreatedAfterInput("");
    setCreatedBeforeInput("");
    setDateRangeError(null);
    updateURL({ createdAfter: "", createdBefore: "", page: 1 });
  }, [updateURL]);

  const handleStatusFilterChange = useCallback(
    (status: string) => updateURL({ status, page: 1 }),
    [updateURL]
  );

  const columns = useMemo(() => getConsolidationColumns(t), [t]);
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
            clearSearch();
            updateURL({ status: "all", page: 1 });
          }}
          className="mt-8 gap-2"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          {t("clearSearch")}
        </Button>
      ),
    [t, searchInput, statusFilter, clearSearch, updateURL]
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

  const getRowKey = useCallback((c: ConsolidateType) => c.id, []);

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
        <RefreshButton
          onClick={list.refresh}
          loading={list.loading}
          label={t("refresh")}
        />
      }
    >
      <ConsolidationDialogs dialogs={dialogs} onRefresh={list.refresh} />

      <BaseTable<ConsolidateType>
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
          <ConsolidationToolbar
            searchInput={list.search.input}
            onSearchInputChange={list.search.setInput}
            onClearSearch={list.search.clear}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            createdAfter={createdAfterInput}
            createdBefore={createdBeforeInput}
            onCreatedAfterChange={handleCreatedAfterChange}
            onCreatedBeforeChange={handleCreatedBeforeChange}
            onClearDates={handleClearDates}
            dateRangeError={dateRangeError}
            isLoading={list.loading}
            isDebouncing={list.search.isDebouncing}
          />
        }
      />
    </ListPageShell>
  );
}
