import { z } from "zod";

type TranslationFn = (key: string) => string;

export const MAX_EXTRA_ATTRIBUTES = 5;

export function createConsolidationFormSchema(t: TranslationFn) {
  return z.object({
    description: z.string().min(1, t("descriptionRequired")),
    comment: z.string().optional(),
    extraAttributes: z
      .array(z.object({ key: z.string(), value: z.string() }))
      .max(MAX_EXTRA_ATTRIBUTES)
      .optional()
      .default([]),
    sendEmail: z.boolean().optional().default(true),
  });
}
