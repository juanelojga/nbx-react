import { parseISODate } from "@/lib/date/parseISODate";

const PROJECT_TIMEZONE = "America/Guayaquil";

export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PROJECT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isValidISODate(value: string): boolean {
  return parseISODate(value) !== null;
}
