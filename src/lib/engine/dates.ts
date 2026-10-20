/** Calendar helpers on ISO dates (YYYY-MM-DD), computed in UTC so a build in any time zone gives the same result. */
export const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
export const toIso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return toIso(d); };
/** Same day N months later, clamped to the month's last day (Jan 31 + 1 month = Feb 28). */
export function addMonths(iso: string, n: number) {
  const d = toDate(iso), day = d.getUTCDate();
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
  const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
  t.setUTCDate(Math.min(day, last));
  return toIso(t);
}
export const daysBetween = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000);
export const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const quarterOf = (iso: string) => `${iso.slice(0, 4)}-Q${Math.floor((Number(iso.slice(5, 7)) - 1) / 3) + 1}`;
/**
 * Penalty months: "each month or part of a month" from the due date (IRC 6651). Paying or filing on the due date
 * itself is 0 months; one day late is 1 month; the same day one month later is still 1 month.
 */
export function monthsOrPart(from: string, to: string) {
  if (to <= from) return 0;
  let m = 0;
  while (addMonths(from, m) < to) m++;
  return m;
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "April 15, 2026". */
export const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;
/** "April 2026". */
export const monthYear = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
