export type { ClientType } from "@/graphql/queries/clients";

export const SORT_FIELDS = ["full_name", "email", "created_at"] as const;

export type SortField = (typeof SORT_FIELDS)[number];

export interface ClientToDelete {
  id: string;
  fullName: string;
  email: string;
}

export interface ClientToEdit {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  extraEmail1: string | null;
  extraEmail2: string | null;
  identificationNumber: string | null;
  mobilePhoneNumber: string | null;
  phoneNumber: string | null;
  state: string | null;
  city: string | null;
  mainStreet: string | null;
  secondaryStreet: string | null;
  buildingNumber: string | null;
}
