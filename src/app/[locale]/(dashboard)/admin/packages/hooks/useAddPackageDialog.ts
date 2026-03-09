"use client";

import { useCallback, useState } from "react";

export interface UseAddPackageDialogReturn {
  isAddPackageDialogOpen: boolean;
  handleOpenAddPackageDialog: () => void;
  setIsAddPackageDialogOpen: (open: boolean) => void;
}

export function useAddPackageDialog(): UseAddPackageDialogReturn {
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] = useState(false);

  const handleOpenAddPackageDialog = useCallback(() => {
    setIsAddPackageDialogOpen(true);
  }, []);

  return {
    isAddPackageDialogOpen,
    handleOpenAddPackageDialog,
    setIsAddPackageDialogOpen,
  };
}
