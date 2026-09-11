import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExtraAttributesEditor } from "@/components/admin/ExtraAttributesEditor";
import type { ExtraAttributeEntry } from "@/types/consolidation";

const labels = {
  title: "Extra charges",
  description: "Optional charges added to this consolidation",
  addCharge: "Add charge",
  chargeName: "Charge name",
  chargeAmount: "Amount",
  maxChargesReached: "Maximum reached",
  removeCharge: "Remove charge",
};

function renderEditor(
  value: ExtraAttributeEntry[],
  props: Partial<React.ComponentProps<typeof ExtraAttributesEditor>> = {}
) {
  const onChange = jest.fn();
  render(
    <ExtraAttributesEditor
      value={value}
      onChange={onChange}
      labels={labels}
      {...props}
    />
  );
  return { onChange };
}

describe("ExtraAttributesEditor", () => {
  it("labels both inputs of every row for screen readers", () => {
    renderEditor([{ key: "Insurance", value: "10" }]);

    expect(screen.getByLabelText(labels.chargeName)).toHaveValue("Insurance");
    expect(screen.getByLabelText(labels.chargeAmount)).toHaveValue(10);
    expect(
      screen.getByRole("button", { name: labels.removeCharge })
    ).toBeInTheDocument();
  });

  it("appends an empty row", async () => {
    const { onChange } = renderEditor([]);

    await userEvent.click(
      screen.getByRole("button", { name: labels.addCharge })
    );

    expect(onChange).toHaveBeenCalledWith([{ key: "", value: "" }]);
  });

  it("edits the name and amount of the right row", async () => {
    const { onChange } = renderEditor([
      { key: "a", value: "1" },
      { key: "b", value: "2" },
    ]);

    await userEvent.type(screen.getAllByLabelText(labels.chargeName)[1]!, "c");

    expect(onChange).toHaveBeenLastCalledWith([
      { key: "a", value: "1" },
      { key: "bc", value: "2" },
    ]);
  });

  it("removes the selected row", async () => {
    const { onChange } = renderEditor([
      { key: "a", value: "1" },
      { key: "b", value: "2" },
    ]);

    await userEvent.click(
      screen.getAllByRole("button", { name: labels.removeCharge })[0]!
    );

    expect(onChange).toHaveBeenCalledWith([{ key: "b", value: "2" }]);
  });

  it("disables adding once the maximum is reached", () => {
    renderEditor([{ key: "a", value: "1" }], { maxEntries: 1 });

    const addButton = screen.getByRole("button", {
      name: labels.maxChargesReached,
    });
    expect(addButton).toBeDisabled();
  });

  it("disables every control when the form is busy", () => {
    renderEditor([{ key: "a", value: "1" }], { disabled: true });

    expect(screen.getByLabelText(labels.chargeName)).toBeDisabled();
    expect(screen.getByLabelText(labels.chargeAmount)).toBeDisabled();
    expect(
      screen.getByRole("button", { name: labels.removeCharge })
    ).toBeDisabled();
  });

  it("shows per-row and general validation errors", () => {
    renderEditor([{ key: "", value: "" }], {
      errors: {
        extraAttributes_0_key: "Name required",
        extraAttributes_0_value: "Amount required",
        extraAttributes_general: "Duplicate charge name",
      },
    });

    expect(screen.getByText("Name required")).toBeInTheDocument();
    expect(screen.getByText("Amount required")).toBeInTheDocument();
    expect(screen.getByText("Duplicate charge name")).toBeInTheDocument();
  });
});
