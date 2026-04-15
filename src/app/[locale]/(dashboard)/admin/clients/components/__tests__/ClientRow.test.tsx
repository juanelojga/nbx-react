import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientRow } from "../ClientRow";
import type { ClientType } from "@/graphql/queries/clients";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/table", () => ({
  TableRow: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => (
    <tr data-testid="table-row" style={props.style}>
      {children}
    </tr>
  ),
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
  ),
}));

jest.mock("@/components/common/TableActionButtons", () => ({
  TableActionButtons: ({
    onView,
    onEdit,
    onDelete,
  }: {
    onView: { onClick: () => void; ariaLabel: string };
    onEdit: { onClick: () => void; ariaLabel: string };
    onDelete: { onClick: () => void; ariaLabel: string };
  }) => (
    <td>
      <button data-testid="view-btn" onClick={onView.onClick}>
        {onView.ariaLabel}
      </button>
      <button data-testid="edit-btn" onClick={onEdit.onClick}>
        {onEdit.ariaLabel}
      </button>
      <button data-testid="delete-btn" onClick={onDelete.onClick}>
        {onDelete.ariaLabel}
      </button>
    </td>
  ),
}));

const mockClient: ClientType = {
  id: "client-1",
  user: {
    id: "user-1",
    isSuperuser: false,
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
  },
  email: "john@example.com",
  extraEmail1: null,
  extraEmail2: null,
  identificationNumber: "123456",
  state: "Guayas",
  city: "Guayaquil",
  mainStreet: "Av. Principal",
  secondaryStreet: "Calle 2",
  buildingNumber: "101",
  mobilePhoneNumber: "0991234567",
  phoneNumber: "042345678",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  fullName: "John Doe",
};

const renderInTable = (ui: React.ReactElement) =>
  render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  );

describe("ClientRow", () => {
  const defaultProps = {
    client: mockClient,
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders name, email, and location", () => {
    renderInTable(<ClientRow {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Guayaquil, Guayas")).toBeInTheDocument();
  });

  it('handles null city/state with "-" fallback', () => {
    const clientNullLocation = {
      ...mockClient,
      city: null,
      state: null,
    };

    renderInTable(<ClientRow {...defaultProps} client={clientNullLocation} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("action callbacks fire with correct args", async () => {
    const user = userEvent.setup();
    const onView = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    renderInTable(
      <ClientRow
        {...defaultProps}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByTestId("view-btn"));
    expect(onView).toHaveBeenCalledWith("client-1");

    await user.click(screen.getByTestId("edit-btn"));
    expect(onEdit).toHaveBeenCalledWith(mockClient);

    await user.click(screen.getByTestId("delete-btn"));
    expect(onDelete).toHaveBeenCalledWith(mockClient);
  });

  it("animation delay applied via style", () => {
    renderInTable(<ClientRow {...defaultProps} animationDelay={150} />);

    const row = screen.getByTestId("table-row");
    expect(row.style.animationDelay).toBe("150ms");
  });
});
