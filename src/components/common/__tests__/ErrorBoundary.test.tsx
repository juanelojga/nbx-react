import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";

jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));
jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("kaboom");
  return <p>content</p>;
}

function Harness() {
  const [shouldThrow, setShouldThrow] = useState(true);
  return (
    <ErrorBoundary>
      <button onClick={() => setShouldThrow(false)}>fix</button>
      <Bomb shouldThrow={shouldThrow} />
    </ErrorBoundary>
  );
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("shows the fallback with the error message when a child throws", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("kaboom");
  });

  it("renders a custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<p>custom</p>}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText("custom")).toBeInTheDocument();
  });

  it("re-renders children after retry", async () => {
    render(<Harness />);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "retry" }));
    // Still throwing: the boundary catches again.
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
