"use client";

import { memo, useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        animation: isSelected
          ? "subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
          : "fade-in 0.4s ease-out forwards",
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
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
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
              className={`font-mono text-sm font-semibold tracking-wide ${
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
            className={`text-sm transition-colors duration-300 ${
              pkg.description
                ? "text-muted-foreground group-hover:text-foreground"
                : "text-muted-foreground/40 italic"
            }`}
          >
            {pkg.description || "—"}
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

  // Rule 5.8: Subscribe to derived state with useMemo - Rule 7.11: Using Set.size
  const allSelected = useMemo(() => {
    return packages.length > 0 && selectedPackages.size === packages.length;
  }, [packages.length, selectedPackages.size]);

  const someSelected = useMemo(() => {
    return selectedPackages.size > 0 && !allSelected;
  }, [selectedPackages.size, allSelected]);

  // Rule 5.7: Put interaction logic in event handlers with useCallback
  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(packages.map((pkg) => pkg.id)));
    }
  }, [allSelected, onSelectionChange, packages]);

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

  const handleClearSelection = useCallback(() => {
    onSelectionChange(new Set());
  }, [onSelectionChange]);

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
    // Refetch packages to update the table
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
    // Refetch packages to update the table
    if (onRefetch) {
      await onRefetch();
    }
  }, [onRefetch, onSelectionChange, packageToDelete, selectedPackages]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20">
                  <TableHead className="w-12 pl-4">
                    <div className="h-4 w-4 animate-pulse rounded bg-muted/60"></div>
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("barcodeHeader")}
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("descriptionHeader")}
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("createdAtHeader")}
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("actionsHeader")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow
                    key={index}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fade-in 0.6s ease-out forwards",
                      opacity: 0,
                    }}
                  >
                    <TableCell className="pl-4">
                      <div className="h-4 w-4 animate-pulse rounded bg-muted/60"></div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-pulse rounded bg-muted/60"></div>
                        <div className="h-4 w-32 animate-pulse rounded-md bg-muted/60"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-48 animate-pulse rounded-md bg-muted/60"></div>
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
      </div>
    );
  }

  // Empty state
  if (packages.length === 0) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 via-background to-muted/20 py-24 text-center shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
        <div className="relative">
          <div className="mb-8 inline-flex rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-inner ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <PackageIcon className="h-20 w-20 text-primary/60 transition-all duration-500 group-hover:text-primary" />
          </div>
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {t("emptyTitle")}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
            {t("emptyDescription")}
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/30" />
            <span>Ready to start</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/30" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <div className="relative overflow-x-auto">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-card/80 to-transparent" />
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm transition-colors hover:from-muted/60 hover:to-muted/30">
                  <TableHead className="w-12 pl-4">
                    <div className="relative">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label={t("selectPackage", { barcode: "" })}
                        className={`transition-all duration-300 hover:scale-110 ${
                          someSelected
                            ? "data-[state=checked]:bg-primary/50"
                            : ""
                        }`}
                      />
                      {someSelected && !allSelected && (
                        <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-primary" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {t("barcodeHeader")}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("descriptionHeader")}
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("createdAtHeader")}
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("actionsHeader")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg, index) => (
                  <PackageRow
                    key={pkg.id}
                    pkg={pkg}
                    isSelected={selectedPackages.has(pkg.id)}
                    onSelect={handleSelectPackage}
                    onView={handleViewPackage}
                    onEdit={handleEditPackage}
                    onDelete={handleDeletePackage}
                    animationDelay={index * 50}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Selection Actions Bar */}
        {selectedPackages.size > 0 && (
          <div
            className="sticky bottom-4 z-10 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background p-5 shadow-2xl backdrop-blur-md transition-all duration-500 animate-slide-up"
            style={{
              animation: "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-5">
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
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                  className="gap-2 rounded-xl border-2 border-border/50 bg-background/80 font-semibold shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive hover:shadow-md active:scale-95"
                >
                  <X className="h-4 w-4" />
                  {t("clearSelection")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

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
    </TooltipProvider>
  );
}
