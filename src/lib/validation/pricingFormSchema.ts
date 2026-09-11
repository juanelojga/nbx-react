import { z } from "zod";

type TranslationFn = (key: string) => string;

export interface PricingFormValues {
  transportationRatePerLb: string;
  serviceFeePercentage: string;
}

const toNumber = (value: string) => Number.parseFloat(value.trim());

/** Rate per lb must be a non-negative amount; the fee is a fraction from 0 to 1. */
export function createPricingFormSchema(t: TranslationFn) {
  return z.object({
    transportationRatePerLb: z.string().refine((value) => {
      const parsed = toNumber(value);
      return value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0;
    }, t("transportationRateInvalid")),
    serviceFeePercentage: z.string().refine((value) => {
      const parsed = toNumber(value);
      return (
        value.trim() !== "" &&
        Number.isFinite(parsed) &&
        parsed >= 0 &&
        parsed <= 1
      );
    }, t("serviceFeePercentageInvalid")),
  }) satisfies z.ZodType<PricingFormValues>;
}
