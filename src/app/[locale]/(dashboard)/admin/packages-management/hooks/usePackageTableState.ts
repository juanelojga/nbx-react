import { useCallback } from "react";
import { useRouter, usePathname } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";

type SortField = "barcode" | "description" | "created_at";
type SortOrder = "asc" | "desc";

export interface PackageTableState {
  search: string;
  page: number;
  pageSize: number;
  sortField: SortField;
  sortOrder: SortOrder;
}

interface UsePackageTableStateOptions {
  defaultPageSize?: number;
  defaultSortField?: SortField;
  defaultSortOrder?: SortOrder;
}

interface UsePackageTableStateReturn {
  state: PackageTableState;
  updateURL: (newState: Partial<PackageTableState>) => void;
  getOrderBy: () => string;
}

const ALLOWED_SORT_FIELDS: SortField[] = [
  "barcode",
  "description",
  "created_at",
];

export function usePackageTableState(
  options: UsePackageTableStateOptions = {}
): UsePackageTableStateReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    defaultPageSize = 10,
    defaultSortField = "created_at",
    defaultSortOrder = "desc",
  } = options;

  const parseURLState = useCallback((): PackageTableState => {
    const search = searchParams.get("search") || "";

    const pageParam = searchParams.get("page");
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

    const MAX_PAGE_SIZE = 100;
    const pageSizeParam = searchParams.get("pageSize");
    const pageSize = pageSizeParam
      ? Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(pageSizeParam, 10)))
      : defaultPageSize;

    const orderBy = searchParams.get("orderBy") || "";
    let sortField: SortField = defaultSortField;
    let sortOrder: SortOrder = defaultSortOrder;

    if (orderBy) {
      const isDescending = orderBy.startsWith("-");
      const field = isDescending ? orderBy.slice(1) : orderBy;

      if ((ALLOWED_SORT_FIELDS as string[]).includes(field)) {
        sortField = field as SortField;
        sortOrder = isDescending ? "desc" : "asc";
      }
    }

    return { search, page, pageSize, sortField, sortOrder };
  }, [searchParams, defaultPageSize, defaultSortField, defaultSortOrder]);

  const state = parseURLState();

  const updateURL = useCallback(
    (newState: Partial<PackageTableState>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newState.search !== undefined) {
        if (newState.search) {
          params.set("search", newState.search);
        } else {
          params.delete("search");
        }
      }

      if (newState.page !== undefined) {
        if (newState.page > 1) {
          params.set("page", newState.page.toString());
        } else {
          params.delete("page");
        }
      }

      if (newState.pageSize !== undefined) {
        if (newState.pageSize !== defaultPageSize) {
          params.set("pageSize", newState.pageSize.toString());
        } else {
          params.delete("pageSize");
        }
      }

      if (
        newState.sortField !== undefined ||
        newState.sortOrder !== undefined
      ) {
        const sortField = newState.sortField || state.sortField;
        const sortOrder = newState.sortOrder || state.sortOrder;
        const orderBy = `${sortOrder === "desc" ? "-" : ""}${sortField}`;

        if (sortField !== defaultSortField || sortOrder !== defaultSortOrder) {
          params.set("orderBy", orderBy);
        } else {
          params.delete("orderBy");
        }
      }

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

  const getOrderBy = useCallback((): string => {
    return `${state.sortOrder === "desc" ? "-" : ""}${state.sortField}`;
  }, [state.sortField, state.sortOrder]);

  return { state, updateURL, getOrderBy };
}
