import { UserRole } from "@/types/user";

import { canAccessRoute } from "../canAccessRoute";

describe("canAccessRoute", () => {
  it("allows everyone when no roles are specified", () => {
    expect(canAccessRoute(UserRole.CLIENT)).toBe(true);
    expect(canAccessRoute(UserRole.CLIENT, [])).toBe(true);
  });

  it("allows only the listed roles otherwise", () => {
    expect(canAccessRoute(UserRole.ADMIN, [UserRole.ADMIN])).toBe(true);
    expect(canAccessRoute(UserRole.CLIENT, [UserRole.ADMIN])).toBe(false);
  });
});
