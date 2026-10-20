/**
 * What an unpaid federal income tax balance becomes, day by day (IRC 6651, 6601, 6621, 6622).
 *
 * - Failure to file (6651(a)(1)): 5% of the unpaid tax per month or part of a month the return is late, at most 5
 *   months (25%). In a month where the failure to pay penalty also runs, the 5% is reduced by it (4.5% + 0.5%).
 *   Return more than 60 days late: at least the published minimum ($525 for returns due after 2025) or 100% of
 *   the tax, whichever is less.
 * - Failure to pay (6651(a)(2)): 0.5% of the unpaid tax per month or part of a month, 25% at most; 0.25% while an
 *   approved payment plan runs if the return was filed on time; 1% from 10 days after a notice of intent to levy.
 * - Interest: underpayment rate of each calendar quarter, compounded daily, on the tax from its due date, on the
 *   late filing penalty from the due date, and (simplification, stated on the site) on each month of late payment
 *   penalty from the day it accrues; the IRS starts it at the notice date, so the real figure can be a little lower.
 */
import P from '../../data/params-2026.json';
import { addDays, addMonths, daysBetween, isLeap, quarterOf, monthsOrPart } from './dates';

const RATES = P.interest.rates as Record<string, number>;
const FIRST_Q = Object.keys(RATES).sort()[0];
const LAST_Q = P.interest.current;

/** Underpayment rate for a day. After the last published quarter the current rate is carried forward (flagged). */
export function rateOn(iso: string): number {
  const q = quarterOf(iso);
  if (q in RATES) return RATES[q];
  return q < FIRST_Q ? RATES[FIRST_Q] : RATES[LAST_Q];
}
export const isProjected = (iso: string) => quarterOf(iso) > LAST_Q;

/** Due date of a Form 1040 by tax year, as postponed nationwide (COVID years); disaster-area postponements are not modelled. */
export const DUE_DATES: Record<number, string> = {
  2016: '2017-04-18', 2017: '2018-04-17', 2018: '2019-04-15', 2019: '2020-07-15', 2020: '2021-05-17', 2021: '2022-04-18',
  2022: '2023-04-18', 2023: '2024-04-15', 2024: '2025-04-15', 2025: '2026-04-15',
};
export const TAX_YEARS = Object.keys(DUE_DATES).map(Number).sort((a, b) => b - a);

/** Minimum failure to file penalty for a return due on `due` (table of the IRS failure to file page). */
export function ftfMinimum(due: string) {
  let amt = 0;
  for (const r of P.ftf.minimum) if (due >= r.dueFrom) amt = r.amount;
  return amt;
}

export interface DebtInput {
  /** Tax shown on the return (or assessed) and not paid by the due date. */
  tax: number;
  /** Original due date of the return and of the payment. */
  due: string;
  /** Day the return was filed; null = not filed by `until`. Equal to or before `due` (or the extended date) = on time. */
  filed: string | null;
  /** A valid extension to file: the return is on time up to six months later (the payment is still due on `due`). */
  extension?: boolean;
  /** Day the balance is paid in full (end of the calculation). */
  until: string;
  /** Day the notice of intent to levy was received; the late payment penalty doubles 10 days later. */
  levyNotice?: string | null;
}
export interface DebtResult {
  ftf: number; ftp: number; interest: number; total: number;
  ftfMonths: number; ftpMonths: number; minimumApplied: boolean; days: number;
  /** Day after which interest uses a rate not yet published (carried forward). */
  projectedFrom: string | null;
  /** One line per month from the due date: [date, tax, penalties, interest, balance]. */
  months: Array<{ date: string; penalties: number; interest: number; balance: number }>;
}

