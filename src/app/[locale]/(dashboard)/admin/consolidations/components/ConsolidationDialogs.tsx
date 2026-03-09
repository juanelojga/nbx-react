"use client";

import dynamic from "next/dynamic";
import type { ConsolidateType } from "@/graphql/queries/consolidations";
import type { ConsolidationToDelete } from "./consolidations-table.types";

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
  isViewDialogOpen: boolean;
  onViewDialogOpenChange: (open: boolean) => void;
  isEditDialogOpen: boolean;
  onEditDialogOpenChange: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  onDeleteDialogOpenChange: (open: boolean) => void;
  consolidationIdToView: string | null;
  consolidationToEdit: ConsolidateType | null;
  consolidationToDelete: ConsolidationToDelete | null;
  onRefresh: () => void;
}

export function ConsolidationDialogs({
  isViewDialogOpen,
  onViewDialogOpenChange,
  isEditDialogOpen,
  onEditDialogOpenChange,
  isDeleteDialogOpen,
  onDeleteDialogOpenChange,
  consolidationIdToView,
  consolidationToEdit,
  consolidationToDelete,
  onRefresh,
}: ConsolidationDialogsProps) {
  return (
    <>
      <ViewConsolidationDialog
        open={isViewDialogOpen}
        onOpenChange={onViewDialogOpenChange}
        consolidationId={consolidationIdToView}
      />
      <EditConsolidationDialog
        open={isEditDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        consolidation={consolidationToEdit}
        onConsolidationUpdated={onRefresh}
      />
      <DeleteConsolidationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogOpenChange}
        consolidation={consolidationToDelete}
        onConsolidationDeleted={onRefresh}
      />
    </>
  );
}
