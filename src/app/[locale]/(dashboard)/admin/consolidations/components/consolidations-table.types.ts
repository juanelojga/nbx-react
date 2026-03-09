export type { ConsolidateType } from "@/graphql/queries/consolidations";

export type SortField = "delivery_date" | "status";

export interface ConsolidationToDelete {
  id: string;
  description: string;
  client: {
    fullName: string;
    email: string;
  };
  packagesCount: number;
}
