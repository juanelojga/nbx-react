"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
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
  ConsolidateType,
} from "@/graphql/queries/consolidations";
import {
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

export default function AdminConsolidations() {
  const t = useTranslations("adminConsolidations");

  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  const { data, loading, error, refetch } =
    useQuery<GetAllConsolidatesResponse>(GET_ALL_CONSOLIDATES, {
      notifyOnNetworkStatusChange: true,
    });

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
  }, []);

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

  // Filter and search consolidations
  const filteredConsolidations = useMemo(() => {
    if (!data?.allConsolidates) return [];

    let result = [...data.allConsolidates];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Apply client filter
    if (clientFilter !== "all") {
      result = result.filter((c) => c.client.id === clientFilter);
    }

    // Apply search
    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.client.fullName.toLowerCase().includes(searchLower) ||
          c.client.email.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [data, statusFilter, clientFilter, searchInput]);

  // Get unique clients for filter dropdown
  const uniqueClients = useMemo(() => {
    if (!data?.allConsolidates) return [];
    const clientsMap = new Map();
    data.allConsolidates.forEach((c) => {
      if (!clientsMap.has(c.client.id)) {
        clientsMap.set(c.client.id, c.client);
      }
    });
    return Array.from(clientsMap.values());
  }, [data]);

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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                      setStatusFilter("all");
                      setClientFilter("all");
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
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("id")}</TableHead>
                      <TableHead>{t("client")}</TableHead>
                      <TableHead>{t("description")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("packagesCount")}</TableHead>
                      <TableHead>{t("deliveryDate")}</TableHead>
                      <TableHead>{t("createdAt")}</TableHead>
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
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
