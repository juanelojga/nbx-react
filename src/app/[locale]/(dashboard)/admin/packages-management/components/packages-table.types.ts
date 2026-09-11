export type { PackageType } from "@/graphql/queries/packages";

export const SORT_FIELDS = ["barcode", "description", "created_at"] as const;

export type SortField = (typeof SORT_FIELDS)[number];

export interface PackageToDelete {
  id: string;
  barcode: string;
}
