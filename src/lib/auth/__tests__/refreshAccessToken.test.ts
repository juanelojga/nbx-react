import { refreshAccessToken } from "../refreshAccessToken";

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

const okResponse = (token = "new-access") =>
  ({
    ok: true,
    status: 200,
    json: async () => ({
      data: {
        refreshWithToken: {
          token,
          refreshToken: "new-refresh",
          refreshExpiresIn: 3600,
        },
      },
    }),
  }) as unknown as Response;

describe("refreshAccessToken", () => {
  const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("narbox_refresh_token", "old-refresh");
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("posts the refresh mutation with credentials and CSRF header", async () => {
    fetchMock.mockResolvedValue(okResponse());

    await expect(refreshAccessToken()).resolves.toBe("new-access");

    const [, init] = fetchMock.mock.calls[0]!;
    expect(init.credentials).toBe("include");
    expect(init.headers).toMatchObject({
      "X-Requested-With": "XMLHttpRequest",
    });
    const body = JSON.parse(init.body as string);
    expect(body.operationName).toBe("RefreshToken");
    expect(body.variables).toEqual({ refreshToken: "old-refresh" });
    expect(body.query).toContain("refreshWithToken");
  });

  it("persists the rotated token pair", async () => {
    fetchMock.mockResolvedValue(okResponse());

    await refreshAccessToken();

    expect(localStorage.getItem("narbox_access_token")).toBe("new-access");
    expect(localStorage.getItem("narbox_refresh_token")).toBe("new-refresh");
  });

  it("shares one in-flight request between concurrent callers", async () => {
    let resolveFetch!: (value: Response) => void;
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      })
    );

    const first = refreshAccessToken();
    const second = refreshAccessToken();
    expect(second).toBe(first);
    resolveFetch(okResponse());

    await expect(Promise.all([first, second])).resolves.toEqual([
      "new-access",
      "new-access",
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not poison the lock when there is no refresh token", async () => {
    localStorage.removeItem("narbox_refresh_token");
    await expect(refreshAccessToken()).resolves.toBeNull();

    localStorage.setItem("narbox_refresh_token", "later-refresh");
    fetchMock.mockResolvedValue(okResponse("after-recovery"));

    await expect(refreshAccessToken()).resolves.toBe("after-recovery");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("clears tokens and resolves null on a non-OK response", async () => {
    localStorage.setItem("narbox_access_token", "stale");
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as unknown as Response);

    await expect(refreshAccessToken()).resolves.toBeNull();
    expect(localStorage.getItem("narbox_access_token")).toBeNull();
    expect(localStorage.getItem("narbox_refresh_token")).toBeNull();
  });

  it("resolves null when the payload carries GraphQL errors", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: { refreshWithToken: null },
        errors: [{ message: "Invalid refresh token" }],
      }),
    } as unknown as Response);

    await expect(refreshAccessToken()).resolves.toBeNull();
  });

  it("allows a new refresh after a failed one", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    await expect(refreshAccessToken()).resolves.toBeNull();

    localStorage.setItem("narbox_refresh_token", "again");
    fetchMock.mockResolvedValueOnce(okResponse("second-try"));
    await expect(refreshAccessToken()).resolves.toBe("second-try");
  });
});
