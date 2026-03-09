import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { AddClientDialog } from "@/components/admin/AddClientDialog";
import { CREATE_CLIENT } from "@/graphql/mutations/clients";
import { toast } from "sonner";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const createSuccessResult = () => ({
  data: {
    createClient: {
      client: {
        id: "1",
        fullName: "John Doe",
        email: "john@example.com",
        identificationNumber: null,
        state: null,
        city: null,
        mainStreet: null,
        secondaryStreet: null,
        buildingNumber: null,
        mobilePhoneNumber: null,
        phoneNumber: null,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    },
  },
});

const createRequiredOnlyMock = (
  overrides?: Partial<MockedResponse>
): MockedResponse => ({
  request: {
    query: CREATE_CLIENT,
    variables: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    },
  },
  result: createSuccessResult(),
  ...overrides,
});

const createAllFieldsMock = (): MockedResponse => ({
  request: {
    query: CREATE_CLIENT,
    variables: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      identificationNumber: "1234567890",
      mobilePhoneNumber: "0991234567",
      phoneNumber: "042345678",
      state: "Guayas",
      city: "Guayaquil",
      mainStreet: "Av. Principal",
      secondaryStreet: "Calle Secundaria",
      buildingNumber: "42",
    },
  },
  result: createSuccessResult(),
});

const createErrorMock = (): MockedResponse => ({
  request: {
    query: CREATE_CLIENT,
    variables: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    },
  },
  error: new Error("Network error"),
});

function fillInput(id: string, value: string) {
  const input = document.getElementById(id) as HTMLInputElement;
  fireEvent.change(input, { target: { value } });
}

describe("AddClientDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onClientCreated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText("firstName")).toBeInTheDocument();
    expect(screen.getByText("lastName")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("identificationNumber")).toBeInTheDocument();
    expect(screen.getByText("mobilePhone")).toBeInTheDocument();
    expect(screen.getByText("phoneNumber")).toBeInTheDocument();
    expect(screen.getByText("state")).toBeInTheDocument();
    expect(screen.getByText("city")).toBeInTheDocument();
    expect(screen.getByText("mainStreet")).toBeInTheDocument();
    expect(screen.getByText("secondaryStreet")).toBeInTheDocument();
    expect(screen.getByText("buildingNumber")).toBeInTheDocument();
  });

  it("shows required indicators (*) on firstName, lastName, email", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    const requiredIndicators = screen.getAllByText("*");
    expect(requiredIndicators).toHaveLength(3);
  });

  it("shows validation error when firstName is empty on submit", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(screen.getByText("firstNameRequired")).toBeInTheDocument();
    });
  });

  it("shows validation error when lastName is empty on submit", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/firstName/), "John");
    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(screen.getByText("lastNameRequired")).toBeInTheDocument();
    });
  });

  it("shows validation error when email is empty on submit", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/firstName/), "John");
    await user.type(screen.getByLabelText(/lastName/), "Doe");
    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(screen.getByText("emailRequired")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/firstName/), "John");
    await user.type(screen.getByLabelText(/lastName/), "Doe");
    // "user@domain" passes type="email" validation but fails the regex
    await user.type(screen.getByLabelText(/email/), "user@domain");
    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(screen.getByText("emailInvalid")).toBeInTheDocument();
    });
  });

  it("clears validation error when user types in errored field", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(screen.getByText("firstNameRequired")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/firstName/), "J");

    await waitFor(() => {
      expect(screen.queryByText("firstNameRequired")).not.toBeInTheDocument();
    });
  });

  it("submits with required fields only and calls mutation with correct variables", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[createRequiredOnlyMock()]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/firstName/), "John");
    await user.type(screen.getByLabelText(/lastName/), "Doe");
    await user.type(screen.getByLabelText(/email/), "john@example.com");
    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("submits with all fields and mutation includes optional fields", async () => {
    render(
      <MockedProvider mocks={[createAllFieldsMock()]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    // Use fireEvent.change for speed with many fields
    fillInput("firstName", "John");
    fillInput("lastName", "Doe");
    fillInput("email", "john@example.com");
    fillInput("identificationNumber", "1234567890");
    fillInput("mobilePhoneNumber", "0991234567");
    fillInput("phoneNumber", "042345678");
    fillInput("state", "Guayas");
    fillInput("city", "Guayaquil");
    fillInput("mainStreet", "Av. Principal");
    fillInput("secondaryStreet", "Calle Secundaria");
    fillInput("buildingNumber", "42");

    fireEvent.submit(screen.getByText("createClient").closest("form")!);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("on success: toast.success called, onClientCreated called, dialog closes", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[createRequiredOnlyMock()]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/firstName/), "John");
    await user.type(screen.getByLabelText(/lastName/), "Doe");
    await user.type(screen.getByLabelText(/email/), "john@example.com");
    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
      expect(defaultProps.onClientCreated).toHaveBeenCalled();
    });
  });

  it("on error: toast.error called", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[createErrorMock()]} addTypename={false}>
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/firstName/), "John");
    await user.type(screen.getByLabelText(/lastName/), "Doe");
    await user.type(screen.getByLabelText(/email/), "john@example.com");
    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("errorTitle", {
        description: "errorDescription",
      });
    });
  });

  it("loading state: buttons are disabled", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[createRequiredOnlyMock({ delay: 1000 })]}
        addTypename={false}
      >
        <AddClientDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.type(screen.getByLabelText(/firstName/), "John");
    await user.type(screen.getByLabelText(/lastName/), "Doe");
    await user.type(screen.getByLabelText(/email/), "john@example.com");
    await user.click(screen.getByText("createClient"));

    await waitFor(() => {
      expect(screen.getByText("creating")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("cancel").closest("button");
    const submitButton = screen.getByText("creating").closest("button");

    expect(cancelButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
