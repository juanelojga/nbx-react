import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { PackageDetailsModal } from "../PackageDetailsModal";
import { GET_PACKAGE } from "@/graphql/queries/packages";
import { GraphQLError } from "graphql";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
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
  weightUnit: "kg",
  description: "Electronic components",
  purchaseLink: "https://example.com/product",
  purchasedByNarbox: false,
  realPrice: 150.99,
  servicePrice: 25.5,
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
};

const successMock = {
  request: {
    query: GET_PACKAGE,
    variables: { id: 42 },
  },
  result: {
    data: {
      package: mockPackage,
    },
  },
};

const errorMock = {
  request: {
    query: GET_PACKAGE,
    variables: { id: 42 },
  },
  result: {
    errors: [new GraphQLError("Failed to fetch package")],
  },
};

describe("PackageDetailsModal", () => {
  it("shows spinner when query is loading", () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <PackageDetailsModal
          open={true}
          onOpenChange={jest.fn()}
          packageId="42"
        />
      </MockedProvider>
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("shows destructive alert on error", async () => {
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <PackageDetailsModal
          open={true}
          onOpenChange={jest.fn()}
          packageId="42"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("renders identification, courier, dimensions, pricing, and additional info sections", async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <PackageDetailsModal
          open={true}
          onOpenChange={jest.fn()}
          packageId="42"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("identificationTitle")).toBeInTheDocument();
    });

    expect(screen.getByText("courierInfoTitle")).toBeInTheDocument();
    expect(screen.getByText("dimensionsWeightTitle")).toBeInTheDocument();
    expect(screen.getByText("pricingTitle")).toBeInTheDocument();
    expect(screen.getByText("additionalInfoTitle")).toBeInTheDocument();

    expect(screen.getByText("PKG-12345")).toBeInTheDocument();
    expect(screen.getByText("FedEx")).toBeInTheDocument();
    expect(screen.getByText("Electronic components")).toBeInTheDocument();
    expect(screen.getByText("Handle with care")).toBeInTheDocument();
  });

  it("renders em-dash for null values", async () => {
    const packageWithNulls = {
      ...mockPackage,
      otherCourier: null,
      client: null,
      description: null,
      purchaseLink: null,
      comments: null,
    };

    const nullMock = {
      request: {
        query: GET_PACKAGE,
        variables: { id: 42 },
      },
      result: {
        data: { package: packageWithNulls },
      },
    };

    render(
      <MockedProvider mocks={[nullMock]} addTypename={false}>
        <PackageDetailsModal
          open={true}
          onOpenChange={jest.fn()}
          packageId="42"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("identificationTitle")).toBeInTheDocument();
    });

    const emDashes = screen.getAllByText("\u2014");
    expect(emDashes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders purchase link as anchor with target='_blank'", async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <PackageDetailsModal
          open={true}
          onOpenChange={jest.fn()}
          packageId="42"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("identificationTitle")).toBeInTheDocument();
    });

    const link = screen.getByRole("link", {
      name: "https://example.com/product",
    });
    expect(link).toHaveAttribute("href", "https://example.com/product");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders client info when client is present", async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <PackageDetailsModal
          open={true}
          onOpenChange={jest.fn()}
          packageId="42"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("identificationTitle")).toBeInTheDocument();
    });

    expect(screen.getByText("John Doe (john@example.com)")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when close button is clicked", async () => {
    const onOpenChange = jest.fn();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <PackageDetailsModal
          open={true}
          onOpenChange={onOpenChange}
          packageId="42"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("identificationTitle")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText("close"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
