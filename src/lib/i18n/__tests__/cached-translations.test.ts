/**
 * Tests for cached translations utilities
 */

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  getLocale: jest.fn(() => Promise.resolve("en")),
  getMessages: jest.fn(() => Promise.resolve({ test: "Test message" })),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getLocale: originalGetLocale } = require("next-intl/server");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getMessages: originalGetMessages } = require("next-intl/server");

describe("cached-translations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should export getLocale and getMessages functions", async () => {
    const { getLocale, getMessages } = await import("../cached-translations");

    expect(typeof getLocale).toBe("function");
    expect(typeof getMessages).toBe("function");
  });

  it("should call the original getLocale function", async () => {
    const { getLocale } = await import("../cached-translations");

    const result = await getLocale();

    expect(result).toBe("en");
    expect(originalGetLocale).toHaveBeenCalled();
  });

  it("should call the original getMessages function", async () => {
    const { getMessages } = await import("../cached-translations");

    const result = await getMessages();

    expect(result).toEqual({ test: "Test message" });
    expect(originalGetMessages).toHaveBeenCalled();
  });
});
