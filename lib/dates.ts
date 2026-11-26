const at = (iso: string) => new Date(iso);

const format = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options }).format(
    at(iso),
  );

export const dayMonth = (iso: string) =>
  format(iso, { day: "numeric", month: "short" });

export const longDate = (iso: string) =>
  format(iso, { day: "numeric", month: "long", year: "numeric" });

export const year = (iso: string) => at(iso).getUTCFullYear();

export function readingMinutes(text = "") {
  return Math.max(
    1,
    Math.round(text.split(/\s+/).filter(Boolean).length / 230),
  );
}
