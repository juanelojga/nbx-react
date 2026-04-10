import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsolidationRow } from "../ConsolidationRow";
import type { ConsolidateType } from "@/graphql/queries/consolidations";

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
  TableCell: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <td>{children}</td>,
}));

jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
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

jest.mock("@/components/ui/status-badge", () => ({
  StatusBadge: ({ label }: { status: string; label: string }) => (
    <span data-testid="status-badge">{label}</span>
  ),
}));

jest.mock("../getStatusLabel", () => ({
  getStatusLabel: (_t: unknown, status: string) => `status-${status}`,
}));

const mockConsolidation: ConsolidateType = {
  id: "cons-1",
  description: "Test consolidation",
  status: "pending",
  deliveryDate: "2024-06-15",
  comment: null,
  extraAttributes: null,
  client: {
    id: "client-1",
    fullName: "John Doe",
    email: "john@example.com",
  },
  packages: [
    { id: "pkg-1", barcode: "BC001", description: "Package 1" },
    { id: "pkg-2", barcode: "BC002", description: "Package 2" },
  ],
  totalCost: 150.0,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

const renderInTable = (ui: React.ReactElement) =>
  render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  );

describe("ConsolidationRow", () => {
  const defaultProps = {
    consolidation: mockConsolidation,
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders id, client name, and description", () => {
    renderInTable(<ConsolidationRow {...defaultProps} />);

    expect(screen.getByText("cons-1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getAllByText("Test consolidation").length).toBeGreaterThan(0);
  });

  it("renders status badge", () => {
    renderInTable(<ConsolidationRow {...defaultProps} />);

    expect(screen.getByTestId("status-badge")).toHaveTextContent(
      "status-pending"
    );
  });

  it("renders package count", () => {
    renderInTable(<ConsolidationRow {...defaultProps} />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders formatted delivery date", () => {
    renderInTable(<ConsolidationRow {...defaultProps} />);

    const timeEl = screen.getByRole("time");
    expect(timeEl).toBeInTheDocument();
    expect(timeEl).toHaveAttribute("datetime", "2024-06-15");
  });

  it("renders em dash when no delivery date", () => {
    const noDateConsolidation = {
      ...mockConsolidation,
      deliveryDate: null,
    };
    renderInTable(
      <ConsolidationRow {...defaultProps} consolidation={noDateConsolidation} />
    );

    const timeEl = screen.getByRole("time");
    expect(timeEl).toHaveTextContent("\u2014");
  });

  it("renders em dash when no description", () => {
    const noDescConsolidation = {
      ...mockConsolidation,
      description: "",
    };
    renderInTable(
      <ConsolidationRow {...defaultProps} consolidation={noDescConsolidation} />
    );

    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("action callbacks fire with correct args", async () => {
    const user = userEvent.setup();
    const onView = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    renderInTable(
      <ConsolidationRow
        {...defaultProps}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByTestId("view-btn"));
    expect(onView).toHaveBeenCalledWith("cons-1");

    await user.click(screen.getByTestId("edit-btn"));
    expect(onEdit).toHaveBeenCalledWith(mockConsolidation);

    await user.click(screen.getByTestId("delete-btn"));
    expect(onDelete).toHaveBeenCalledWith(mockConsolidation);
  });

  it("animation delay applied via style", () => {
    renderInTable(<ConsolidationRow {...defaultProps} animationDelay={150} />);

    const row = screen.getByTestId("table-row");
    expect(row.style.animationDelay).toBe("150ms");
  });
});
