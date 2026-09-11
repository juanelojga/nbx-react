import { render, screen } from "@testing-library/react";
import React from "react";

import type { UseClientDialogsReturn } from "../../hooks/useClientDialogs";
import { ClientDialogs } from "../ClientDialogs";

// Mock next/dynamic to render components synchronously
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

jest.mock("@/components/admin/AddClientDialog", () => ({
  AddClientDialog: (props: { open: boolean; onClientCreated: () => void }) => (
    <div data-testid="add-dialog" data-open={props.open} />
  ),
}));

jest.mock("@/components/admin/DeleteClientDialog", () => ({
  DeleteClientDialog: (props: {
    open: boolean;
    onClientDeleted: () => void;
  }) => <div data-testid="delete-dialog" data-open={props.open} />,
}));

jest.mock("@/components/admin/EditClientDialog", () => ({
  EditClientDialog: (props: { open: boolean; onClientUpdated: () => void }) => (
    <div data-testid="edit-dialog" data-open={props.open} />
  ),
}));

jest.mock("@/components/admin/ViewClientDialog", () => ({
  ViewClientDialog: (props: { open: boolean }) => (
    <div data-testid="view-dialog" data-open={props.open} />
  ),
}));

describe("ClientDialogs", () => {
  const dialogs: UseClientDialogsReturn = {
    isAddDialogOpen: false,
    setIsAddDialogOpen: jest.fn(),
    isDeleteDialogOpen: false,
    setIsDeleteDialogOpen: jest.fn(),
    isEditDialogOpen: false,
    setIsEditDialogOpen: jest.fn(),
    isViewDialogOpen: false,
    setIsViewDialogOpen: jest.fn(),
    clientToDelete: null,
    clientToEdit: null,
    clientIdToView: null,
    handleViewClient: jest.fn(),
    handleEditClient: jest.fn(),
    handleDeleteClient: jest.fn(),
  };
  const defaultProps = { dialogs, onRefresh: jest.fn() };

  it("renders all 4 dialogs", async () => {
    render(<ClientDialogs {...defaultProps} />);
    expect(await screen.findByTestId("view-dialog")).toBeInTheDocument();

    expect(screen.getByTestId("add-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("edit-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("view-dialog")).toBeInTheDocument();
  });

  it("passes onRefresh as created/updated/deleted callbacks", async () => {
    const onRefresh = jest.fn();
    render(<ClientDialogs {...defaultProps} onRefresh={onRefresh} />);
    expect(await screen.findByTestId("view-dialog")).toBeInTheDocument();

    expect(screen.getByTestId("add-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("edit-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("view-dialog")).toBeInTheDocument();
  });
});

describe("ClientDialogs open state", () => {
  it("forwards the open flags from the hook result", async () => {
    const dialogs: UseClientDialogsReturn = {
      isAddDialogOpen: true,
      setIsAddDialogOpen: jest.fn(),
      isDeleteDialogOpen: false,
      setIsDeleteDialogOpen: jest.fn(),
      isEditDialogOpen: true,
      setIsEditDialogOpen: jest.fn(),
      isViewDialogOpen: false,
      setIsViewDialogOpen: jest.fn(),
      clientToDelete: null,
      clientToEdit: null,
      clientIdToView: null,
      handleViewClient: jest.fn(),
      handleEditClient: jest.fn(),
      handleDeleteClient: jest.fn(),
    };

    render(<ClientDialogs dialogs={dialogs} onRefresh={jest.fn()} />);
    expect(await screen.findByTestId("view-dialog")).toBeInTheDocument();

    expect(screen.getByTestId("add-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(screen.getByTestId("edit-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(screen.getByTestId("delete-dialog")).toHaveAttribute(
      "data-open",
      "false"
    );
  });
});
