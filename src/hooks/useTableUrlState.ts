"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { decodeOrderBy } from "@/lib/table/decodeOrderBy";
import { encodeOrderBy } from "@/lib/table/encodeOrderBy";
import { parsePositiveInt } from "@/lib/table/parsePositiveInt";
import type {
  ExtraParamsCodec,
  SortSelection,
  TableUrlState,
} from "@/lib/table/table-url-state.types";

export interface UseTableUrlStateOptions<
  TSort extends string,
  TExtra extends object,
> {
  sortFields: readonly TSort[];
  defaultSort: SortSelection<TSort>;
  defaultPageSize?: number;
  maxPageSize?: number;
  extra?: ExtraParamsCodec<TExtra>;
}

export interface UseTableUrlStateReturn<
  TSort extends string,
  TExtra extends object,
> {
  state: TableUrlState<TSort, TExtra>;
  /** Merge a partial state into the URL (values equal to defaults are dropped). */
  updateURL: (patch: Partial<TableUrlState<TSort, TExtra>>) => void;
  /** Ordering string ready for the GraphQL `orderBy` argument. */
  orderBy: string;
}

const EMPTY_EXTRA = {} as const;

/**
 * Keeps a data table's search/pagination/sort (and optional feature-specific
 * filters) in the URL so views are shareable and survive reloads.
 */
export function useTableUrlState<
  TSort extends string,
  TExtra extends object = typeof EMPTY_EXTRA,
>({
  sortFields,
  defaultSort,
  defaultPageSize = 10,
  maxPageSize = 100,
  extra,
}: UseTableUrlStateOptions<TSort, TExtra>): UseTableUrlStateReturn<
  TSort,
  TExtra
> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo<TableUrlState<TSort, TExtra>>(() => {
    const sort = decodeOrderBy(searchParams.get("orderBy"), sortFields, {
      field: defaultSort.field,
      order: defaultSort.order,
    });
    const extraState = extra
      ? extra.parse(searchParams)
      : (EMPTY_EXTRA as TExtra);
    return {
      search: searchParams.get("search") ?? "",
      page: parsePositiveInt(searchParams.get("page"), 1),
      pageSize: Math.min(
        maxPageSize,
        parsePositiveInt(searchParams.get("pageSize"), defaultPageSize)
      ),
      sortField: sort.field,
      sortOrder: sort.order,
      ...extraState,
    };
  }, [
    searchParams,
    sortFields,
    defaultSort.field,
    defaultSort.order,
    defaultPageSize,
    maxPageSize,
    extra,
  ]);

  const updateURL = useCallback(
    (patch: Partial<TableUrlState<TSort, TExtra>>) => {
      const params = new URLSearchParams(searchParams.toString());
      const { search, page, pageSize, sortField, sortOrder, ...extraPatch } =
        patch;

      if (search !== undefined) {
        if (search) params.set("search", search);
        else params.delete("search");
      }
      if (page !== undefined) {
        if (page > 1) params.set("page", String(page));
        else params.delete("page");
      }
      if (pageSize !== undefined) {
        if (pageSize !== defaultPageSize)
          params.set("pageSize", String(pageSize));
        else params.delete("pageSize");
      }
      if (sortField !== undefined || sortOrder !== undefined) {
        const field = sortField ?? state.sortField;
        const order = sortOrder ?? state.sortOrder;
        if (field !== defaultSort.field || order !== defaultSort.order) {
          params.set("orderBy", encodeOrderBy(field, order));
        } else {
          params.delete("orderBy");
        }
      }
      if (extra && Object.keys(extraPatch).length > 0) {
        extra.apply(params, extraPatch as Partial<TExtra>, state);
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [
      searchParams,
      pathname,
      router,
      defaultPageSize,
      defaultSort.field,
      defaultSort.order,
      extra,
      state,
    ]
  );

  return {
    state,
    updateURL,
    orderBy: encodeOrderBy(state.sortField, state.sortOrder),
  };
}
