import { useCallback, useState } from "react";
import type { ConsolidateType } from "@/graphql/queries/consolidations";
import type { ConsolidationToDelete } from "../components/consolidations-table.types";

export interface UseConsolidationDialogsReturn {
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  consolidationIdToView: string | null;
  consolidationToEdit: ConsolidateType | null;
  consolidationToDelete: ConsolidationToDelete | null;
  handleViewConsolidation: (id: string) => void;
  handleEditConsolidation: (consolidation: ConsolidateType) => void;
  handleDeleteConsolidation: (consolidation: ConsolidateType) => void;
}

export function useConsolidationDialogs(): UseConsolidationDialogsReturn {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [consolidationIdToView, setConsolidationIdToView] = useState<
    string | null
  >(null);
  const [consolidationToEdit, setConsolidationToEdit] =
    useState<ConsolidateType | null>(null);
  const [consolidationToDelete, setConsolidationToDelete] =
    useState<ConsolidationToDelete | null>(null);

  const handleViewConsolidation = useCallback((id: string) => {
    setConsolidationIdToView(id);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditConsolidation = useCallback(
    (consolidation: ConsolidateType) => {
      setConsolidationToEdit(consolidation);
      setIsEditDialogOpen(true);
    },
    []
  );

  const handleDeleteConsolidation = useCallback(
    (consolidation: ConsolidateType) => {
      setConsolidationToDelete({
        id: consolidation.id,
        description: consolidation.description,
        client: consolidation.client,
        packagesCount: consolidation.packages.length,
      });
      setIsDeleteDialogOpen(true);
    },
    []
  );

  return {
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    consolidationIdToView,
    consolidationToEdit,
    consolidationToDelete,
    handleViewConsolidation,
    handleEditConsolidation,
    handleDeleteConsolidation,
  };
}
