/**
 * Shared next-intl stub for unit tests.
 * Usage: jest.mock("next-intl", () => jest.requireActual("@/test/mockNextIntl"));
 *
 * Translation calls echo their key (values are ignored) so assertions can
 * target keys without loading message catalogs.
 */
const translate = (key: string) => key;

export const useTranslations = () =>
  Object.assign(translate, {
    rich: (key: string) => key,
    raw: (key: string) => key,
    markup: (key: string) => key,
    has: () => true,
  });

export const useLocale = () => "es";

export const useFormatter = () => ({
  dateTime: (date: Date) => date.toISOString(),
  number: (value: number) => String(value),
  relativeTime: (date: Date) => date.toISOString(),
});
