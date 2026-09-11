import type { ExtraAttributeEntry } from "@/types/consolidation";

/** Serialize non-empty entries to the JSON object the backend stores; undefined when empty. */
export function serializeExtraAttributes(
  entries: ExtraAttributeEntry[]
): string | undefined {
  const filtered = entries.filter(
    (e) => e.key.trim() !== "" && e.value.trim() !== ""
  );
  if (filtered.length === 0) return undefined;
  const obj: Record<string, string> = {};
  for (const entry of filtered) {
    obj[entry.key.trim()] = entry.value.trim();
  }
  return JSON.stringify(obj);
}
