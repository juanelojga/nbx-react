"use client";

import dynamic from "next/dynamic";
import type { UsePackageDialogsReturn } from "../hooks/usePackageDialogs";

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
  dialogs: UsePackageDialogsReturn;
  onRefresh: () => void | Promise<void>;
}

export function PackageDialogs({ dialogs, onRefresh }: PackageDialogsProps) {
  return (
    <>
      <AddPackageDialog
        open={dialogs.isAddDialogOpen}
        onOpenChange={dialogs.setIsAddDialogOpen}
        showClientSelector
        onPackageCreated={onRefresh}
      />
      <UpdatePackageDialog
        open={dialogs.isEditDialogOpen}
        onOpenChange={dialogs.setIsEditDialogOpen}
        packageId={dialogs.packageIdToEdit}
        showClientSelector
        onPackageUpdated={onRefresh}
      />
      <DeletePackageDialog
        open={dialogs.isDeleteDialogOpen}
        onOpenChange={dialogs.setIsDeleteDialogOpen}
        package_={dialogs.packageToDelete}
        onPackageDeleted={onRefresh}
      />
      <PackageDetailsModal
        open={dialogs.isViewDialogOpen}
        onOpenChange={dialogs.setIsViewDialogOpen}
        packageId={dialogs.packageIdToView}
      />
    </>
  );
}
