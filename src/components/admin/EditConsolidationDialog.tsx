"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { BaseDialog, DialogFooter } from "@/components/ui/base-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UPDATE_CONSOLIDATE,
  UpdateConsolidateVariables,
  UpdateConsolidateResponse,
} from "@/graphql/mutations/consolidations";
import { toast } from "sonner";
import { ConsolidationStatus } from "@/lib/validation/status";
import {
  ExtraAttributesEditor,
  ExtraAttributeEntry,
  parseExtraAttributes,
  serializeExtraAttributes,
} from "@/components/admin/ExtraAttributesEditor";

interface EditConsolidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consolidation: {
    id: string;
    description: string;
    status: ConsolidationStatus;
    deliveryDate: string | null;
    comment: string | null;
    extraAttributes: string | null;
  } | null;
  onConsolidationUpdated?: () => void | Promise<void>;
}

interface FormData {
  description: string;
  status: ConsolidationStatus;
  deliveryDate: string;
  comment: string;
  extraAttributes: ExtraAttributeEntry[];
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

export function EditConsolidationDialog({
  open,
  onOpenChange,
  consolidation,
  onConsolidationUpdated,
}: EditConsolidationDialogProps) {
  const t = useTranslations("adminConsolidations.editDialog");
  const [formData, setFormData] = useState<FormData>({
    description: "",
    status: "pending",
    deliveryDate: "",
    comment: "",
    extraAttributes: [],
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Track the last processed consolidation to avoid unnecessary re-renders
  const lastConsolidationIdRef = useRef<string | null>(null);

  // Prefill form data when consolidation changes
  useEffect(() => {
    if (consolidation) {
      if (lastConsolidationIdRef.current !== consolidation.id) {
        lastConsolidationIdRef.current = consolidation.id;
        queueMicrotask(() => {
          setFormData({
            description: consolidation.description || "",
            status: consolidation.status,
            deliveryDate: consolidation.deliveryDate || "",
            comment: consolidation.comment || "",
            extraAttributes: parseExtraAttributes(
              consolidation.extraAttributes
            ),
          });
          setValidationErrors({});
        });
      }
    }
  }, [consolidation]);

  const [updateConsolidate, { loading }] = useMutation<
    UpdateConsolidateResponse,
    UpdateConsolidateVariables
  >(UPDATE_CONSOLIDATE, {
    onCompleted: async () => {
      toast.success(t("successTitle"), {
        description: t("successDescription"),
      });
      onOpenChange(false);
      if (onConsolidationUpdated) {
        await onConsolidationUpdated();
      }
    },
    onError: (error) => {
      toast.error(t("errorTitle"), {
        description: t("errorDescription", { error: error.message }),
      });
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!consolidation) {
        return;
      }

      // Inline validation
      const errors: ValidationErrors = {};
      if (!formData.description.trim()) {
        errors.description = t("descriptionRequired");
      }

      const validStatuses = [
        "awaiting_payment",
        "pending",
        "processing",
        "in_transit",
        "delivered",
        "cancelled",
      ];
      if (!formData.status || !validStatuses.includes(formData.status)) {
        errors.status = t("statusRequired");
      }

      // Validate extra attributes
      const seenKeys = new Set<string>();
      for (let i = 0; i < formData.extraAttributes.length; i++) {
        const entry = formData.extraAttributes[i];
        const hasKey = entry.key.trim() !== "";
        const hasValue = entry.value.trim() !== "";
        if (hasKey || hasValue) {
          if (!hasKey) {
            errors[`extraAttributes_${i}_key`] = t("chargeNameRequired");
          }
          if (!hasValue) {
            errors[`extraAttributes_${i}_value`] = t("chargeAmountRequired");
          } else if (isNaN(Number(entry.value))) {
            errors[`extraAttributes_${i}_value`] = t("chargeAmountInvalid");
          }
          if (hasKey && seenKeys.has(entry.key.trim().toLowerCase())) {
            errors[`extraAttributes_${i}_key`] = t("duplicateChargeName");
          }
          if (hasKey) seenKeys.add(entry.key.trim().toLowerCase());
        }
      }

      setValidationErrors(errors);
      if (Object.keys(errors).length > 0) {
        return;
      }

      const variables: UpdateConsolidateVariables = {
        id: consolidation.id,
        description: formData.description.trim(),
        status: formData.status,
        deliveryDate: formData.deliveryDate || undefined,
        comment: formData.comment.trim() || undefined,
        extraAttributes: serializeExtraAttributes(formData.extraAttributes),
      };

      await updateConsolidate({ variables }).catch(() => {});
    },
    [consolidation, formData, updateConsolidate, t]
  );

  const handleCancel = () => {
    if (!loading) {
      setValidationErrors({});
      onOpenChange(false);
    }
  };

  if (!consolidation) return null;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={t("title")}
      description={t("description")}
      icon={Pencil}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            {t("description_label")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="description"
            type="text"
            placeholder={t("descriptionPlaceholder")}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={loading}
            className={validationErrors.description ? "border-destructive" : ""}
          />
          {validationErrors.description && (
            <p className="text-sm text-destructive">
              {validationErrors.description}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            {t("status")} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as ConsolidationStatus,
              })
            }
            disabled={loading}
          >
            <SelectTrigger
              className={validationErrors.status ? "border-destructive" : ""}
            >
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="awaiting_payment">
                {t("statusAwaitingPayment")}
              </SelectItem>
              <SelectItem value="pending">{t("statusPending")}</SelectItem>
              <SelectItem value="processing">
                {t("statusProcessing")}
              </SelectItem>
              <SelectItem value="in_transit">{t("statusInTransit")}</SelectItem>
              <SelectItem value="delivered">{t("statusDelivered")}</SelectItem>
              <SelectItem value="cancelled">{t("statusCancelled")}</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.status && (
            <p className="text-sm text-destructive">
              {validationErrors.status}
            </p>
          )}
        </div>

        {/* Delivery Date */}
        <div className="space-y-2">
          <Label htmlFor="deliveryDate">{t("deliveryDate")}</Label>
          <Input
            id="deliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) =>
              setFormData({ ...formData, deliveryDate: e.target.value })
            }
            disabled={loading}
          />
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">{t("comment")}</Label>
          <Textarea
            id="comment"
            placeholder={t("commentPlaceholder")}
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            disabled={loading}
            rows={3}
          />
        </div>

        {/* Extra Attributes */}
        <ExtraAttributesEditor
          value={formData.extraAttributes}
          onChange={(entries) =>
            setFormData({ ...formData, extraAttributes: entries })
          }
          disabled={loading}
          labels={{
            title: t("extraAttributesLabel"),
            description: t("extraAttributesDescription"),
            addCharge: t("addCharge"),
            chargeName: t("chargeName"),
            chargeAmount: t("chargeAmount"),
            maxChargesReached: t("maxChargesReached"),
          }}
          errors={validationErrors}
        />

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2 animate-spin">
                  <Loader2 className="h-4 w-4" />
                </span>
                {t("updating")}
              </>
            ) : (
              t("updateConsolidation")
            )}
          </Button>
        </DialogFooter>
      </form>
    </BaseDialog>
  );
}
