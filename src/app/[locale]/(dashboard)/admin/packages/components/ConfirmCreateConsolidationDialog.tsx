"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, Loader2 } from "lucide-react";
import { BaseDialog } from "@/components/ui/base-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmCreateConsolidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}

export function ConfirmCreateConsolidationDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
}: ConfirmCreateConsolidationDialogProps) {
  const t = useTranslations("adminPackages.consolidationForm.confirmCreate");

  const handleCancel = () => {
    if (!loading) onOpenChange(false);
  };

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
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("confirm")
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-semibold text-destructive mb-2">
            {t("warningTitle")}
          </p>
          <ul className="list-disc pl-5 text-sm text-destructive/90 space-y-1">
            <li>{t("warningPackages")}</li>
            <li>{t("warningWeights")}</li>
            <li>{t("warningValues")}</li>
            <li>{t("warningExtras")}</li>
          </ul>
        </div>
      </div>
    </BaseDialog>
  );
}
