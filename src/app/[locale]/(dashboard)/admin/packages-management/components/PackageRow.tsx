"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableActionButtons } from "@/components/common/TableActionButtons";
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TableRow
      key={pkg.id}
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
            className="max-w-[200px] truncate text-xs font-medium text-foreground transition-colors duration-300"
            title={pkg.barcode}
          >
            {pkg.barcode}
          </div>
          <div
            className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 ${
              isHovered ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          />
        </div>
      </TableCell>
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
          ariaLabel: `View ${pkg.barcode}`,
          tooltip: t("viewPackage"),
        }}
        onEdit={{
          onClick: () => onEdit(pkg),
          ariaLabel: `Edit ${pkg.barcode}`,
          tooltip: t("editPackage"),
        }}
        onDelete={{
          onClick: () => onDelete(pkg),
          ariaLabel: `Delete ${pkg.barcode}`,
          tooltip: t("deletePackage"),
        }}
      />
    </TableRow>
  );
});
