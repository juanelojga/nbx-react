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
import { Package as PackageIcon, X, Eye, Trash2, Pencil } from "lucide-react";
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
}

const PackageRow = memo(function PackageRow({
  pkg,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: PackageRowProps) {
  const t = useTranslations("adminPackages.table");

  return (
    <TableRow
      className={`table-row-optimized ${
        isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
      }`}
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(pkg.id)}
          aria-label={t("selectPackage", { barcode: pkg.barcode })}
        />
      </TableCell>
      <TableCell className="font-medium">{pkg.barcode}</TableCell>
      <TableCell className="text-muted-foreground">
        {pkg.description || "—"}
      </TableCell>
      <TableCell>{new Date(pkg.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                onClick={() => onView(pkg.id)}
                aria-label={t("viewDetails")}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("viewDetails")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                onClick={() => onEdit(pkg.id)}
                aria-label={t("editPackage")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("editPackage")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                onClick={() => onDelete(pkg)}
                aria-label={t("deletePackage")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
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
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
                </TableHead>
                <TableHead>{t("barcodeHeader")}</TableHead>
                <TableHead>{t("descriptionHeader")}</TableHead>
                <TableHead>{t("createdAtHeader")}</TableHead>
                <TableHead className="text-right">
                  {t("actionsHeader")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Empty state
  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <PackageIcon className="h-16 w-16 text-primary/60" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {t("emptyTitle")}
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label={t("selectPackage", { barcode: "" })}
                    className={
                      someSelected ? "data-[state=checked]:bg-primary/50" : ""
                    }
                  />
                </TableHead>
                <TableHead>{t("barcodeHeader")}</TableHead>
                <TableHead>{t("descriptionHeader")}</TableHead>
                <TableHead>{t("createdAtHeader")}</TableHead>
                <TableHead className="text-right">
                  {t("actionsHeader")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <PackageRow
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={selectedPackages.has(pkg.id)}
                  onSelect={handleSelectPackage}
                  onView={handleViewPackage}
                  onEdit={handleEditPackage}
                  onDelete={handleDeletePackage}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Selection Actions Bar */}
        {selectedPackages.size > 0 && (
          <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-lg border bg-background p-4 shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {t("selectedCount", {
                  count: selectedPackages.size,
                  plural: selectedPackages.size !== 1 ? "s" : "",
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                {t("clearSelection")}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {t("selectToConsolidate")}
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
