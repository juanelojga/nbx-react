"use client";

import { useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye, Loader2, Package } from "lucide-react";
import {
  GET_CONSOLIDATE_BY_ID,
  GetConsolidateByIdResponse,
  GetConsolidateByIdVariables,
} from "@/graphql/queries/consolidations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/data-display/status-badge";
import { parseExtraAttributes } from "@/lib/consolidations/parseExtraAttributes";
import { getViewConsolidationPackageColumns } from "@/components/admin/viewConsolidationPackageColumns";
import { BaseTable } from "@/components/data-display/base-table";
import { getStatusLabel } from "@/lib/consolidations/getStatusLabel";
import { useMemo } from "react";

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
  const packageColumns = useMemo(
    () => getViewConsolidationPackageColumns(t),
    [t]
  );

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={t("title")}
      description={t("description")}
      icon={Eye}
      footer={<Button onClick={handleClose}>{t("close")}</Button>}
    >
      {/* Loading State */}
      {loading && (
        <div
          className="flex items-center justify-center py-12"
          role="status"
          aria-live="polite"
        >
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
            <h3 className="text-lg font-semibold mb-4">{t("generalInfo")}</h3>
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
                    status={consolidation.status}
                    label={getStatusLabel(tStatus, consolidation.status)}
                  />
                </div>
              </div>
              <InfoRow
                label={t("deliveryDate")}
                value={
                  consolidation.deliveryDate
                    ? (() => {
                        const [y, m, d] = consolidation.deliveryDate
                          .split("-")
                          .map(Number);
                        return new Date(y, m - 1, d).toLocaleDateString();
                      })()
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
              <InfoRow
                label={t("totalCost")}
                value={
                  consolidation.totalCost != null
                    ? `$${consolidation.totalCost.toFixed(2)}`
                    : undefined
                }
              />
              {(() => {
                const entries = parseExtraAttributes(
                  consolidation.extraAttributes
                );
                if (entries.length === 0) return null;
                return (
                  <div className="flex flex-col space-y-1 md:col-span-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("extraAttributes")}
                    </span>
                    <div className="space-y-1">
                      {entries.map((entry, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm text-foreground max-w-xs"
                        >
                          <span className="capitalize">{entry.key}</span>
                          <span className="font-mono">
                            ${Number(entry.value).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
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
              <BaseTable
                columns={packageColumns}
                data={consolidation.packages}
                getRowKey={(pkg) => pkg.id}
                withTooltipProvider={false}
              />
            )}
          </div>
        </div>
      )}
    </BaseDialog>
  );
}
