import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider, MockedResponse } from "@/test/MockedProvider";
import { DeletePackageDialog } from "@/app/[locale]/(dashboard)/admin/packages/components/DeletePackageDialog";
import { DELETE_PACKAGE } from "@/graphql/mutations/packages";
import { toast } from "sonner";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockPackage = {
  id: "pkg-1",
  barcode: "ABC123",
};

const successMock: MockedResponse = {
  request: {
    query: DELETE_PACKAGE,
    variables: { id: "pkg-1" },
  },
  result: {
    data: { deletePackage: { success: true } },
  },
};

const successFalseMock: MockedResponse = {
  request: {
    query: DELETE_PACKAGE,
    variables: { id: "pkg-1" },
  },
  result: {
    data: { deletePackage: { success: false } },
  },
};

const errorMock: MockedResponse = {
  request: {
    query: DELETE_PACKAGE,
    variables: { id: "pkg-1" },
  },
  error: new Error("Network error"),
};

describe("DeletePackageDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    package_: mockPackage,
    onPackageDeleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when package_ is null", () => {
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeletePackageDialog {...defaultProps} package_={null} />
      </MockedProvider>
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders barcode and warning message when open", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeletePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("warningMessage")).toBeInTheDocument();
  });

  it("cancel button calls onOpenChange(false)", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeletePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("cancel"));

    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("delete triggers mutation with package_.id", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <DeletePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteButton"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("on mutation success: toast.success called, onPackageDeleted called, dialog closes", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <DeletePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteButton"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("successTitle", {
        description: "successDescription",
      });
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
      expect(defaultProps.onPackageDeleted).toHaveBeenCalled();
    });
  });

  it("on mutation success with success=false: toast.error called, dialog closes", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[successFalseMock]} addTypename={false}>
        <DeletePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteButton"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("errorTitle", {
        description: "errorDescription",
      });
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("on mutation error: toast.error with errorTitleGeneric, dialog closes", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <DeletePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteButton"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("errorTitleGeneric", {
        description: "Network error",
      });
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("loading state: buttons are disabled", async () => {
    const user = userEvent.setup();

    const delayedMock: MockedResponse = {
      request: {
        query: DELETE_PACKAGE,
        variables: { id: "pkg-1" },
      },
      result: {
        data: { deletePackage: { success: true } },
      },
      delay: 1000,
    };

    render(
      <MockedProvider mocks={[delayedMock]} addTypename={false}>
        <DeletePackageDialog {...defaultProps} />
      </MockedProvider>
    );

    await user.click(screen.getByText("deleteButton"));

    await waitFor(() => {
      expect(screen.getByText("deleting")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("cancel").closest("button");
    const deleteButton = screen.getByText("deleting").closest("button");

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
