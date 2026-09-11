import { UserRole } from "@/types/user";

import { getDefaultRoute } from "../getDefaultRoute";

describe("getDefaultRoute", () => {
  it("sends admins to the admin dashboard", () => {
    expect(getDefaultRoute(UserRole.ADMIN)).toBe("/admin/dashboard");
  });

  it("sends clients to the client dashboard", () => {
    expect(getDefaultRoute(UserRole.CLIENT)).toBe("/client/dashboard");
  });
});
