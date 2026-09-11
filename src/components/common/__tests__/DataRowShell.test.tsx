import { render, screen } from "@testing-library/react";

import { DataRowPrimaryCell } from "@/components/common/DataRowPrimaryCell";
import { DataRowShell } from "@/components/common/DataRowShell";

describe("DataRowShell", () => {
  it("renders a table row with the stagger delay and primary cell", () => {
    render(
      <table>
        <tbody>
          <DataRowShell animationDelay={200} data-testid="row">
            <DataRowPrimaryCell text="BC-1" title="Barcode BC-1" mono />
          </DataRowShell>
        </tbody>
      </table>
    );

    const row = screen.getByRole("row");
    expect(row.style.animationDelay).toBe("200ms");
    expect(screen.getByTitle("Barcode BC-1")).toHaveTextContent("BC-1");
  });
});
