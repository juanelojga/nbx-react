import { decodeOrderBy } from "../decodeOrderBy";
import { encodeOrderBy } from "../encodeOrderBy";
import { parsePositiveInt } from "../parsePositiveInt";

const FIELDS = ["email", "created_at"] as const;
const FALLBACK = { field: "created_at", order: "desc" } as const;

describe("orderBy codec", () => {
  it("round-trips ascending and descending fields", () => {
    expect(encodeOrderBy("email", "asc")).toBe("email");
    expect(encodeOrderBy("email", "desc")).toBe("-email");
    expect(decodeOrderBy("-email", FIELDS, FALLBACK)).toEqual({
      field: "email",
      order: "desc",
    });
    expect(decodeOrderBy("created_at", FIELDS, FALLBACK)).toEqual({
      field: "created_at",
      order: "asc",
    });
  });

  it("falls back for unknown or empty values", () => {
    expect(decodeOrderBy("password", FIELDS, FALLBACK)).toEqual(FALLBACK);
    expect(decodeOrderBy(null, FIELDS, FALLBACK)).toEqual(FALLBACK);
  });
});

describe("parsePositiveInt", () => {
  it("parses valid integers and rejects the rest", () => {
    expect(parsePositiveInt("3", 1)).toBe(3);
    expect(parsePositiveInt("abc", 1)).toBe(1);
    expect(parsePositiveInt("0", 1)).toBe(1);
    expect(parsePositiveInt("-2", 1)).toBe(1);
    expect(parsePositiveInt(null, 7)).toBe(7);
  });
});
