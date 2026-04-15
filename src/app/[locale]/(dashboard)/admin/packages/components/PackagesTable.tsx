"use client";

import { memo, useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TableActionButtons } from "@/components/common/TableActionButtons";
import {
  BaseTable,
  type ColumnDef,
  type EmptyStateConfig,
} from "@/components/ui/base-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Package as PackageIcon, Sparkles } from "lucide-react";
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

const BarcodeText = ({
  barcode,
  isSelected,
}: {
  barcode: string;
  isSelected: boolean;
}) => (
  <div
    className={`font-mono text-xs font-semibold tracking-wide ${
      isSelected ? "text-primary" : "text-foreground"
    } transition-colors duration-300`}
    style={{ fontVariantNumeric: "tabular-nums" }}
  >
    {barcode}
  </div>
);

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

  return (
    <TableRow
      className={`table-row-optimized group relative transition-all duration-300 ${
        isSelected
          ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/15 hover:via-primary/8 border-l-4 border-l-primary"
          : "hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent"
      }`}
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
        {pkg.description ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block cursor-default">
                <BarcodeText barcode={pkg.barcode} isSelected={isSelected} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{pkg.description}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <BarcodeText barcode={pkg.barcode} isSelected={isSelected} />
        )}
      </TableCell>
      <TableActionButtons
        onView={{
          onClick: () => onView(pkg.id),
          ariaLabel: t("viewDetails"),
          tooltip: t("viewDetails"),
        }}
        onEdit={{
          onClick: () => onEdit(pkg.id),
          ariaLabel: t("editPackage"),
          tooltip: t("editPackage"),
        }}
        onDelete={{
          onClick: () => onDelete(pkg),
          ariaLabel: t("deletePackage"),
          tooltip: t("deletePackage"),
        }}
      />
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

  const selectionLabels = useMemo(
    () => ({
      selectedLabel: t("selectedCount", {
        count: selectedPackages.size,
        plural: selectedPackages.size !== 1 ? "s" : "",
      }),
      clearLabel: t("clearSelection"),
      message: t("selectToConsolidate"),
    }),
    [t, selectedPackages.size]
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
          selectionLabels,
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
