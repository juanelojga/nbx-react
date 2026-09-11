import { z } from "zod";

import { digitsOnly } from "@/lib/validation/primitives/digitsOnly";
import { optionalEmail } from "@/lib/validation/primitives/optionalEmail";
import { requiredTrimmed } from "@/lib/validation/primitives/requiredTrimmed";

type TranslationFn = (key: string) => string;

export interface ClientFormValues {
  firstName: string;
  lastName: string;
  email: string;
  extraEmail1: string;
  extraEmail2: string;
  identificationNumber: string;
  mobilePhoneNumber: string;
  phoneNumber: string;
  state: string;
  city: string;
  mainStreet: string;
  secondaryStreet: string;
  buildingNumber: string;
}

export const EMPTY_CLIENT_FORM: ClientFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  extraEmail1: "",
  extraEmail2: "",
  identificationNumber: "",
  mobilePhoneNumber: "",
  phoneNumber: "",
  state: "",
  city: "",
  mainStreet: "",
  secondaryStreet: "",
  buildingNumber: "",
};

/**
 * Client create/edit form. The email is immutable after creation, so edit
 * forms skip its validation (`requireEmail: false`).
 */
export function createClientFormSchema(
  t: TranslationFn,
  { requireEmail }: { requireEmail: boolean }
) {
  return z.object({
    firstName: requiredTrimmed(t("firstNameRequired")),
    lastName: requiredTrimmed(t("lastNameRequired")),
    email: requireEmail
      ? requiredTrimmed(t("emailRequired")).pipe(z.email(t("emailInvalid")))
      : z.string(),
    extraEmail1: optionalEmail(t("extraEmail1Invalid")),
    extraEmail2: optionalEmail(t("extraEmail2Invalid")),
    identificationNumber: z.string(),
    mobilePhoneNumber: digitsOnly(t("mobilePhoneInvalid")),
    phoneNumber: digitsOnly(t("phoneNumberInvalid")),
    state: z.string(),
    city: z.string(),
    mainStreet: z.string(),
    secondaryStreet: z.string(),
    buildingNumber: z.string(),
  }) satisfies z.ZodType<ClientFormValues>;
}
