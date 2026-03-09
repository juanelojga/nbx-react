"use client";

import dynamic from "next/dynamic";
import type { ClientToDelete, ClientToEdit } from "./clients-table.types";

const AddClientDialog = dynamic(
  () =>
    import("@/components/admin/AddClientDialog").then((mod) => ({
      default: mod.AddClientDialog,
    })),
  { ssr: false }
);
const DeleteClientDialog = dynamic(
  () =>
    import("@/components/admin/DeleteClientDialog").then((mod) => ({
      default: mod.DeleteClientDialog,
    })),
  { ssr: false }
);
const EditClientDialog = dynamic(
  () =>
    import("@/components/admin/EditClientDialog").then((mod) => ({
      default: mod.EditClientDialog,
    })),
  { ssr: false }
);
const ViewClientDialog = dynamic(
  () =>
    import("@/components/admin/ViewClientDialog").then((mod) => ({
      default: mod.ViewClientDialog,
    })),
  { ssr: false }
);

interface ClientDialogsProps {
  isAddDialogOpen: boolean;
  onAddDialogOpenChange: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  onDeleteDialogOpenChange: (open: boolean) => void;
  isEditDialogOpen: boolean;
  onEditDialogOpenChange: (open: boolean) => void;
  isViewDialogOpen: boolean;
  onViewDialogOpenChange: (open: boolean) => void;
  clientToDelete: ClientToDelete | null;
  clientToEdit: ClientToEdit | null;
  clientIdToView: string | null;
  onRefresh: () => void;
}

export function ClientDialogs({
  isAddDialogOpen,
  onAddDialogOpenChange,
  isDeleteDialogOpen,
  onDeleteDialogOpenChange,
  isEditDialogOpen,
  onEditDialogOpenChange,
  isViewDialogOpen,
  onViewDialogOpenChange,
  clientToDelete,
  clientToEdit,
  clientIdToView,
  onRefresh,
}: ClientDialogsProps) {
  return (
    <>
      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={onAddDialogOpenChange}
        onClientCreated={onRefresh}
      />
      <DeleteClientDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogOpenChange}
        client={clientToDelete}
        onClientDeleted={onRefresh}
      />
      <EditClientDialog
        open={isEditDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        client={clientToEdit}
        onClientUpdated={onRefresh}
      />
      <ViewClientDialog
        open={isViewDialogOpen}
        onOpenChange={onViewDialogOpenChange}
        clientId={clientIdToView}
      />
    </>
  );
}
