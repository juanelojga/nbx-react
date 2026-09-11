import { z } from "zod";

import { requiredTrimmed } from "@/lib/validation/primitives/requiredTrimmed";

type TranslationFn = (key: string) => string;

export interface LoginFormValues {
  email: string;
  password: string;
}

const PASSWORD_MIN_LENGTH = 6;

export function createLoginFormSchema(t: TranslationFn) {
  return z.object({
    email: requiredTrimmed(t("emailRequired")).pipe(z.email(t("emailInvalid"))),
    password: z
      .string()
      .min(1, t("passwordRequired"))
      .min(PASSWORD_MIN_LENGTH, t("passwordMinLength")),
  }) satisfies z.ZodType<LoginFormValues>;
}
