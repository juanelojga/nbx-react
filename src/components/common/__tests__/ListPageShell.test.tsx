import { render, screen } from "@testing-library/react";

import { ListPageShell } from "@/components/common/ListPageShell";

describe("ListPageShell", () => {
  it("renders the header, actions and children", () => {
    render(
      <ListPageShell
        title="Clients"
        description="All clients"
        actions={<button>Add</button>}
      >
        <p>table</p>
      </ListPageShell>
    );

    expect(
      screen.getByRole("heading", { name: "Clients" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("table")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error alert when a message is given", () => {
    render(
      <ListPageShell title="Clients" description="" errorMessage="boom">
        <p>table</p>
      </ListPageShell>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("boom");
  });
});
