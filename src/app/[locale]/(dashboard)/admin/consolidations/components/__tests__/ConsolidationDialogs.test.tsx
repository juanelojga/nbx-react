import { render, screen } from "@testing-library/react";
import React from "react";

import type { UseConsolidationDialogsReturn } from "../../hooks/useConsolidationDialogs";
import { ConsolidationDialogs } from "../ConsolidationDialogs";

jest.mock("next/dynamic", () => {
  return (loader: () => Promise<{ default: React.ComponentType }>) => {
    let Component: React.ComponentType | null = null;
    void loader().then((mod) => {
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
  const dialogs: UseConsolidationDialogsReturn = {
    isViewDialogOpen: false,
    setIsViewDialogOpen: jest.fn(),
    isEditDialogOpen: false,
    setIsEditDialogOpen: jest.fn(),
    isDeleteDialogOpen: false,
    setIsDeleteDialogOpen: jest.fn(),
    consolidationIdToView: null,
    consolidationToEdit: null,
    consolidationToDelete: null,
    handleViewConsolidation: jest.fn(),
    handleEditConsolidation: jest.fn(),
    handleDeleteConsolidation: jest.fn(),
  };
  const defaultProps = { dialogs, onRefresh: jest.fn() };

  it("renders all 3 dialogs", async () => {
    render(<ConsolidationDialogs {...defaultProps} />);
    expect(await screen.findByTestId("view-dialog")).toBeInTheDocument();

    expect(screen.getByTestId("view-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("edit-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
  });

  it("passes open state to dialogs", async () => {
    render(
      <ConsolidationDialogs
        {...defaultProps}
        dialogs={{
          ...dialogs,
          isViewDialogOpen: true,
          isEditDialogOpen: true,
          isDeleteDialogOpen: true,
        }}
      />
    );
    expect(await screen.findByTestId("view-dialog")).toBeInTheDocument();

    expect(screen.getByTestId("view-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(screen.getByTestId("edit-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(screen.getByTestId("delete-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
  });
});
