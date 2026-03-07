"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useClientTableState } from "@/hooks/useClientTableState";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableActionButtons } from "@/components/common/TableActionButtons";
import {
  BaseTable,
  type ColumnDef,
  type SortState,
  type PaginationState,
  type EmptyStateConfig,
  type PaginationLabels,
} from "@/components/ui/base-table";
import {
  GET_ALL_CLIENTS,
  GetAllClientsResponse,
  GetAllClientsVariables,
} from "@/graphql/queries/clients";
import { Loader2, RefreshCw, Search, UserPlus, Users, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Dynamically import dialog components for better bundle splitting
const AddClientDialog = dynamic(
  () =>
    import("@/components/admin/AddClientDialog").then((mod) => ({
      default: mod.AddClientDialog,
    })),
  { ssr: false }
);
const DeleteClientDialog = dynamic(
  () =>
    import("@/components/admin/DeleteClientDialog").then((mod) => ({
      default: mod.DeleteClientDialog,
    })),
  { ssr: false }
);
const EditClientDialog = dynamic(
  () =>
    import("@/components/admin/EditClientDialog").then((mod) => ({
      default: mod.EditClientDialog,
    })),
  { ssr: false }
);
const ViewClientDialog = dynamic(
  () =>
    import("@/components/admin/ViewClientDialog").then((mod) => ({
      default: mod.ViewClientDialog,
    })),
  { ssr: false }
);

type SortField = "full_name" | "email" | "created_at";

const DEBOUNCE_DELAY = 400; // milliseconds

// Rule 7.9: Hoist RegExp creation to module level
const DANGEROUS_CHARS_REGEX = /[<>{};\\\[\]]/g;

// Rule 5.5: Extract to memoized components - ClientRow
interface ClientRowProps {
  client: {
    id: string;
    fullName: string;
    email: string;
    mobilePhoneNumber: string | null;
    phoneNumber: string | null;
    city: string | null;
    state: string | null;
    createdAt: string;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
    identificationNumber: string | null;
    mainStreet: string | null;
    secondaryStreet: string | null;
    buildingNumber: string | null;
  };
  onView: (clientId: string) => void;
  onEdit: (client: ClientRowProps["client"]) => void;
  onDelete: (client: ClientRowProps["client"]) => void;
  animationDelay?: number;
}

const ClientRow = memo(function ClientRow({
  client,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}: ClientRowProps) {
  const t = useTranslations("adminClients");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TableRow
      key={client.id}
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
            className="max-w-[200px] truncate text-xs font-medium text-foreground transition-colors duration-300"
            title={client.fullName || "-"}
          >
            {client.fullName || "-"}
          </div>
          <div
            className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 ${
              isHovered ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          />
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[250px] truncate text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300"
          title={client.email}
        >
          {client.email}
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[150px] truncate text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300"
          title={client.mobilePhoneNumber || client.phoneNumber || "-"}
        >
          {client.mobilePhoneNumber || client.phoneNumber || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[200px] truncate text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300"
          title={
            client.city && client.state
              ? `${client.city}, ${client.state}`
              : client.city || client.state || "-"
          }
        >
          {client.city && client.state
            ? `${client.city}, ${client.state}`
            : client.city || client.state || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <time
              className="text-xs font-medium text-foreground/80 whitespace-nowrap"
              dateTime={client.createdAt}
            >
              {new Date(client.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </TableCell>
      <TableActionButtons
        onView={{
          onClick: () => onView(client.id),
          ariaLabel: `View ${client.fullName || client.email}`,
          tooltip: t("viewClient"),
        }}
        onEdit={{
          onClick: () => onEdit(client),
          ariaLabel: `Edit ${client.fullName || client.email}`,
          tooltip: t("editClient"),
        }}
        onDelete={{
          onClick: () => onDelete(client),
          ariaLabel: `Delete ${client.fullName || client.email}`,
          tooltip: t("deleteClient"),
        }}
      />
    </TableRow>
  );
});

export default function AdminClients() {
  const t = useTranslations("adminClients");

  // URL state synchronization
  const {
    state: urlState,
    updateURL,
    getOrderBy,
  } = useClientTableState({
    defaultPageSize: 10,
    defaultSortField: "created_at",
    defaultSortOrder: "desc",
  });

  // Local state for search input (not synced to URL until debounced)
  const [searchInput, setSearchInput] = useState(urlState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(urlState.search);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Destructure URL state for easier access
  const { page, pageSize, sortField, sortOrder } = urlState;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{
    id: string;
    userId: string;
    fullName: string;
    email: string;
  } | null>(null);
  const [clientToEdit, setClientToEdit] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    identificationNumber: string | null;
    mobilePhoneNumber: string | null;
    phoneNumber: string | null;
    state: string | null;
    city: string | null;
    mainStreet: string | null;
    secondaryStreet: string | null;
    buildingNumber: string | null;
  } | null>(null);
  const [clientIdToView, setClientIdToView] = useState<string | null>(null);

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
  const queryVariables: GetAllClientsVariables = {
    page,
    pageSize,
    orderBy,
  };

  // Only include search if it has a valid value
  if (debouncedSearch) {
    queryVariables.search = debouncedSearch;
  }

  const { data, loading, error, refetch } = useQuery<
    GetAllClientsResponse,
    GetAllClientsVariables
  >(GET_ALL_CLIENTS, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true, // Show loading state on refetch
  });

  // Rule 5.9: Use functional setState updates & Rule 5.6: Narrow effect dependencies with useCallback
  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        // Toggle sort order
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        updateURL({ sortOrder: newSortOrder });
      } else {
        // Change sort field, default to ascending
        updateURL({ sortField: field as SortField, sortOrder: "asc" });
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

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Rule 5.1: Calculate derived state during rendering
  const clients = data?.allClients.results || [];
  const totalCount = data?.allClients.totalCount || 0;
  const hasNext = data?.allClients.hasNext || false;
  const hasPrevious = data?.allClients.hasPrevious || false;

  // Rule 5.7: Put interaction logic in event handlers (with useCallback for stability)
  const handleViewClient = useCallback((clientId: string) => {
    setClientIdToView(clientId);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditClient = useCallback(
    (client: {
      id: string;
      user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
      };
      email: string;
      identificationNumber: string | null;
      mobilePhoneNumber: string | null;
      phoneNumber: string | null;
      state: string | null;
      city: string | null;
      mainStreet: string | null;
      secondaryStreet: string | null;
      buildingNumber: string | null;
    }) => {
      setClientToEdit({
        id: client.id,
        firstName: client.user.firstName || "",
        lastName: client.user.lastName || "",
        email: client.email,
        identificationNumber: client.identificationNumber,
        mobilePhoneNumber: client.mobilePhoneNumber,
        phoneNumber: client.phoneNumber,
        state: client.state,
        city: client.city,
        mainStreet: client.mainStreet,
        secondaryStreet: client.secondaryStreet,
        buildingNumber: client.buildingNumber,
      });
      setIsEditDialogOpen(true);
    },
    []
  );

  const handleDeleteClient = useCallback(
    (client: {
      id: string;
      user: { id: string };
      fullName: string;
      email: string;
    }) => {
      setClientToDelete({
        id: client.id,
        userId: client.user.id,
        fullName: client.fullName,
        email: client.email,
      });
      setIsDeleteDialogOpen(true);
    },
    []
  );

  const columns: ColumnDef<(typeof clients)[number]>[] = useMemo(
    () => [
      {
        id: "fullName",
        header: t("fullName"),
        cell: () => null,
        sortable: true,
        sortField: "full_name",
        skeletonWidth: "8rem",
      },
      {
        id: "email",
        header: t("email"),
        cell: () => null,
        sortable: true,
        sortField: "email",
        skeletonWidth: "10rem",
      },
      {
        id: "phone",
        header: t("phone"),
        cell: () => null,
        skeletonWidth: "7rem",
      },
      {
        id: "location",
        header: t("location"),
        cell: () => null,
        skeletonWidth: "9rem",
      },
      {
        id: "createdAt",
        header: t("createdAt"),
        cell: () => null,
        sortable: true,
        sortField: "created_at",
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
        t("showing", { start, end, total }),
      rowsPerPage: t("rowsPerPage"),
      previousPage: t("previousPage"),
      nextPage: t("nextPage"),
      goToPage: (pageNum: number | string) => t("goToPage", { page: pageNum }),
    }),
    [t]
  );

  const emptyState: EmptyStateConfig = useMemo(
    () => ({
      icon: Users,
      title: debouncedSearch ? t("noMatchingClients") : t("noClientsFound"),
      description: debouncedSearch
        ? t("noMatchingClientsDescription", { search: debouncedSearch })
        : t("noClientsFoundDescription"),
      action: debouncedSearch ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSearch}
          className="mt-8 gap-2"
        >
          <X className="h-4 w-4" />
          {t("clearSearch")}
        </Button>
      ) : undefined,
    }),
    [t, debouncedSearch, handleClearSearch]
  );

  const renderRow = useCallback(
    (client: (typeof clients)[number], index: number, _isSelected: boolean) => (
      <ClientRow
        key={client.id}
        client={client}
        onView={handleViewClient}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        animationDelay={index * 50}
      />
    ),
    [handleViewClient, handleEditClient, handleDeleteClient]
  );

  const searchToolbar = (
    <div className="mb-6">
      <div className="relative max-w-md">
        {loading || isDebouncing ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={loading && !searchInput}
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
    </div>
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
            {/* Rule 6.1: Animate wrapper div instead of SVG icon */}
            <div className={loading ? "animate-spin mr-2" : "mr-2"}>
              <RefreshCw className="h-4 w-4" />
            </div>
            {t("refresh")}
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="sm:w-auto"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {t("addClient")}
          </Button>
        </div>
      </div>

      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onClientCreated={handleRefresh}
      />

      <DeleteClientDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        client={clientToDelete}
        onClientDeleted={handleRefresh}
      />

      <EditClientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={clientToEdit}
        onClientUpdated={handleRefresh}
      />

      <ViewClientDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        clientId={clientIdToView}
      />

      <Card>
        <CardContent className="p-6">
          {/* Error State */}
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
