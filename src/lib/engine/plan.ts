/**
 * A payment plan run month by month: interest compounded daily at the quarter's rate on everything unpaid,
 * the late payment penalty at 0.25% a month on the unpaid tax while the plan runs (return filed on time) or 0.5%
 * (return filed late), never beyond 25% of the tax in total, and payments applied to the tax first, then to
 * penalties, then to interest (the order the IRS generally uses, which also keeps the penalty lowest).
 */
import P from '../../data/params-2026.json';
import { addDays, addMonths, daysBetween, isLeap } from './dates';
import { rateOn } from './debt';

export interface PlanInput {
  tax: number; penalties: number; interest: number;
  /** Late payment penalty already charged before the plan (counts toward the 25% cap). */
  ftpSoFar: number;
  /** Original tax, the base of the 25% cap. */
  taxOriginal: number;
  start: string;
  monthly: number;
  filedOnTime: boolean;
  /** Set-up fee added to the balance on day one (0 if paid separately or waived). */
  fee?: number;
  maxMonths?: number;
}
export interface PlanResult {
  months: number; paid: boolean; interest: number; ftp: number; fee: number; totalPaid: number; endDate: string;
  rows: Array<{ n: number; date: string; payment: number; interest: number; ftp: number; balance: number }>;
}

export function runPlan(i: PlanInput): PlanResult {
  let tax = i.tax, pen = i.penalties + (i.fee ?? 0), int = i.interest;
  const rate = i.filedOnTime ? P.ftp.withPlan : P.ftp.monthly;
  const capLeft = () => Math.max(0, P.ftp.max * i.taxOriginal - i.ftpSoFar - ftpSum);
  let ftpSum = 0, intSum = 0, paidSum = 0, n = 0;
  const rows: PlanResult['rows'] = [];
  const max = i.maxMonths ?? 600;
  let date = i.start;
  while (tax + pen + int > 0.005 && n < max) {
    const next = addMonths(i.start, n + 1);
    // Interest for the month, day by day, on the whole balance.
    let mInt = 0;
    for (let d = 0, k = daysBetween(date, next); d < k; d++) {
      const day = addDays(date, d), y = Number(day.slice(0, 4));
      const inc = (tax + pen + int) * (rateOn(day) / (isLeap(y) ? 366 : 365));
      int += inc; mInt += inc;
    }
    const mFtp = Math.min(rate * tax, capLeft());
    pen += mFtp; ftpSum += mFtp; intSum += mInt;
    let pay = Math.min(i.monthly, tax + pen + int);
    paidSum += pay;
    const onTax = Math.min(pay, tax); tax -= onTax; pay -= onTax;
    const onPen = Math.min(pay, pen); pen -= onPen; pay -= onPen;
    int -= Math.min(pay, int);
    n++;
    rows.push({ n, date: next, payment: Math.min(i.monthly, paidSum - rows.reduce((a, r) => a + r.payment, 0)), interest: mInt, ftp: mFtp, balance: Math.max(0, tax + pen + int) });
    date = next;
    if (i.monthly <= 0) break;
  }
  return { months: n, paid: tax + pen + int <= 0.005, interest: intSum, ftp: ftpSum, fee: i.fee ?? 0, totalPaid: paidSum, endDate: date, rows };
}

/** Smallest whole-dollar monthly payment that clears the balance in `months` (bisection on runPlan). */
export function paymentFor(base: Omit<PlanInput, 'monthly' | 'maxMonths'>, months: number) {
  let lo = 1, hi = Math.max(10, (base.tax + base.penalties + base.interest + (base.fee ?? 0)) * 2);
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    const r = runPlan({ ...base, monthly: mid, maxMonths: months });
    if (r.paid) hi = mid; else lo = mid;
  }
  return Math.ceil(hi);
}

export type PlanKind = 'short' | 'guaranteed' | 'simple' | 'nonstreamlined';
/** Which plan the IRS offers for a balance, by the thresholds of its payment plan pages and IRC 6159(c). */
export function planOptions(balance: number, tax: number) {
  const p = P.plans;
  return {
    shortTerm: balance < p.shortTermMax,
    guaranteed: tax <= p.guaranteedMaxTax,
    simple: balance <= p.simpleMax,
    onlineLongTerm: balance <= p.onlineLongTermMax,
    needsFinancials: balance > p.simpleMax,
  };
}

/** Set-up fee of a long-term plan (IRS payment plan page, in force on 2026-10-20). */
export function setupFee(debit: boolean, online: boolean, lowIncome: boolean) {
  const f = P.plans.fees;
  if (debit) return lowIncome ? f.ddiaLowIncome : online ? f.ddiaOnline : f.ddiaOther;
  return lowIncome ? f.otherLowIncome : online ? f.otherOnline : f.otherOther;
}
