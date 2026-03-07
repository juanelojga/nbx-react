"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useClientTableState } from "@/hooks/useClientTableState";
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
  GET_ALL_CLIENTS,
  GetAllClientsResponse,
  GetAllClientsVariables,
} from "@/graphql/queries/clients";
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
  UserPlus,
  Users,
  X,
} from "lucide-react";
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
      <TableCell>
        <div className="flex items-center justify-end gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 shadow-sm ring-1 ring-blue-200/50 transition-all duration-300 hover:scale-110 hover:from-blue-100 hover:to-blue-200/50 hover:text-blue-700 hover:shadow-md hover:ring-blue-300/50 active:scale-95 dark:from-blue-950/30 dark:to-blue-900/20 dark:ring-blue-800/30 dark:hover:from-blue-900/40"
                onClick={() => onView(client.id)}
                aria-label={`View ${client.fullName || client.email}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-medium text-blue-50"
            >
              <p>{t("viewClient")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 shadow-sm ring-1 ring-amber-200/50 transition-all duration-300 hover:scale-110 hover:from-amber-100 hover:to-amber-200/50 hover:text-amber-700 hover:shadow-md hover:ring-amber-300/50 active:scale-95 dark:from-amber-950/30 dark:to-amber-900/20 dark:ring-amber-800/30 dark:hover:from-amber-900/40"
                onClick={() => onEdit(client)}
                aria-label={`Edit ${client.fullName || client.email}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-amber-950 px-3 py-1.5 text-xs font-medium text-amber-50"
            >
              <p>{t("editClient")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 shadow-sm ring-1 ring-red-200/50 transition-all duration-300 hover:scale-110 hover:from-red-100 hover:to-red-200/50 hover:text-red-700 hover:shadow-md hover:ring-red-300/50 active:scale-95 dark:from-red-950/30 dark:to-red-900/20 dark:ring-red-800/30 dark:hover:from-red-900/40"
                onClick={() => onDelete(client)}
                aria-label={`Delete ${client.fullName || client.email}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-red-950 px-3 py-1.5 text-xs font-medium text-red-50"
            >
              <p>{t("deleteClient")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
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

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Rule 5.1: Calculate derived state during rendering
  const clients = data?.allClients.results || [];
  const totalCount = data?.allClients.totalCount || 0;
  const hasNext = data?.allClients.hasNext || false;
  const hasPrevious = data?.allClients.hasPrevious || false;
  const totalPages = Math.ceil(totalCount / pageSize);

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

  // Loading skeleton
  if (loading) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PageHeader title={t("title")} description={t("description")} />
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchInput}
                    disabled
                    className="pl-9 pr-9"
                    aria-label={t("searchPlaceholder")}
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20">
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {t("fullName")}
                        </TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {t("email")}
                        </TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {t("phone")}
                        </TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {t("location")}
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
                      {[...Array(pageSize)].map((_, index) => (
                        <TableRow
                          key={index}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "fade-in 0.6s ease-out forwards",
                            opacity: 0,
                          }}
                        >
                          <TableCell>
                            <div className="h-4 w-32 animate-pulse rounded-md bg-muted/60"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-40 animate-pulse rounded-md bg-muted/60"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-28 animate-pulse rounded-md bg-muted/60"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-36 animate-pulse rounded-md bg-muted/60"></div>
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
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  // Empty state
  if (!loading && !error && clients.length === 0) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PageHeader title={t("title")} description={t("description")} />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("refresh")}
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
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

          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="relative max-w-md">
                  {isDebouncing ? (
                    <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  ) : (
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  )}
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
              </div>

              <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 via-background to-muted/20 py-24 text-center shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
                <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-8 inline-flex rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-inner ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Users className="h-20 w-20 text-primary/60 transition-all duration-500 group-hover:text-primary" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                    {debouncedSearch
                      ? t("noMatchingClients")
                      : t("noClientsFound")}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                    {debouncedSearch
                      ? t("noMatchingClientsDescription", {
                          search: debouncedSearch,
                        })
                      : t("noClientsFoundDescription")}
                  </p>
                  {debouncedSearch && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearSearch}
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
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative max-w-md">
                {isDebouncing ? (
                  <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                ) : (
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                )}
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
            </div>

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  {t("loadingError", { error: error.message })}
                </AlertDescription>
              </Alert>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm transition-colors hover:from-muted/60 hover:to-muted/30">
                      <TableHead
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:bg-accent/50 transition-colors"
                        onClick={() => handleSort("full_name")}
                        aria-sort={getAriaSort("full_name")}
                      >
                        <div className="flex items-center gap-2">
                          {t("fullName")}
                          {getSortIcon("full_name")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:bg-accent/50 transition-colors"
                        onClick={() => handleSort("email")}
                        aria-sort={getAriaSort("email")}
                      >
                        <div className="flex items-center gap-2">
                          {t("email")}
                          {getSortIcon("email")}
                        </div>
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("phone")}
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("location")}
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
                    {clients.map((client, index) => (
                      <ClientRow
                        key={client.id}
                        client={client}
                        onView={handleViewClient}
                        onEdit={handleEditClient}
                        onDelete={handleDeleteClient}
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
                  {t("showing", {
                    start: (page - 1) * pageSize + 1,
                    end: Math.min(page * pageSize, totalCount),
                    total: totalCount,
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("rowsPerPage")}
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
