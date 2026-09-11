import { consolidationExtraParams } from "../consolidationExtraParams";

jest.mock("@/lib/date/todayISO", () => ({
  todayISO: () => "2024-05-10",
  isValidISODate: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value),
}));

const parse = (query: string) =>
  consolidationExtraParams.parse(new URLSearchParams(query));

describe("consolidationExtraParams", () => {
  it("defaults to today/today when no date params are present", () => {
    expect(parse("")).toEqual({
      status: "all",
      createdAfter: "2024-05-10",
      createdBefore: "2024-05-10",
    });
  });

  it("keeps an explicitly cleared range empty", () => {
    expect(parse("createdAfter=&createdBefore=")).toMatchObject({
      createdAfter: "",
      createdBefore: "",
    });
  });

  it("drops malformed dates and resets inverted ranges", () => {
    expect(parse("createdAfter=nope&createdBefore=2024-05-01")).toMatchObject({
      createdAfter: "",
      createdBefore: "2024-05-01",
    });
    expect(
      parse("createdAfter=2024-06-01&createdBefore=2024-05-01")
    ).toMatchObject({
      createdAfter: "2024-05-10",
      createdBefore: "2024-05-10",
    });
  });

  it("reads the status filter", () => {
    expect(parse("status=pending").status).toBe("pending");
  });

  it("writes status only when it is not 'all' and always writes both dates", () => {
    const params = new URLSearchParams("status=pending");
    const current = {
      status: "pending",
      createdAfter: "2024-05-01",
      createdBefore: "2024-05-02",
    };

    consolidationExtraParams.apply(
      params,
      { status: "all", createdAfter: "" },
      current
    );

    expect(params.has("status")).toBe(false);
    expect(params.get("createdAfter")).toBe("");
    expect(params.get("createdBefore")).toBe("2024-05-02");
  });
});
