"use client";

import { useMutation } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { BaseDialog } from "@/components/ui/base-dialog";
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
    }).catch(() => {});
  };

  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  if (!package_) return null;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={t("title")}
      description={t("description")}
      icon={AlertTriangle}
      iconVariant="destructive"
      footer={
        <>
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
        </>
      }
    >
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
    </BaseDialog>
  );
}
