import type { ExtraAttributeEntry } from "@/types/consolidation";

/** Inverse of `serializeExtraAttributes`; tolerant of null/invalid JSON. */
export function parseExtraAttributes(
  json: string | null
): ExtraAttributeEntry[] {
  if (!json) return [];
  try {
    const obj: unknown = JSON.parse(json);
    if (typeof obj !== "object" || obj === null || Array.isArray(obj))
      return [];
    return Object.entries(obj as Record<string, unknown>).map(
      ([key, value]) => ({
        key,
        value: String(value),
      })
    );
  } catch {
    return [];
  }
}
