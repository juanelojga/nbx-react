export type SortOrder = "asc" | "desc";

export interface SortSelection<TSort extends string> {
  field: TSort;
  order: SortOrder;
}

/**
 * Codec for feature-specific URL parameters layered on top of the common
 * search/page/pageSize/orderBy set.
 */
export interface ExtraParamsCodec<TExtra extends object> {
  /** Derive the extra state from the current URL. */
  parse: (params: URLSearchParams) => TExtra;
  /** Write the changed keys of `patch` into `params`; `current` is the parsed state. */
  apply: (
    params: URLSearchParams,
    patch: Partial<TExtra>,
    current: TExtra
  ) => void;
}

export interface BaseTableUrlState<TSort extends string> {
  search: string;
  page: number;
  pageSize: number;
  sortField: TSort;
  sortOrder: SortOrder;
}

export type TableUrlState<
  TSort extends string,
  TExtra extends object,
> = BaseTableUrlState<TSort> & TExtra;
