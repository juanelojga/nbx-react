/** Parse a URL integer parameter, falling back for missing, NaN or < 1 values. */
export function parsePositiveInt(raw: string | null, fallback: number): number {
  if (raw === null || raw === "") return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isNaN(value) || value < 1 ? fallback : value;
}
