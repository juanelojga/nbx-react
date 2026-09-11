import type { ClientFormValues } from "@/lib/validation/clientFormSchema";

type NullableClientFields = {
  [K in keyof ClientFormValues]: string | null | undefined;
};

/** Normalize nullable API fields into the empty-string form representation. */
export function toClientFormValues(
  client: NullableClientFields
): ClientFormValues {
  return {
    firstName: client.firstName ?? "",
    lastName: client.lastName ?? "",
    email: client.email ?? "",
    extraEmail1: client.extraEmail1 ?? "",
    extraEmail2: client.extraEmail2 ?? "",
    identificationNumber: client.identificationNumber ?? "",
    mobilePhoneNumber: client.mobilePhoneNumber ?? "",
    phoneNumber: client.phoneNumber ?? "",
    state: client.state ?? "",
    city: client.city ?? "",
    mainStreet: client.mainStreet ?? "",
    secondaryStreet: client.secondaryStreet ?? "",
    buildingNumber: client.buildingNumber ?? "",
  };
}
