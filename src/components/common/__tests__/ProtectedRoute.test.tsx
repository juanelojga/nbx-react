import { render, screen } from "@testing-library/react";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";

const mockPush = jest.fn();
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("@/components/common/PageLoading", () => ({
  PageLoading: () => <div role="status">loading</div>,
}));

const mockUseAuth = useAuth as jest.Mock;
const admin = {
  id: "1",
  email: "a@b.co",
  firstName: "A",
  lastName: "B",
  role: UserRole.ADMIN,
  isSuperuser: true,
};
const client = { ...admin, role: UserRole.CLIENT, isSuperuser: false };

describe("ProtectedRoute", () => {
  beforeEach(() => mockPush.mockClear());

  it("shows the loading state while the session is being restored", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false,
    });
    render(<ProtectedRoute>secret</ProtectedRoute>);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated users to login", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
    });
    render(<ProtectedRoute>secret</ProtectedRoute>);

    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("renders children for an allowed role", () => {
    mockUseAuth.mockReturnValue({
      user: admin,
      loading: false,
      isAuthenticated: true,
    });
    render(
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>secret</ProtectedRoute>
    );

    expect(screen.getByText("secret")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("sends a client who opens an admin route to their own dashboard", () => {
    mockUseAuth.mockReturnValue({
      user: client,
      loading: false,
      isAuthenticated: true,
    });
    render(
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>secret</ProtectedRoute>
    );

    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith("/client/dashboard");
  });

  it("allows any authenticated user when no roles are given", () => {
    mockUseAuth.mockReturnValue({
      user: client,
      loading: false,
      isAuthenticated: true,
    });
    render(<ProtectedRoute>secret</ProtectedRoute>);

    expect(screen.getByText("secret")).toBeInTheDocument();
  });
});
