import { createLoginFormSchema } from "../loginFormSchema";

const t = (key: string) => key;
const schema = createLoginFormSchema(t);

describe("createLoginFormSchema", () => {
  it("reports empty and invalid emails", () => {
    expect(
      schema.safeParse({ email: "", password: "secret1" }).error?.issues[0]
        ?.message
    ).toBe("emailRequired");
    expect(
      schema.safeParse({ email: "user@domain", password: "secret1" }).error
        ?.issues[0]?.message
    ).toBe("emailInvalid");
  });

  it("enforces the password minimum length", () => {
    expect(
      schema.safeParse({ email: "a@b.co", password: "" }).error?.issues[0]
        ?.message
    ).toBe("passwordRequired");
    expect(
      schema.safeParse({ email: "a@b.co", password: "abc" }).error?.issues[0]
        ?.message
    ).toBe("passwordMinLength");
    expect(
      schema.safeParse({ email: "a@b.co", password: "abcdef" }).success
    ).toBe(true);
  });
});
