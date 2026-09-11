import type {
  SortOrder,
  SortSelection,
} from "@/lib/table/table-url-state.types";

/**
 * Inverse of `encodeOrderBy`. Unknown fields fall back to the default so a
 * hand-edited URL can never send an unsupported ordering to the API.
 */
export function decodeOrderBy<TSort extends string>(
  raw: string | null,
  sortFields: readonly TSort[],
  fallback: SortSelection<TSort>
): SortSelection<TSort> {
  if (!raw) return fallback;
  const order: SortOrder = raw.startsWith("-") ? "desc" : "asc";
  const field = order === "desc" ? raw.slice(1) : raw;
  const match = sortFields.find((candidate) => candidate === field);
  return match ? { field: match, order } : fallback;
}
