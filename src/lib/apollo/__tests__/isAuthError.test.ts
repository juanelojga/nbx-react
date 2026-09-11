import { isAuthError } from "../isAuthError";

describe("isAuthError", () => {
  it("matches the UNAUTHENTICATED extension code", () => {
    expect(
      isAuthError({
        message: "anything",
        extensions: { code: "UNAUTHENTICATED" },
      })
    ).toBe(true);
  });

  it("matches known django-graphql-jwt messages exactly", () => {
    expect(isAuthError({ message: "Signature has expired" })).toBe(true);
    expect(isAuthError({ message: "Invalid refresh token" })).toBe(true);
  });

  it("ignores errors that merely mention tokens", () => {
    expect(isAuthError({ message: "Invalid barcode token" })).toBe(false);
    expect(isAuthError({ message: "Token limit reached" })).toBe(false);
  });

  it("does not treat authorization failures as authentication failures", () => {
    expect(
      isAuthError({
        message: "You do not have permission to perform this action",
      })
    ).toBe(false);
  });
});
