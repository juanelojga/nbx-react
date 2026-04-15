import { useCallback, useState } from "react";
import type { ClientType } from "@/graphql/queries/clients";
import type {
  ClientToDelete,
  ClientToEdit,
} from "../components/clients-table.types";

export interface UseClientDialogsReturn {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  clientToDelete: ClientToDelete | null;
  clientToEdit: ClientToEdit | null;
  clientIdToView: string | null;
  handleViewClient: (clientId: string) => void;
  handleEditClient: (client: ClientType) => void;
  handleDeleteClient: (client: ClientType) => void;
}

export function useClientDialogs(): UseClientDialogsReturn {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientToDelete | null>(
    null
  );
  const [clientToEdit, setClientToEdit] = useState<ClientToEdit | null>(null);
  const [clientIdToView, setClientIdToView] = useState<string | null>(null);

  const handleViewClient = useCallback((clientId: string) => {
    setClientIdToView(clientId);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditClient = useCallback((client: ClientType) => {
    setClientToEdit({
      id: client.id,
      firstName: client.user.firstName || "",
      lastName: client.user.lastName || "",
      email: client.email,
      extraEmail1: client.extraEmail1,
      extraEmail2: client.extraEmail2,
      identificationNumber: client.identificationNumber,
      mobilePhoneNumber: client.mobilePhoneNumber,
      phoneNumber: client.phoneNumber,
      state: client.state,
      city: client.city,
      mainStreet: client.mainStreet,
      secondaryStreet: client.secondaryStreet,
      buildingNumber: client.buildingNumber,
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteClient = useCallback((client: ClientType) => {
    setClientToDelete({
      id: client.id,
      fullName: client.fullName,
      email: client.email,
    });
    setIsDeleteDialogOpen(true);
  }, []);

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    clientToDelete,
    clientToEdit,
    clientIdToView,
    handleViewClient,
    handleEditClient,
    handleDeleteClient,
  };
}
