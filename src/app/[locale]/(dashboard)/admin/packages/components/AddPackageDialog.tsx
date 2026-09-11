"use client";

import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ClientAutocomplete } from "@/components/admin/ClientAutocomplete";
import { PackageFormFields } from "@/components/admin/PackageFormFields";
import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  CREATE_PACKAGE,
  type CreatePackageResponse,
  type CreatePackageVariables,
} from "@/graphql/mutations/packages";
import type { ClientType } from "@/graphql/queries/clients";
import { toCreatePackageVariables } from "@/lib/packages/toCreatePackageVariables";
import {
  createPackageFormSchema,
  EMPTY_PACKAGE_FORM,
  type PackageFormValues,
} from "@/lib/validation/packageFormSchema";

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Preselected client when the selector is hidden. */
  clientId?: string;
  showClientSelector?: boolean;
  onPackageCreated?: () => void | Promise<void>;
}

export function AddPackageDialog({
  open,
  onOpenChange,
  clientId,
  showClientSelector = false,
  onPackageCreated,
}: AddPackageDialogProps) {
  const t = useTranslations("adminPackages.addDialog");
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

  const schema = useMemo(
    () =>
      createPackageFormSchema(t, {
        mode: "create",
        requireClient: showClientSelector,
      }),
    [t, showClientSelector]
  );
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...EMPTY_PACKAGE_FORM, clientId: clientId ?? "" },
  });

  const handleClose = useCallback(() => {
    form.reset({ ...EMPTY_PACKAGE_FORM, clientId: clientId ?? "" });
    setSelectedClient(null);
    onOpenChange(false);
  }, [form, clientId, onOpenChange]);

  const [createPackage, { loading }] = useMutation<
    CreatePackageResponse,
    CreatePackageVariables
  >(CREATE_PACKAGE, {
    onCompleted: async (data) => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          barcode: data.createPackage?.package?.barcode ?? "",
        }),
      });
      handleClose();
      await onPackageCreated?.();
    },
    onError: (error) => {
      toast.error(t("errorTitle"), { description: error.message });
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const effectiveClientId = showClientSelector ? values.clientId : clientId;
    if (!effectiveClientId) return;
    await createPackage({
      variables: toCreatePackageVariables(values, effectiveClientId),
    }).catch(() => undefined);
  });

  const clientError = form.formState.errors.clientId?.message;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={t("title")}
      description={t("description")}
      icon={Plus}
    >
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <PackageFormFields
          form={form}
          namespace="adminPackages.addDialog"
          mode="create"
          disabled={loading}
          clientSelector={
            showClientSelector ? (
              <div className="space-y-2">
                <Label>
                  {t("clientLabel")} <span className="text-destructive">*</span>
                </Label>
                <ClientAutocomplete
                  selectedClient={selectedClient}
                  onClientSelect={(client) => {
                    setSelectedClient(client);
                    form.setValue("clientId", client?.id ?? "", {
                      shouldValidate: form.formState.isSubmitted,
                    });
                  }}
                />
                {clientError && (
                  <p className="text-sm text-destructive font-medium flex items-center gap-1">
                    <span className="text-base" aria-hidden="true">
                      ⚠
                    </span>
                    {clientError}
                  </p>
                )}
              </div>
            ) : undefined
          }
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                {t("creating")}
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" aria-hidden />
                {t("createButton")}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </BaseDialog>
  );
}
