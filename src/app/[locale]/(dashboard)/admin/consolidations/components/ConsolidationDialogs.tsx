"use client";

import type { UseConsolidationDialogsReturn } from "../hooks/useConsolidationDialogs";

import dynamic from "next/dynamic";

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

interface ConsolidationDialogsProps {
  dialogs: UseConsolidationDialogsReturn;
  onRefresh: () => void | Promise<void>;
}

export function ConsolidationDialogs({
  dialogs,
  onRefresh,
}: ConsolidationDialogsProps) {
  return (
    <>
      <ViewConsolidationDialog
        open={dialogs.isViewDialogOpen}
        onOpenChange={dialogs.setIsViewDialogOpen}
        consolidationId={dialogs.consolidationIdToView}
      />
      <EditConsolidationDialog
        open={dialogs.isEditDialogOpen}
        onOpenChange={dialogs.setIsEditDialogOpen}
        consolidation={dialogs.consolidationToEdit}
        onConsolidationUpdated={onRefresh}
      />
      <DeleteConsolidationDialog
        open={dialogs.isDeleteDialogOpen}
        onOpenChange={dialogs.setIsDeleteDialogOpen}
        consolidation={dialogs.consolidationToDelete}
        onConsolidationDeleted={onRefresh}
      />
    </>
  );
}
