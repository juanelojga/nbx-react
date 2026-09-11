import type { ListConnection } from "@/hooks/useAdminListPage";
import { compact } from "@/lib/graphql/compact";

interface NullableConnection<TItem> {
  results?: ReadonlyArray<TItem | null> | null;
  totalCount?: number | null;
  hasNext?: boolean | null;
  hasPrevious?: boolean | null;
}

/** Normalize Graphene's all-nullable connection fields for the list hook. */
export function toListConnection<TItem>(
  connection: NullableConnection<TItem> | null | undefined
): ListConnection<TItem> | undefined {
  if (!connection) return undefined;
  return {
    results: compact(connection.results),
    totalCount: connection.totalCount ?? 0,
    hasNext: connection.hasNext ?? false,
    hasPrevious: connection.hasPrevious ?? false,
  };
}
