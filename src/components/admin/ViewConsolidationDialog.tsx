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
import { AlertCircle, Eye, Loader2, Package } from "lucide-react";
import {
  GET_CONSOLIDATE_BY_ID,
  GetConsolidateByIdResponse,
  GetConsolidateByIdVariables,
} from "@/graphql/queries/consolidations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">
        {value && value.trim() !== "" ? value : "-"}
      </span>
    </div>
  );
}

interface ViewConsolidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consolidationId: string | null;
}

export function ViewConsolidationDialog({
  open,
  onOpenChange,
  consolidationId,
}: ViewConsolidationDialogProps) {
  const t = useTranslations("adminConsolidations.viewDialog");
  const tStatus = useTranslations("adminConsolidations");

  const { data, loading, error } = useQuery<
    GetConsolidateByIdResponse,
    GetConsolidateByIdVariables
  >(GET_CONSOLIDATE_BY_ID, {
    variables: { id: consolidationId || "" },
    skip: !consolidationId || !open,
  });

  const consolidation = data?.consolidateById;

  const handleClose = () => {
    onOpenChange(false);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return tStatus("statusPending");
      case "in_transit":
        return tStatus("statusInTransit");
      case "delivered":
        return tStatus("statusDelivered");
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <div className="animate-spin">
                <Loader2 className="h-12 w-12 text-primary" />
              </div>
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
        {consolidation && !loading && !error && (
          <div className="space-y-6">
            {/* General Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("generalInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4">
                <InfoRow label={t("id")} value={consolidation.id} />
                <InfoRow
                  label={t("client")}
                  value={`${consolidation.client.fullName} (${consolidation.client.email})`}
                />
                <InfoRow
                  label={t("description")}
                  value={consolidation.description}
                />
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("status")}
                  </span>
                  <div>
                    <StatusBadge
                      status={
                        consolidation.status as
                          | "pending"
                          | "in_transit"
                          | "delivered"
                      }
                      label={getStatusLabel(consolidation.status)}
                    />
                  </div>
                </div>
                <InfoRow
                  label={t("deliveryDate")}
                  value={
                    consolidation.deliveryDate
                      ? new Date(
                          consolidation.deliveryDate
                        ).toLocaleDateString()
                      : undefined
                  }
                />
                <InfoRow label={t("comment")} value={consolidation.comment} />
                <InfoRow
                  label={t("createdAt")}
                  value={new Date(consolidation.createdAt).toLocaleString()}
                />
                <InfoRow
                  label={t("updatedAt")}
                  value={new Date(consolidation.updatedAt).toLocaleString()}
                />
              </div>
            </div>

            {/* Packages List */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("packagesInfo")} ({consolidation.packages.length})
              </h3>
              {consolidation.packages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground rounded-lg border-2 border-dashed">
                  {t("noPackages")}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("packageBarcode")}</TableHead>
                        <TableHead>{t("packageDescription")}</TableHead>
                        <TableHead>{t("packageWeight")}</TableHead>
                        <TableHead>{t("packageDimensions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consolidation.packages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-mono font-medium">
                            {pkg.barcode}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {pkg.description || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {pkg.weight && pkg.weightUnit
                              ? `${pkg.weight} ${pkg.weightUnit}`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {pkg.length && pkg.width && pkg.height
                              ? `${pkg.length}×${pkg.width}×${pkg.height} ${pkg.dimensionUnit || ""}`
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleClose}>{t("close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
