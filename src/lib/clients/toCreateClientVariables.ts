import type { CreateClientVariables } from "@/graphql/mutations/clients";
import type { ClientFormValues } from "@/lib/validation/clientFormSchema";

const OPTIONAL_FIELDS = [
  "extraEmail1",
  "extraEmail2",
  "identificationNumber",
  "mobilePhoneNumber",
  "phoneNumber",
  "state",
  "city",
  "mainStreet",
  "secondaryStreet",
  "buildingNumber",
] as const;

/** Trim every value and omit optional fields left empty. */
export function toCreateClientVariables(
  values: ClientFormValues
): CreateClientVariables {
  const variables: CreateClientVariables = {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
  };
  for (const field of OPTIONAL_FIELDS) {
    const value = values[field].trim();
    if (value) variables[field] = value;
  }
  return variables;
}
