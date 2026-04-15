export type { PackageType } from "@/graphql/queries/packages";

export type SortField = "barcode" | "description" | "created_at";

export interface PackageToDelete {
  id: string;
  barcode: string;
}
