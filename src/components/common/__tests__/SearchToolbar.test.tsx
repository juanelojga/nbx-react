import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchToolbar } from "@/components/common/SearchToolbar";

const baseProps = {
  value: "",
  onChange: jest.fn(),
  onClear: jest.fn(),
  placeholder: "Search clients",
  clearLabel: "Clear search",
};

describe("SearchToolbar", () => {
  beforeEach(() => jest.clearAllMocks());

  it("forwards typed text", async () => {
    const user = userEvent.setup();
    render(<SearchToolbar {...baseProps} />);

    await user.type(
      screen.getByRole("textbox", { name: "Search clients" }),
      "a"
    );

    expect(baseProps.onChange).toHaveBeenCalledWith("a");
  });

  it("shows the clear button only when there is a value", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchToolbar {...baseProps} />);
    expect(
      screen.queryByRole("button", { name: "Clear search" })
    ).not.toBeInTheDocument();

    rerender(<SearchToolbar {...baseProps} value="ana" />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(baseProps.onClear).toHaveBeenCalledTimes(1);
  });

  it("disables the input while loading with no value", () => {
    render(<SearchToolbar {...baseProps} isLoading />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
