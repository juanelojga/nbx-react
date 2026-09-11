"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";

import { DataRowPrimaryCell } from "@/components/common/DataRowPrimaryCell";
import { DataRowShell } from "@/components/common/DataRowShell";
import { TableActionButtons } from "@/components/common/TableActionButtons";
import { TableCell } from "@/components/ui/table";
import type { PackageType } from "@/graphql/queries/packages";

interface PackageRowProps {
  pkg: PackageType;
  onView: (packageId: string) => void;
  onEdit: (pkg: PackageType) => void;
  onDelete: (pkg: PackageType) => void;
  animationDelay?: number;
}

function formatWeight(weight: number | null, unit: string | null): string {
  if (weight === null || weight === undefined) return "-";
  return `${weight} ${unit || ""}`.trim();
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export const PackageRow = memo(function PackageRow({
  pkg,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}: PackageRowProps) {
  const t = useTranslations("adminPackagesManagement");

  return (
    <DataRowShell animationDelay={animationDelay}>
      <DataRowPrimaryCell text={pkg.barcode} className="max-w-[200px]" />
      <TableCell>
        <div
          className="max-w-[220px] flex flex-col"
          title={pkg.client?.fullName || pkg.client?.email || "-"}
        >
          <span className="truncate text-xs font-medium text-foreground transition-colors duration-300">
            {pkg.client?.fullName || "-"}
          </span>
          {pkg.client?.email && (
            <span className="truncate text-[11px] text-muted-foreground">
              {pkg.client.email}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div
          className="max-w-[260px] truncate text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300"
          title={pkg.description || "-"}
        >
          {pkg.description || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {formatWeight(pkg.weight, pkg.weightUnit)}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {formatDate(pkg.createdAt)}
        </div>
      </TableCell>
      <TableActionButtons
        onView={{
          onClick: () => onView(pkg.id),
          ariaLabel: t("viewAriaLabel", { barcode: pkg.barcode }),
          tooltip: t("viewPackage"),
        }}
        onEdit={{
          onClick: () => onEdit(pkg),
          ariaLabel: t("editAriaLabel", { barcode: pkg.barcode }),
          tooltip: t("editPackage"),
        }}
        onDelete={{
          onClick: () => onDelete(pkg),
          ariaLabel: t("deleteAriaLabel", { barcode: pkg.barcode }),
          tooltip: t("deletePackage"),
        }}
      />
    </DataRowShell>
  );
});
