import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { ViewConsolidationDialog } from "../ViewConsolidationDialog";
import { GET_CONSOLIDATE_BY_ID } from "@/graphql/queries/consolidations";
import { GraphQLError } from "graphql";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/components/ui/status-badge", () => ({
  StatusBadge: ({ status, label }: { status: string; label: string }) => (
    <span data-testid="status-badge" data-status={status}>
      {label}
    </span>
  ),
}));

const mockConsolidation = {
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
    mobilePhoneNumber: "0991234567",
  },
  packages: [
    {
      id: "pkg-1",
      barcode: "PKG001",
      description: "Package 1",
      weight: 2.5,
      weightUnit: "kg",
      courier: "DHL",
      otherCourier: null,
      length: 10,
      width: 20,
      height: 30,
      dimensionUnit: "cm",
      realPrice: 50,
      servicePrice: 10,
      arrivalDate: "2024-06-01",
    },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
};

const successMock = {
  request: {
    query: GET_CONSOLIDATE_BY_ID,
    variables: { id: "consol-1" },
  },
  result: {
    data: {
      consolidateById: mockConsolidation,
    },
  },
};

const errorMock = {
  request: {
    query: GET_CONSOLIDATE_BY_ID,
    variables: { id: "consol-1" },
  },
  result: {
    errors: [new GraphQLError("Failed to fetch consolidation")],
  },
};

describe("ViewConsolidationDialog", () => {
  it("shows spinner when query is loading", () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <ViewConsolidationDialog
          open={true}
          onOpenChange={jest.fn()}
          consolidationId="consol-1"
        />
      </MockedProvider>
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("shows destructive alert on error", async () => {
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <ViewConsolidationDialog
          open={true}
          onOpenChange={jest.fn()}
          consolidationId="consol-1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("renders general info and consolidation data when loaded", async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <ViewConsolidationDialog
          open={true}
          onOpenChange={jest.fn()}
          consolidationId="consol-1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("generalInfo")).toBeInTheDocument();
    });

    expect(screen.getByText("consol-1")).toBeInTheDocument();
    expect(screen.getByText("Test consolidation")).toBeInTheDocument();
    expect(screen.getByText("Test comment")).toBeInTheDocument();
    expect(screen.getByText("John Doe (john@example.com)")).toBeInTheDocument();
    expect(screen.getByTestId("status-badge")).toHaveAttribute(
      "data-status",
      "pending"
    );
  });

  it("renders packages table with package data", async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <ViewConsolidationDialog
          open={true}
          onOpenChange={jest.fn()}
          consolidationId="consol-1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("packagesInfo"))
      ).toBeInTheDocument();
    });

    expect(screen.getByText("PKG001")).toBeInTheDocument();
    expect(screen.getByText("Package 1")).toBeInTheDocument();
    expect(screen.getByText("2.5 kg")).toBeInTheDocument();
    expect(screen.getByText(/10.*20.*30/)).toBeInTheDocument();
  });

  it("renders empty packages state with dashed border", async () => {
    const emptyPackagesMock = {
      request: {
        query: GET_CONSOLIDATE_BY_ID,
        variables: { id: "consol-1" },
      },
      result: {
        data: {
          consolidateById: {
            ...mockConsolidation,
            packages: [],
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[emptyPackagesMock]} addTypename={false}>
        <ViewConsolidationDialog
          open={true}
          onOpenChange={jest.fn()}
          consolidationId="consol-1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("noPackages")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) when close button is clicked", async () => {
    const onOpenChange = jest.fn();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <ViewConsolidationDialog
          open={true}
          onOpenChange={onOpenChange}
          consolidationId="consol-1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("generalInfo")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText("close"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
