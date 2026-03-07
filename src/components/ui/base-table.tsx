"use client";

import * as React from "react";
import { useMemo } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  EnhancedTable,
  EnhancedTableHeader,
  EnhancedTableHead,
  EnhancedTableRow,
  EnhancedTableEmptyState,
  EnhancedTableSelectionBar,
} from "@/components/ui/enhanced-table";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  Sparkles,
} from "lucide-react";

/* ============================================================================
 * Type Definitions
 * ========================================================================== */

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

/* ============================================================================
 * TableSkeleton - Internal skeleton component
 * ========================================================================== */

const skeletonVariantClasses: Record<string, string> = {
  text: "h-4 rounded-md",
  badge: "h-6 rounded-full",
  date: "h-8 rounded-md",
  actions: "h-9 w-9 rounded-lg",
};

function TableSkeleton<T>({
  columns,
  rowCount,
  hasSelection,
}: {
  columns: ColumnDef<T>[];
  rowCount: number;
  hasSelection: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
        <EnhancedTable withSpacing={false}>
          <EnhancedTableHeader>
            <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20">
              {hasSelection && (
                <EnhancedTableHead className="w-12 pl-4">
                  <div className="h-4 w-4 animate-pulse rounded bg-muted/60" />
                </EnhancedTableHead>
              )}
              {columns.map((col) => (
                <EnhancedTableHead
                  key={col.id}
                  className={cn(
                    col.align === "right" && "text-right",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </EnhancedTableHead>
              ))}
            </TableRow>
          </EnhancedTableHeader>
          <TableBody>
            {[...Array(rowCount)].map((_, index) => (
              <TableRow
                key={index}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fade-in 0.6s ease-out forwards",
                  opacity: 0,
                }}
              >
                {hasSelection && (
                  <TableCell className="pl-4">
                    <div className="h-4 w-4 animate-pulse rounded bg-muted/60" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.skeletonVariant === "actions" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        {[...Array(col.skeletonActionCount || 3)].map(
                          (_, i) => (
                            <div
                              key={i}
                              className="h-9 w-9 animate-pulse rounded-lg bg-muted/60"
                              style={{ animationDelay: `${i * 50}ms` }}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "animate-pulse bg-muted/60",
                          skeletonVariantClasses[col.skeletonVariant || "text"]
                        )}
                        style={{
                          width: col.skeletonWidth || "8rem",
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </EnhancedTable>
      </div>
    </div>
  );
}

/* ============================================================================
 * TablePagination - Internal pagination component
 * ========================================================================== */

function TablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  labels,
}: {
  pagination: PaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  labels?: PaginationLabels;
}) {
  const { page, pageSize, totalCount, hasNext, hasPrevious } = pagination;
  const totalPages = Math.ceil(totalCount / pageSize);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page <= 3) {
        for (let i = 2; i <= Math.min(maxVisiblePages, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push(ellipsis);
      } else if (page >= totalPages - 2) {
        pages.push(ellipsis);
        for (let i = totalPages - maxVisiblePages + 1; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(ellipsis);
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push(ellipsis);
      }

      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-muted-foreground">
          {labels?.showing
            ? labels.showing(start, end, totalCount)
            : `${start}-${end} of ${totalCount}`}
        </p>
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {labels?.rowsPerPage || "Rows per page"}
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious}
            aria-label={labels?.previousPage || "Previous page"}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum, idx) =>
              pageNum === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum as number)}
                  className="h-8 w-8 p-0"
                  aria-label={
                    labels?.goToPage
                      ? labels.goToPage(pageNum)
                      : `Go to page ${pageNum}`
                  }
                  aria-current={page === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext}
            aria-label={labels?.nextPage || "Next page"}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * BaseTable - Main component
 * ========================================================================== */

export function BaseTable<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  skeletonRowCount = 5,
  renderRow,
  selection,
  sort,
  onSortChange,
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  paginationLabels,
  emptyState,
  withTooltipProvider = true,
  toolbar,
  className,
}: BaseTableProps<T>) {
  const allSelected = useMemo(() => {
    if (!selection || data.length === 0) return false;
    return data.every((item) =>
      selection.selectedIds.has(selection.getItemId(item))
    );
  }, [selection, data]);

  const someSelected = useMemo(() => {
    if (!selection) return false;
    return selection.selectedIds.size > 0 && !allSelected;
  }, [selection, allSelected]);

  const handleSelectAll = () => {
    if (!selection) return;
    if (allSelected) {
      selection.onSelectionChange(new Set());
    } else {
      selection.onSelectionChange(
        new Set(data.map((item) => selection.getItemId(item)))
      );
    }
  };

  const handleSelectItem = (itemId: string) => {
    if (!selection) return;
    const newSelection = new Set(selection.selectedIds);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    selection.onSelectionChange(newSelection);
  };

  const getSortIcon = (field: string) => {
    if (!sort || sort.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sort.order === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getAriaSort = (field: string): "ascending" | "descending" | "none" => {
    if (!sort || sort.field !== field) return "none";
    return sort.order === "asc" ? "ascending" : "descending";
  };

  const content = (
    <div className={cn("space-y-6", className)}>
      {toolbar}

      {isLoading ? (
        <TableSkeleton
          columns={columns}
          rowCount={skeletonRowCount}
          hasSelection={!!selection}
        />
      ) : data.length === 0 && emptyState ? (
        <EnhancedTableEmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={emptyState.action}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <div className="relative overflow-x-auto">
            <EnhancedTable withSpacing={false}>
              <EnhancedTableHeader>
                <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm transition-colors hover:from-muted/60 hover:to-muted/30">
                  {selection && (
                    <EnhancedTableHead className="w-12 pl-4">
                      <div className="relative">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                          className={cn(
                            "transition-all duration-300 hover:scale-110",
                            someSelected && "data-[state=checked]:bg-primary/50"
                          )}
                        />
                        {someSelected && !allSelected && (
                          <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-primary" />
                        )}
                      </div>
                    </EnhancedTableHead>
                  )}
                  {columns.map((col) => {
                    const isSortable =
                      col.sortable && col.sortField && onSortChange;
                    return (
                      <EnhancedTableHead
                        key={col.id}
                        className={cn(
                          col.align === "right" && "text-right",
                          isSortable &&
                            "cursor-pointer select-none hover:bg-accent/50 transition-colors",
                          col.headerClassName
                        )}
                        onClick={
                          isSortable
                            ? () => onSortChange(col.sortField!)
                            : undefined
                        }
                        aria-sort={
                          isSortable ? getAriaSort(col.sortField!) : undefined
                        }
                      >
                        {isSortable ? (
                          <div className="flex items-center gap-2">
                            {col.header}
                            {getSortIcon(col.sortField!)}
                          </div>
                        ) : (
                          col.header
                        )}
                      </EnhancedTableHead>
                    );
                  })}
                </TableRow>
              </EnhancedTableHeader>
              <TableBody>
                {data.map((item, index) => {
                  const key = getRowKey(item);
                  const isSelected = selection
                    ? selection.selectedIds.has(selection.getItemId(item))
                    : false;

                  if (renderRow) {
                    return (
                      <React.Fragment key={key}>
                        {renderRow(item, index, isSelected)}
                      </React.Fragment>
                    );
                  }

                  return (
                    <EnhancedTableRow
                      key={key}
                      index={index}
                      isSelected={isSelected}
                    >
                      {selection && (
                        <TableCell className="pl-4">
                          <div className="relative">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                handleSelectItem(selection.getItemId(item))
                              }
                              aria-label={`Select row ${index + 1}`}
                              className="transition-all duration-300 hover:scale-110"
                            />
                            {isSelected && (
                              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 animate-pulse text-primary" />
                            )}
                          </div>
                        </TableCell>
                      )}
                      {columns.map((col) => (
                        <TableCell
                          key={col.id}
                          className={cn(col.align === "right" && "text-right")}
                        >
                          {col.cell(item, index)}
                        </TableCell>
                      ))}
                    </EnhancedTableRow>
                  );
                })}
              </TableBody>
            </EnhancedTable>
          </div>
        </div>
      )}

      {selection && selection.selectedIds.size > 0 && (
        <EnhancedTableSelectionBar
          selectedCount={selection.selectedIds.size}
          onClearSelection={() => selection.onSelectionChange(new Set())}
          actions={selection.selectionBarContent}
        />
      )}

      {pagination && (
        <TablePagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
          labels={paginationLabels}
        />
      )}
    </div>
  );

  if (withTooltipProvider) {
    return <TooltipProvider>{content}</TooltipProvider>;
  }

  return content;
}
