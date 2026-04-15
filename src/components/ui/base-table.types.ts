import * as React from "react";
import { LucideIcon } from "lucide-react";

export interface ColumnDef<T> {
  id: string;
  header: React.ReactNode;
  headerIcon?: LucideIcon;
  cell: (item: T, index: number) => React.ReactNode;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sortField?: string;
  skeletonWidth?: string;
  skeletonVariant?: "text" | "badge" | "date" | "actions";
  skeletonActionCount?: number;
  headerClassName?: string;
}

export interface SortState {
  field: string;
  order: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SelectionConfig<T> {
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  getItemId: (item: T) => string;
  selectionBarContent?: React.ReactNode;
  selectionLabels?: {
    selectedLabel?: React.ReactNode;
    clearLabel?: React.ReactNode;
    message?: string;
  };
}

export interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export interface PaginationLabels {
  showing?: (start: number, end: number, total: number) => React.ReactNode;
  rowsPerPage?: string;
  previousPage?: string;
  nextPage?: string;
  goToPage?: (page: number | string) => string;
}

export interface BaseTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  isLoading?: boolean;
  skeletonRowCount?: number;
  renderRow?: (item: T, index: number, isSelected: boolean) => React.ReactNode;
  selection?: SelectionConfig<T>;
  sort?: SortState;
  onSortChange?: (field: string) => void;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  paginationLabels?: PaginationLabels;
  emptyState?: EmptyStateConfig;
  withTooltipProvider?: boolean;
  toolbar?: React.ReactNode;
  className?: string;
}
