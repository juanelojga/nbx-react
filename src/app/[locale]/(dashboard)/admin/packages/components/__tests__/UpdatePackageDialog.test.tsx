import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@/test/MockedProvider";
import { UpdatePackageDialog } from "@/app/[locale]/(dashboard)/admin/packages/components/UpdatePackageDialog";
import { GET_PACKAGE } from "@/graphql/queries/packages";
import { UPDATE_PACKAGE } from "@/graphql/mutations/packages";
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

const mockPackage = {
  id: "42",
  barcode: "PKG-12345",
  courier: "FedEx",
  otherCourier: null,
  length: 30,
  width: 20,
  height: 15,
  dimensionUnit: "cm",
  weight: 5.5,
  weightUnit: "lb",
  description: "Test package",
  purchaseLink: "https://example.com",
  purchasedByNarbox: false,
  realPrice: 100,
  servicePrice: 25,
  transportationCost: 15.13,
  serviceFee: 0,
  arrivalDate: "2024-06-15",
  comments: "Handle with care",
  client: { id: "1", fullName: "John Doe", email: "john@example.com" },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
};

const queryMock: MockedResponse = {
  request: {
    query: GET_PACKAGE,
    variables: { id: 42 },
  },
  result: {
    data: { package: mockPackage },
  },
};

const queryLoadingMock: MockedResponse = {
  request: {
    query: GET_PACKAGE,
    variables: { id: 42 },
  },
  result: {
    data: { package: mockPackage },
  },
  delay: 5000,
};

const queryErrorMock: MockedResponse = {
  request: {
    query: GET_PACKAGE,
    variables: { id: 42 },
  },
  error: new Error("Failed to fetch package"),
};

const mutationSuccessMock: MockedResponse = {
  request: {
    query: UPDATE_PACKAGE,
    variables: {
      id: "42",
      courier: "FedEx",
      dimensionUnit: "cm",
      weightUnit: "lb",
      description: "Updated description",
      purchaseLink: "https://example.com",
      comments: "Handle with care",
      length: 30,
      width: 20,
      height: 15,
      weight: 5.5,
      realPrice: 100,
      purchasedByNarbox: false,
      arrivalDate: "2024-06-15",
    },
  },
  result: {
    data: {
      updatePackage: {
        package: {
          id: "42",
          barcode: "PKG-12345",
          courier: "FedEx",
          otherCourier: null,
          length: 30,
          width: 20,
          height: 15,
          dimensionUnit: "cm",
          weight: 5.5,
          weightUnit: "lb",
          description: "Updated description",
          purchaseLink: "https://example.com",
          purchasedByNarbox: false,
          realPrice: 100,
          servicePrice: 25,
          transportationCost: 15.13,
          serviceFee: 0,
          arrivalDate: "2024-06-15",
          comments: "Handle with care",
          client: {
            id: "1",
            fullName: "John Doe",
            email: "john@example.com",
          },
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-06-01T00:00:00Z",
        },
      },
    },
  },
};

const mutationErrorMock: MockedResponse = {
  request: {
    query: UPDATE_PACKAGE,
    variables: {
      id: "42",
      courier: "FedEx",
      dimensionUnit: "cm",
      weightUnit: "lb",
      description: "Updated description",
      purchaseLink: "https://example.com",
      comments: "Handle with care",
      length: 30,
      width: 20,
      height: 15,
      weight: 5.5,
      realPrice: 100,
      purchasedByNarbox: false,
      arrivalDate: "2024-06-15",
    },
  },
  error: new Error("Update failed"),
};

describe("UpdatePackageDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    packageId: "42",
    onPackageUpdated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows spinner during query loading", () => {
    render(
      <MockedProvider mocks={[queryLoadingMock]} addTypename={false}>
        <UpdatePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("shows alert on query error", async () => {
    render(
      <MockedProvider mocks={[queryErrorMock]} addTypename={false}>
        <UpdatePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("loadError")).toBeInTheDocument();
    });
  });

  it("prefills form from queried package data", async () => {
    render(
      <MockedProvider mocks={[queryMock]} addTypename={false}>
        <UpdatePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("PKG-12345")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test package")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("FedEx")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(screen.getByDisplayValue("15")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5.5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$25.00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-06-15")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Handle with care")).toBeInTheDocument();
  });

  it("barcode field is read-only (disabled)", async () => {
    render(
      <MockedProvider mocks={[queryMock]} addTypename={false}>
        <UpdatePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("PKG-12345")).toBeInTheDocument();
    });

    const barcodeInput = screen.getByDisplayValue("PKG-12345");
    expect(barcodeInput).toBeDisabled();
  });

  it("submit calls UPDATE_PACKAGE mutation with packageId", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[queryMock, mutationSuccessMock]}
        addTypename={false}
      >
        <UpdatePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    // Wait for form to be prefilled
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test package")).toBeInTheDocument();
    });

    // Modify description field
    const descriptionInput = screen.getByDisplayValue("Test package");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");

    // Submit
    await user.click(screen.getByText("updateButton"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
    });
  });

  it("on mutation success: toast.success, onPackageUpdated called", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[queryMock, mutationSuccessMock]}
        addTypename={false}
      >
        <UpdatePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test package")).toBeInTheDocument();
    });

    const descriptionInput = screen.getByDisplayValue("Test package");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");

    await user.click(screen.getByText("updateButton"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
      expect(defaultProps.onPackageUpdated).toHaveBeenCalled();
    });
  });

  it("on mutation error: toast.error with error message", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[queryMock, mutationErrorMock]}
        addTypename={false}
      >
        <UpdatePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test package")).toBeInTheDocument();
    });

    const descriptionInput = screen.getByDisplayValue("Test package");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");

    await user.click(screen.getByText("updateButton"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("errorTitle", {
        description: "Update failed",
      });
    });
  });

  it("skips query when packageId is null", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <UpdatePackageDialog {...defaultProps} packageId={null} />
      </MockedProvider>
    );

    // No loading state, no form, no error - dialog content is essentially empty
    expect(screen.queryByText("loading")).not.toBeInTheDocument();
    expect(screen.queryByText("loadError")).not.toBeInTheDocument();
    expect(screen.queryByText("updateButton")).not.toBeInTheDocument();
  });
});
