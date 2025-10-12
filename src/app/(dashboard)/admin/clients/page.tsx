"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
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
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Loader2,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddClientDialog } from "@/components/admin/AddClientDialog";
import { DeleteClientDialog } from "@/components/admin/DeleteClientDialog";
import { EditClientDialog } from "@/components/admin/EditClientDialog";
import { ViewClientDialog } from "@/components/admin/ViewClientDialog";

type SortField = "full_name" | "email" | "created_at";
type SortOrder = "asc" | "desc";

const DEBOUNCE_DELAY = 400; // milliseconds

export default function AdminClients() {
  const t = useTranslations("adminClients");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
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

  const orderBy = `${sortOrder === "desc" ? "-" : ""}${sortField}`;

  // Input sanitization function
  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous characters
    return input.replace(/[<>{};\\\[\]]/g, "").trim();
  };

  // Debounce search input
  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsDebouncing(true);
    }

    const timer = setTimeout(() => {
      const sanitized = sanitizeInput(searchInput);
      setDebouncedSearch(sanitized);
      setPage(1); // Reset to first page on search
      setIsDebouncing(false);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchInput, debouncedSearch]);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setDebouncedSearch("");
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const clients = data?.allClients.results || [];
  const totalCount = data?.allClients.totalCount || 0;
  const hasNext = data?.allClients.hasNext || false;
  const hasPrevious = data?.allClients.hasPrevious || false;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
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
  };

  const pageNumbers = generatePageNumbers();

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

  // Action handlers
  const handleViewClient = (clientId: string) => {
    setClientIdToView(clientId);
    setIsViewDialogOpen(true);
  };

  const handleEditClient = (client: {
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
  };

  const handleDeleteClient = (client: {
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
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
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
              <Alert variant="destructive">
                <AlertDescription>
                  {t("loadingError", { error: error.message })}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State - Skeleton */}
            {loading && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("fullName")}</TableHead>
                        <TableHead>{t("email")}</TableHead>
                        <TableHead>{t("phone")}</TableHead>
                        <TableHead>{t("location")}</TableHead>
                        <TableHead>{t("createdAt")}</TableHead>
                        <TableHead className="text-right">
                          {t("actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(pageSize)].map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-40 animate-pulse rounded bg-muted"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-28 animate-pulse rounded bg-muted"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-36 animate-pulse rounded bg-muted"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
                              <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
                              <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-9 w-32 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
                    <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
                    <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && clients.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                <div className="mb-6 rounded-full bg-primary/10 p-6">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {debouncedSearch
                    ? t("noMatchingClients")
                    : t("noClientsFound")}
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
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
                    className="mt-4"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t("clearSearch")}
                  </Button>
                )}
              </div>
            )}

            {/* Table - with horizontal scroll only */}
            {!loading && !error && clients.length > 0 && (
              <>
                <div className="overflow-x-auto overflow-y-visible rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead aria-sort={getAriaSort("full_name")}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("full_name")}
                            className={`flex items-center gap-1 ${
                              sortField === "full_name"
                                ? "text-primary font-semibold"
                                : ""
                            }`}
                          >
                            {t("fullName")}
                            {getSortIcon("full_name")}
                          </Button>
                        </TableHead>
                        <TableHead aria-sort={getAriaSort("email")}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("email")}
                            className={`flex items-center gap-1 ${
                              sortField === "email"
                                ? "text-primary font-semibold"
                                : ""
                            }`}
                          >
                            {t("email")}
                            {getSortIcon("email")}
                          </Button>
                        </TableHead>
                        <TableHead>{t("phone")}</TableHead>
                        <TableHead>{t("location")}</TableHead>
                        <TableHead aria-sort={getAriaSort("created_at")}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("created_at")}
                            className={`flex items-center gap-1 ${
                              sortField === "created_at"
                                ? "text-primary font-semibold"
                                : ""
                            }`}
                          >
                            {t("createdAt")}
                            {getSortIcon("created_at")}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          {t("actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            <div
                              className="max-w-[200px] truncate"
                              title={client.fullName || "-"}
                            >
                              {client.fullName || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className="max-w-[250px] truncate"
                              title={client.email}
                            >
                              {client.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className="max-w-[150px] truncate"
                              title={
                                client.mobilePhoneNumber ||
                                client.phoneNumber ||
                                "-"
                              }
                            >
                              {client.mobilePhoneNumber ||
                                client.phoneNumber ||
                                "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className="max-w-[200px] truncate"
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
                            <div className="whitespace-nowrap">
                              {new Date(client.createdAt).toLocaleDateString()}
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
                                    onClick={() => handleViewClient(client.id)}
                                    aria-label={`View ${client.fullName || client.email}`}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t("viewClient")}</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                                    onClick={() => handleEditClient(client)}
                                    aria-label={`Edit ${client.fullName || client.email}`}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t("editClient")}</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                    onClick={() => handleDeleteClient(client)}
                                    aria-label={`Delete ${client.fullName || client.email}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t("deleteClient")}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination and Page Size Controls */}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center">
                  {/* Left: Page Size Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t("rowsPerPage")}
                    </span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) =>
                        handlePageSizeChange(parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-[70px]">
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

                  {/* Center: Showing Entries */}
                  <div className="flex justify-center">
                    <span className="text-sm text-muted-foreground">
                      {t("showing", {
                        start: (page - 1) * pageSize + 1,
                        end: Math.min(page * pageSize, totalCount),
                        total: totalCount,
                      })}
                    </span>
                  </div>

                  {/* Right: Pagination Controls */}
                  <div className="flex items-center justify-end gap-1">
                    {/* Previous Button - Icon Only */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setPage(page - 1)}
                      disabled={!hasPrevious}
                      aria-label={t("previousPage")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers - Desktop Only */}
                    <div className="hidden sm:flex items-center gap-1">
                      {pageNumbers.map((pageNum, index) => {
                        if (pageNum === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 text-sm text-muted-foreground"
                            >
                              …
                            </span>
                          );
                        }

                        const pageNumber = pageNum as number;
                        const isActive = pageNumber === page;

                        return (
                          <Button
                            key={pageNumber}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNumber)}
                            className="h-8 w-8 p-0"
                            aria-label={t("goToPage", { page: pageNumber })}
                            aria-current={isActive ? "page" : undefined}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Mobile: Current Page Indicator */}
                    <div className="flex sm:hidden items-center justify-center min-w-[60px]">
                      <span className="text-sm font-medium">
                        {page} / {totalPages}
                      </span>
                    </div>

                    {/* Next Button - Icon Only */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setPage(page + 1)}
                      disabled={!hasNext}
                      aria-label={t("nextPage")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
