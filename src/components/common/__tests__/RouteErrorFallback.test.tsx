import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RouteErrorFallback } from "@/components/common/RouteErrorFallback";

const mockPush = jest.fn();
jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("RouteErrorFallback", () => {
  beforeEach(() => mockPush.mockClear());

  it("shows the error message and retries via reset", async () => {
    const reset = jest.fn();
    render(
      <RouteErrorFallback
        error={new Error("boom")}
        reset={reset}
        homeHref="/admin/dashboard"
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("boom");
    await userEvent.click(screen.getByRole("button", { name: "retry" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("navigates home through the locale-aware router", async () => {
    render(
      <RouteErrorFallback
        error={new Error("boom")}
        reset={jest.fn()}
        homeHref="/client/dashboard"
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: "goToDashboard" })
    );
    expect(mockPush).toHaveBeenCalledWith("/client/dashboard");
  });
});
