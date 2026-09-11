"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";

import { DataRowPrimaryCell } from "@/components/common/DataRowPrimaryCell";
import { DataRowShell } from "@/components/common/DataRowShell";
import { TableActionButtons } from "@/components/common/TableActionButtons";
import { StatusBadge } from "@/components/data-display/status-badge";
import { TableCell } from "@/components/ui/table";
import type { ConsolidateType } from "@/graphql/queries/consolidations";
import { getStatusLabel } from "@/lib/consolidations/getStatusLabel";
import { parseISODate } from "@/lib/date/parseISODate";

interface ConsolidationRowProps {
  consolidation: ConsolidateType;
  onView: (id: string) => void;
  onEdit: (consolidation: ConsolidateType) => void;
  onDelete: (consolidation: ConsolidateType) => void;
  animationDelay?: number;
}

export const ConsolidationRow = memo(function ConsolidationRow({
  consolidation,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}: ConsolidationRowProps) {
  const t = useTranslations("adminConsolidations");

  return (
    <DataRowShell animationDelay={animationDelay}>
      <DataRowPrimaryCell
        text={consolidation.id}
        mono
        className="max-w-[120px]"
      />
      <TableCell>
        <div className="relative max-w-[200px]">
          <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300 truncate">
            {consolidation.client.fullName}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[240px] truncate text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300"
          title={consolidation.description}
        >
          {consolidation.description}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge
          status={consolidation.status}
          label={getStatusLabel(t, consolidation.status)}
          iconOnly
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <span className="text-xs font-medium text-foreground/80">
              {consolidation.packages.length}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <time
              className="text-xs font-medium text-foreground/80 whitespace-nowrap"
              dateTime={consolidation.deliveryDate || undefined}
            >
              {parseISODate(
                consolidation.deliveryDate ?? ""
              )?.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) ?? "\u2014"}
            </time>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <time
              className="text-xs font-medium text-foreground/80 whitespace-nowrap"
              dateTime={consolidation.createdAt}
            >
              {new Date(consolidation.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-col justify-center rounded-md bg-muted/50 px-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/80">
            <span
              className="text-xs font-medium text-foreground/80 whitespace-nowrap"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {consolidation.totalCost != null
                ? `$${consolidation.totalCost.toFixed(2)}`
                : "\u2014"}
            </span>
          </div>
        </div>
      </TableCell>
      <TableActionButtons
        onView={{
          onClick: () => onView(consolidation.id),
          ariaLabel: t("viewAriaLabel", {
            description: consolidation.description,
          }),
          tooltip: t("viewConsolidation"),
        }}
        onEdit={{
          onClick: () => onEdit(consolidation),
          ariaLabel: t("editAriaLabel", {
            description: consolidation.description,
          }),
          tooltip: t("editConsolidation"),
        }}
        onDelete={{
          onClick: () => onDelete(consolidation),
          ariaLabel: t("deleteAriaLabel", {
            description: consolidation.description,
          }),
          tooltip: t("deleteConsolidation"),
        }}
      />
    </DataRowShell>
  );
});
