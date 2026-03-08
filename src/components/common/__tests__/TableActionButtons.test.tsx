import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableActionButtons } from "../TableActionButtons";
import { TableAction } from "../table-action-buttons.types";

jest.mock("../ActionButton", () => ({
  ActionButton: ({
    variant,
    action,
  }: {
    variant: string;
    action: TableAction;
  }) => (
    <button
      data-testid={`action-${variant}`}
      onClick={action.onClick}
      aria-label={action.ariaLabel}
    >
      {action.tooltip}
    </button>
  ),
}));

jest.mock("@/components/ui/table", () => ({
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td data-testid="table-cell">{children}</td>
  ),
}));

const createAction = (overrides?: Partial<TableAction>): TableAction => ({
  onClick: jest.fn(),
  ariaLabel: "Test action",
  tooltip: "Test tooltip",
  ...overrides,
});

const renderInTable = (ui: React.ReactElement) =>
  render(
    <table>
      <tbody>
        <tr>{ui}</tr>
      </tbody>
    </table>
  );

describe("TableActionButtons", () => {
  describe("Rendering", () => {
    it("renders all action buttons when all props provided", () => {
      renderInTable(
        <TableActionButtons
          onView={createAction({ tooltip: "View" })}
          onEdit={createAction({ tooltip: "Edit" })}
          onDelete={createAction({ tooltip: "Delete" })}
        />
      );

      expect(screen.getByTestId("action-view")).toBeInTheDocument();
      expect(screen.getByTestId("action-edit")).toBeInTheDocument();
      expect(screen.getByTestId("action-delete")).toBeInTheDocument();
    });

    it("renders only view button when only onView provided", () => {
      renderInTable(
        <TableActionButtons onView={createAction({ tooltip: "View" })} />
      );

      expect(screen.getByTestId("action-view")).toBeInTheDocument();
      expect(screen.queryByTestId("action-edit")).not.toBeInTheDocument();
      expect(screen.queryByTestId("action-delete")).not.toBeInTheDocument();
    });

    it("renders only edit button when only onEdit provided", () => {
      renderInTable(
        <TableActionButtons onEdit={createAction({ tooltip: "Edit" })} />
      );

      expect(screen.queryByTestId("action-view")).not.toBeInTheDocument();
      expect(screen.getByTestId("action-edit")).toBeInTheDocument();
      expect(screen.queryByTestId("action-delete")).not.toBeInTheDocument();
    });

    it("renders only delete button when only onDelete provided", () => {
      renderInTable(
        <TableActionButtons onDelete={createAction({ tooltip: "Delete" })} />
      );

      expect(screen.queryByTestId("action-view")).not.toBeInTheDocument();
      expect(screen.queryByTestId("action-edit")).not.toBeInTheDocument();
      expect(screen.getByTestId("action-delete")).toBeInTheDocument();
    });

    it("renders inside a TableCell", () => {
      renderInTable(
        <TableActionButtons onView={createAction({ tooltip: "View" })} />
      );

      expect(screen.getByTestId("table-cell")).toBeInTheDocument();
    });

    it("renders empty container when no props provided", () => {
      renderInTable(<TableActionButtons />);

      const cell = screen.getByTestId("table-cell");
      expect(cell).toBeInTheDocument();
      expect(screen.queryByTestId("action-view")).not.toBeInTheDocument();
      expect(screen.queryByTestId("action-edit")).not.toBeInTheDocument();
      expect(screen.queryByTestId("action-delete")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onView onClick when view button is clicked", async () => {
      const user = userEvent.setup();
      const handleView = jest.fn();

      renderInTable(
        <TableActionButtons
          onView={createAction({ onClick: handleView })}
          onEdit={createAction()}
          onDelete={createAction()}
        />
      );

      await user.click(screen.getByTestId("action-view"));
      expect(handleView).toHaveBeenCalledTimes(1);
    });

    it("calls onEdit onClick when edit button is clicked", async () => {
      const user = userEvent.setup();
      const handleEdit = jest.fn();

      renderInTable(
        <TableActionButtons
          onView={createAction()}
          onEdit={createAction({ onClick: handleEdit })}
          onDelete={createAction()}
        />
      );

      await user.click(screen.getByTestId("action-edit"));
      expect(handleEdit).toHaveBeenCalledTimes(1);
    });

    it("calls onDelete onClick when delete button is clicked", async () => {
      const user = userEvent.setup();
      const handleDelete = jest.fn();

      renderInTable(
        <TableActionButtons
          onView={createAction()}
          onEdit={createAction()}
          onDelete={createAction({ onClick: handleDelete })}
        />
      );

      await user.click(screen.getByTestId("action-delete"));
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });

    it("does not call other handlers when one button is clicked", async () => {
      const user = userEvent.setup();
      const handleView = jest.fn();
      const handleEdit = jest.fn();
      const handleDelete = jest.fn();

      renderInTable(
        <TableActionButtons
          onView={createAction({ onClick: handleView })}
          onEdit={createAction({ onClick: handleEdit })}
          onDelete={createAction({ onClick: handleDelete })}
        />
      );

      await user.click(screen.getByTestId("action-edit"));
      expect(handleEdit).toHaveBeenCalledTimes(1);
      expect(handleView).not.toHaveBeenCalled();
      expect(handleDelete).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("applies correct aria-labels to each button", () => {
      renderInTable(
        <TableActionButtons
          onView={createAction({ ariaLabel: "View item" })}
          onEdit={createAction({ ariaLabel: "Edit item" })}
          onDelete={createAction({ ariaLabel: "Delete item" })}
        />
      );

      expect(screen.getByLabelText("View item")).toBeInTheDocument();
      expect(screen.getByLabelText("Edit item")).toBeInTheDocument();
      expect(screen.getByLabelText("Delete item")).toBeInTheDocument();
    });

    it("buttons are keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleView = jest.fn();

      const action = createAction({ onClick: handleView });
      renderInTable(<TableActionButtons onView={action} />);

      const button = screen.getByTestId("action-view");
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleView).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration", () => {
    it("handles dynamic prop updates", () => {
      const { rerender } = renderInTable(
        <TableActionButtons onView={createAction({ tooltip: "View" })} />
      );

      expect(screen.getByTestId("action-view")).toBeInTheDocument();
      expect(screen.queryByTestId("action-edit")).not.toBeInTheDocument();

      rerender(
        <table>
          <tbody>
            <tr>
              <TableActionButtons
                onView={createAction({ tooltip: "View" })}
                onEdit={createAction({ tooltip: "Edit" })}
              />
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByTestId("action-view")).toBeInTheDocument();
      expect(screen.getByTestId("action-edit")).toBeInTheDocument();
    });

    it("handles removing actions dynamically", () => {
      const { rerender } = renderInTable(
        <TableActionButtons
          onView={createAction({ tooltip: "View" })}
          onEdit={createAction({ tooltip: "Edit" })}
        />
      );

      expect(screen.getByTestId("action-view")).toBeInTheDocument();
      expect(screen.getByTestId("action-edit")).toBeInTheDocument();

      const viewAction = createAction({ tooltip: "View" });
      rerender(
        <table>
          <tbody>
            <tr>
              <TableActionButtons onView={viewAction} />
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByTestId("action-view")).toBeInTheDocument();
      expect(screen.queryByTestId("action-edit")).not.toBeInTheDocument();
    });
  });
});
