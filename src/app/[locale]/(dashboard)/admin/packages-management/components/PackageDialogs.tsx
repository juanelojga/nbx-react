"use client";

import dynamic from "next/dynamic";
import type { PackageToDelete } from "./packages-table.types";

const AddPackageDialog = dynamic(
  () =>
    import("@/app/[locale]/(dashboard)/admin/packages/components/AddPackageDialog").then(
      (mod) => ({ default: mod.AddPackageDialog })
    ),
  { ssr: false }
);
const UpdatePackageDialog = dynamic(
  () =>
    import("@/app/[locale]/(dashboard)/admin/packages/components/UpdatePackageDialog").then(
      (mod) => ({ default: mod.UpdatePackageDialog })
    ),
  { ssr: false }
);
const DeletePackageDialog = dynamic(
  () =>
    import("@/app/[locale]/(dashboard)/admin/packages/components/DeletePackageDialog").then(
      (mod) => ({ default: mod.DeletePackageDialog })
    ),
  { ssr: false }
);
const PackageDetailsModal = dynamic(
  () =>
    import("@/app/[locale]/(dashboard)/admin/packages/components/PackageDetailsModal").then(
      (mod) => ({ default: mod.PackageDetailsModal })
    ),
  { ssr: false }
);

interface PackageDialogsProps {
  isAddDialogOpen: boolean;
  onAddDialogOpenChange: (open: boolean) => void;
  isEditDialogOpen: boolean;
  onEditDialogOpenChange: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  onDeleteDialogOpenChange: (open: boolean) => void;
  isViewDialogOpen: boolean;
  onViewDialogOpenChange: (open: boolean) => void;
  packageIdToEdit: string | null;
  packageToDelete: PackageToDelete | null;
  packageIdToView: string | null;
  onRefresh: () => void | Promise<void>;
}

export function PackageDialogs({
  isAddDialogOpen,
  onAddDialogOpenChange,
  isEditDialogOpen,
  onEditDialogOpenChange,
  isDeleteDialogOpen,
  onDeleteDialogOpenChange,
  isViewDialogOpen,
  onViewDialogOpenChange,
  packageIdToEdit,
  packageToDelete,
  packageIdToView,
  onRefresh,
}: PackageDialogsProps) {
  return (
    <>
      <AddPackageDialog
        open={isAddDialogOpen}
        onOpenChange={onAddDialogOpenChange}
        showClientSelector
        onPackageCreated={onRefresh}
      />
      <UpdatePackageDialog
        open={isEditDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        packageId={packageIdToEdit}
        showClientSelector
        onPackageUpdated={onRefresh}
      />
      <DeletePackageDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogOpenChange}
        package_={packageToDelete}
        onPackageDeleted={onRefresh}
      />
      <PackageDetailsModal
        open={isViewDialogOpen}
        onOpenChange={onViewDialogOpenChange}
        packageId={packageIdToView}
      />
    </>
  );
}
