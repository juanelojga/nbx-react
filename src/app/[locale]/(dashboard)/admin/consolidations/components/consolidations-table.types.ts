export type { ConsolidateType } from "@/graphql/queries/consolidations";

export const SORT_FIELDS = ["delivery_date", "status", "created_at"] as const;

export type SortField = (typeof SORT_FIELDS)[number];

export interface ConsolidationToDelete {
  id: string;
  description: string;
  client: {
    fullName: string;
    email: string;
  };
  packagesCount: number;
}
