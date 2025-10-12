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
  DELETE_USER,
  DeleteUserResponse,
  DeleteUserVariables,
} from "@/graphql/mutations/clients";
import { toast } from "sonner";

interface DeleteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
  } | null;
  onClientDeleted?: () => void | Promise<void>;
}

export function DeleteClientDialog({
  open,
  onOpenChange,
  client,
  onClientDeleted,
}: DeleteClientDialogProps) {
  const t = useTranslations("adminClients.deleteDialog");
  const tParent = useTranslations("adminClients");
  const [deleteUser, { loading }] = useMutation<
    DeleteUserResponse,
    DeleteUserVariables
  >(DELETE_USER, {
    onCompleted: async () => {
      toast.success(t("successTitle"), {
        description: t("successDescription", {
          name: client?.fullName || client?.email || "",
        }),
      });
      onOpenChange(false);
      // Trigger table refresh
      if (onClientDeleted) {
        await onClientDeleted();
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
    if (!client) return;

    await deleteUser({
      variables: {
        id: client.userId,
      },
    });
  };

  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  if (!client) return null;

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
          {/* Client Info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                {t("clientName")}
              </span>
              <span className="text-sm font-semibold text-foreground text-right">
                {client.fullName || "-"}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                {tParent("email")}
              </span>
              <span className="text-sm font-semibold text-foreground text-right">
                {client.email}
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              t("deleteClient")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
