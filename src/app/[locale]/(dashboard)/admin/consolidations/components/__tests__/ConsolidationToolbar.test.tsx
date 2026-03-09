import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsolidationToolbar } from "../ConsolidationToolbar";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: React.ReactNode;
    onValueChange: (v: string) => void;
    value: string;
  }) => (
    <div data-testid="select" data-value={value}>
      {children}
      <button
        data-testid="select-pending"
        onClick={() => onValueChange("pending")}
      />
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-value={value}>{children}</div>,
}));

describe("ConsolidationToolbar", () => {
  const defaultProps = {
    searchInput: "",
    onSearchInputChange: jest.fn(),
    onClearSearch: jest.fn(),
    statusFilter: "all",
    onStatusFilterChange: jest.fn(),
    isLoading: false,
    isDebouncing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input and status filter", () => {
    render(<ConsolidationToolbar {...defaultProps} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("select")).toBeInTheDocument();
  });

  it("input change calls onSearchInputChange", async () => {
    const user = userEvent.setup();
    const onSearchInputChange = jest.fn();

    render(
      <ConsolidationToolbar
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
      <ConsolidationToolbar {...defaultProps} searchInput="" />
    );

    expect(
      screen.queryByRole("button", { name: "clearSearch" })
    ).not.toBeInTheDocument();

    rerender(<ConsolidationToolbar {...defaultProps} searchInput="test" />);

    expect(
      screen.getByRole("button", { name: "clearSearch" })
    ).toBeInTheDocument();
  });

  it("clear button calls onClearSearch", async () => {
    const user = userEvent.setup();
    const onClearSearch = jest.fn();

    render(
      <ConsolidationToolbar
        {...defaultProps}
        searchInput="test"
        onClearSearch={onClearSearch}
      />
    );

    await user.click(screen.getByRole("button", { name: "clearSearch" }));
    expect(onClearSearch).toHaveBeenCalled();
  });

  it("status filter change calls onStatusFilterChange", async () => {
    const user = userEvent.setup();
    const onStatusFilterChange = jest.fn();

    render(
      <ConsolidationToolbar
        {...defaultProps}
        onStatusFilterChange={onStatusFilterChange}
      />
    );

    await user.click(screen.getByTestId("select-pending"));
    expect(onStatusFilterChange).toHaveBeenCalledWith("pending");
  });
});
