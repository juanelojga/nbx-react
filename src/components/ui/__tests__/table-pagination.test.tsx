import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TablePagination, TablePaginationProps } from "../table-pagination";
import { PaginationState } from "../base-table.types";

/* ============================================================================
 * Mock Data & Helpers
 * ========================================================================== */

const defaultPagination: PaginationState = {
  page: 2,
  pageSize: 10,
  totalCount: 50,
  hasNext: true,
  hasPrevious: true,
};

function renderPagination(props: Partial<TablePaginationProps> = {}) {
  return render(
    <TablePagination
      pagination={defaultPagination}
      onPageChange={jest.fn()}
      {...props}
    />
  );
}

/* ============================================================================
 * Tests
 * ========================================================================== */

describe("TablePagination", () => {
  describe("Showing Text", () => {
    it("renders default showing text format", () => {
      renderPagination();

      expect(screen.getByText("11-20 of 50")).toBeInTheDocument();
    });

    it("renders first page showing text", () => {
      renderPagination({
        pagination: { ...defaultPagination, page: 1, hasPrevious: false },
      });

      expect(screen.getByText("1-10 of 50")).toBeInTheDocument();
    });

    it("renders last page showing text with partial page", () => {
      renderPagination({
        pagination: {
          ...defaultPagination,
          page: 5,
          hasNext: false,
          totalCount: 47,
        },
      });

      expect(screen.getByText("41-47 of 47")).toBeInTheDocument();
    });

    it("renders custom showing label", () => {
      renderPagination({
        labels: {
          showing: (start, end, total) =>
            `Mostrando ${start} a ${end} de ${total}`,
        },
      });

      expect(screen.getByText("Mostrando 11 a 20 de 50")).toBeInTheDocument();
    });
  });

  describe("Previous / Next Buttons", () => {
    it("calls onPageChange with page - 1 when Previous clicked", async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();
      renderPagination({ onPageChange });

      await user.click(screen.getByLabelText("Previous page"));

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("calls onPageChange with page + 1 when Next clicked", async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();
      renderPagination({ onPageChange });

      await user.click(screen.getByLabelText("Next page"));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("disables Previous button when hasPrevious is false", () => {
      renderPagination({
        pagination: { ...defaultPagination, page: 1, hasPrevious: false },
      });

      expect(screen.getByLabelText("Previous page")).toBeDisabled();
    });

    it("disables Next button when hasNext is false", () => {
      renderPagination({
        pagination: { ...defaultPagination, page: 5, hasNext: false },
      });

      expect(screen.getByLabelText("Next page")).toBeDisabled();
    });

    it("uses custom previousPage label", () => {
      renderPagination({
        labels: { previousPage: "Anterior" },
      });

      expect(screen.getByLabelText("Anterior")).toBeInTheDocument();
    });

    it("uses custom nextPage label", () => {
      renderPagination({
        labels: { nextPage: "Siguiente" },
      });

      expect(screen.getByLabelText("Siguiente")).toBeInTheDocument();
    });
  });

  describe("Page Number Buttons", () => {
    it("renders page number buttons", () => {
      renderPagination();

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 2")).toBeInTheDocument();
    });

    it("marks current page with aria-current", () => {
      renderPagination();

      const activePage = screen.getByLabelText("Go to page 2");
      expect(activePage).toHaveAttribute("aria-current", "page");
    });

    it("does not mark non-active page with aria-current", () => {
      renderPagination();

      const inactivePage = screen.getByLabelText("Go to page 1");
      expect(inactivePage).not.toHaveAttribute("aria-current");
    });

    it("calls onPageChange with page number when clicked", async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();
      renderPagination({ onPageChange });

      await user.click(screen.getByLabelText("Go to page 3"));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("uses custom goToPage label", () => {
      renderPagination({
        labels: { goToPage: (p) => `Ir a pagina ${p}` },
      });

      expect(screen.getByLabelText("Ir a pagina 1")).toBeInTheDocument();
    });
  });

  describe("Ellipsis Logic", () => {
    it("shows all pages without ellipsis when total pages <= 7", () => {
      renderPagination({
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 70,
          hasNext: true,
          hasPrevious: false,
        },
      });

      for (let i = 1; i <= 7; i++) {
        expect(screen.getByLabelText(`Go to page ${i}`)).toBeInTheDocument();
      }
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("shows trailing ellipsis when on early pages of large set", () => {
      renderPagination({
        pagination: {
          page: 2,
          pageSize: 10,
          totalCount: 200,
          hasNext: true,
          hasPrevious: true,
        },
      });

      const ellipses = screen.getAllByText("...");
      expect(ellipses).toHaveLength(1);
      // Last page should be visible
      expect(screen.getByLabelText("Go to page 20")).toBeInTheDocument();
    });

    it("shows leading ellipsis when on late pages", () => {
      renderPagination({
        pagination: {
          page: 19,
          pageSize: 10,
          totalCount: 200,
          hasNext: true,
          hasPrevious: true,
        },
      });

      const ellipses = screen.getAllByText("...");
      expect(ellipses).toHaveLength(1);
      // First page should be visible
      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
    });

    it("shows both ellipses when in the middle of large set", () => {
      renderPagination({
        pagination: {
          page: 10,
          pageSize: 10,
          totalCount: 200,
          hasNext: true,
          hasPrevious: true,
        },
      });

      const ellipses = screen.getAllByText("...");
      expect(ellipses).toHaveLength(2);
    });
  });

  describe("Page Size Selector", () => {
    it("renders page size selector when onPageSizeChange provided", () => {
      renderPagination({ onPageSizeChange: jest.fn() });

      expect(screen.getByText("Rows per page")).toBeInTheDocument();
    });

    it("does not render page size selector when onPageSizeChange not provided", () => {
      renderPagination({ onPageSizeChange: undefined });

      expect(screen.queryByText("Rows per page")).not.toBeInTheDocument();
    });

    it("uses custom rowsPerPage label", () => {
      renderPagination({
        onPageSizeChange: jest.fn(),
        labels: { rowsPerPage: "Filas por pagina" },
      });

      expect(screen.getByText("Filas por pagina")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("does not render page buttons when totalPages is 1", () => {
      renderPagination({
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 5,
          hasNext: false,
          hasPrevious: false,
        },
      });

      expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
    });

    it("does not render navigation when onPageChange is not provided", () => {
      renderPagination({ onPageChange: undefined });

      expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
    });

    it("still shows showing text when totalCount is zero", () => {
      renderPagination({
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 0,
          hasNext: false,
          hasPrevious: false,
        },
      });

      expect(screen.getByText("1-0 of 0")).toBeInTheDocument();
    });
  });
});
