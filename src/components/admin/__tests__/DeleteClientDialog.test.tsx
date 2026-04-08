import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@/test/MockedProvider";
import { DeleteClientDialog } from "@/components/admin/DeleteClientDialog";
import { DELETE_USER } from "@/graphql/mutations/clients";
import { toast } from "sonner";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockClient = {
  id: "1",
  userId: "user-1",
  fullName: "John Doe",
  email: "john@example.com",
};

const successMock: MockedResponse = {
  request: {
    query: DELETE_USER,
    variables: { id: "user-1" },
  },
  result: {
    data: { deleteUser: { ok: true } },
  },
};

const errorMock: MockedResponse = {
  request: {
    query: DELETE_USER,
    variables: { id: "user-1" },
  },
  error: new Error("Network error"),
};

describe("DeleteClientDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    client: mockClient,
    onClientDeleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when client is null", () => {
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeleteClientDialog {...defaultProps} client={null} />
      </MockedProvider>
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders client name, email, and warning message when open", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeleteClientDialog {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("warningDescription")).toBeInTheDocument();
  });

  it("cancel button calls onOpenChange(false)", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeleteClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("cancel"));

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("delete triggers mutation with client.userId", async () => {
    const user = userEvent.setup();

    const mutationMock: MockedResponse = {
      request: {
        query: DELETE_USER,
        variables: { id: "user-1" },
      },
      result: {
        data: { deleteUser: { ok: true } },
      },
    };

    render(
      <MockedProvider mocks={[mutationMock]} addTypename={false}>
        <DeleteClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteClient"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("on mutation success: toast.success called, onClientDeleted called, dialog closes", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <DeleteClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteClient"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
      expect(defaultProps.onClientDeleted).toHaveBeenCalled();
    });
  });

  it("on mutation error: toast.error called, dialog closes", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <DeleteClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteClient"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("errorTitle", {
        description: "errorDescription",
      });
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("loading state: buttons are disabled", async () => {
    const user = userEvent.setup();

    const delayedMock: MockedResponse = {
      request: {
        query: DELETE_USER,
        variables: { id: "user-1" },
      },
      result: {
        data: { deleteUser: { ok: true } },
      },
      delay: 1000,
    };

    render(
      <MockedProvider mocks={[delayedMock]} addTypename={false}>
        <DeleteClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteClient"));

    await waitFor(() => {
      expect(screen.getByText("deleting")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("cancel").closest("button");
    const deleteButton = screen.getByText("deleting").closest("button");

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
