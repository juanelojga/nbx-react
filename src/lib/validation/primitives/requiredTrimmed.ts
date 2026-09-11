import { z } from "zod";

/** Non-empty string after trimming. */
export function requiredTrimmed(message: string) {
  return z.string().trim().min(1, message);
}
