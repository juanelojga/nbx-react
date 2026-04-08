import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@/test/MockedProvider";
import { DeleteConsolidationDialog } from "@/components/admin/DeleteConsolidationDialog";
import { DELETE_CONSOLIDATE } from "@/graphql/mutations/consolidations";
import { toast } from "sonner";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockConsolidation = {
  id: "consol-1",
  description: "Test consolidation",
  client: {
    fullName: "Jane Doe",
    email: "jane@example.com",
  },
  packagesCount: 3,
};

const successMock: MockedResponse = {
  request: {
    query: DELETE_CONSOLIDATE,
    variables: { id: "consol-1" },
  },
  result: {
    data: { deleteConsolidate: { success: true } },
  },
};

const errorMock: MockedResponse = {
  request: {
    query: DELETE_CONSOLIDATE,
    variables: { id: "consol-1" },
  },
  error: new Error("Network error"),
};

describe("DeleteConsolidationDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    consolidation: mockConsolidation,
    onConsolidationDeleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when consolidation is null", () => {
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeleteConsolidationDialog {...defaultProps} consolidation={null} />
      </MockedProvider>
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders consolidation ID, client name, and packages count when open", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeleteConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText("consol-1")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("packages")).toBeInTheDocument();
    expect(screen.getByText("warningDescription")).toBeInTheDocument();
  });

  it("cancel button calls onOpenChange(false)", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeleteConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("cancel"));

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("delete triggers mutation with consolidation.id", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <DeleteConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteConsolidation"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("on mutation success: toast.success called, onConsolidationDeleted called, dialog closes", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <DeleteConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteConsolidation"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
      expect(defaultProps.onConsolidationDeleted).toHaveBeenCalled();
    });
  });

  it("on mutation error: toast.error called, dialog closes", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <DeleteConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteConsolidation"));

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
        query: DELETE_CONSOLIDATE,
        variables: { id: "consol-1" },
      },
      result: {
        data: { deleteConsolidate: { success: true } },
      },
      delay: 1000,
    };

    render(
      <MockedProvider mocks={[delayedMock]} addTypename={false}>
        <DeleteConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteConsolidation"));

    await waitFor(() => {
      expect(screen.getByText("deleting")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("cancel").closest("button");
    const deleteButton = screen.getByText("deleting").closest("button");

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
