import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Package } from "lucide-react";
import {
  BaseTable,
  ColumnDef,
  PaginationState,
  SelectionConfig,
} from "../base-table";

/* ============================================================================
 * Mock Data & Helpers
 * ========================================================================== */

interface TestItem {
  id: string;
  name: string;
  email: string;
  status: string;
}

const mockData: TestItem[] = [
  { id: "1", name: "Alice", email: "alice@test.com", status: "active" },
  { id: "2", name: "Bob", email: "bob@test.com", status: "inactive" },
  { id: "3", name: "Charlie", email: "charlie@test.com", status: "pending" },
];

const mockColumns: ColumnDef<TestItem>[] = [
  {
    id: "name",
    header: "Name",
    cell: (item) => item.name,
  },
  {
    id: "email",
    header: "Email",
    cell: (item) => item.email,
    align: "left",
  },
  {
    id: "status",
    header: "Status",
    cell: (item) => item.status,
    align: "right",
  },
];

const sortableColumns: ColumnDef<TestItem>[] = mockColumns.map((col) => ({
  ...col,
  sortable: true,
  sortField: col.id,
}));

const skeletonColumns: ColumnDef<TestItem>[] = [
  {
    id: "name",
    header: "Name",
    cell: (item) => item.name,
    skeletonVariant: "text",
    skeletonWidth: "10rem",
  },
  {
    id: "status",
    header: "Status",
    cell: (item) => item.status,
    skeletonVariant: "badge",
    skeletonWidth: "6rem",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => null,
    skeletonVariant: "actions",
    skeletonActionCount: 2,
  },
];

function renderTable(
  props: Partial<React.ComponentProps<typeof BaseTable<TestItem>>> = {}
) {
  return render(
    <BaseTable<TestItem>
      columns={mockColumns}
      data={mockData}
      getRowKey={(item) => item.id}
      {...props}
    />
  );
}

/* ============================================================================
 * Tests
 * ========================================================================== */

