import manifest from "@/app/manifest";

describe("manifest", () => {
  it("uses a locale-agnostic start url and provides installable icons", () => {
    const result = manifest();

    expect(result.start_url).toBe("/");
    expect(result.icons?.length).toBeGreaterThanOrEqual(2);
    expect(result.icons?.some((icon) => icon.sizes === "512x512")).toBe(true);
    expect(result.icons?.some((icon) => icon.purpose === "maskable")).toBe(
      true
    );
  });
});
