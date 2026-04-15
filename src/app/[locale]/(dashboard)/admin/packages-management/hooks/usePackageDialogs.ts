import { useCallback, useState } from "react";
import type { PackageType } from "@/graphql/queries/packages";
import type { PackageToDelete } from "../components/packages-table.types";

export interface UsePackageDialogsReturn {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  packageToDelete: PackageToDelete | null;
  packageIdToEdit: string | null;
  packageIdToView: string | null;
  handleViewPackage: (packageId: string) => void;
  handleEditPackage: (pkg: PackageType) => void;
  handleDeletePackage: (pkg: PackageType) => void;
}

export function usePackageDialogs(): UsePackageDialogsReturn {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] =
    useState<PackageToDelete | null>(null);
  const [packageIdToEdit, setPackageIdToEdit] = useState<string | null>(null);
  const [packageIdToView, setPackageIdToView] = useState<string | null>(null);

  const handleViewPackage = useCallback((packageId: string) => {
    setPackageIdToView(packageId);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditPackage = useCallback((pkg: PackageType) => {
    setPackageIdToEdit(pkg.id);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeletePackage = useCallback((pkg: PackageType) => {
    setPackageToDelete({ id: pkg.id, barcode: pkg.barcode });
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
    packageToDelete,
    packageIdToEdit,
    packageIdToView,
    handleViewPackage,
    handleEditPackage,
    handleDeletePackage,
  };
}
