"use client";

import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ClientFormFields } from "@/components/admin/ClientFormFields";
import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  CREATE_CLIENT,
  type CreateClientResponse,
  type CreateClientVariables,
} from "@/graphql/mutations/clients";
import { toCreateClientVariables } from "@/lib/clients/toCreateClientVariables";
import {
  type ClientFormValues,
  createClientFormSchema,
  EMPTY_CLIENT_FORM,
} from "@/lib/validation/clientFormSchema";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void | Promise<void>;
}

export function AddClientDialog({
  open,
  onOpenChange,
  onClientCreated,
}: AddClientDialogProps) {
  const t = useTranslations("adminClients.addDialog");
  const schema = useMemo(
    () => createClientFormSchema(t, { requireEmail: true }),
    [t]
  );
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_CLIENT_FORM,
  });

  const handleClose = useCallback(() => {
    form.reset(EMPTY_CLIENT_FORM);
    onOpenChange(false);
  }, [form, onOpenChange]);

  const [createClient, { loading }] = useMutation<
    CreateClientResponse,
    CreateClientVariables
  >(CREATE_CLIENT, {
    onCompleted: async (data) => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          fullName: data.createClient.client.fullName,
        }),
      });
      handleClose();
      await onClientCreated?.();
    },
    onError: (error) => {
      toast.error(t("errorTitle"), {
        description: t("errorDescription", { error: error.message }),
      });
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createClient({ variables: toCreateClientVariables(values) }).catch(
      () => undefined
    );
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={t("title")}
      description={t("description")}
      icon={UserPlus}
    >
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <ClientFormFields
          form={form}
          namespace="adminClients.addDialog"
          disabled={loading}
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
                <UserPlus className="mr-2 h-4 w-4" aria-hidden />
                {t("createClient")}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </BaseDialog>
  );
}
