import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Get locale from cookie or default to 'es'
  const cookieStore = await cookies();

  let locale = cookieStore.get("NEXT_LOCALE")?.value || "es";

  // Validate locale
  if (!["es", "en"].includes(locale)) {
    locale = "es";
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
