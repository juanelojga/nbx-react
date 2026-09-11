import type { UpdateClientVariables } from "@/graphql/mutations/clients";
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

/** Email is immutable after creation and is never sent. */
export function toUpdateClientVariables(
  id: string,
  values: ClientFormValues
): UpdateClientVariables {
  const variables: UpdateClientVariables = {
    id,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
  };
  for (const field of OPTIONAL_FIELDS) {
    const value = values[field].trim();
    if (value) variables[field] = value;
  }
  return variables;
}
