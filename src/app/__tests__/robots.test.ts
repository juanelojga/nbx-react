import robots from "@/app/robots";
import { routing } from "@/i18n/routing";

describe("robots", () => {
  it("disallows private sections for every configured locale", () => {
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    const disallow = rule?.disallow ?? [];

    for (const locale of routing.locales) {
      expect(disallow).toContain(`/${locale}/login`);
      expect(disallow).toContain(`/${locale}/admin/`);
      expect(disallow).toContain(`/${locale}/client/`);
    }
    expect(disallow).toContain("/api/");
  });

  it("points to the sitemap", () => {
    expect(robots().sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