describe("BaseTable", () => {
  describe("Basic Rendering", () => {
    it("renders data rows with item text visible", () => {
      renderTable();

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
      expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    });

    it("renders column headers", () => {
      renderTable();

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("applies alignment classes on right-aligned columns", () => {
      renderTable();

      const statusHeader = screen.getByText("Status").closest("th");
      expect(statusHeader).toHaveClass("text-right");
    });

    it("renders custom className", () => {
      const { container } = renderTable({ className: "my-custom-class" });

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("my-custom-class");
    });

    it("renders toolbar slot", () => {
      renderTable({
        toolbar: <div data-testid="toolbar">Toolbar Content</div>,
      });

      expect(screen.getByTestId("toolbar")).toBeInTheDocument();
      expect(screen.getByText("Toolbar Content")).toBeInTheDocument();
    });

    it("renders with TooltipProvider by default", () => {
      const { container } = renderTable();
      // Component renders content - just verify it doesn't crash
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders without TooltipProvider when disabled", () => {
      const { container } = renderTable({ withTooltipProvider: false });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows skeleton rows when isLoading is true and hides data", () => {
      renderTable({ isLoading: true });

      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      // Headers should still be visible
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("renders 5 skeleton rows by default", () => {
      const { container } = renderTable({ isLoading: true });

      const skeletonRows = container.querySelectorAll("tbody tr");
      expect(skeletonRows).toHaveLength(5);
    });

    it("respects custom skeletonRowCount", () => {
      const { container } = renderTable({
        isLoading: true,
        skeletonRowCount: 3,
      });

      const skeletonRows = container.querySelectorAll("tbody tr");
      expect(skeletonRows).toHaveLength(3);
    });

    it("renders skeleton checkbox placeholder when selection configured", () => {
      const { container } = renderTable({
        isLoading: true,
        selection: {
          selectedIds: new Set(),
          onSelectionChange: jest.fn(),
          getItemId: (item) => item.id,
        },
      });

      // The header should have a skeleton checkbox placeholder
      const headerRow = container.querySelector("thead tr");
      const checkboxPlaceholder = headerRow?.querySelector(
        ".h-4.w-4.animate-pulse"
      );
      expect(checkboxPlaceholder).toBeInTheDocument();
    });

    it("column headers are visible during loading", () => {
      renderTable({ isLoading: true });

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("renders correct skeleton variant classes for badge", () => {
      const { container } = renderTable({
        isLoading: true,
        columns: skeletonColumns,
      });

      const skeletonElements = container.querySelectorAll(
        "tbody tr:first-child td"
      );
      // Second column (status) has badge variant -> rounded-full
      const badgeSkeleton = skeletonElements[1]?.querySelector(".rounded-full");
      expect(badgeSkeleton).toBeInTheDocument();
    });

    it("renders multiple divs for actions skeleton variant", () => {
      const { container } = renderTable({
        isLoading: true,
        columns: skeletonColumns,
      });

      const skeletonRows = container.querySelectorAll("tbody tr");
      const firstRow = skeletonRows[0];
      const actionCell = firstRow?.querySelectorAll("td")[2];
      const actionDivs = actionCell?.querySelectorAll(".h-9.w-9.rounded-lg");
      expect(actionDivs).toHaveLength(2); // skeletonActionCount: 2
    });

    it("applies custom skeletonWidth as inline style", () => {
      const { container } = renderTable({
        isLoading: true,
        columns: skeletonColumns,
      });

      const firstRow = container.querySelector("tbody tr");
      const nameCell = firstRow?.querySelectorAll("td")[0];
      const skeleton = nameCell?.querySelector(".animate-pulse");
      expect(skeleton).toHaveStyle({ width: "10rem" });
    });
  });

  describe("Empty State", () => {
    it("renders empty state title and description when data is empty", () => {
      renderTable({
        data: [],
        emptyState: {
          icon: Package,
          title: "No items found",
          description: "There are no items to display.",
        },
      });

      expect(screen.getByText("No items found")).toBeInTheDocument();
      expect(
        screen.getByText("There are no items to display.")
      ).toBeInTheDocument();
    });

    it("renders optional action in empty state", () => {
      renderTable({
        data: [],
        emptyState: {
          icon: Package,
          title: "No items",
          description: "Nothing here.",
          action: <button>Add Item</button>,
        },
      });

      expect(screen.getByText("Add Item")).toBeInTheDocument();
    });

    it("does not render empty state when data exists", () => {
      renderTable({
        emptyState: {
          icon: Package,
          title: "No items found",
          description: "There are no items to display.",
        },
      });

      expect(screen.queryByText("No items found")).not.toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("does not render empty state when config not provided", () => {
      renderTable({ data: [] });

      // Should render table with headers but no empty state
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.queryByText("No items found")).not.toBeInTheDocument();
    });
  });

  describe("Row Selection", () => {
    const createSelection = (
      selectedIds: Set<string> = new Set(),
      onSelectionChange = jest.fn()
    ): SelectionConfig<TestItem> => ({
      selectedIds,
      onSelectionChange,
      getItemId: (item) => item.id,
    });

    it("renders checkboxes with correct aria-labels", () => {
      renderTable({ selection: createSelection() });

      expect(screen.getByLabelText("Select all")).toBeInTheDocument();
      expect(screen.getByLabelText("Select row 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Select row 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Select row 3")).toBeInTheDocument();
    });

    it("does not render checkboxes without selection config", () => {
      renderTable();

      expect(screen.queryByLabelText("Select all")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Select row 1")).not.toBeInTheDocument();
    });

    it("calls onSelectionChange with correct Set when selecting an item", async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();
      renderTable({ selection: createSelection(new Set(), onSelectionChange) });

      await user.click(screen.getByLabelText("Select row 1"));

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      const calledWith = onSelectionChange.mock.calls[0][0];
      expect(calledWith).toBeInstanceOf(Set);
      expect(calledWith.has("1")).toBe(true);
      expect(calledWith.size).toBe(1);
    });

    it("calls onSelectionChange to deselect an item", async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();
      renderTable({
        selection: createSelection(new Set(["1"]), onSelectionChange),
      });

      await user.click(screen.getByLabelText("Select row 1"));

      const calledWith = onSelectionChange.mock.calls[0][0];
      expect(calledWith.has("1")).toBe(false);
      expect(calledWith.size).toBe(0);
    });

    it("select all toggles all ids", async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();
      renderTable({ selection: createSelection(new Set(), onSelectionChange) });

      await user.click(screen.getByLabelText("Select all"));

      const calledWith = onSelectionChange.mock.calls[0][0];
      expect(calledWith.size).toBe(3);
      expect(calledWith.has("1")).toBe(true);
      expect(calledWith.has("2")).toBe(true);
      expect(calledWith.has("3")).toBe(true);
    });

    it("deselects all when all are selected", async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();
      renderTable({
        selection: createSelection(new Set(["1", "2", "3"]), onSelectionChange),
      });

      await user.click(screen.getByLabelText("Select all"));

      const calledWith = onSelectionChange.mock.calls[0][0];
      expect(calledWith.size).toBe(0);
    });

    it("shows selection bar with count when items selected", () => {
      renderTable({
        selection: createSelection(new Set(["1", "2"])),
      });

      expect(screen.getByText("2 items selected")).toBeInTheDocument();
    });

    it("hides selection bar when none selected", () => {
      renderTable({ selection: createSelection(new Set()) });

      expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
    });

    it("Clear Selection button calls onSelectionChange with empty Set", async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();
      renderTable({
        selection: createSelection(new Set(["1"]), onSelectionChange),
      });

      await user.click(screen.getByText("Clear Selection"));

      const calledWith = onSelectionChange.mock.calls[0][0];
      expect(calledWith).toBeInstanceOf(Set);
      expect(calledWith.size).toBe(0);
    });

    it("renders custom selectionBarContent in selection bar", () => {
      renderTable({
        selection: {
          selectedIds: new Set(["1"]),
          onSelectionChange: jest.fn(),
          getItemId: (item) => item.id,
          selectionBarContent: (
            <button data-testid="bulk-action">Bulk Delete</button>
          ),
        },
      });

      expect(screen.getByTestId("bulk-action")).toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("sortable headers are clickable and call onSortChange", async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      renderTable({
        columns: sortableColumns,
        sort: { field: "name", order: "asc" },
        onSortChange,
      });

      await user.click(screen.getByText("Email"));

      expect(onSortChange).toHaveBeenCalledWith("email");
    });

    it("non-sortable headers do not call onSortChange", async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      renderTable({
        columns: mockColumns, // not sortable
        sort: { field: "name", order: "asc" },
        onSortChange,
      });

      await user.click(screen.getByText("Name"));

      expect(onSortChange).not.toHaveBeenCalled();
    });

    it("renders aria-sort ascending on active sort column", () => {
      renderTable({
        columns: sortableColumns,
        sort: { field: "name", order: "asc" },
        onSortChange: jest.fn(),
      });

      const nameHeader = screen.getByText("Name").closest("th");
      expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    });

    it("renders aria-sort descending on active sort column", () => {
      renderTable({
        columns: sortableColumns,
        sort: { field: "name", order: "desc" },
        onSortChange: jest.fn(),
      });

      const nameHeader = screen.getByText("Name").closest("th");
      expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    });

    it("renders aria-sort none on non-active sortable columns", () => {
      renderTable({
        columns: sortableColumns,
        sort: { field: "name", order: "asc" },
        onSortChange: jest.fn(),
      });

      const emailHeader = screen.getByText("Email").closest("th");
      expect(emailHeader).toHaveAttribute("aria-sort", "none");
    });

    it("does not render aria-sort on non-sortable columns", () => {
      renderTable({
        columns: mockColumns,
        sort: { field: "name", order: "asc" },
        onSortChange: jest.fn(),
      });

      const nameHeader = screen.getByText("Name").closest("th");
      expect(nameHeader).not.toHaveAttribute("aria-sort");
    });

    it("sortable header has cursor-pointer class", () => {
      renderTable({
        columns: sortableColumns,
        sort: { field: "name", order: "asc" },
        onSortChange: jest.fn(),
      });

      const nameHeader = screen.getByText("Name").closest("th");
      expect(nameHeader).toHaveClass("cursor-pointer");
    });
  });

  describe("Pagination", () => {
    const defaultPagination: PaginationState = {
      page: 2,
      pageSize: 10,
      totalCount: 50,
      hasNext: true,
      hasPrevious: true,
    };

    it("renders showing text correctly", () => {
      renderTable({
        pagination: defaultPagination,
        onPageChange: jest.fn(),
      });

      expect(screen.getByText("11-20 of 50")).toBeInTheDocument();
    });

    it("uses custom paginationLabels.showing function", () => {
      renderTable({
        pagination: defaultPagination,
        onPageChange: jest.fn(),
        paginationLabels: {
          showing: (start, end, total) =>
            `Showing ${start} to ${end} of ${total} results`,
        },
      });

      expect(
        screen.getByText("Showing 11 to 20 of 50 results")
      ).toBeInTheDocument();
    });

    it("renders page buttons with correct aria-labels", () => {
      renderTable({
        pagination: defaultPagination,
        onPageChange: jest.fn(),
      });

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 2")).toBeInTheDocument();
    });

    it("active page has aria-current page", () => {
      renderTable({
        pagination: defaultPagination,
        onPageChange: jest.fn(),
      });

      const activePage = screen.getByLabelText("Go to page 2");
      expect(activePage).toHaveAttribute("aria-current", "page");
    });

    it("non-active page does not have aria-current", () => {
      renderTable({
        pagination: defaultPagination,
        onPageChange: jest.fn(),
      });

      const inactivePage = screen.getByLabelText("Go to page 1");
      expect(inactivePage).not.toHaveAttribute("aria-current");
    });

    it("Previous button calls onPageChange with page - 1", async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();

      renderTable({
        pagination: defaultPagination,
        onPageChange,
      });

      await user.click(screen.getByLabelText("Previous page"));

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("Next button calls onPageChange with page + 1", async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();

      renderTable({
        pagination: defaultPagination,
        onPageChange,
      });

      await user.click(screen.getByLabelText("Next page"));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("Previous button is disabled when hasPrevious is false", () => {
      renderTable({
        pagination: { ...defaultPagination, page: 1, hasPrevious: false },
        onPageChange: jest.fn(),
      });

      expect(screen.getByLabelText("Previous page")).toBeDisabled();
    });

    it("Next button is disabled when hasNext is false", () => {
      renderTable({
        pagination: { ...defaultPagination, page: 5, hasNext: false },
        onPageChange: jest.fn(),
      });

      expect(screen.getByLabelText("Next page")).toBeDisabled();
    });

    it("renders page size selector when onPageSizeChange provided", () => {
      renderTable({
        pagination: defaultPagination,
        onPageChange: jest.fn(),
        onPageSizeChange: jest.fn(),
      });

      expect(screen.getByText("Rows per page")).toBeInTheDocument();
    });

    it("does not render page buttons when totalPages is 1", () => {
      renderTable({
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 5,
          hasNext: false,
          hasPrevious: false,
        },
        onPageChange: jest.fn(),
      });

      expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
    });

    it("renders ellipsis for large page counts", () => {
      renderTable({
        pagination: {
          page: 5,
          pageSize: 10,
          totalCount: 200,
          hasNext: true,
          hasPrevious: true,
        },
        onPageChange: jest.fn(),
      });

      const ellipses = screen.getAllByText("...");
      expect(ellipses.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Custom Row Rendering", () => {
    it("renderRow output replaces default cell rendering", () => {
      renderTable({
        renderRow: (item) => (
          <tr key={item.id}>
            <td data-testid={`custom-row-${item.id}`}>{item.name} Custom</td>
          </tr>
        ),
      });

      expect(screen.getByText("Alice Custom")).toBeInTheDocument();
      expect(screen.getByTestId("custom-row-1")).toBeInTheDocument();
    });

    it("renderRow receives correct arguments", () => {
      const renderRow = jest.fn(
        (item: TestItem, index: number, isSelected: boolean) => (
          <tr key={item.id}>
            <td>
              {item.name}-{index}-{String(isSelected)}
            </td>
          </tr>
        )
      );

      renderTable({
        renderRow,
        selection: {
          selectedIds: new Set(["2"]),
          onSelectionChange: jest.fn(),
          getItemId: (item) => item.id,
        },
      });

      expect(renderRow).toHaveBeenCalledTimes(3);
      expect(renderRow).toHaveBeenCalledWith(mockData[0], 0, false);
      expect(renderRow).toHaveBeenCalledWith(mockData[1], 1, true);
      expect(renderRow).toHaveBeenCalledWith(mockData[2], 2, false);
    });
  });

  describe("Edge Cases", () => {
    it("renders headers only with empty data and no emptyState config", () => {
      renderTable({ data: [] });

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("single item renders correctly", () => {
      renderTable({ data: [mockData[0]] });

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });

    it("unmounts cleanly", () => {
      const { unmount } = renderTable();

      expect(screen.getByText("Alice")).toBeInTheDocument();

      unmount();

      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("renders full table with all features enabled", async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();
      const onSortChange = jest.fn();
      const onPageChange = jest.fn();

      renderTable({
        columns: sortableColumns,
        selection: {
          selectedIds: new Set(["1"]),
          onSelectionChange,
          getItemId: (item) => item.id,
        },
        sort: { field: "name", order: "asc" },
        onSortChange,
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 30,
          hasNext: true,
          hasPrevious: false,
        },
        onPageChange,
        toolbar: <div data-testid="toolbar">Filter Bar</div>,
      });

      // Toolbar
      expect(screen.getByTestId("toolbar")).toBeInTheDocument();

      // Data
      expect(screen.getByText("Alice")).toBeInTheDocument();

      // Selection
      expect(screen.getByLabelText("Select all")).toBeInTheDocument();
      expect(screen.getByText("1 item selected")).toBeInTheDocument();

      // Sorting
      const nameHeader = screen.getByText("Name").closest("th");
      expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

      // Pagination
      expect(screen.getByText("1-10 of 30")).toBeInTheDocument();
      expect(screen.getByLabelText("Previous page")).toBeDisabled();

      // Interactions
      await user.click(screen.getByText("Email"));
      expect(onSortChange).toHaveBeenCalledWith("email");

      await user.click(screen.getByLabelText("Next page"));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("transitions from loading to loaded state", () => {
      const { rerender } = render(
        <BaseTable<TestItem>
          columns={mockColumns}
          data={[]}
          getRowKey={(item) => item.id}
          isLoading={true}
        />
      );

      expect(screen.queryByText("Alice")).not.toBeInTheDocument();

      rerender(
        <BaseTable<TestItem>
          columns={mockColumns}
          data={mockData}
          getRowKey={(item) => item.id}
          isLoading={false}
        />
      );

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });
  });
});
