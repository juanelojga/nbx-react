"use client";

import type { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { DocumentNode } from "graphql";
import { useCallback, useMemo } from "react";

import type {
  PaginationState,
  SortState,
} from "@/components/ui/base-table.types";
import { useSearchState } from "@/hooks/useSearchState";
import {
  useTableUrlState,
  type UseTableUrlStateOptions,
} from "@/hooks/useTableUrlState";
import type { TableUrlState } from "@/lib/table/table-url-state.types";

export interface ListConnection<TItem> {
  results: TItem[];
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UseAdminListPageOptions<
  TData,
  TVariables extends OperationVariables,
  TItem,
  TSort extends string,
  TExtra extends object,
> extends UseTableUrlStateOptions<TSort, TExtra> {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  /** Map the URL state (with the debounced search and encoded orderBy) to query variables. */
  buildVariables: (
    state: TableUrlState<TSort, TExtra> & { orderBy: string }
  ) => TVariables;
  /** Pick the paginated connection out of the query result. */
  selectConnection: (
    data: TData | undefined
  ) => ListConnection<TItem> | undefined;
}

export interface UseAdminListPageReturn<
  TItem,
  TSort extends string,
  TExtra extends object,
> {
  items: TItem[];
  loading: boolean;
  errorMessage: string | null;
  refresh: () => Promise<void>;
  urlState: TableUrlState<TSort, TExtra>;
  updateURL: (patch: Partial<TableUrlState<TSort, TExtra>>) => void;
  search: {
    input: string;
    setInput: (value: string) => void;
    debounced: string;
    isDebouncing: boolean;
    clear: () => void;
  };
  table: {
    sort: SortState;
    onSortChange: (field: string) => void;
    pagination: PaginationState | undefined;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    skeletonRowCount: number;
  };
}

/**
 * Everything an admin list page needs: URL-backed table state, a debounced
 * search box, the paginated query and the BaseTable sort/pagination handlers.
 */
export function useAdminListPage<
  TData,
  TVariables extends OperationVariables,
  TItem,
  TSort extends string,
  TExtra extends object = Record<never, never>,
>({
  query,
  buildVariables,
  selectConnection,
  ...urlOptions
}: UseAdminListPageOptions<
  TData,
  TVariables,
  TItem,
  TSort,
  TExtra
>): UseAdminListPageReturn<TItem, TSort, TExtra> {
  const { state, updateURL, orderBy } = useTableUrlState<TSort, TExtra>(
    urlOptions
  );

  const handleSearchChange = useCallback(
    (search: string, page: number) =>
      updateURL({ search, page } as Partial<TableUrlState<TSort, TExtra>>),
    [updateURL]
  );

  const search = useSearchState({
    initialSearch: state.search,
    onSearchChange: handleSearchChange,
  });

  const variables = useMemo(
    () => buildVariables({ ...state, search: search.debouncedSearch, orderBy }),
    [buildVariables, state, search.debouncedSearch, orderBy]
  );

  const { data, loading, error, refetch } = useQuery<TData, TVariables>(query, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const onSortChange = useCallback(
    (field: string) => {
      if (state.sortField === field) {
        updateURL({
          sortOrder: state.sortOrder === "asc" ? "desc" : "asc",
        } as Partial<TableUrlState<TSort, TExtra>>);
      } else {
        updateURL({
          sortField: field as TSort,
          sortOrder: "asc",
        } as Partial<TableUrlState<TSort, TExtra>>);
      }
    },
    [state.sortField, state.sortOrder, updateURL]
  );

  const onPageChange = useCallback(
    (page: number) =>
      updateURL({ page } as Partial<TableUrlState<TSort, TExtra>>),
    [updateURL]
  );

  const onPageSizeChange = useCallback(
    (pageSize: number) =>
      updateURL({ pageSize, page: 1 } as Partial<TableUrlState<TSort, TExtra>>),
    [updateURL]
  );

  const connection = selectConnection(data);
  const totalCount = connection?.totalCount ?? 0;

  const sort = useMemo<SortState>(
    () => ({ field: state.sortField, order: state.sortOrder }),
    [state.sortField, state.sortOrder]
  );

  const pagination = useMemo<PaginationState | undefined>(
    () =>
      totalCount > 0
        ? {
            page: state.page,
            pageSize: state.pageSize,
            totalCount,
            hasNext: connection?.hasNext ?? false,
            hasPrevious: connection?.hasPrevious ?? false,
          }
        : undefined,
    [
      state.page,
      state.pageSize,
      totalCount,
      connection?.hasNext,
      connection?.hasPrevious,
    ]
  );

  return {
    items: connection?.results ?? [],
    loading,
    errorMessage: error ? error.message : null,
    refresh,
    urlState: state,
    updateURL,
    search: {
      input: search.searchInput,
      setInput: search.setSearchInput,
      debounced: search.debouncedSearch,
      isDebouncing: search.isDebouncing,
      clear: search.handleClearSearch,
    },
    table: {
      sort,
      onSortChange,
      pagination,
      onPageChange,
      onPageSizeChange,
      skeletonRowCount: state.pageSize,
    },
  };
}
