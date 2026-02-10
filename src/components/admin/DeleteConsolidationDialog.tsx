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
  DELETE_CONSOLIDATE,
  DeleteConsolidateResponse,
  DeleteConsolidateVariables,
} from "@/graphql/mutations/consolidations";
import { toast } from "sonner";

interface DeleteConsolidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consolidation: {
    id: string;
    description: string;
    client: {
      fullName: string;
      email: string;
    };
    packagesCount: number;
  } | null;
  onConsolidationDeleted?: () => void | Promise<void>;
}

export function DeleteConsolidationDialog({
  open,
  onOpenChange,
  consolidation,
  onConsolidationDeleted,
}: DeleteConsolidationDialogProps) {
  const t = useTranslations("adminConsolidations.deleteDialog");
  const tParent = useTranslations("adminConsolidations");

  const [deleteConsolidate, { loading }] = useMutation<
    DeleteConsolidateResponse,
    DeleteConsolidateVariables
  >(DELETE_CONSOLIDATE, {
    onCompleted: async () => {
      toast.success(t("successTitle"), {
        description: t("successDescription"),
      });
      onOpenChange(false);
      if (onConsolidationDeleted) {
        await onConsolidationDeleted();
      }
    },
    onError: (error) => {
      toast.error(t("errorTitle"), {
        description: t("errorDescription", { error: error.message }),
      });
      onOpenChange(false);
    },
  });

  const handleDelete = async () => {
    if (!consolidation) return;

    await deleteConsolidate({
      variables: {
        id: consolidation.id,
      },
    });
  };

  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  if (!consolidation) return null;

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
          {/* Consolidation Info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                {t("consolidationId")}
              </span>
              <span className="text-sm font-semibold text-foreground text-right font-mono">
                {consolidation.id}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                {t("client")}
              </span>
              <span className="text-sm font-semibold text-foreground text-right">
                {consolidation.client.fullName}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                {t("packagesCount")}
              </span>
              <span className="text-sm font-semibold text-foreground text-right">
                {tParent("packages", { count: consolidation.packagesCount })}
              </span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive font-medium">
              <strong>{t("warningTitle")}</strong> {t("warningDescription")}
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
                <span className="mr-2 animate-spin">
                  <Loader2 className="h-4 w-4" />
                </span>
                {t("deleting")}
              </>
            ) : (
              t("deleteConsolidation")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
