import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SortField = "full_name" | "email" | "created_at";
type SortOrder = "asc" | "desc";

export interface ClientTableState {
  search: string;
  page: number;
  pageSize: number;
  sortField: SortField;
  sortOrder: SortOrder;
}

interface UseClientTableStateOptions {
  defaultPageSize?: number;
  defaultSortField?: SortField;
  defaultSortOrder?: SortOrder;
}

interface UseClientTableStateReturn {
  state: ClientTableState;
  updateURL: (newState: Partial<ClientTableState>) => void;
  getOrderBy: () => string;
}

/**
 * Custom hook for synchronizing client table state with URL parameters
 *
 * @param options - Configuration options for default values
 * @returns Object containing current state, update function, and orderBy getter
 */
export function useClientTableState(
  options: UseClientTableStateOptions = {}
): UseClientTableStateReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    defaultPageSize = 10,
    defaultSortField = "created_at",
    defaultSortOrder = "desc",
  } = options;

  /**
   * Parse URL parameters and return current state
   */
  const parseURLState = useCallback((): ClientTableState => {
    // Parse search parameter
    const search = searchParams.get("search") || "";

    // Parse page parameter (default to 1)
    const pageParam = searchParams.get("page");
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

    // Parse pageSize parameter (default to defaultPageSize)
    const pageSizeParam = searchParams.get("pageSize");
    const pageSize = pageSizeParam
      ? Math.max(1, parseInt(pageSizeParam, 10))
      : defaultPageSize;

    // Parse orderBy parameter (format: "field" or "-field")
    const orderBy = searchParams.get("orderBy") || "";
    let sortField: SortField = defaultSortField;
    let sortOrder: SortOrder = defaultSortOrder;

    if (orderBy) {
      const isDescending = orderBy.startsWith("-");
      const field = isDescending ? orderBy.slice(1) : orderBy;

      // Validate field is one of the allowed sort fields
      if (
        field === "full_name" ||
        field === "email" ||
        field === "created_at"
      ) {
        sortField = field;
        sortOrder = isDescending ? "desc" : "asc";
      }
    }

    return {
      search,
      page,
      pageSize,
      sortField,
      sortOrder,
    };
  }, [searchParams, defaultPageSize, defaultSortField, defaultSortOrder]);

  // Get current state from URL
  const state = parseURLState();

  /**
   * Update URL with new state parameters
   * Preserves existing parameters not being updated
   */
  const updateURL = useCallback(
    (newState: Partial<ClientTableState>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update search parameter
      if (newState.search !== undefined) {
        if (newState.search) {
          params.set("search", newState.search);
        } else {
          params.delete("search");
        }
      }

      // Update page parameter
      if (newState.page !== undefined) {
        if (newState.page > 1) {
          params.set("page", newState.page.toString());
        } else {
          params.delete("page");
        }
      }

      // Update pageSize parameter
      if (newState.pageSize !== undefined) {
        if (newState.pageSize !== defaultPageSize) {
          params.set("pageSize", newState.pageSize.toString());
        } else {
          params.delete("pageSize");
        }
      }

      // Update orderBy parameter
      if (
        newState.sortField !== undefined ||
        newState.sortOrder !== undefined
      ) {
        const sortField = newState.sortField || state.sortField;
        const sortOrder = newState.sortOrder || state.sortOrder;
        const orderBy = `${sortOrder === "desc" ? "-" : ""}${sortField}`;

        // Only include in URL if different from default
        if (sortField !== defaultSortField || sortOrder !== defaultSortOrder) {
          params.set("orderBy", orderBy);
        } else {
          params.delete("orderBy");
        }
      }

      // Update URL without reloading the page
      const queryString = params.toString();
      const newURL = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;

      router.replace(newURL, { scroll: false });
    },
    [
      searchParams,
      router,
      defaultPageSize,
      defaultSortField,
      defaultSortOrder,
      state.sortField,
      state.sortOrder,
    ]
  );

  /**
   * Helper function to get orderBy string for GraphQL queries
   */
  const getOrderBy = useCallback((): string => {
    return `${state.sortOrder === "desc" ? "-" : ""}${state.sortField}`;
  }, [state.sortField, state.sortOrder]);

  return {
    state,
    updateURL,
    getOrderBy,
  };
}
