import {
  getClientColumns,
  getEmptyStateConfig,
  getPaginationLabels,
} from "../ClientsTableConfig";

const mockT = (key: string, values?: Record<string, unknown>) => {
  if (values) {
    return `${key}:${JSON.stringify(values)}`;
  }
  return key;
};

describe("getClientColumns", () => {
  it("returns 4 columns with correct ids", () => {
    const columns = getClientColumns(mockT);

    expect(columns).toHaveLength(4);
    expect(columns.map((c) => c.id)).toEqual([
      "fullName",
      "email",
      "location",
      "actions",
    ]);
  });

  it("has correct sort fields on sortable columns", () => {
    const columns = getClientColumns(mockT);

    const sortableColumns = columns.filter((c) => c.sortable);
    expect(sortableColumns).toHaveLength(2);
    expect(sortableColumns[0].sortField).toBe("full_name");
    expect(sortableColumns[1].sortField).toBe("email");
  });
});

describe("getEmptyStateConfig", () => {
  it("returns search-specific config when search is active", () => {
    const config = getEmptyStateConfig(mockT, "john", undefined);

    expect(config.title).toBe("noMatchingClients");
    expect(config.description).toContain("john");
  });

  it("returns generic config when no search", () => {
    const config = getEmptyStateConfig(mockT, "", undefined);

    expect(config.title).toBe("noClientsFound");
    expect(config.description).toBe("noClientsFoundDescription");
    expect(config.action).toBeUndefined();
  });
});

describe("getPaginationLabels", () => {
  it("returns all required label functions", () => {
    const labels = getPaginationLabels(mockT);

    expect(typeof labels.showing).toBe("function");
    expect(typeof labels.rowsPerPage).toBe("string");
    expect(typeof labels.previousPage).toBe("string");
    expect(typeof labels.nextPage).toBe("string");
    expect(typeof labels.goToPage).toBe("function");
  });

  it("showing function passes correct values", () => {
    const labels = getPaginationLabels(mockT);

    const result = labels.showing!(1, 10, 100);
    expect(result).toContain("1");
    expect(result).toContain("10");
    expect(result).toContain("100");
  });
});
