import { EMPTY_CLIENT_FORM } from "@/lib/validation/clientFormSchema";

import { toClientFormValues } from "../toClientFormValues";
import { toCreateClientVariables } from "../toCreateClientVariables";
import { toUpdateClientVariables } from "../toUpdateClientVariables";

const filled = {
  ...EMPTY_CLIENT_FORM,
  firstName: " Ana ",
  lastName: "Ruiz",
  email: "ana@example.com ",
  city: "Quito",
  phoneNumber: "",
};

describe("client variable mappers", () => {
  it("trims values and omits empty optional fields on create", () => {
    expect(toCreateClientVariables(filled)).toEqual({
      firstName: "Ana",
      lastName: "Ruiz",
      email: "ana@example.com",
      city: "Quito",
    });
  });

  it("never sends the email on update", () => {
    expect(toUpdateClientVariables("7", filled)).toEqual({
      id: "7",
      firstName: "Ana",
      lastName: "Ruiz",
      city: "Quito",
    });
  });

  it("normalizes nullable API fields into form values", () => {
    expect(
      toClientFormValues({
        ...EMPTY_CLIENT_FORM,
        firstName: "Ana",
        lastName: "Ruiz",
        email: "a@b.co",
        city: null,
        state: undefined,
      })
    ).toMatchObject({ firstName: "Ana", city: "", state: "" });
  });
});
