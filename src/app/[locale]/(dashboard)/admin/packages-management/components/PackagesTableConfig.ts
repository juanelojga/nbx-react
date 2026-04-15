import type { PackageType } from "@/graphql/queries/packages";
import type {
  ColumnDef,
  EmptyStateConfig,
  PaginationLabels,
} from "@/components/ui/base-table";
import { Package as PackageIcon } from "lucide-react";

export function getPackageColumns(
  t: (key: string) => string
): ColumnDef<PackageType>[] {
  return [
    {
      id: "barcode",
      header: t("barcode"),
      cell: () => null,
      sortable: true,
      sortField: "barcode",
      skeletonWidth: "8rem",
    },
    {
      id: "owner",
      header: t("owner"),
      cell: () => null,
      skeletonWidth: "10rem",
    },
    {
      id: "description",
      header: t("description"),
      cell: () => null,
      sortable: true,
      sortField: "description",
      skeletonWidth: "12rem",
    },
    {
      id: "weight",
      header: t("weight"),
      cell: () => null,
      skeletonWidth: "5rem",
    },
    {
      id: "createdAt",
      header: t("createdAt"),
      cell: () => null,
      sortable: true,
      sortField: "created_at",
      skeletonWidth: "6rem",
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
  debouncedSearch: string,
  clearSearchAction?: React.ReactNode
): EmptyStateConfig {
  return {
    icon: PackageIcon,
    title: debouncedSearch ? t("noMatchingPackages") : t("noPackagesFound"),
    description: debouncedSearch
      ? t("noMatchingPackagesDescription", { search: debouncedSearch })
      : t("noPackagesFoundDescription"),
    action: debouncedSearch ? clearSearchAction : undefined,
  };
}

type TranslationFn = (
  key: string,
  values?: Record<string, string | number | Date>
) => string;

export function getPaginationLabels(t: TranslationFn): PaginationLabels {
  return {
    showing: (start: number, end: number, total: number) =>
      t("showing", { start, end, total }),
    rowsPerPage: t("rowsPerPage"),
    previousPage: t("previousPage"),
    nextPage: t("nextPage"),
    goToPage: (pageNum: number | string) => t("goToPage", { page: pageNum }),
  };
}
