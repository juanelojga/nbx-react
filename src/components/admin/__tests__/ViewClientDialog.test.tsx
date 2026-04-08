import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@/test/MockedProvider";
import { ViewClientDialog } from "../ViewClientDialog";
import { GET_CLIENT } from "@/graphql/queries/clients";
import { GraphQLError } from "graphql";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockClient = {
  id: "1",
  email: "john@example.com",
  identificationNumber: "1234567890",
  state: "Guayas",
  city: "Guayaquil",
  mainStreet: "Main St",
  secondaryStreet: "Second St",
  buildingNumber: "42",
  mobilePhoneNumber: "0991234567",
  phoneNumber: "042345678",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  fullName: "John Doe",
};

const successMock = {
  request: {
    query: GET_CLIENT,
    variables: { id: "1" },
  },
  result: {
    data: {
      client: mockClient,
    },
  },
};

const errorMock = {
  request: {
    query: GET_CLIENT,
    variables: { id: "1" },
  },
  result: {
    errors: [new GraphQLError("Failed to fetch client")],
  },
};

describe("ViewClientDialog", () => {
  it("shows spinner when query is loading", () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <ViewClientDialog open={true} onOpenChange={jest.fn()} clientId="1" />
      </MockedProvider>
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("shows destructive alert on error", async () => {
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <ViewClientDialog open={true} onOpenChange={jest.fn()} clientId="1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("renders personal info, contact info, and address info when data is loaded", async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <ViewClientDialog open={true} onOpenChange={jest.fn()} clientId="1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("personalInfo")).toBeInTheDocument();
    });

    expect(screen.getByText("contactInfo")).toBeInTheDocument();
    expect(screen.getByText("addressInfo")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Guayas")).toBeInTheDocument();
    expect(screen.getByText("Guayaquil")).toBeInTheDocument();
    expect(screen.getByText("Main St")).toBeInTheDocument();
    expect(screen.getByText("Second St")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("0991234567")).toBeInTheDocument();
    expect(screen.getByText("042345678")).toBeInTheDocument();
  });

  it("renders '-' for null or empty field values", async () => {
    const clientWithNulls = {
      ...mockClient,
      identificationNumber: null,
      state: null,
      city: null,
      mainStreet: null,
      secondaryStreet: null,
      buildingNumber: null,
      mobilePhoneNumber: null,
      phoneNumber: null,
    };

    const nullMock = {
      request: {
        query: GET_CLIENT,
        variables: { id: "1" },
      },
      result: {
        data: { client: clientWithNulls },
      },
    };

    render(
      <MockedProvider mocks={[nullMock]} addTypename={false}>
        <ViewClientDialog open={true} onOpenChange={jest.fn()} clientId="1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("personalInfo")).toBeInTheDocument();
    });

    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThanOrEqual(7);
  });

  it("calls onOpenChange(false) when close button is clicked", async () => {
    const onOpenChange = jest.fn();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <ViewClientDialog
          open={true}
          onOpenChange={onOpenChange}
          clientId="1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("personalInfo")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText("close"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("skips query when clientId is null", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ViewClientDialog
          open={true}
          onOpenChange={jest.fn()}
          clientId={null}
        />
      </MockedProvider>
    );

    // Component should render without errors and without data sections
    expect(screen.queryByText("personalInfo")).not.toBeInTheDocument();
  });
});
