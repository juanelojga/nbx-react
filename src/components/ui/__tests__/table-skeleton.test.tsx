import React from "react";
import { render } from "@testing-library/react";
import { TableSkeleton, skeletonVariantClasses } from "../table-skeleton";
import { ColumnDef } from "../base-table.types";

/* ============================================================================
 * Mock Data & Helpers
 * ========================================================================== */

interface TestItem {
  id: string;
  name: string;
  status: string;
}

const basicColumns: ColumnDef<TestItem>[] = [
  { id: "name", header: "Name", cell: (item) => item.name },
  { id: "status", header: "Status", cell: (item) => item.status },
];

function renderSkeleton(
  props: Partial<React.ComponentProps<typeof TableSkeleton<TestItem>>> = {}
) {
  return render(
    <TableSkeleton<TestItem>
      columns={basicColumns}
      rowCount={3}
      hasSelection={false}
      {...props}
    />
  );
}

/* ============================================================================
 * Tests
 * ========================================================================== */

describe("TableSkeleton", () => {
  describe("Row Count", () => {
    it("renders the specified number of skeleton rows", () => {
      const { container } = renderSkeleton({ rowCount: 4 });

      const rows = container.querySelectorAll("tbody tr");
      expect(rows).toHaveLength(4);
    });

    it("renders zero rows when rowCount is 0", () => {
      const { container } = renderSkeleton({ rowCount: 0 });

      const rows = container.querySelectorAll("tbody tr");
      expect(rows).toHaveLength(0);
    });

    it("renders default rowCount of 3 skeleton rows", () => {
      const { container } = renderSkeleton();

      const rows = container.querySelectorAll("tbody tr");
      expect(rows).toHaveLength(3);
    });
  });

  describe("Column Headers", () => {
    it("renders column header text", () => {
      const { container } = renderSkeleton();

      expect(container.textContent).toContain("Name");
      expect(container.textContent).toContain("Status");
    });

    it("renders correct number of cells per row", () => {
      const { container } = renderSkeleton();

      const firstRow = container.querySelector("tbody tr");
      const cells = firstRow?.querySelectorAll("td");
      expect(cells).toHaveLength(2);
    });

    it("applies right alignment class to header when specified", () => {
      const columns: ColumnDef<TestItem>[] = [
        {
          id: "name",
          header: "Name",
          cell: (item) => item.name,
          align: "right",
        },
      ];
      const { container } = renderSkeleton({ columns });

      const header = container.querySelector("thead th");
      expect(header).toHaveClass("text-right");
    });

    it("applies custom headerClassName", () => {
      const columns: ColumnDef<TestItem>[] = [
        {
          id: "name",
          header: "Name",
          cell: (item) => item.name,
          headerClassName: "custom-header",
        },
      ];
      const { container } = renderSkeleton({ columns });

      const header = container.querySelector("thead th");
      expect(header).toHaveClass("custom-header");
    });
  });

  describe("Selection Column", () => {
    it("renders selection placeholder in header when hasSelection is true", () => {
      const { container } = renderSkeleton({ hasSelection: true });

      const headerRow = container.querySelector("thead tr");
      const placeholder = headerRow?.querySelector(".h-4.w-4.animate-pulse");
      expect(placeholder).toBeInTheDocument();
    });

    it("renders selection placeholder in each body row when hasSelection is true", () => {
      const { container } = renderSkeleton({
        hasSelection: true,
        rowCount: 2,
      });

      const bodyRows = container.querySelectorAll("tbody tr");
      bodyRows.forEach((row) => {
        const placeholder = row.querySelector(".h-4.w-4.animate-pulse");
        expect(placeholder).toBeInTheDocument();
      });
    });

    it("does not render selection placeholders when hasSelection is false", () => {
      const { container } = renderSkeleton({ hasSelection: false });

      const firstRow = container.querySelector("tbody tr");
      const cells = firstRow?.querySelectorAll("td");
      // Should only have columns, no extra selection cell
      expect(cells).toHaveLength(2);
    });

    it("adds extra cell when hasSelection is true", () => {
      const { container } = renderSkeleton({ hasSelection: true });

      const firstRow = container.querySelector("tbody tr");
      const cells = firstRow?.querySelectorAll("td");
      // 2 columns + 1 selection cell
      expect(cells).toHaveLength(3);
    });
  });

  describe("Skeleton Variants", () => {
    it("applies text variant classes by default", () => {
      const columns: ColumnDef<TestItem>[] = [
        { id: "name", header: "Name", cell: (item) => item.name },
      ];
      const { container } = renderSkeleton({ columns, rowCount: 1 });

      const skeleton = container.querySelector("tbody td .animate-pulse");
      expect(skeleton).toHaveClass("h-4", "rounded-md");
    });

    it("applies badge variant classes", () => {
      const columns: ColumnDef<TestItem>[] = [
        {
          id: "status",
          header: "Status",
          cell: (item) => item.status,
          skeletonVariant: "badge",
        },
      ];
      const { container } = renderSkeleton({ columns, rowCount: 1 });

      const skeleton = container.querySelector("tbody td .animate-pulse");
      expect(skeleton).toHaveClass("h-6", "rounded-full");
    });

    it("applies date variant classes", () => {
      const columns: ColumnDef<TestItem>[] = [
        {
          id: "date",
          header: "Date",
          cell: () => null,
          skeletonVariant: "date",
        },
      ];
      const { container } = renderSkeleton({ columns, rowCount: 1 });

      const skeleton = container.querySelector("tbody td .animate-pulse");
      expect(skeleton).toHaveClass("h-8", "rounded-md");
    });

    it("renders action skeleton as multiple rounded-lg divs", () => {
      const columns: ColumnDef<TestItem>[] = [
        {
          id: "actions",
          header: "Actions",
          cell: () => null,
          skeletonVariant: "actions",
          skeletonActionCount: 2,
        },
      ];
      const { container } = renderSkeleton({ columns, rowCount: 1 });

      const actionDivs = container.querySelectorAll(
        "tbody td .h-9.w-9.rounded-lg"
      );
      expect(actionDivs).toHaveLength(2);
    });

    it("defaults to 3 action buttons when skeletonActionCount not specified", () => {
      const columns: ColumnDef<TestItem>[] = [
        {
          id: "actions",
          header: "Actions",
          cell: () => null,
          skeletonVariant: "actions",
        },
      ];
      const { container } = renderSkeleton({ columns, rowCount: 1 });

      const actionDivs = container.querySelectorAll(
        "tbody td .h-9.w-9.rounded-lg"
      );
      expect(actionDivs).toHaveLength(3);
    });
  });

  describe("Skeleton Width", () => {
    it("applies custom skeletonWidth as inline style", () => {
      const columns: ColumnDef<TestItem>[] = [
        {
          id: "name",
          header: "Name",
          cell: (item) => item.name,
          skeletonWidth: "12rem",
        },
      ];
      const { container } = renderSkeleton({ columns, rowCount: 1 });

      const skeleton = container.querySelector("tbody td .animate-pulse");
      expect(skeleton).toHaveStyle({ width: "12rem" });
    });

    it("uses 8rem default width when skeletonWidth not specified", () => {
      const columns: ColumnDef<TestItem>[] = [
        { id: "name", header: "Name", cell: (item) => item.name },
      ];
      const { container } = renderSkeleton({ columns, rowCount: 1 });

      const skeleton = container.querySelector("tbody td .animate-pulse");
      expect(skeleton).toHaveStyle({ width: "8rem" });
    });
  });

  describe("Animation", () => {
    it("applies staggered animation delays to rows", () => {
      const { container } = renderSkeleton({ rowCount: 3 });

      const rows = container.querySelectorAll("tbody tr");
      expect(rows[0]).toHaveStyle({ animationDelay: "0ms" });
      expect(rows[1]).toHaveStyle({ animationDelay: "100ms" });
      expect(rows[2]).toHaveStyle({ animationDelay: "200ms" });
    });

    it("applies animation delays to action skeleton buttons", () => {
      const columns: ColumnDef<TestItem>[] = [
        {
          id: "actions",
          header: "Actions",
          cell: () => null,
          skeletonVariant: "actions",
          skeletonActionCount: 3,
        },
      ];
      const { container } = renderSkeleton({ columns, rowCount: 1 });

      const actionDivs = container.querySelectorAll(
        "tbody td .h-9.w-9.rounded-lg"
      );
      expect(actionDivs[0]).toHaveStyle({ animationDelay: "0ms" });
      expect(actionDivs[1]).toHaveStyle({ animationDelay: "50ms" });
      expect(actionDivs[2]).toHaveStyle({ animationDelay: "100ms" });
    });
  });

  describe("skeletonVariantClasses export", () => {
    it("exports correct class mappings", () => {
      expect(skeletonVariantClasses.text).toBe("h-4 rounded-md");
      expect(skeletonVariantClasses.badge).toBe("h-6 rounded-full");
      expect(skeletonVariantClasses.date).toBe("h-8 rounded-md");
      expect(skeletonVariantClasses.actions).toBe("h-9 w-9 rounded-lg");
    });
  });
});
