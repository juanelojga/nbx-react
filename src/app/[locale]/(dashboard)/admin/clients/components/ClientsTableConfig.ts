import type { ClientType } from "@/graphql/queries/clients";
import type {
  ColumnDef,
  EmptyStateConfig,
  PaginationLabels,
} from "@/components/ui/base-table";
import { Users } from "lucide-react";

export function getClientColumns(
  t: (key: string) => string
): ColumnDef<ClientType>[] {
  return [
    {
      id: "fullName",
      header: t("fullName"),
      cell: () => null,
      sortable: true,
      sortField: "full_name",
      skeletonWidth: "8rem",
    },
    {
      id: "email",
      header: t("email"),
      cell: () => null,
      sortable: true,
      sortField: "email",
      skeletonWidth: "10rem",
    },
    {
      id: "location",
      header: t("location"),
      cell: () => null,
      skeletonWidth: "9rem",
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
    icon: Users,
    title: debouncedSearch ? t("noMatchingClients") : t("noClientsFound"),
    description: debouncedSearch
      ? t("noMatchingClientsDescription", { search: debouncedSearch })
      : t("noClientsFoundDescription"),
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
