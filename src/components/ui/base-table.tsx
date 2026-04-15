"use client";

import * as React from "react";
import { useMemo } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowDown, ArrowUp, ArrowUpDown, Sparkles } from "lucide-react";
import { TableSkeleton } from "./table-skeleton";
import { TablePagination } from "./table-pagination";

export type {
  ColumnDef,
  SortState,
  PaginationState,
  SelectionConfig,
  EmptyStateConfig,
  PaginationLabels,
  BaseTableProps,
} from "./base-table.types";

import type { BaseTableProps } from "./base-table.types";

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
          selectedLabel={selection.selectionLabels?.selectedLabel}
          clearLabel={selection.selectionLabels?.clearLabel}
          message={selection.selectionLabels?.message}
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
