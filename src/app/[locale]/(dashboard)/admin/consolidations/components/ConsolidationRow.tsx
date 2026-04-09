"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableActionButtons } from "@/components/common/TableActionButtons";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ConsolidateType } from "@/graphql/queries/consolidations";
import { getStatusLabel } from "./getStatusLabel";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TableRow
      className="group relative transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent hover:border-l-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationName: "fade-in",
        animationDuration: "0.4s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <TableCell>
        <div className="relative">
          <div
            className="font-mono text-xs font-semibold tracking-wide text-foreground transition-colors duration-300"
            style={{ fontVariantNumeric: "tabular-nums" }}
            title={consolidation.id}
          >
            <div className="max-w-[120px] truncate">{consolidation.id}</div>
          </div>
          <div
            className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 ${
              isHovered ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="relative max-w-[200px]">
          <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300 truncate">
            {consolidation.client.fullName}
          </p>
        </div>
      </TableCell>
      <TableCell className="whitespace-normal">
        <div className="relative max-w-xs">
          {consolidation.description ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs transition-colors duration-300 line-clamp-3 text-muted-foreground group-hover:text-foreground cursor-default">
                  {consolidation.description}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-sm text-[11px]">
                {consolidation.description}
              </TooltipContent>
            </Tooltip>
          ) : (
            <p className="text-xs transition-colors duration-300 text-muted-foreground/40 italic">
              {"\u2014"}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge
          status={consolidation.status}
          label={getStatusLabel(t, consolidation.status)}
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
              {consolidation.deliveryDate
                ? new Date(consolidation.deliveryDate).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )
                : "\u2014"}
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
          ariaLabel: `View ${consolidation.description}`,
          tooltip: t("viewConsolidation"),
        }}
        onEdit={{
          onClick: () => onEdit(consolidation),
          ariaLabel: `Edit ${consolidation.description}`,
          tooltip: t("editConsolidation"),
        }}
        onDelete={{
          onClick: () => onDelete(consolidation),
          ariaLabel: `Delete ${consolidation.description}`,
          tooltip: t("deleteConsolidation"),
        }}
      />
    </TableRow>
  );
});
