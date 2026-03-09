import React from "react";
import { render, act } from "@testing-library/react";
import { ConsolidationDialogs } from "../ConsolidationDialogs";

jest.mock("next/dynamic", () => {
  return (loader: () => Promise<{ default: React.ComponentType }>) => {
    let Component: React.ComponentType | null = null;
    loader().then((mod) => {
      Component = mod.default;
    });
    return function DynamicComponent(props: Record<string, unknown>) {
      if (Component) return <Component {...props} />;
      return null;
    };
  };
});

jest.mock("@/components/admin/ViewConsolidationDialog", () => ({
  ViewConsolidationDialog: (props: { open: boolean }) => (
    <div data-testid="view-dialog" data-open={props.open} />
  ),
}));

jest.mock("@/components/admin/EditConsolidationDialog", () => ({
  EditConsolidationDialog: (props: {
    open: boolean;
    onConsolidationUpdated: () => void;
  }) => <div data-testid="edit-dialog" data-open={props.open} />,
}));

jest.mock("@/components/admin/DeleteConsolidationDialog", () => ({
  DeleteConsolidationDialog: (props: {
    open: boolean;
    onConsolidationDeleted: () => void;
  }) => <div data-testid="delete-dialog" data-open={props.open} />,
}));

describe("ConsolidationDialogs", () => {
  const defaultProps = {
    isViewDialogOpen: false,
    onViewDialogOpenChange: jest.fn(),
    isEditDialogOpen: false,
    onEditDialogOpenChange: jest.fn(),
    isDeleteDialogOpen: false,
    onDeleteDialogOpenChange: jest.fn(),
    consolidationIdToView: null,
    consolidationToEdit: null,
    consolidationToDelete: null,
    onRefresh: jest.fn(),
  };

  it("renders all 3 dialogs", async () => {
    let result: ReturnType<typeof render>;

    await act(async () => {
      result = render(<ConsolidationDialogs {...defaultProps} />);
    });

    expect(result!.getByTestId("view-dialog")).toBeInTheDocument();
    expect(result!.getByTestId("edit-dialog")).toBeInTheDocument();
    expect(result!.getByTestId("delete-dialog")).toBeInTheDocument();
  });

  it("passes open state to dialogs", async () => {
    let result: ReturnType<typeof render>;

    await act(async () => {
      result = render(
        <ConsolidationDialogs
          {...defaultProps}
          isViewDialogOpen={true}
          isEditDialogOpen={true}
          isDeleteDialogOpen={true}
        />
      );
    });

    expect(result!.getByTestId("view-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(result!.getByTestId("edit-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(result!.getByTestId("delete-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
  });
});
