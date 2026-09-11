/** Drop null/undefined entries from a nullable GraphQL list. */
export function compact<T>(
  items: ReadonlyArray<T | null | undefined> | null | undefined
): T[] {
  return (items ?? []).filter((item): item is T => item != null);
}
