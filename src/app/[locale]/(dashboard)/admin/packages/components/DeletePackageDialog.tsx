"use client";

import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("adminPackages.deleteDialog");
  const [deletePackage, { loading }] = useMutation<
    DeletePackageResponse,
    DeletePackageVariables
  >(DELETE_PACKAGE, {
    onCompleted: async (data) => {
      if (data.deletePackage.success) {
        toast.success(t("successTitle"), {
          description: t("successDescription", {
            barcode: package_?.barcode || "",
          }),
        });
        onOpenChange(false);
        // Trigger table refresh
        if (onPackageDeleted) {
          await onPackageDeleted();
        }
      } else {
        toast.error(t("errorTitle"), {
          description: t("errorDescription"),
        });
        onOpenChange(false);
      }
    },
    onError: (error) => {
      toast.error(t("errorTitleGeneric"), {
        description: error.message || t("errorDescriptionGeneric"),
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
                {t("title")}
              </DialogTitle>
              <DialogDescription className="text-left mt-2">
                {t("description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Package Info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                {t("barcodeLabel")}
              </span>
              <span className="text-sm font-semibold text-foreground text-right">
                {package_.barcode}
              </span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive font-medium">
              <strong>{t("warningLabel")}</strong> {t("warningMessage")}
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
            {t("cancel")}
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
                {t("deleting")}
              </>
            ) : (
              t("deleteButton")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
