import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RefreshButton } from "@/components/common/RefreshButton";

describe("RefreshButton", () => {
  it("calls onClick and is disabled while loading", async () => {
    const onClick = jest.fn();
    const { rerender } = render(
      <RefreshButton onClick={onClick} loading={false} label="Refresh" />
    );

    await userEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<RefreshButton onClick={onClick} loading label="Refresh" />);
    expect(screen.getByRole("button", { name: "Refresh" })).toBeDisabled();
  });
});
