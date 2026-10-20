/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                   params-2026.json (rates, penalties, plans, offer, standards, levy, passport, sources)
 *   K.tool(kind, args)    runs a calculator of tool-specs.ts on its defaults plus `args`, returns its result card
 *   K.debt, K.plan, ...   engine functions for a figure in a sentence
 *   formats               K.usd, K.usd2, K.pct, K.num, K.day, K.rate(quarter)
 */
import P from '../data/params-2026.json';
import H from '../data/housing-2026.json';
import { usd, getTool, pct } from './tool-specs';
import { formatNumber, formatMoney } from './format';
import { longDate, monthYear, addMonths } from './engine/dates';
import { projectDebt, interestOn, ftfMinimum, DUE_DATES, rateOn } from './engine/debt';
import { runPlan, paymentFor, setupFee, planOptions } from './engine/plan';
import { primeHousing, allowable, nationalStandard, housingStandard, operatingStandard, msaOf, healthStandard, type Row } from './engine/standards';
import { assetEquity, rcp, lowIncomeLimit, upfront } from './engine/oic';
import { exemptAmount, levyTake } from './engine/levy';
import { LAST_UPDATED } from '../data/site-config';
import type { V } from './tool-types';

primeHousing(H.states as unknown as Record<string, Row[]>);

function tool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args };
  return spec.run(v);
}
/** A plan of `months` on a balance that is all tax, return filed on time, starting on the build day. */
function plan(balance: number, months: number, filedOnTime = true) {
  const base = { tax: balance, penalties: 0, interest: 0, ftpSoFar: 0, taxOriginal: balance, start: LAST_UPDATED, filedOnTime };
  const monthly = paymentFor(base, months);
  return { monthly, ...runPlan({ ...base, monthly, maxMonths: months }) };
}
/** Balance of `tax` due on the 2025 due date, filed on time or `late` days late, paid on `until`. */
const debt = (tax: number, until: string, filedLateDays: number | null = 0, due = DUE_DATES[2025]) =>
  projectDebt({ tax, due, filed: filedLateDays === null ? null : addDays0(due, filedLateDays), until });
const addDays0 = (iso: string, d: number) => { const x = new Date(`${iso}T00:00:00Z`); x.setUTCDate(x.getUTCDate() + d); return x.toISOString().slice(0, 10); };
/** Quarter label "2026-Q4" to "fourth quarter of 2026". */
const QN = ['first', 'second', 'third', 'fourth'];
const quarter = (q: string) => `${QN[Number(q.slice(-1)) - 1]} quarter of ${q.slice(0, 4)}`;

export const KIT = {
  P, S: P.standards, tool, plan, debt, quarter, today: LAST_UPDATED,
  projectDebt, interestOn, ftfMinimum, DUE_DATES, rateOn, runPlan, paymentFor, setupFee, planOptions,
  allowable, nationalStandard, housingStandard, operatingStandard, msaOf, healthStandard,
  assetEquity, rcp, lowIncomeLimit, upfront, exemptAmount, levyTake, addMonths,
  usd, pct, usd2: (x: number) => formatMoney(x, Number.isInteger(x) ? 0 : 2), num: (x: number) => formatNumber(x, 0),
  day: longDate, month: monthYear,
  /** Interest rate of a quarter, "7%". */
  rate: (q: string) => pct((P.interest.rates as Record<string, number>)[q], 0),
};
export type Kit = typeof KIT;
