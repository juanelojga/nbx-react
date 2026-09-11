"use client";

import dynamic from "next/dynamic";

import type { UseClientDialogsReturn } from "../hooks/useClientDialogs";

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
  dialogs: UseClientDialogsReturn;
  onRefresh: () => void | Promise<void>;
}

export function ClientDialogs({ dialogs, onRefresh }: ClientDialogsProps) {
  return (
    <>
      <AddClientDialog
        open={dialogs.isAddDialogOpen}
        onOpenChange={dialogs.setIsAddDialogOpen}
        onClientCreated={onRefresh}
      />
      <DeleteClientDialog
        open={dialogs.isDeleteDialogOpen}
        onOpenChange={dialogs.setIsDeleteDialogOpen}
        client={dialogs.clientToDelete}
        onClientDeleted={onRefresh}
      />
      <EditClientDialog
        open={dialogs.isEditDialogOpen}
        onOpenChange={dialogs.setIsEditDialogOpen}
        client={dialogs.clientToEdit}
        onClientUpdated={onRefresh}
      />
      <ViewClientDialog
        open={dialogs.isViewDialogOpen}
        onOpenChange={dialogs.setIsViewDialogOpen}
        clientId={dialogs.clientIdToView}
      />
    </>
  );
}
