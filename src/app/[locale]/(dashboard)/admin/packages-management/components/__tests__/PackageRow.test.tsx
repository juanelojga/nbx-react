import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import type { PackageType } from "@/graphql/queries/packages";

import { PackageRow } from "../PackageRow";

jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));

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
      <button onClick={onView.onClick}>{onView.ariaLabel}</button>
      <button onClick={onEdit.onClick}>{onEdit.ariaLabel}</button>
      <button onClick={onDelete.onClick}>{onDelete.ariaLabel}</button>
    </td>
  ),
}));

const pkg = {
  id: "pkg-1",
  barcode: "BC-123",
  description: "Shoes",
  weight: 2.5,
  weightUnit: "lb",
  createdAt: "2024-03-01T00:00:00Z",
  client: { id: "c1", fullName: "Ana Ruiz", email: "ana@example.com" },
} as unknown as PackageType;

const renderRow = (
  props: Partial<React.ComponentProps<typeof PackageRow>> = {}
) =>
  render(
    <table>
      <tbody>
        <PackageRow
          pkg={pkg}
          onView={jest.fn()}
          onEdit={jest.fn()}
          onDelete={jest.fn()}
          {...props}
        />
      </tbody>
    </table>
  );

describe("PackageRow", () => {
  it("renders barcode, client, description and weight", () => {
    renderRow();

    expect(screen.getByText("BC-123")).toBeInTheDocument();
    expect(screen.getByText("Ana Ruiz")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText("Shoes")).toBeInTheDocument();
    expect(screen.getByText("2.5 lb")).toBeInTheDocument();
  });

  it("fires the action callbacks with the package", async () => {
    const user = userEvent.setup();
    const onView = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    renderRow({ onView, onEdit, onDelete });

    await user.click(screen.getByRole("button", { name: "viewAriaLabel" }));
    expect(onView).toHaveBeenCalledWith("pkg-1");
    await user.click(screen.getByRole("button", { name: "editAriaLabel" }));
    expect(onEdit).toHaveBeenCalledWith(pkg);
    await user.click(screen.getByRole("button", { name: "deleteAriaLabel" }));
    expect(onDelete).toHaveBeenCalledWith(pkg);
  });

  it("applies the stagger delay", () => {
    renderRow({ animationDelay: 120 });
    expect(screen.getByRole("row")).toHaveStyle({ animationDelay: "120ms" });
  });
});
