"use client";

import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ClientFormFields } from "@/components/admin/ClientFormFields";
import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  UPDATE_CLIENT,
  type UpdateClientResponse,
  type UpdateClientVariables,
} from "@/graphql/mutations/clients";
import { toClientFormValues } from "@/lib/clients/toClientFormValues";
import { toUpdateClientVariables } from "@/lib/clients/toUpdateClientVariables";
import {
  type ClientFormValues,
  createClientFormSchema,
  EMPTY_CLIENT_FORM,
} from "@/lib/validation/clientFormSchema";

export interface EditableClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  extraEmail1: string | null;
  extraEmail2: string | null;
  identificationNumber: string | null;
  mobilePhoneNumber: string | null;
  phoneNumber: string | null;
  state: string | null;
  city: string | null;
  mainStreet: string | null;
  secondaryStreet: string | null;
  buildingNumber: string | null;
}

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: EditableClient | null;
  onClientUpdated?: () => void | Promise<void>;
}

export function EditClientDialog({
  open,
  onOpenChange,
  client,
  onClientUpdated,
}: EditClientDialogProps) {
  const t = useTranslations("adminClients.editDialog");
  const schema = useMemo(
    () => createClientFormSchema(t, { requireEmail: false }),
    [t]
  );
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_CLIENT_FORM,
  });
  const { reset } = form;

  // Seed the form whenever a different client is opened for editing.
  useEffect(() => {
    if (client) reset(toClientFormValues(client));
  }, [client, reset]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const [updateClient, { loading }] = useMutation<
    UpdateClientResponse,
    UpdateClientVariables
  >(UPDATE_CLIENT, {
    onCompleted: async (data) => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          fullName: data.updateClient?.client?.fullName ?? "",
        }),
      });
      handleClose();
      await onClientUpdated?.();
    },
    onError: (error) => {
      toast.error(t("errorTitle"), {
        description: t("errorDescription", { error: error.message }),
      });
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!client) return;
    await updateClient({
      variables: toUpdateClientVariables(client.id, values),
    }).catch(() => undefined);
  });

  if (!client) return null;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={t("title")}
      description={t("description")}
      icon={Pencil}
    >
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <ClientFormFields
          form={form}
          namespace="adminClients.editDialog"
          disabled={loading}
          emailReadOnly
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
                {t("updating")}
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" aria-hidden />
                {t("updateClient")}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </BaseDialog>
  );
}
