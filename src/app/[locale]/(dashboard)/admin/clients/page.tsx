"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useClientTableState } from "@/hooks/useClientTableState";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BaseTable,
  type SortState,
  type PaginationState,
} from "@/components/ui/base-table";
import {
  GET_ALL_CLIENTS,
  type GetAllClientsResponse,
  type GetAllClientsVariables,
  type ClientType,
} from "@/graphql/queries/clients";
import { RefreshCw, UserPlus, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SortField } from "./components/clients-table.types";
import { useClientSearch } from "./hooks/useClientSearch";
import { useClientDialogs } from "./hooks/useClientDialogs";
import { ClientRow } from "./components/ClientRow";
import { ClientSearchToolbar } from "./components/ClientSearchToolbar";
import {
  getClientColumns,
  getEmptyStateConfig,
  getPaginationLabels,
} from "./components/ClientsTableConfig";
import { ClientDialogs } from "./components/ClientDialogs";

export default function AdminClients() {
  const t = useTranslations("adminClients");

  const {
    state: urlState,
    updateURL,
    getOrderBy,
  } = useClientTableState({
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
  } = useClientSearch({
    initialSearch: urlState.search,
    onSearchChange: handleSearchChange,
  });

  const dialogs = useClientDialogs();

  // Build GraphQL variables
  const queryVariables: GetAllClientsVariables = {
    page,
    pageSize,
    orderBy: getOrderBy(),
  };
  if (debouncedSearch) {
    queryVariables.search = debouncedSearch;
  }

  const { data, loading, error, refetch } = useQuery<
    GetAllClientsResponse,
    GetAllClientsVariables
  >(GET_ALL_CLIENTS, {
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

  const clients = data?.allClients.results || [];
  const totalCount = data?.allClients.totalCount || 0;
  const hasNext = data?.allClients.hasNext || false;
  const hasPrevious = data?.allClients.hasPrevious || false;

  const columns = useMemo(() => getClientColumns(t), [t]);

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
    (client: ClientType, index: number) => (
      <ClientRow
        key={client.id}
        client={client}
        onView={dialogs.handleViewClient}
        onEdit={dialogs.handleEditClient}
        onDelete={dialogs.handleDeleteClient}
        animationDelay={index * 50}
      />
    ),
    [
      dialogs.handleViewClient,
      dialogs.handleEditClient,
      dialogs.handleDeleteClient,
    ]
  );

  const searchToolbar = (
    <ClientSearchToolbar
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
            <UserPlus className="mr-2 h-4 w-4" />
            {t("addClient")}
          </Button>
        </div>
      </div>

      <ClientDialogs
        isAddDialogOpen={dialogs.isAddDialogOpen}
        onAddDialogOpenChange={dialogs.setIsAddDialogOpen}
        isDeleteDialogOpen={dialogs.isDeleteDialogOpen}
        onDeleteDialogOpenChange={dialogs.setIsDeleteDialogOpen}
        isEditDialogOpen={dialogs.isEditDialogOpen}
        onEditDialogOpenChange={dialogs.setIsEditDialogOpen}
        isViewDialogOpen={dialogs.isViewDialogOpen}
        onViewDialogOpenChange={dialogs.setIsViewDialogOpen}
        clientToDelete={dialogs.clientToDelete}
        clientToEdit={dialogs.clientToEdit}
        clientIdToView={dialogs.clientIdToView}
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
            data={clients}
            getRowKey={(client) => client.id}
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
            className=""
          />
        </CardContent>
      </Card>
    </div>
  );
}
