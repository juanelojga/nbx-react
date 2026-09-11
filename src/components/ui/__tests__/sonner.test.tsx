import { render, screen } from "@testing-library/react";

import { Toaster } from "../sonner";

jest.mock("sonner", () => ({
  Toaster: ({
    theme,
    className,
    position,
  }: {
    theme?: string;
    className?: string;
    position?: string;
  }) => (
    <div
      data-testid="sonner-toaster"
      data-theme={theme}
      data-position={position}
      className={className}
    />
  ),
}));

describe("Toaster", () => {
  it("follows the system theme", () => {
    render(<Toaster />);
    expect(screen.getByTestId("sonner-toaster")).toHaveAttribute(
      "data-theme",
      "system"
    );
  });

  it("forwards Sonner props", () => {
    render(<Toaster position="top-center" />);
    expect(screen.getByTestId("sonner-toaster")).toHaveAttribute(
      "data-position",
      "top-center"
    );
  });
});
