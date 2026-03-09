import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { EditClientDialog } from "@/components/admin/EditClientDialog";
import { UPDATE_CLIENT } from "@/graphql/mutations/clients";
import { toast } from "sonner";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockClient = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  identificationNumber: "1234567890",
  mobilePhoneNumber: "0991234567",
  phoneNumber: "042345678",
  state: "Guayas",
  city: "Guayaquil",
  mainStreet: "Main St",
  secondaryStreet: "Second St",
  buildingNumber: "42",
};

describe("EditClientDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    client: mockClient,
    onClientUpdated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when client is null", () => {
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditClientDialog {...defaultProps} client={null} />
      </MockedProvider>
    );

    expect(container.innerHTML).toBe("");
  });

  it("prefills form from client prop", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/firstName/)).toHaveValue("John");
    });

    expect(screen.getByLabelText(/lastName/)).toHaveValue("Doe");
    expect(screen.getByLabelText(/identificationNumber/)).toHaveValue(
      "1234567890"
    );
    expect(screen.getByLabelText(/mobilePhone/)).toHaveValue("0991234567");
    expect(screen.getByLabelText(/phoneNumber/)).toHaveValue("042345678");
    expect(screen.getByLabelText(/^state$/)).toHaveValue("Guayas");
    expect(screen.getByLabelText(/^city$/)).toHaveValue("Guayaquil");
    expect(screen.getByLabelText(/mainStreet/)).toHaveValue("Main St");
    expect(screen.getByLabelText(/secondaryStreet/)).toHaveValue("Second St");
    expect(screen.getByLabelText(/buildingNumber/)).toHaveValue("42");
  });

  it("email field is disabled and read-only", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditClientDialog {...defaultProps} />
      </MockedProvider>
    );

    const emailInput = screen.getByLabelText(/email/);
    expect(emailInput).toBeDisabled();
    expect(emailInput).toHaveAttribute("readOnly");
    expect(emailInput).toHaveValue("john@example.com");
  });

  it("validates firstName is required when cleared", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/firstName/)).toHaveValue("John");
    });

    await user.clear(screen.getByLabelText(/firstName/));
    await user.click(screen.getByText("updateClient"));

    await waitFor(() => {
      expect(screen.getByText("firstNameRequired")).toBeInTheDocument();
    });
  });

  it("validates lastName is required when cleared", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/lastName/)).toHaveValue("Doe");
    });

    await user.clear(screen.getByLabelText(/lastName/));
    await user.click(screen.getByText("updateClient"));

    await waitFor(() => {
      expect(screen.getByText("lastNameRequired")).toBeInTheDocument();
    });
  });

  it("submit calls mutation with client.id and updated fields", async () => {
    const user = userEvent.setup();

    const mutationMock: MockedResponse = {
      request: {
        query: UPDATE_CLIENT,
        variables: {
          id: "1",
          firstName: "Jane",
          lastName: "Doe",
          identificationNumber: "1234567890",
          mobilePhoneNumber: "0991234567",
          phoneNumber: "042345678",
          state: "Guayas",
          city: "Guayaquil",
          mainStreet: "Main St",
          secondaryStreet: "Second St",
          buildingNumber: "42",
        },
      },
      result: {
        data: {
          updateClient: {
            client: {
              id: "1",
              fullName: "Jane Doe",
              email: "john@example.com",
              city: "Guayaquil",
              state: "Guayas",
              mobilePhoneNumber: "0991234567",
              phoneNumber: "042345678",
              identificationNumber: "1234567890",
              mainStreet: "Main St",
              secondaryStreet: "Second St",
              buildingNumber: "42",
              updatedAt: "2026-03-09T00:00:00Z",
            },
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[mutationMock]} addTypename={false}>
        <EditClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/firstName/)).toHaveValue("John");
    });

    await user.clear(screen.getByLabelText(/firstName/));
    await user.type(screen.getByLabelText(/firstName/), "Jane");
    await user.click(screen.getByText("updateClient"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("on success: toast.success with fullName, onClientUpdated called", async () => {
    const user = userEvent.setup();

    const successMock: MockedResponse = {
      request: {
        query: UPDATE_CLIENT,
        variables: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          identificationNumber: "1234567890",
          mobilePhoneNumber: "0991234567",
          phoneNumber: "042345678",
          state: "Guayas",
          city: "Guayaquil",
          mainStreet: "Main St",
          secondaryStreet: "Second St",
          buildingNumber: "42",
        },
      },
      result: {
        data: {
          updateClient: {
            client: {
              id: "1",
              fullName: "John Doe",
              email: "john@example.com",
              city: "Guayaquil",
              state: "Guayas",
              mobilePhoneNumber: "0991234567",
              phoneNumber: "042345678",
              identificationNumber: "1234567890",
              mainStreet: "Main St",
              secondaryStreet: "Second St",
              buildingNumber: "42",
              updatedAt: "2026-03-09T00:00:00Z",
            },
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <EditClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/firstName/)).toHaveValue("John");
    });

    await user.click(screen.getByText("updateClient"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
      expect(defaultProps.onClientUpdated).toHaveBeenCalled();
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("on error: toast.error is called", async () => {
    const user = userEvent.setup();

    const errorMock: MockedResponse = {
      request: {
        query: UPDATE_CLIENT,
        variables: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          identificationNumber: "1234567890",
          mobilePhoneNumber: "0991234567",
          phoneNumber: "042345678",
          state: "Guayas",
          city: "Guayaquil",
          mainStreet: "Main St",
          secondaryStreet: "Second St",
          buildingNumber: "42",
        },
      },
      error: new Error("Network error"),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <EditClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/firstName/)).toHaveValue("John");
    });

    await user.click(screen.getByText("updateClient"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("errorTitle", {
        description: "errorDescription",
      });
    });
  });
});
