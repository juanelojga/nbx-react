"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ClientAutocomplete } from "@/components/admin/ClientAutocomplete";
import { PackageFormFields } from "@/components/admin/PackageFormFields";
import { BaseDialog } from "@/components/common/BaseDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  UPDATE_PACKAGE,
  type UpdatePackageResponse,
  type UpdatePackageVariables,
} from "@/graphql/mutations/packages";
import type { ClientType } from "@/graphql/queries/clients";
import {
  GET_PACKAGE,
  type GetPackageResponse,
  type GetPackageVariables,
} from "@/graphql/queries/packages";
import { toPackageFormValues } from "@/lib/packages/toPackageFormValues";
import { toUpdatePackageVariables } from "@/lib/packages/toUpdatePackageVariables";
import {
  createPackageFormSchema,
  EMPTY_PACKAGE_FORM,
  type PackageFormValues,
} from "@/lib/validation/packageFormSchema";

interface UpdatePackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string | null;
  showClientSelector?: boolean;
  onPackageUpdated?: () => void | Promise<void>;
}

export function UpdatePackageDialog({
  open,
  onOpenChange,
  packageId,
  showClientSelector = false,
  onPackageUpdated,
}: UpdatePackageDialogProps) {
  const t = useTranslations("adminPackages.editDialog");
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

  const schema = useMemo(
    () => createPackageFormSchema(t, { mode: "update", requireClient: false }),
    [t]
  );
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_PACKAGE_FORM,
  });
  const { reset } = form;

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<GetPackageResponse, GetPackageVariables>(GET_PACKAGE, {
    variables: { id: parseInt(packageId || "0") },
    skip: !packageId || !open,
  });
  const pkg = data?.package;

  // Seed the form once the package arrives (keyed on id so re-fetches don't clobber edits).
  useEffect(() => {
    if (!pkg) return;
    reset(toPackageFormValues(pkg));
    setSelectedClient(
      pkg.client
        ? ({
            id: pkg.client.id,
            fullName: pkg.client.fullName,
            email: pkg.client.email,
          } as ClientType)
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reseed only when a different package loads
  }, [pkg?.id, reset]);

  const handleClose = useCallback(() => {
    reset(EMPTY_PACKAGE_FORM);
    setSelectedClient(null);
    onOpenChange(false);
  }, [reset, onOpenChange]);

  const [updatePackage, { loading: mutationLoading }] = useMutation<
    UpdatePackageResponse,
    UpdatePackageVariables
  >(UPDATE_PACKAGE, {
    onCompleted: async (result) => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          barcode: result.updatePackage?.package?.barcode ?? "",
        }),
      });
      handleClose();
      await onPackageUpdated?.();
    },
    onError: (error) => {
      toast.error(t("errorTitle"), { description: error.message });
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!packageId) return;
    await updatePackage({
      variables: toUpdatePackageVariables(packageId, values, {
        includeClient: showClientSelector && Boolean(selectedClient),
      }),
    }).catch(() => undefined);
  });

  const isBusy = queryLoading || mutationLoading;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={t("title")}
      description={t("description")}
      icon={Pencil}
    >
      {queryLoading && (
        <div
          className="flex items-center justify-center py-12"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2
              className="h-12 w-12 animate-spin text-primary"
              aria-hidden
            />
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          </div>
        </div>
      )}

      {queryError && !queryLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden />
          <AlertDescription>{t("loadError")}</AlertDescription>
        </Alert>
      )}

      {pkg && !queryLoading && (
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <PackageFormFields
            form={form}
            namespace="adminPackages.editDialog"
            mode="update"
            disabled={isBusy}
            computed={{
              servicePrice: pkg.servicePrice,
              transportationCost: pkg.transportationCost,
              serviceFee: pkg.serviceFee,
            }}
            clientSelector={
              showClientSelector ? (
                <div className="space-y-2">
                  <Label>
                    {t("clientLabel")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <ClientAutocomplete
                    selectedClient={selectedClient}
                    onClientSelect={(client) => {
                      setSelectedClient(client);
                      form.setValue("clientId", client?.id ?? "");
                    }}
                  />
                </div>
              ) : undefined
            }
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutationLoading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isBusy}>
              {mutationLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  {t("updating")}
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" aria-hidden />
                  {t("updateButton")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      )}
    </BaseDialog>
  );
}
