import { UserRole } from "@/types/user";

import { mapBackendUser } from "../mapBackendUser";

const base = {
  id: "1",
  email: "a@b.co",
  firstName: "Ana",
  lastName: "Ruiz",
};

describe("mapBackendUser", () => {
  it("maps superusers to ADMIN", () => {
    expect(mapBackendUser({ ...base, isSuperuser: true })).toMatchObject({
      role: UserRole.ADMIN,
      isSuperuser: true,
    });
  });

  it("maps everyone else to CLIENT", () => {
    expect(mapBackendUser({ ...base, isSuperuser: false }).role).toBe(
      UserRole.CLIENT
    );
  });
});
