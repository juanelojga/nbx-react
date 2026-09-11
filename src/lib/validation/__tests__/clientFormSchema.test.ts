import { createClientFormSchema, EMPTY_CLIENT_FORM } from "../clientFormSchema";

const t = (key: string) => key;

describe("createClientFormSchema", () => {
  const schema = createClientFormSchema(t, { requireEmail: true });

  it("requires first name, last name and a valid email", () => {
    const result = schema.safeParse(EMPTY_CLIENT_FORM);
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((i) => i.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        "firstNameRequired",
        "lastNameRequired",
        "emailRequired",
      ])
    );

    const invalid = schema.safeParse({
      ...EMPTY_CLIENT_FORM,
      firstName: "A",
      lastName: "B",
      email: "user@domain",
    });
    expect(invalid.error?.issues[0]?.message).toBe("emailInvalid");
  });

  it("accepts optional fields when empty and validates them when filled", () => {
    const base = {
      ...EMPTY_CLIENT_FORM,
      firstName: "Ana",
      lastName: "Ruiz",
      email: "ana@example.com",
    };
    expect(schema.safeParse(base).success).toBe(true);
    expect(
      schema.safeParse({ ...base, extraEmail1: "nope" }).error?.issues[0]
        ?.message
    ).toBe("extraEmail1Invalid");
    expect(
      schema.safeParse({ ...base, mobilePhoneNumber: "09x" }).error?.issues[0]
        ?.message
    ).toBe("mobilePhoneInvalid");
  });

  it("skips email validation in edit mode", () => {
    const editSchema = createClientFormSchema(t, { requireEmail: false });
    expect(
      editSchema.safeParse({
        ...EMPTY_CLIENT_FORM,
        firstName: "Ana",
        lastName: "Ruiz",
      }).success
    ).toBe(true);
  });
});
