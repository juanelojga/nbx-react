import { z } from "zod";

/** Empty string or digits only (phone/identification numbers as typed). */
export function digitsOnly(message: string) {
  return z.string().regex(/^\d*$/, message);
}
