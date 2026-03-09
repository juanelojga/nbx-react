import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { AddPackageDialog } from "@/app/[locale]/(dashboard)/admin/packages/components/AddPackageDialog";
import { CREATE_PACKAGE } from "@/graphql/mutations/packages";
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
      data-testid="mock-select"
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

const successMock: MockedResponse = {
  request: {
    query: CREATE_PACKAGE,
    variables: {
      barcode: "ABC123",
      courier: "FedEx",
      clientId: "client-1",
      dimensionUnit: "cm",
      weightUnit: "kg",
    },
  },
  result: {
    data: {
      createPackage: {
        package: {
          id: "1",
          barcode: "ABC123",
          description: null,
          createdAt: "2024-01-01",
        },
      },
    },
  },
};

const errorMock: MockedResponse = {
  request: {
    query: CREATE_PACKAGE,
    variables: {
      barcode: "ABC123",
      courier: "FedEx",
      clientId: "client-1",
      dimensionUnit: "cm",
      weightUnit: "kg",
    },
  },
  error: new Error("Network error"),
};

describe("AddPackageDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    clientId: "client-1",
    onPackageCreated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with required field indicators for barcode and courier", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddPackageDialog {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/barcodeLabel/)).toBeInTheDocument();
    expect(screen.getByLabelText(/courierLabel/)).toBeInTheDocument();

    const requiredMarkers = screen.getAllByText("*");
    expect(requiredMarkers.length).toBeGreaterThanOrEqual(2);
  });

  it("shows validation error when barcode is empty on submit", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddPackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("createButton"));

    await waitFor(() => {
      expect(screen.getByText("barcodeRequired")).toBeInTheDocument();
    });
  });

  it("shows validation error when barcode is under 3 characters", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddPackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/barcodeLabel/), "AB");
    await user.click(screen.getByText("createButton"));

    await waitFor(() => {
      expect(screen.getByText("barcodeMinLength")).toBeInTheDocument();
    });
  });

  it("shows validation error when courier is empty on submit", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddPackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/barcodeLabel/), "ABC123");
    await user.click(screen.getByText("createButton"));

    await waitFor(() => {
      expect(screen.getByText("courierRequired")).toBeInTheDocument();
    });
  });

  it("submits with required fields only and calls mutation with correct variables", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <AddPackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/barcodeLabel/), "ABC123");
    await user.type(screen.getByLabelText(/courierLabel/), "FedEx");
    await user.click(screen.getByText("createButton"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("on success: toast.success called, onPackageCreated called, form resets", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <AddPackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/barcodeLabel/), "ABC123");
    await user.type(screen.getByLabelText(/courierLabel/), "FedEx");
    await user.click(screen.getByText("createButton"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
      expect(defaultProps.onPackageCreated).toHaveBeenCalled();
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("on error: toast.error called with error message", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <AddPackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/barcodeLabel/), "ABC123");
    await user.type(screen.getByLabelText(/courierLabel/), "FedEx");
    await user.click(screen.getByText("createButton"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("errorTitle", {
        description: "Network error",
      });
    });
  });

  it("cancel resets form and closes dialog", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddPackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/barcodeLabel/), "ABC123");
    await user.click(screen.getByText("cancel"));

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);

    const barcodeInput = screen.getByLabelText(
      /barcodeLabel/
    ) as HTMLInputElement;
    expect(barcodeInput.value).toBe("");
  });
});
