import { z } from "zod";

/** Empty string or a syntactically valid email. */
export function optionalEmail(message: string) {
  return z.union([z.literal(""), z.email(message)]);
}
