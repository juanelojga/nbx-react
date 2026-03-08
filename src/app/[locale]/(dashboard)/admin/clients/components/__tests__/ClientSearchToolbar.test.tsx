import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientSearchToolbar } from "../ClientSearchToolbar";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("ClientSearchToolbar", () => {
  const defaultProps = {
    searchInput: "",
    onSearchInputChange: jest.fn(),
    onClearSearch: jest.fn(),
    isLoading: false,
    isDebouncing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows search icon when idle", () => {
    const { container } = render(<ClientSearchToolbar {...defaultProps} />);

    // Search icon should be present (not loader)
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("input change calls onSearchInputChange", async () => {
    const user = userEvent.setup();
    const onSearchInputChange = jest.fn();

    render(
      <ClientSearchToolbar
        {...defaultProps}
        onSearchInputChange={onSearchInputChange}
      />
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "a");

    expect(onSearchInputChange).toHaveBeenCalledWith("a");
  });

  it("clear button visible only with non-empty input", () => {
    const { rerender } = render(
      <ClientSearchToolbar {...defaultProps} searchInput="" />
    );

    expect(
      screen.queryByRole("button", { name: "clearSearch" })
    ).not.toBeInTheDocument();

    rerender(<ClientSearchToolbar {...defaultProps} searchInput="test" />);

    expect(
      screen.getByRole("button", { name: "clearSearch" })
    ).toBeInTheDocument();
  });

  it("clear button calls onClearSearch", async () => {
    const user = userEvent.setup();
    const onClearSearch = jest.fn();

    render(
      <ClientSearchToolbar
        {...defaultProps}
        searchInput="test"
        onClearSearch={onClearSearch}
      />
    );

    await user.click(screen.getByRole("button", { name: "clearSearch" }));
    expect(onClearSearch).toHaveBeenCalled();
  });
});