export function projectDebt(i: DebtInput): DebtResult {
  const tax = Math.max(0, i.tax);
  const until = i.until < i.due ? i.due : i.until;
  const fileDue = i.extension ? addMonths(i.due, 6) : i.due;
  const filedOnTime = i.filed !== null && i.filed <= fileDue;
  // Months of late filing are counted from the due date including extension, up to the filing day or `until`.
  const fileEnd = i.filed ?? until;
  const ftfMonths = filedOnTime ? 0 : Math.min(5, monthsOrPart(fileDue, fileEnd));
  const ftpMonthsAll = monthsOrPart(i.due, until);
  const levyFrom = i.levyNotice ? addDays(i.levyNotice, 10) : null;

  // Failure to pay, month by month (0.5% or 1%), capped at 25% of the tax.
  const ftpByMonth: number[] = [];
  let ftpTotal = 0;
  for (let m = 0; m < ftpMonthsAll; m++) {
    const start = addMonths(i.due, m);
    const rate = levyFrom && start >= levyFrom ? P.ftp.afterLevyNotice : P.ftp.monthly;
    const add = Math.min(rate * tax, P.ftp.max * tax - ftpTotal);
    ftpByMonth.push(Math.max(0, add));
    ftpTotal += Math.max(0, add);
  }
  // Failure to file: 5% a month, reduced by the late payment penalty of the same month.
  const fileMonthStart = (m: number) => addMonths(fileDue, m);
  let ftf = 0;
  for (let m = 0; m < ftfMonths; m++) {
    const sameMonthFtp = (() => { const d = fileMonthStart(m); const k = monthsOrPart(i.due, addDays(d, 1)) - 1; return ftpByMonth[k] ?? 0; })();
    ftf += Math.max(0, P.ftf.monthly * tax - sameMonthFtp);
  }
  let minimumApplied = false;
  if (!filedOnTime && daysBetween(fileDue, fileEnd) > P.ftf.minimumAfterDays) {
    const floor = Math.min(ftfMinimum(i.due), tax);
    if (floor > ftf) { ftf = floor; minimumApplied = true; }
  }

  // Daily simulation of interest, compounded each day at the quarter's rate (rate / days in the year).
  const days = daysBetween(i.due, until);
  let bearing = tax + ftf; // the late filing penalty bears interest from the due date (IRC 6601(e)(2)(B))
  let interest = 0;
  let nextFtp = 0;
  let projectedFrom: string | null = null;
  const months: DebtResult['months'] = [];
  let mIdx = 1;
  for (let d = 0; d < days; d++) {
    const day = addDays(i.due, d);
    while (nextFtp < ftpByMonth.length && addMonths(i.due, nextFtp) <= day) { bearing += ftpByMonth[nextFtp]; nextFtp++; }
    if (!projectedFrom && isProjected(day)) projectedFrom = day;
    const y = Number(day.slice(0, 4));
    const inc = bearing * (rateOn(day) / (isLeap(y) ? 366 : 365));
    bearing += inc; interest += inc;
    const next = addDays(day, 1);
    if (next === addMonths(i.due, mIdx) || next === until) {
      const pen = ftf + ftpByMonth.slice(0, nextFtp).reduce((a, b) => a + b, 0);
      months.push({ date: next, penalties: pen, interest, balance: tax + pen + interest });
      mIdx++;
    }
  }
  while (nextFtp < ftpByMonth.length) { nextFtp++; }
  return {
    ftf, ftp: ftpTotal, interest, total: tax + ftf + ftpTotal + interest,
    ftfMonths, ftpMonths: ftpMonthsAll, minimumApplied, days, projectedFrom, months,
  };
}

/** Interest only, compounded daily, on a fixed amount between two dates (CP2000 and amended-return cases). */
export function interestOn(amount: number, from: string, to: string) {
  let b = amount;
  for (let d = 0, n = daysBetween(from, to); d < n; d++) {
    const day = addDays(from, d), y = Number(day.slice(0, 4));
    b *= 1 + rateOn(day) / (isLeap(y) ? 366 : 365);
  }
  return b - amount;
}
