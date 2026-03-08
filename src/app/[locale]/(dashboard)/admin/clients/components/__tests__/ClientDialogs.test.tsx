import React from "react";
import { render, act } from "@testing-library/react";
import { ClientDialogs } from "../ClientDialogs";

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
  const defaultProps = {
    isAddDialogOpen: false,
    onAddDialogOpenChange: jest.fn(),
    isDeleteDialogOpen: false,
    onDeleteDialogOpenChange: jest.fn(),
    isEditDialogOpen: false,
    onEditDialogOpenChange: jest.fn(),
    isViewDialogOpen: false,
    onViewDialogOpenChange: jest.fn(),
    clientToDelete: null,
    clientToEdit: null,
    clientIdToView: null,
    onRefresh: jest.fn(),
  };

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
