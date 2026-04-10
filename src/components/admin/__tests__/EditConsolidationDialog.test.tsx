import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@/test/MockedProvider";
import { EditConsolidationDialog } from "@/components/admin/EditConsolidationDialog";
import { UPDATE_CONSOLIDATE } from "@/graphql/mutations/consolidations";
import { toast } from "sonner";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
    value,
    disabled,
  }: {
    children: React.ReactNode;
    onValueChange: (value: string) => void;
    value: string;
    disabled?: boolean;
  }) => (
    <select
      data-testid="status-select"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onValueChange(e.target.value)
      }
      disabled={disabled}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <option value="">{placeholder}</option>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
}));

const mockConsolidation = {
  id: "consol-1",
  description: "Test consolidation",
  status: "pending" as const,
  deliveryDate: "2024-06-15",
  comment: "Test comment",
  extraAttributes: null,
};

const successMock: MockedResponse = {
  request: {
    query: UPDATE_CONSOLIDATE,
    variables: {
      id: "consol-1",
      description: "Test consolidation",
      status: "pending",
      deliveryDate: "2024-06-15",
      comment: "Test comment",
    },
  },
  result: {
    data: {
      updateConsolidate: {
        consolidate: {
          id: "consol-1",
          description: "Test consolidation",
          status: "pending",
          deliveryDate: "2024-06-15",
          comment: "Test comment",
          extraAttributes: null,
          client: {
            id: "1",
            fullName: "John Doe",
            email: "john@example.com",
          },
          packages: [],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-06-01T00:00:00Z",
        },
      },
    },
  },
};

const errorMock: MockedResponse = {
  request: {
    query: UPDATE_CONSOLIDATE,
    variables: {
      id: "consol-1",
      description: "Test consolidation",
      status: "pending",
      deliveryDate: "2024-06-15",
      comment: "Test comment",
    },
  },
  error: new Error("Network error"),
};

describe("EditConsolidationDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    consolidation: mockConsolidation,
    onConsolidationUpdated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when consolidation is null", () => {
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditConsolidationDialog {...defaultProps} consolidation={null} />
      </MockedProvider>
    );
    expect(container.innerHTML).toBe("");
  });

  it("prefills form from consolidation prop", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Test consolidation")
      ).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("2024-06-15")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test comment")).toBeInTheDocument();

    const statusSelect = screen.getByTestId("status-select");
    expect(statusSelect).toHaveValue("pending");
  });

  it("shows validation error when description is empty", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Test consolidation")
      ).toBeInTheDocument();
    });

    const descriptionInput = screen.getByDisplayValue("Test consolidation");
    await user.clear(descriptionInput);

    const submitButton = screen.getByRole("button", {
      name: "updateConsolidation",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("descriptionRequired")).toBeInTheDocument();
    });
  });

  it("submits mutation with correct variables", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <EditConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Test consolidation")
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: "updateConsolidation",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
    });
  });

  it("calls onConsolidationUpdated on success", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <EditConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Test consolidation")
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: "updateConsolidation",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onConsolidationUpdated).toHaveBeenCalled();
    });

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows error toast on mutation failure", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <EditConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Test consolidation")
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: "updateConsolidation",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("errorTitle", {
        description: "errorDescription",
      });
    });
  });

  it("calls onOpenChange(false) when cancel is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditConsolidationDialog {...defaultProps} />
      </MockedProvider>
    );

    const cancelButton = screen.getByRole("button", { name: "cancel" });
    await user.click(cancelButton);

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });
});
