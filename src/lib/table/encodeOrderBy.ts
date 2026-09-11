import type { SortOrder } from "@/lib/table/table-url-state.types";

/** Django-style ordering string: `field` for ascending, `-field` for descending. */
export function encodeOrderBy(field: string, order: SortOrder): string {
  return `${order === "desc" ? "-" : ""}${field}`;
}
