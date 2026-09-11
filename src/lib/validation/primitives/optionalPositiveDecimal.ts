import { z } from "zod";

/** Empty string or a decimal strictly greater than zero (kept as text for inputs). */
export function optionalPositiveDecimal(message: string) {
  return z
    .string()
    .trim()
    .refine((value) => {
      if (value === "") return true;
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) && parsed > 0;
    }, message);
}
