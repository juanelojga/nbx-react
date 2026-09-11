import sitemap from "@/app/sitemap";
import { routing } from "@/i18n/routing";

describe("sitemap", () => {
  it("emits one entry per locale with language alternates", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(routing.locales.length);
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      for (const locale of routing.locales) {
        expect(languages).toHaveProperty(locale);
      }
    }
  });
});
