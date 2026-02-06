"use client";

import { useQuery } from "@apollo/client";
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
import { AlertCircle, Eye, Loader2 } from "lucide-react";
import {
  GET_CLIENT,
  GetClientResponse,
  GetClientVariables,
} from "@/graphql/queries/clients";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ViewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
}

export function ViewClientDialog({
  open,
  onOpenChange,
  clientId,
}: ViewClientDialogProps) {
  const t = useTranslations("adminClients.viewDialog");
  const tParent = useTranslations("adminClients");
  const { data, loading, error } = useQuery<
    GetClientResponse,
    GetClientVariables
  >(GET_CLIENT, {
    variables: { id: clientId || "" },
    skip: !clientId || !open, // Skip query if no clientId or dialog is closed
  });

  const client = data?.client;

  const handleClose = () => {
    onOpenChange(false);
  };

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | null | undefined;
  }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">
        {value && value.trim() !== "" ? value : "-"}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Eye className="h-6 w-6" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t("loading")}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("errorTitle", { error: error.message })}
            </AlertDescription>
          </Alert>
        )}

        {/* Data Display */}
        {client && !loading && !error && (
          <div className="space-y-6 py-4">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                {t("personalInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label={tParent("fullName")} value={client.fullName} />
                <InfoRow label={t("email")} value={client.email} />
                <InfoRow
                  label={t("identificationNumber")}
                  value={client.identificationNumber}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                {t("contactInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label={t("mobilePhone")}
                  value={client.mobilePhoneNumber}
                />
                <InfoRow label={t("phoneNumber")} value={client.phoneNumber} />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
                {t("addressInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label={t("state")} value={client.state} />
                <InfoRow label={t("city")} value={client.city} />
                <InfoRow label={t("mainStreet")} value={client.mainStreet} />
                <InfoRow
                  label={t("secondaryStreet")}
                  value={client.secondaryStreet}
                />
                <InfoRow
                  label={t("buildingNumber")}
                  value={client.buildingNumber}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
