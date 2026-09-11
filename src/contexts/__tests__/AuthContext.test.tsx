import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LOGIN_MUTATION } from "@/graphql/mutations/auth";
import { GET_CURRENT_USER } from "@/graphql/queries/auth";
import { authEvents, SESSION_EXPIRED_EVENT } from "@/lib/auth/authEvents";
import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";
import { MockedProvider, type MockedResponse } from "@/test/MockedProvider";
import { UserRole } from "@/types/user";

const mockPush = jest.fn();
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("@/lib/auth/refreshAccessToken", () => ({
  refreshAccessToken: jest.fn(),
}));
jest.mock("jwt-decode", () => ({
  jwtDecode: (token: string) => ({
    exp: token === "expired-access" ? 0 : Date.now() / 1000 + 3600,
  }),
}));
jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

const mockRefresh = refreshAccessToken as jest.Mock;

const me = {
  id: "7",
  email: "root@narbox.com",
  firstName: "Root",
  lastName: "Admin",
  isSuperuser: true,
};

const meMock = (): MockedResponse => ({
  request: { query: GET_CURRENT_USER },
  result: { data: { me: { ...me, __typename: "MeType" } } },
});

function renderAuth(mocks: MockedResponse[]) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks}>
      <AuthProvider>{children}</AuthProvider>
    </MockedProvider>
  );
  return renderHook(() => useAuth(), { wrapper });
}

function storeSession(access = "valid-access") {
  localStorage.setItem("narbox_access_token", access);
  localStorage.setItem("narbox_refresh_token", "refresh");
  localStorage.setItem(
    "narbox_refresh_token_expires_at",
    String(Date.now() + 60_000)
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    mockRefresh.mockReset();
  });

  it("starts unauthenticated when no tokens are stored", async () => {
    const { result } = renderAuth([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("restores the session from valid stored tokens", async () => {
    storeSession();
    const { result } = renderAuth([meMock()]);

    await waitFor(() => expect(result.current.user).not.toBeNull());
    expect(result.current.user?.role).toBe(UserRole.ADMIN);
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it("refreshes an expired access token before loading the user", async () => {
    storeSession("expired-access");
    mockRefresh.mockResolvedValue("valid-access");
    const { result } = renderAuth([meMock()]);

    await waitFor(() => expect(result.current.user).not.toBeNull());
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("clears an expired refresh session without querying the user", async () => {
    storeSession();
    localStorage.setItem("narbox_refresh_token_expires_at", "1");
    const { result } = renderAuth([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("narbox_refresh_token")).toBeNull();
  });

  it("logs in, stores tokens and navigates to the role dashboard", async () => {
    const { result } = renderAuth([
      {
        request: {
          query: LOGIN_MUTATION,
          variables: { email: "root@narbox.com", password: "pw" },
        },
        result: {
          data: {
            emailAuth: {
              token: "valid-access",
              refreshToken: "refresh",
              refreshExpiresIn: 3600,
              payload: {},
              __typename: "ObtainJSONWebToken",
            },
          },
        },
      },
      meMock(),
    ]);
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login("root@narbox.com", "pw");
    });

    expect(localStorage.getItem("narbox_access_token")).toBe("valid-access");
    expect(result.current.user?.email).toBe("root@narbox.com");
    expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("surfaces login failures as errors", async () => {
    const { result } = renderAuth([
      {
        request: {
          query: LOGIN_MUTATION,
          variables: { email: "x", password: "y" },
        },
        error: new Error("Please enter valid credentials"),
      },
    ]);
    await waitFor(() => expect(result.current.loading).toBe(false));

    let thrown: unknown;
    await act(async () => {
      try {
        await result.current.login("x", "y");
      } catch (err) {
        thrown = err;
      }
    });

    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toBe("Please enter valid credentials");
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe("Please enter valid credentials");
  });

  it("logs out locally and navigates to login", async () => {
    storeSession();
    const { result } = renderAuth([meMock()]);
    await waitFor(() => expect(result.current.user).not.toBeNull());

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("narbox_access_token")).toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("drops the session when the link chain reports expiry", async () => {
    storeSession();
    const { result } = renderAuth([meMock()]);
    await waitFor(() => expect(result.current.user).not.toBeNull());

    act(() => {
      authEvents.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    });

    expect(result.current.user).toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
