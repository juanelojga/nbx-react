"use client";

import { useMutation } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  DELETE_PACKAGE,
  DeletePackageResponse,
  DeletePackageVariables,
} from "@/graphql/mutations/packages";
import { toast } from "sonner";

interface DeletePackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package_: {
    id: string;
    barcode: string;
  } | null;
  onPackageDeleted?: () => void | Promise<void>;
}

export function DeletePackageDialog({
  open,
  onOpenChange,
  package_,
  onPackageDeleted,
}: DeletePackageDialogProps) {
  const [deletePackage, { loading }] = useMutation<
    DeletePackageResponse,
    DeletePackageVariables
  >(DELETE_PACKAGE, {
    onCompleted: async (data) => {
      if (data.deletePackage.success) {
        toast.success("Package Deleted", {
          description: `Package ${package_?.barcode || ""} has been successfully deleted.`,
        });
        onOpenChange(false);
        // Trigger table refresh
        if (onPackageDeleted) {
          await onPackageDeleted();
        }
      } else {
        toast.error("Deletion Failed", {
          description: "Failed to delete the package. Please try again.",
        });
        onOpenChange(false);
      }
    },
    onError: (error) => {
      toast.error("Deletion Error", {
        description:
          error.message || "An error occurred while deleting the package.",
      });
      onOpenChange(false);
    },
  });

  const handleDelete = async () => {
    if (!package_) return;

    await deletePackage({
      variables: {
        id: package_.id,
      },
    });
  };

  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  if (!package_) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl text-left">
                Delete Package?
              </DialogTitle>
              <DialogDescription className="text-left mt-2">
                This action cannot be undone. The selected package will be
                permanently removed from the system.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Package Info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                Barcode
              </span>
              <span className="text-sm font-semibold text-foreground text-right">
                {package_.barcode}
              </span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive font-medium">
              <strong>Warning:</strong> This will permanently delete the package
              and all associated data. This action cannot be reversed.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Package"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
