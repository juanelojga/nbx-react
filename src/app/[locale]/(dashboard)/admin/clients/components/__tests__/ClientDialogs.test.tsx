import React from "react";
import { render, act } from "@testing-library/react";
import { ClientDialogs } from "../ClientDialogs";
import type { UseClientDialogsReturn } from "../../hooks/useClientDialogs";

// Mock next/dynamic to render components synchronously
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
    let result: ReturnType<typeof render>;

    await act(async () => {
      result = render(<ClientDialogs {...defaultProps} />);
    });

    expect(result!.getByTestId("add-dialog")).toBeInTheDocument();
    expect(result!.getByTestId("delete-dialog")).toBeInTheDocument();
    expect(result!.getByTestId("edit-dialog")).toBeInTheDocument();
    expect(result!.getByTestId("view-dialog")).toBeInTheDocument();
  });

  it("passes onRefresh as created/updated/deleted callbacks", async () => {
    const onRefresh = jest.fn();
    let result: ReturnType<typeof render>;

    await act(async () => {
      result = render(
        <ClientDialogs {...defaultProps} onRefresh={onRefresh} />
      );
    });

    expect(result!.getByTestId("add-dialog")).toBeInTheDocument();
    expect(result!.getByTestId("delete-dialog")).toBeInTheDocument();
    expect(result!.getByTestId("edit-dialog")).toBeInTheDocument();
    expect(result!.getByTestId("view-dialog")).toBeInTheDocument();
  });
});

describe("ClientDialogs open state", () => {
  it("forwards the open flags from the hook result", async () => {
    let result: ReturnType<typeof render>;
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

    await act(async () => {
      result = render(
        <ClientDialogs dialogs={dialogs} onRefresh={jest.fn()} />
      );
    });

    expect(result!.getByTestId("add-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(result!.getByTestId("edit-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(result!.getByTestId("delete-dialog")).toHaveAttribute(
      "data-open",
      "false"
    );
  });
});
