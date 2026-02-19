import { useCallback } from "react";
import { useRouter, usePathname } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";

type SortField = "created_at" | "delivery_date" | "status";
type SortOrder = "asc" | "desc";

export interface ConsolidationTableState {
  search: string;
  page: number;
  pageSize: number;
  sortField: SortField;
  sortOrder: SortOrder;
  status: string; // Status filter
}

interface UseConsolidationTableStateOptions {
  defaultPageSize?: number;
  defaultSortField?: SortField;
  defaultSortOrder?: SortOrder;
}

interface UseConsolidationTableStateReturn {
  state: ConsolidationTableState;
  updateURL: (newState: Partial<ConsolidationTableState>) => void;
  getOrderBy: () => string;
}

/**
 * Custom hook for synchronizing consolidation table state with URL parameters
 *
 * @param options - Configuration options for default values
 * @returns Object containing current state, update function, and orderBy getter
 */
export function useConsolidationTableState(
  options: UseConsolidationTableStateOptions = {}
): UseConsolidationTableStateReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    defaultPageSize = 10,
    defaultSortField = "created_at",
    defaultSortOrder = "desc",
  } = options;

  /**
   * Parse URL parameters and return current state
   */
  const parseURLState = useCallback((): ConsolidationTableState => {
    // Parse search parameter
    const search = searchParams.get("search") || "";

    // Parse status filter
    const status = searchParams.get("status") || "all";

    // Parse page parameter (default to 1)
    const pageParam = searchParams.get("page");
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

    // Parse pageSize parameter (default to defaultPageSize, max 100)
    const MAX_PAGE_SIZE = 100;
    const pageSizeParam = searchParams.get("pageSize");
    const pageSize = pageSizeParam
      ? Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(pageSizeParam, 10)))
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
        field === "created_at" ||
        field === "delivery_date" ||
        field === "status"
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
      status,
    };
  }, [searchParams, defaultPageSize, defaultSortField, defaultSortOrder]);

  // Get current state from URL
  const state = parseURLState();

  /**
   * Update URL with new state parameters
   * Preserves existing parameters not being updated
   */
  const updateURL = useCallback(
    (newState: Partial<ConsolidationTableState>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update search parameter
      if (newState.search !== undefined) {
        if (newState.search) {
          params.set("search", newState.search);
        } else {
          params.delete("search");
        }
      }

      // Update status parameter
      if (newState.status !== undefined) {
        if (newState.status !== "all") {
          params.set("status", newState.status);
        } else {
          params.delete("status");
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
      const newURL = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newURL, { scroll: false });
    },
    [
      searchParams,
      pathname,
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
