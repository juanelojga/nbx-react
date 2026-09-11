import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAuth } from "@/contexts/AuthContext";
import { useLoginRateLimit } from "@/hooks/useLoginRateLimit";

import { LoginForm } from "../LoginForm";

jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
jest.mock("@/components/LanguageSelector", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("@/hooks/useLoginRateLimit", () => ({
  useLoginRateLimit: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUseRateLimit = useLoginRateLimit as jest.Mock;

function setup(overrides: { login?: jest.Mock; isLocked?: boolean } = {}) {
  const login = overrides.login ?? jest.fn().mockResolvedValue(undefined);
  mockUseAuth.mockReturnValue({
    login,
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false,
  });
  mockUseRateLimit.mockReturnValue({
    attempt: jest.fn(() => !overrides.isLocked),
    isLocked: overrides.isLocked ?? false,
    lockExpiry: overrides.isLocked ? Date.now() + 60_000 : null,
  });
  render(<LoginForm />);
  return { login };
}

describe("LoginForm", () => {
  it("shows validation messages and does not call login", async () => {
    const { login } = setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /signIn/ }));

    expect(await screen.findByText("emailRequired")).toBeInTheDocument();
    expect(screen.getByText("passwordRequired")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("submits a normalized email and the password", async () => {
    const { login } = setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("email"), "  Ana@Example.com ");
    await user.type(screen.getByLabelText("password"), "secret1");
    await user.click(screen.getByRole("button", { name: /signIn/ }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith("ana@example.com", "secret1")
    );
  });

  it("surfaces login errors in the alert", async () => {
    const { login } = setup({
      login: jest.fn().mockRejectedValue(new Error("Bad credentials")),
    });
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("email"), "ana@example.com");
    await user.type(screen.getByLabelText("password"), "secret1");
    await user.click(screen.getByRole("button", { name: /signIn/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Bad credentials"
    );
    expect(login).toHaveBeenCalledTimes(1);
  });

  it("disables the form while rate limited", () => {
    setup({ isLocked: true });

    expect(screen.getByRole("button", { name: /signIn/ })).toBeDisabled();
    expect(screen.getByLabelText("email")).toBeDisabled();
  });
});
