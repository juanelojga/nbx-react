"use client";

import { memo, useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BaseTable,
  type ColumnDef,
  type EmptyStateConfig,
} from "@/components/ui/base-table";
import {
  Package as PackageIcon,
  X,
  Eye,
  Trash2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { Package } from "../types";

// Dynamically import dialog components for better bundle splitting
const PackageDetailsModal = dynamic(
  () =>
    import("./PackageDetailsModal").then((mod) => ({
      default: mod.PackageDetailsModal,
    })),
  { ssr: false }
);
const DeletePackageDialog = dynamic(
  () =>
    import("./DeletePackageDialog").then((mod) => ({
      default: mod.DeletePackageDialog,
    })),
  { ssr: false }
);
const UpdatePackageDialog = dynamic(
  () =>
    import("./UpdatePackageDialog").then((mod) => ({
      default: mod.UpdatePackageDialog,
    })),
  { ssr: false }
);

// Rule 5.5: Extract to memoized components - PackageRow
interface PackageRowProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (packageId: string) => void;
  onView: (packageId: string) => void;
  onEdit: (packageId: string) => void;
  onDelete: (pkg: Package) => void;
  animationDelay?: number;
}

const PackageRow = memo(function PackageRow({
  pkg,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}: PackageRowProps) {
  const t = useTranslations("adminPackages.table");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TableRow
      className={`table-row-optimized group relative transition-all duration-300 ${
        isSelected
          ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/15 hover:via-primary/8 border-l-4 border-l-primary"
          : "hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationName: isSelected ? "subtle-pulse" : "fade-in",
        animationDuration: isSelected ? "2s" : "0.4s",
        animationTimingFunction: isSelected
          ? "cubic-bezier(0.4, 0, 0.6, 1)"
          : "ease-out",
        animationIterationCount: isSelected ? "infinite" : "1",
        animationFillMode: isSelected ? "none" : "forwards",
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <TableCell className="pl-4">
        <div className="relative">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(pkg.id)}
            aria-label={t("selectPackage", { barcode: pkg.barcode })}
            className="transition-all duration-300 hover:scale-110"
          />
          {isSelected && (
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 animate-pulse text-primary" />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`transition-all duration-500 ${
              isHovered ? "scale-110 rotate-3" : "scale-100"
            }`}
          >
            <PackageIcon
              className={`h-5 w-5 ${
                isSelected
                  ? "text-primary"
                  : "text-muted-foreground/60 group-hover:text-primary"
              } transition-colors duration-300`}
            />
          </div>
          <div className="relative">
            <div
              className={`font-mono text-xs font-semibold tracking-wide ${
                isSelected ? "text-primary" : "text-foreground"
              } transition-colors duration-300`}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {pkg.barcode}
            </div>
            <div
              className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 ${
                isHovered ? "w-full opacity-100" : "w-0 opacity-0"
              }`}
            />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="relative max-w-md">
          <p
            className={`text-xs transition-colors duration-300 ${
              pkg.description
                ? "text-muted-foreground group-hover:text-foreground"
                : "text-muted-foreground/40 italic"
            }`}
          >
            {pkg.description || "\u2014"}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <time
              className="text-xs font-medium text-foreground/80"
              dateTime={pkg.createdAt}
            >
              {new Date(pkg.createdAt).toLocaleDateString(undefined, {
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
                onClick={() => onView(pkg.id)}
                aria-label={t("viewDetails")}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-medium text-blue-50"
            >
              <p>{t("viewDetails")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 shadow-sm ring-1 ring-amber-200/50 transition-all duration-300 hover:scale-110 hover:from-amber-100 hover:to-amber-200/50 hover:text-amber-700 hover:shadow-md hover:ring-amber-300/50 active:scale-95 dark:from-amber-950/30 dark:to-amber-900/20 dark:ring-amber-800/30 dark:hover:from-amber-900/40"
                onClick={() => onEdit(pkg.id)}
                aria-label={t("editPackage")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-amber-950 px-3 py-1.5 text-xs font-medium text-amber-50"
            >
              <p>{t("editPackage")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 shadow-sm ring-1 ring-red-200/50 transition-all duration-300 hover:scale-110 hover:from-red-100 hover:to-red-200/50 hover:text-red-700 hover:shadow-md hover:ring-red-300/50 active:scale-95 dark:from-red-950/30 dark:to-red-900/20 dark:ring-red-800/30 dark:hover:from-red-900/40"
                onClick={() => onDelete(pkg)}
                aria-label={t("deletePackage")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="rounded-lg bg-red-950 px-3 py-1.5 text-xs font-medium text-red-50"
            >
              <p>{t("deletePackage")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
});

interface PackagesTableProps {
  packages: Package[];
  selectedPackages: Set<string>; // Rule 7.11: Use Set for O(1) lookups
  onSelectionChange: (packageIds: Set<string>) => void;
  isLoading: boolean;
  onRefetch?: () => void | Promise<void>;
}

export function PackagesTable({
  packages,
  selectedPackages,
  onSelectionChange,
  isLoading,
  onRefetch,
}: PackagesTableProps) {
  const t = useTranslations("adminPackages.table");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<{
    id: string;
    barcode: string;
  } | null>(null);

  // Rule 5.7: Put interaction logic in event handlers with useCallback
  const handleSelectPackage = useCallback(
    (packageId: string) => {
      const newSelection = new Set(selectedPackages);
      if (selectedPackages.has(packageId)) {
        newSelection.delete(packageId);
      } else {
        newSelection.add(packageId);
      }
      onSelectionChange(newSelection);
    },
    [onSelectionChange, selectedPackages]
  );

  const handleViewPackage = useCallback((packageId: string) => {
    setSelectedPackageId(packageId);
    setViewModalOpen(true);
  }, []);

  const handleEditPackage = useCallback((packageId: string) => {
    setPackageToEdit(packageId);
    setEditModalOpen(true);
  }, []);

  const handleDeletePackage = useCallback((pkg: Package) => {
    setPackageToDelete({
      id: pkg.id,
      barcode: pkg.barcode,
    });
    setDeleteModalOpen(true);
  }, []);

  const handlePackageUpdated = useCallback(async () => {
    if (onRefetch) {
      await onRefetch();
    }
  }, [onRefetch]);

  const handlePackageDeleted = useCallback(async () => {
    // Clear selection if the deleted package was selected - Rule 7.11: Use Set.has()
    if (packageToDelete && selectedPackages.has(packageToDelete.id)) {
      const newSelection = new Set(selectedPackages);
      newSelection.delete(packageToDelete.id);
      onSelectionChange(newSelection);
    }
    if (onRefetch) {
      await onRefetch();
    }
  }, [onRefetch, onSelectionChange, packageToDelete, selectedPackages]);

  const columns: ColumnDef<Package>[] = useMemo(
    () => [
      {
        id: "barcode",
        header: t("barcodeHeader"),
        cell: () => null, // Not used with renderRow
        skeletonWidth: "8rem",
      },
      {
        id: "description",
        header: t("descriptionHeader"),
        cell: () => null,
        skeletonWidth: "12rem",
      },
      {
        id: "createdAt",
        header: t("createdAtHeader"),
        cell: () => null,
        skeletonWidth: "7rem",
        skeletonVariant: "date",
      },
      {
        id: "actions",
        header: t("actionsHeader"),
        cell: () => null,
        align: "right",
        skeletonVariant: "actions",
        skeletonActionCount: 3,
      },
    ],
    [t]
  );

  const emptyState: EmptyStateConfig = useMemo(
    () => ({
      icon: PackageIcon,
      title: t("emptyTitle"),
      description: t("emptyDescription"),
    }),
    [t]
  );

  const selectionBarContent = useMemo(
    () => (
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <Sparkles className="h-5 w-5 animate-pulse text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-bold text-foreground">
            {t("selectedCount", {
              count: selectedPackages.size,
              plural: selectedPackages.size !== 1 ? "s" : "",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {t("selectToConsolidate")}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectionChange(new Set())}
          className="gap-2 rounded-xl border-2 border-border/50 bg-background/80 font-semibold shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive hover:shadow-md active:scale-95"
        >
          <X className="h-4 w-4" />
          {t("clearSelection")}
        </Button>
      </div>
    ),
    [t, selectedPackages.size, onSelectionChange]
  );

  const renderRow = useCallback(
    (pkg: Package, index: number, isSelected: boolean) => (
      <PackageRow
        key={pkg.id}
        pkg={pkg}
        isSelected={isSelected}
        onSelect={handleSelectPackage}
        onView={handleViewPackage}
        onEdit={handleEditPackage}
        onDelete={handleDeletePackage}
        animationDelay={index * 50}
      />
    ),
    [
      handleSelectPackage,
      handleViewPackage,
      handleEditPackage,
      handleDeletePackage,
    ]
  );

  return (
    <>
      <BaseTable<Package>
        columns={columns}
        data={packages}
        getRowKey={(pkg) => pkg.id}
        isLoading={isLoading}
        renderRow={renderRow}
        selection={{
          selectedIds: selectedPackages,
          onSelectionChange,
          getItemId: (pkg) => pkg.id,
          selectionBarContent,
        }}
        emptyState={emptyState}
      />

      {/* Package Details Modal */}
      <PackageDetailsModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        packageId={selectedPackageId}
      />

      {/* Edit Package Dialog */}
      <UpdatePackageDialog
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        packageId={packageToEdit}
        onPackageUpdated={handlePackageUpdated}
      />

      {/* Delete Package Dialog */}
      <DeletePackageDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        package_={packageToDelete}
        onPackageDeleted={handlePackageDeleted}
      />
    </>
  );
}
