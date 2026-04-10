import {
  getConsolidationColumns,
  getEmptyStateConfig,
  getPaginationLabels,
} from "../ConsolidationsTableConfig";

const mockT = (key: string, values?: Record<string, unknown>) => {
  if (values) {
    return `${key}:${JSON.stringify(values)}`;
  }
  return key;
};

describe("getConsolidationColumns", () => {
  it("returns 7 columns with correct ids", () => {
    const columns = getConsolidationColumns(mockT);

    expect(columns).toHaveLength(8);
    expect(columns.map((c) => c.id)).toEqual([
      "id",
      "client",
      "description",
      "status",
      "packagesCount",
      "deliveryDate",
      "totalCost",
      "actions",
    ]);
  });

  it("has correct sort fields on sortable columns", () => {
    const columns = getConsolidationColumns(mockT);

    const sortableColumns = columns.filter((c) => c.sortable);
    expect(sortableColumns).toHaveLength(2);
    expect(sortableColumns[0].sortField).toBe("status");
    expect(sortableColumns[1].sortField).toBe("delivery_date");
  });

  it("actions column is right-aligned", () => {
    const columns = getConsolidationColumns(mockT);
    const actionsCol = columns.find((c) => c.id === "actions");

    expect(actionsCol?.align).toBe("right");
  });

  it("status column uses badge skeleton variant", () => {
    const columns = getConsolidationColumns(mockT);
    const statusCol = columns.find((c) => c.id === "status");

    expect(statusCol?.skeletonVariant).toBe("badge");
  });
});

describe("getEmptyStateConfig", () => {
  it("returns search-specific config when search is active", () => {
    const config = getEmptyStateConfig(mockT, "john", "all", undefined);

    expect(config.title).toBe("noMatchingConsolidations");
    expect(config.description).toContain("john");
  });

  it("returns filter-specific config when status filter is active", () => {
    const config = getEmptyStateConfig(mockT, "", "pending", undefined);

    expect(config.title).toBe("noMatchingConsolidations");
  });

  it("returns generic config when no search or filter", () => {
    const config = getEmptyStateConfig(mockT, "", "all", undefined);

    expect(config.title).toBe("noConsolidationsFound");
    expect(config.description).toBe("noConsolidationsFoundDescription");
    expect(config.action).toBeUndefined();
  });

  it("includes clear action when filters are active", () => {
    const action = "clear-button";
    const config = getEmptyStateConfig(mockT, "test", "all", action);

    expect(config.action).toBe("clear-button");
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
