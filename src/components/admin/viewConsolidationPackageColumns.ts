import type { ColumnDef } from "@/components/data-display/base-table.types";
import type { ConsolidatePackageType } from "@/graphql/queries/consolidations";

type TranslationFn = (key: string) => string;

const money = (value: number | null | undefined) =>
  value != null ? `$${value.toFixed(2)}` : "-";

/** Read-only package columns shown inside the consolidation details dialog. */
export function getViewConsolidationPackageColumns(
  t: TranslationFn
): ColumnDef<ConsolidatePackageType>[] {
  return [
    {
      id: "barcode",
      header: t("packageBarcode"),
      cell: (pkg) => pkg.barcode,
      headerClassName: "font-mono",
    },
    {
      id: "description",
      header: t("packageDescription"),
      cell: (pkg) => pkg.description || "-",
    },
    {
      id: "weight",
      header: t("packageWeight"),
      cell: (pkg) =>
        pkg.weight && pkg.weightUnit ? `${pkg.weight} ${pkg.weightUnit}` : "-",
    },
    {
      id: "dimensions",
      header: t("packageDimensions"),
      cell: (pkg) =>
        pkg.length && pkg.width && pkg.height
          ? `${pkg.length}×${pkg.width}×${pkg.height} ${pkg.dimensionUnit || ""}`.trim()
          : "-",
    },
    {
      id: "realPrice",
      header: t("packageRealPrice"),
      cell: (pkg) => money(pkg.realPrice),
      align: "right",
    },
    {
      id: "servicePrice",
      header: t("packageServicePrice"),
      cell: (pkg) => money(pkg.servicePrice),
      align: "right",
    },
  ];
}
