export type { ClientType } from "@/graphql/queries/clients";

export type SortField = "full_name" | "email" | "created_at";

export interface ClientToDelete {
  id: string;
  userId: string;
  fullName: string;
  email: string;
}

export interface ClientToEdit {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identificationNumber: string | null;
  mobilePhoneNumber: string | null;
  phoneNumber: string | null;
  state: string | null;
  city: string | null;
  mainStreet: string | null;
  secondaryStreet: string | null;
  buildingNumber: string | null;
}
