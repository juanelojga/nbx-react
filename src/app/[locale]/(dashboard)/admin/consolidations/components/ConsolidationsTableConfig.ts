import type { ConsolidateType } from "@/graphql/queries/consolidations";
import type {
  ColumnDef,
  EmptyStateConfig,
  PaginationLabels,
} from "@/components/ui/base-table";
import { Package as PackageIcon } from "lucide-react";

export function getConsolidationColumns(
  t: (key: string) => string
): ColumnDef<ConsolidateType>[] {
  return [
    {
      id: "id",
      header: t("id"),
      cell: () => null,
      skeletonWidth: "8rem",
    },
    {
      id: "client",
      header: t("client"),
      cell: () => null,
      skeletonWidth: "9rem",
    },
    {
      id: "description",
      header: t("description"),
      cell: () => null,
      skeletonWidth: "10rem",
    },
    {
      id: "status",
      header: t("status"),
      cell: () => null,
      sortable: true,
      sortField: "status",
      skeletonWidth: "5rem",
      skeletonVariant: "badge",
    },
    {
      id: "packagesCount",
      header: t("packagesCount"),
      cell: () => null,
      skeletonWidth: "3rem",
      skeletonVariant: "date",
    },
    {
      id: "deliveryDate",
      header: t("deliveryDate"),
      cell: () => null,
      sortable: true,
      sortField: "delivery_date",
      skeletonWidth: "7rem",
      skeletonVariant: "date",
    },
    {
      id: "totalCost",
      header: t("totalCost"),
      cell: () => null,
      skeletonWidth: "5rem",
    },
    {
      id: "actions",
      header: t("actions"),
      cell: () => null,
      align: "right",
      skeletonVariant: "actions",
      skeletonActionCount: 3,
    },
  ];
}

export function getEmptyStateConfig(
  t: (key: string, values?: Record<string, string>) => string,
  searchInput: string,
  statusFilter: string,
  clearAction?: React.ReactNode
): EmptyStateConfig {
  const hasFilters = searchInput || statusFilter !== "all";

  return {
    icon: PackageIcon,
    title: hasFilters
      ? t("noMatchingConsolidations")
      : t("noConsolidationsFound"),
    description: searchInput
      ? t("noMatchingConsolidationsDescription", { search: searchInput })
      : t("noConsolidationsFoundDescription"),
    action: hasFilters ? clearAction : undefined,
  };
}

type TranslationFn = (
  key: string,
  values?: Record<string, string | number | Date>
) => string;

export function getPaginationLabels(t: TranslationFn): PaginationLabels {
  return {
    showing: (start: number, end: number, total: number) =>
      t("showingResults", { start, end, total }),
    rowsPerPage: `${t("itemsPerPage")}:`,
    previousPage: t("previousPage"),
    nextPage: t("nextPage"),
    goToPage: (pageNum: number | string) => t("goToPage", { page: pageNum }),
  };
}
