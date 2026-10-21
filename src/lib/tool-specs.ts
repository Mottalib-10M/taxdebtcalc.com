/**
 * The calculators of the site, one entry per question. Every figure comes from the engine (src/lib/engine/*),
 * which reads params-2026.json and housing-2026.json. A spec lists its inputs (visible first, `adv` ones folded
 * under "More options") and a pure `run` that turns them into a result card. Nothing here is a figure typed by hand.
 *
 * Dates: the first render uses the build day (LAST_UPDATED); SpecTool and MiniSim call setToday() after mount
 * (RECETTE §17.5), so a visitor's result is counted to the day they read it.
 */
import P from '../data/params-2026.json';
import { LAST_UPDATED } from '../data/site-config';
import type { ToolSpec, V, Input, Opt } from './tool-types';
import { formatMoney, formatPercent, formatNumber } from './format';
import { addDays, addMonths, longDate, monthYear } from './engine/dates';
import { projectDebt, interestOn, DUE_DATES, TAX_YEARS, ftfMinimum } from './engine/debt';
import { runPlan, paymentFor, setupFee, planOptions } from './engine/plan';
import { allowable, countiesOf, STATES, housingLoaded, operatingArea } from './engine/standards';
import { assetEquity, rcp, lowIncomeLimit, upfront } from './engine/oic';
import { levyTake, type Status, type Period } from './engine/levy';

let TODAY = LAST_UPDATED;
export const setToday = (iso: string) => { TODAY = iso; };
export const today = () => TODAY;

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
/** 7 %, 0.25 %, 22.5 %: as few decimals as the figure needs (up to 2) unless `d` is given. */
export const pct = (x: number, d?: number) => formatPercent(x, d ?? [0, 1, 2].find((k) => Math.abs(Math.round(x * 100 * 10 ** k) - x * 100 * 10 ** k) < 1e-6) ?? 1);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const MONEY = (id: string, label: string, def: number, help?: string, adv = false, max = 5000000): Input => ({ id, label, def, unit: '$', max, help, adv });
const YES_NO = (id: string, label: string, def: 'yes' | 'no', adv = false, help?: string): Input => ({ kind: 'choice', id, label, def, adv, help, options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] });
const TAX_YEAR = (def: number, label = 'Tax year of the balance'): Input => ({ kind: 'select', id: 'ty', label, def: String(def), options: TAX_YEARS.map((y) => ({ value: String(y), label: `${y} (due ${longDate(DUE_DATES[y])})` })) });
const FILED: Input = {
  kind: 'select', id: 'fs', label: 'The return was filed', def: 'ontime', options: [
    { value: 'ontime', label: 'On time' }, { value: 'ext', label: 'On extension, by October 15' },
    { value: 'l1', label: '1 to 30 days late' }, { value: 'l2', label: '31 to 60 days late' }, { value: 'l3', label: '61 to 90 days late' },
    { value: 'l4', label: '91 to 120 days late' }, { value: 'l5', label: 'More than 120 days late' }, { value: 'nf', label: 'Not filed yet' },
  ],
};
const PAYOFF = (def = 0): Input => ({ id: 'pm', label: 'Paid in full in', def, unit: 'months', max: 120, help: '0 = paid today' });
const STATE_OPTS: Opt[] = STATES.map((x) => ({ value: x, label: x }));
const STATE = (def: string): Input => ({ kind: 'select', id: 'st', label: 'State', def, options: STATE_OPTS });
const COUNTY = (def: string): Input => ({
  kind: 'select', id: 'co', label: 'County', def, options: [{ value: def, label: def }],
  optionsFor: (v) => { const c = countiesOf(s(v, 'st')); return c.length ? c.map((x) => ({ value: x, label: x })) : [{ value: s(v, 'co'), label: s(v, 'co') }]; },
});
const firstCounty = (st: string, co: string) => { const c = countiesOf(st); return c.includes(co) ? co : c[0] ?? co; };

/** The four facts a balance needs: due date, filing date, payoff date, and whether a levy notice came. */
function debtCase(v: V) {
  const ty = Number(v.ty), due = DUE_DATES[ty] ?? DUE_DATES[2025];
  const fs = s(v, 'fs');
  const until = addMonths(TODAY, Math.max(0, Math.round(n(v, 'pm'))));
  const late: Record<string, number> = { l1: 30, l2: 60, l3: 90, l4: 120, l5: 150 };
  const filed = fs === 'ontime' ? due : fs === 'ext' ? addMonths(due, 6) : fs === 'nf' ? null : addDays(due, late[fs]);
  const lv = s(v, 'lv') === 'yes' ? TODAY : null;
  return { due, until, input: { tax: n(v, 'tax'), due, filed: filed && filed > until ? until : filed, extension: fs === 'ext', until, levyNotice: lv } };
}
const projected = (from: string | null) => (from ? ` From ${monthYear(from)}, interest keeps the ${pct(P.interest.currentRate, 0)} rate of the last published quarter; the next rate is ${P.interest.nextQuarter.expected}.` : '');

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  /* Home: what the balance is today and on the payoff day, penalty by penalty. */
  debt: (arg) => ({
    inputs: [
      MONEY('tax', 'Unpaid tax (before penalties and interest)', Number(arg?.tax ?? 12000), 'Not paid by the due date'),
      TAX_YEAR(Number(arg?.ty ?? 2025)),
      { ...FILED, def: String(arg?.fs ?? 'ontime') } as Input,
      PAYOFF(Number(arg?.pm ?? 0)),
      YES_NO('lv', 'Final notice of intent to levy received', String(arg?.lv ?? 'no') as 'yes' | 'no', true, 'CP504, LT11 or Letter 1058: the penalty doubles 10 days later'),
    ],
    run: (v) => {
      const c = debtCase(v);
      const r = projectDebt(c.input);
      const perDay = (c.input.tax + r.ftf + r.ftp + r.interest) * (P.interest.currentRate / 365);
      const tail = r.months.slice(-Math.min(12, r.months.length));
      return {
        label: `Balance on ${longDate(c.until)}`, value: usd(r.total),
        sub: `${usd(r.total - c.input.tax)} added to ${usd(c.input.tax)} of tax since ${longDate(c.due)}; interest now runs at about ${usd(perDay)} a day.`,
        rows: [
          ['Unpaid tax', usd(c.input.tax), c.input.tax],
          [`Failure to file penalty${r.ftfMonths ? `, ${r.ftfMonths} month${r.ftfMonths > 1 ? 's' : ''}` : ''}${r.minimumApplied ? ' (minimum)' : ''}`, usd(r.ftf), r.ftf],
          [`Failure to pay penalty, ${r.ftpMonths} month${r.ftpMonths === 1 ? '' : 's'}`, usd(r.ftp), r.ftp],
          ['Interest, compounded daily', usd(r.interest), r.interest],
        ],
        table: tail.length > 1 ? { caption: 'How the balance grows, month by month', headers: ['Month ending', 'Penalties', 'Interest', 'Balance'], align: ['l', 'r', 'r', 'r'], rows: tail.map((m) => [longDate(m.date), usd(m.penalties), usd(m.interest), usd(m.balance)]) } : undefined,
        note: `Penalties of IRC 6651 and interest at each quarter's underpayment rate (${pct(P.interest.currentRate, 0)} in the fourth quarter of 2026).${projected(r.projectedFrom)} Estimate, not tax advice.`,
      };
    },
  }),

  /* Failure to file alone: months late, the 4.5% + 0.5% split and the minimum. */
  ftf: (arg) => ({
    inputs: [
      MONEY('tax', 'Tax not paid by the due date', Number(arg?.tax ?? 8000)),
      { id: 'dl', label: 'Days the return is late', def: Number(arg?.dl ?? 75), unit: 'days', max: 3650 },
      YES_NO('pd', 'Tax paid on the due date', 'no', true, 'If it was, no late filing penalty is due'),
    ],
    run: (v) => {
      const tax = s(v, 'pd') === 'yes' ? 0 : n(v, 'tax'), days = Math.max(0, Math.round(n(v, 'dl')));
      const r = projectDebt({ tax, due: '2026-04-15', filed: addDays('2026-04-15', days), until: addDays('2026-04-15', days) });
      return {
        label: 'Failure to file penalty', value: usd(r.ftf),
        sub: r.minimumApplied ? `More than ${P.ftf.minimumAfterDays} days late: the minimum of ${usd(ftfMinimum('2026-04-15'))} (or the whole tax if less) applies.` : `${r.ftfMonths} month${r.ftfMonths === 1 ? '' : 's'} or part of a month, at most 5.`,
        rows: [
          ['Months counted', formatNumber(r.ftfMonths, 0)],
          ['Rate after the late payment offset', pct(r.ftfMonths ? r.ftf / Math.max(1, tax) : 0)],
          ['Late payment penalty for the same months', usd(r.ftp), r.ftp],
          ['Both penalties together', usd(r.ftf + r.ftp), r.ftf + r.ftp],
        ],
        note: 'Return due April 15, 2026 (2025 tax year). Interest is extra: see the full calculator.',
      };
    },
  }),

  /* Failure to pay alone: 0.5%, 0.25% under a plan, 1% after the levy notice. */
  ftp: (arg) => ({
    inputs: [
      MONEY('tax', 'Unpaid tax', Number(arg?.tax ?? 10000)),
      { id: 'mo', label: 'Months unpaid', def: Number(arg?.mo ?? 12), unit: 'months', max: 600 },
      { kind: 'select', id: 'rt', label: 'During those months', def: String(arg?.rt ?? 'std'), options: [{ value: 'std', label: `No plan (${pct(P.ftp.monthly)} a month)` }, { value: 'plan', label: `Payment plan, return on time (${pct(P.ftp.withPlan)})` }, { value: 'levy', label: `After a levy notice (${pct(P.ftp.afterLevyNotice)})` }] },
    ],
    run: (v) => {
      const tax = n(v, 'tax'), mo = Math.max(0, Math.round(n(v, 'mo')));
      const rate = s(v, 'rt') === 'plan' ? P.ftp.withPlan : s(v, 'rt') === 'levy' ? P.ftp.afterLevyNotice : P.ftp.monthly;
      const pen = Math.min(P.ftp.max * tax, rate * tax * mo);
      const capAt = Math.ceil(P.ftp.max / rate);
      return {
        label: 'Failure to pay penalty', value: usd(pen),
        sub: `${pct(rate, 2)} of the unpaid tax per month or part of a month; the ${pct(P.ftp.max)} ceiling is reached after ${capAt} months at this rate.`,
        rows: [['Months counted', formatNumber(mo, 0)], ['Share of the tax', pct(tax ? pen / tax : 0)], [`Ceiling (${pct(P.ftp.max)} of the tax)`, usd(P.ftp.max * tax)]],
        note: 'The penalty is figured on the tax still unpaid at the start of each month; partial payments lower it. Interest is extra.',
      };
    },
  }),

  /* Payment plan: monthly payment, total cost and the plan the IRS offers for the balance. */
  plan: (arg) => ({
    inputs: [
      MONEY('bal', 'Balance owed today', Number(arg?.bal ?? 15000), 'Tax, penalties and interest on your notice'),
      { kind: 'select', id: 'mo', label: 'Months to pay', def: String(arg?.mo ?? 36), options: [6, 12, 24, 36, 48, 60, 72, 84, 96, 120].map((m) => ({ value: String(m), label: m === 6 ? '6 (short-term, 180 days)' : `${m}` })) },
      { kind: 'select', id: 'how', label: 'How you pay', def: 'ddia', options: [{ value: 'ddia', label: 'Direct debit' }, { value: 'other', label: 'Card, check or Direct Pay' }] },
      { kind: 'choice', id: 'apply', label: 'Applied', def: 'online', options: [{ value: 'online', label: 'Online' }, { value: 'phone', label: 'Phone or mail' }] },
      { id: 'taxp', label: 'Part of the balance that is tax', def: Number(arg?.taxp ?? 85), unit: '%', max: 100, adv: true, help: 'Late payment penalty is figured on the tax only' },
      YES_NO('ot', 'Return filed on time', 'yes', true, `If yes, the late payment penalty drops to ${pct(P.ftp.withPlan)} a month in a long-term plan`),
      YES_NO('li', 'Low income (AGI at or under 250% of the poverty level)', 'no', true),
    ],
    run: (v) => {
      const bal = n(v, 'bal'), mo = Math.max(1, Number(v.mo) || 36), taxShare = Math.min(100, Math.max(0, n(v, 'taxp'))) / 100;
      const short = mo <= 6;
      const fee = short ? 0 : setupFee(s(v, 'how') === 'ddia', s(v, 'apply') === 'online', s(v, 'li') === 'yes');
      const base = { tax: bal * taxShare, penalties: bal * (1 - taxShare), interest: 0, ftpSoFar: 0, taxOriginal: bal * taxShare, start: TODAY, filedOnTime: s(v, 'ot') === 'yes', fee: 0 };
      const pay = paymentFor(base, mo);
      const r = runPlan({ ...base, monthly: pay, maxMonths: mo });
      const o = planOptions(bal, bal * taxShare);
      const kind = short ? (o.shortTerm ? 'Short-term plan, no set-up fee' : 'Over the short-term limit') : o.simple ? 'Simple Payment Plan, no financial statement' : 'Over the Simple Payment Plan limit: Form 433-F or 433-H needed';
      const terms = [6, 12, 24, 36, 72, 120].map((m) => { const p = paymentFor(base, m); const x = runPlan({ ...base, monthly: p, maxMonths: m }); return [`${m} months`, usd(p), usd(x.interest + x.ftp), usd(x.totalPaid + (m <= 6 ? 0 : fee))]; });
      return {
        label: `Monthly payment over ${mo} months`, value: usd(pay),
        sub: `${kind}. Ends ${monthYear(r.endDate)}; you pay ${usd(r.totalPaid + fee)} in all for ${usd(bal)} owed today.`,
        rows: [
          ['Interest while the plan runs', usd(r.interest), r.interest],
          [`Late payment penalty (${pct(base.filedOnTime && !short ? P.ftp.withPlan : P.ftp.monthly, 2)} a month)`, usd(r.ftp), r.ftp],
          ['Set-up fee', usd(fee), fee],
          ['Extra cost over today\'s balance', usd(r.interest + r.ftp + fee)],
        ],
        table: { caption: 'Same balance, other terms', headers: ['Term', 'Monthly', 'Interest and penalty', 'Total paid'], align: ['l', 'r', 'r', 'r'], rows: terms },
        note: `Fees in force on irs.gov on ${longDate(P.meta.retrieved_at)}. Interest at ${pct(P.interest.currentRate, 0)}, kept for future quarters. Estimate, not tax advice.`,
      };
    },
  }),

  /* Allowable living expenses and the remaining monthly income (CNC, plans over $50,000, offers). */
  expenses: (arg) => ({
    housing: true,
    inputs: [
      STATE(String(arg?.st ?? 'California')),
      COUNTY(String(arg?.co ?? 'Los Angeles County')),
      { id: 'hh', label: 'People in the household', def: Number(arg?.hh ?? 2), max: 20 },
      MONEY('inc', 'Gross monthly household income', Number(arg?.inc ?? 6800), 'Wages before tax, benefits, pensions, rent received'),
      MONEY('rent', 'Rent or mortgage and utilities paid', Number(arg?.rent ?? 2400), 'Monthly, with insurance, property tax, phone, internet', true),
      { id: 'cars', label: 'Vehicles', def: Number(arg?.cars ?? 1), max: 4, adv: true },
      MONEY('cp', 'Car loan or lease payments', 350, 'All vehicles, per month', true),
      MONEY('op', 'Car running costs', 300, 'Fuel, insurance, repairs, parking', true),
      MONEY('hi', 'Health insurance premiums', 250, undefined, true),
      MONEY('tx', 'Income tax and payroll tax withheld', Number(arg?.tx ?? 700), 'Current monthly taxes, all levels', true),
      MONEY('cc', 'Child care and court-ordered payments', 0, undefined, true),
      { id: 'o65', label: 'People aged 65 or over', def: 0, max: 20, adv: true },
    ],
    run: (v) => {
      const st = s(v, 'st'), co = firstCounty(st, s(v, 'co'));
      const a = allowable({ state: st, county: co, persons: n(v, 'hh'), over65: Math.min(n(v, 'o65'), n(v, 'hh')), cars: n(v, 'cars'), carPayment: n(v, 'cp'), operating: n(v, 'op'), housingActual: n(v, 'rent'), healthInsurance: n(v, 'hi'), taxes: n(v, 'tx'), childCare: n(v, 'cc'), courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
      const rmi = n(v, 'inc') - a.total;
      const loaded = housingLoaded(st);
      return {
        label: 'Allowable monthly expenses', value: usd(a.total),
        sub: rmi <= 0 ? `Income is ${usd(-rmi)} below the allowance: the IRS treats this as no ability to pay (currently not collectible territory).` : `Remaining monthly income: ${usd(rmi)}. That is the least the IRS expects as a payment when it asks for a financial statement.`,
        rows: [
          ['Food, clothing and other items', usd(a.national), a.national],
          [`Housing and utilities${a.housingStandard !== null ? ` (standard ${usd(a.housingStandard)})` : ''}`, usd(a.housing), a.housing],
          ['Vehicle ownership and operating', usd(a.ownership + a.operating + a.publicTransport), a.ownership + a.operating + a.publicTransport],
          ['Health care out of pocket and insurance', usd(a.health + a.healthInsurance), a.health + a.healthInsurance],
          ['Taxes, child care, court orders', usd(a.taxes + a.childCare), a.taxes + a.childCare],
        ],
        note: `${loaded ? `${co}, ${st}; car costs at the ${a.area} figure.` : 'County figures are loading.'} IRS Collection Financial Standards effective ${longDate(P.standards.effective)}.`,
      };
    },
  }),

  /* Offer in compromise: reasonable collection potential, lump sum and periodic. */
  oic: (arg) => ({
    housing: true,
    inputs: [
      MONEY('bal', 'Total owed to the IRS', Number(arg?.bal ?? 45000)),
      STATE(String(arg?.st ?? 'Texas')),
      COUNTY(String(arg?.co ?? 'Harris County')),
      { id: 'hh', label: 'People in the household', def: Number(arg?.hh ?? 3), max: 20 },
      MONEY('inc', 'Gross monthly household income', Number(arg?.inc ?? 7400)),
      MONEY('hv', 'Market value of your home', Number(arg?.hv ?? 0), 'Enter 0 if you rent'),
      MONEY('hl', 'Mortgage left on the home', Number(arg?.hl ?? 0), undefined, true),
      MONEY('rent', 'Rent or mortgage and utilities paid', 2100, 'Monthly', true),
      { id: 'cars', label: 'Vehicles', def: 1, max: 4, adv: true },
      MONEY('cp', 'Car loan or lease payments', 400, 'Per month', true),
      MONEY('op', 'Car running costs', 280, 'Per month', true),
      MONEY('hi', 'Health insurance premiums', 350, 'Per month', true),
      MONEY('tx', 'Current taxes withheld or paid', 650, 'Per month', true),
      MONEY('cc', 'Child care and court-ordered payments', 0, 'Per month', true),
      MONEY('bank', 'Cash and bank accounts', 2500, undefined, true),
      MONEY('ret', 'Retirement accounts (401(k), IRA)', 8000, undefined, true),
      MONEY('car', 'Value of the car', 14000, undefined, true),
      MONEY('carl', 'Loan left on the car', 7000, undefined, true),
      MONEY('val', 'Furniture, jewelry and other valuables', 6000, undefined, true),
    ],
    run: (v) => {
      const st = s(v, 'st'), co = firstCounty(st, s(v, 'co'));
      const a = allowable({ state: st, county: co, persons: n(v, 'hh'), over65: 0, cars: n(v, 'cars'), carPayment: n(v, 'cp'), operating: n(v, 'op'), housingActual: n(v, 'rent'), healthInsurance: n(v, 'hi'), taxes: n(v, 'tx'), childCare: n(v, 'cc'), courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
      const rmi = Math.max(0, n(v, 'inc') - a.total);
      const eq = assetEquity({ bank: n(v, 'bank'), investments: 0, retirement: n(v, 'ret'), retirementLoan: 0, lifeCash: 0, homeValue: n(v, 'hv'), homeLoan: n(v, 'hl'), carValue: n(v, 'car'), carLoan: n(v, 'carl'), car2Value: 0, car2Loan: 0, valuables: n(v, 'val'), joint: false });
      const r = rcp(eq.total, rmi);
      const bal = n(v, 'bal');
      const low = n(v, 'inc') * 12 <= lowIncomeLimit(n(v, 'hh'), st === 'Alaska' ? 'alaska' : st === 'Hawaii' ? 'hawaii' : 'base');
      const up = upfront(r.lumpSum, 'lump', 24, low);
      const verdict = r.lumpSum >= bal ? `The collection potential reaches the ${usd(bal)} owed: the IRS would expect full payment, usually through a plan.` : `About ${usd(bal - r.lumpSum)} less than the ${usd(bal)} owed${low ? ', and the household meets the Low-Income Certification (no fee, no payment with the offer)' : ''}.`;
      return {
        label: 'Minimum offer, lump sum (5 months)', value: usd(Math.max(r.lumpSum, 0)),
        sub: verdict,
        rows: [
          ['Equity in assets (quick-sale value, after allowances)', usd(eq.total), eq.total],
          [`Future income: ${usd(rmi)} a month × ${P.oic.multiplierLumpSum}`, usd(r.futureLump), r.futureLump],
          [`Periodic offer (6 to 24 months): × ${P.oic.multiplierPeriodic}`, usd(r.periodic), r.periodic],
          [`Due with a lump-sum offer: fee and ${pct(P.oic.lumpSumDeposit)}`, usd(up.fee + up.deposit)],
        ],
        note: `Form 433-A (OIC) Rev. ${P.oic.formRevision}; allowable expenses ${usd(a.total)} a month (${co}, ${st}). The IRS checks every figure; an offer below this amount is usually rejected. Not tax advice.`,
      };
    },
  }),

  /* Wage levy: what an employer must leave you each pay period in 2026. */
  levy: (arg) => ({
    inputs: [
      MONEY('pay', 'Take-home pay per pay period', Number(arg?.pay ?? 1800), 'After tax and deductions in force before the levy'),
      { kind: 'select', id: 'per', label: 'Paid', def: String(arg?.per ?? 'biweekly'), options: [{ value: 'weekly', label: 'Weekly' }, { value: 'biweekly', label: 'Every two weeks' }, { value: 'semimonthly', label: 'Twice a month' }, { value: 'monthly', label: 'Monthly' }, { value: 'daily', label: 'Daily' }] },
      { kind: 'select', id: 'fs', label: 'Filing status on the levy statement', def: String(arg?.fs ?? 'single'), options: [{ value: 'single', label: 'Single' }, { value: 'mfj', label: 'Married filing jointly' }, { value: 'hoh', label: 'Head of household' }, { value: 'mfs', label: 'Married filing separately' }] },
      { id: 'dep', label: 'Dependents claimed', def: Number(arg?.dep ?? 1), max: 20 },
      { id: 'add', label: 'Aged 65+ or blind (count each)', def: 0, max: 4, adv: true },
    ],
    run: (v) => {
      const r = levyTake(n(v, 'pay'), s(v, 'fs') as Status, s(v, 'per') as Period, n(v, 'dep'), n(v, 'add'));
      return {
        label: 'Sent to the IRS each pay period', value: usd(r.levied),
        sub: `You keep ${formatMoney(r.exempt, 2)} of each paycheck (Publication 1494, 2026 table); the levy takes the rest until it is released.`,
        rows: [['Exempt amount', formatMoney(r.exempt, 2), r.exempt], ['Levied', usd(r.levied), r.levied], ['Share of the paycheck levied', pct(n(v, 'pay') ? r.levied / n(v, 'pay') : 0)]],
        note: 'Child support ordered before the levy is also left to you. A payment plan or hardship status is the usual way to have a levy released.',
      };
    },
  }),

  /* Penalty relief: First Time Abate, the 2026 automatic exemption, or reasonable cause. */
  relief: (arg) => ({
    inputs: [
      { kind: 'select', id: 'ty', label: 'Tax year with the penalty', def: String(arg?.ty ?? 2024), options: TAX_YEARS.map((y) => ({ value: String(y), label: String(y) })) },
      YES_NO('h3', 'Returns of the 3 prior years filed on time', 'yes'),
      { kind: 'select', id: 'pp', label: 'Penalties in those 3 years', def: 'none', options: [{ value: 'none', label: 'None (or only an estimated tax penalty)' }, { value: 'abated', label: 'One, later removed for reasonable cause' }, { value: 'yes', label: 'Yes, and it stood' }] },
      MONEY('pen', 'Failure to file and to pay penalties charged', Number(arg?.pen ?? 1400)),
      { id: 'mo', label: 'Months since the penalties were charged', def: 12, unit: 'months', max: 120, adv: true },
    ],
    run: (v) => {
      const ty = Number(v.ty), clean = s(v, 'h3') === 'yes' && s(v, 'pp') !== 'yes';
      const pen = n(v, 'pen');
      const int = interestOn(pen, addMonths(TODAY, -Math.round(n(v, 'mo'))), TODAY);
      const aep = ty >= P.aep.firstTaxYear;
      const label = !clean ? 'Reasonable cause only' : aep ? 'Automatic Exemption from Penalty' : 'First Time Abate, on request';
      return {
        label: 'Relief that fits', value: label,
        sub: !clean ? 'Without three clean prior years, First Time Abate is out; a written reasonable cause request (illness, disaster, records lost) is the route.' : aep ? `For ${ty} returns the IRS does not assess the penalty at all when the 3 prior years are clean; check the notice.` : 'Call the number on the notice or file Form 843; no document is needed for First Time Abate.',
        rows: [['Penalties that would go', clean ? usd(pen) : usd(0), clean ? pen : 0], ['Interest on them, removed with them', clean ? usd(int) : usd(0), clean ? int : 0], ['Interest on the tax itself', 'stays']],
        note: 'The tax and the interest on the tax are never abated by First Time Abate. Estimate, not tax advice.',
      };
    },
  }),

  /* CP2000: proposed tax, 20% accuracy penalty test, interest from the due date. */
  cp2000: (arg) => ({
    inputs: [
      MONEY('add', 'Additional tax proposed on the CP2000', Number(arg?.add ?? 3200)),
      MONEY('shown', 'Tax shown on your original return', Number(arg?.shown ?? 9000)),
      TAX_YEAR(Number(arg?.ty ?? 2024)),
      PAYOFF(1),
    ],
    run: (v) => {
      const add = n(v, 'add'), correct = n(v, 'shown') + add, due = DUE_DATES[Number(v.ty)] ?? DUE_DATES[2024];
      const until = addMonths(TODAY, Math.round(n(v, 'pm')));
      const substantial = add > Math.max(P.cp2000.understatementShare * correct, P.cp2000.understatementFloor);
      const acc = substantial ? add * P.cp2000.accuracyPenalty : 0;
      const int = interestOn(add, due, until) + (acc ? interestOn(acc, due, until) : 0);
      return {
        label: `Owed if you agree, paid ${monthYear(until)}`, value: usd(add + acc + int),
        sub: substantial ? `The understatement is over both ${pct(P.cp2000.understatementShare)} of the correct tax and ${usd(P.cp2000.understatementFloor)}, so a ${pct(P.cp2000.accuracyPenalty)} accuracy penalty is likely to be proposed.` : `Under the substantial understatement test (more than ${pct(P.cp2000.understatementShare)} of the correct tax and more than ${usd(P.cp2000.understatementFloor)}), so no accuracy penalty on that ground.`,
        rows: [['Additional tax', usd(add), add], [`Accuracy-related penalty (${pct(P.cp2000.accuracyPenalty)})`, usd(acc), acc], [`Interest since ${longDate(due)}`, usd(int), int]],
        note: 'A CP2000 is a proposal, not a bill: you can agree, partly agree or disagree with documents by the response date. Negligence can also trigger the penalty below the threshold.',
      };
    },
  }),

  /* Passport certification: seriously delinquent tax debt over the yearly threshold. */
  passport: (arg) => ({
    inputs: [
      MONEY('bal', 'Total assessed: tax, penalties and interest', Number(arg?.bal ?? 70000)),
      { kind: 'select', id: 'stt', label: 'Status of the debt', def: 'none', options: [{ value: 'none', label: 'Nothing arranged' }, { value: 'plan', label: 'Payment plan, paid on time' }, { value: 'pending', label: 'Plan or offer request pending' }, { value: 'oic', label: 'Offer accepted, being paid' }, { value: 'cnc', label: 'Currently not collectible' }] },
      YES_NO('lien', 'Lien filed or levy issued', 'yes'),
    ],
    run: (v) => {
      const th = (P.passport as Record<string, number>)['2026'];
      const over = n(v, 'bal') > th, prot = s(v, 'stt') !== 'none', enf = s(v, 'lien') === 'yes';
      const cert = over && !prot && enf;
      return {
        label: 'Certified to the State Department?', value: cert ? 'Likely' : 'No',
        sub: !over ? `${usd(th - n(v, 'bal'))} under the ${usd(th)} threshold of 2026.` : prot ? 'Over the threshold, but the arrangement in place excludes the debt from certification.' : enf ? 'Over the threshold with a lien or levy and nothing arranged: the IRS can certify and the State Department can deny or revoke the passport.' : 'Over the threshold, but a lien with appeal rights exhausted or a levy is also required.',
        rows: [['Threshold for 2026', usd(th)], ['Your balance', usd(n(v, 'bal')), n(v, 'bal')], ['Gap', usd(n(v, 'bal') - th)]],
        note: 'IRC 7345; threshold adjusted for inflation each year. Payment plans, accepted offers, hardship status and pending requests exclude the debt.',
      };
    },
  }),

  /* Several unfiled years at once: what each year has become. */
  years: (arg) => ({
    inputs: [
      MONEY('y25', 'Unpaid tax for 2025', Number(arg?.y25 ?? 6000)),
      MONEY('y24', 'Unpaid tax for 2024', Number(arg?.y24 ?? 5500)),
      MONEY('y23', 'Unpaid tax for 2023', Number(arg?.y23 ?? 5000)),
      MONEY('y22', 'Unpaid tax for 2022', Number(arg?.y22 ?? 0), undefined, true),
      MONEY('y21', 'Unpaid tax for 2021', Number(arg?.y21 ?? 0), undefined, true),
      { kind: 'choice', id: 'fl', label: 'Returns', def: String(arg?.fl ?? 'nf'), options: [{ value: 'nf', label: 'Not filed' }, { value: 'f', label: 'Filed on time' }] },
    ],
    run: (v) => {
      const ys = [2025, 2024, 2023, 2022, 2021].map((y) => ({ y, tax: n(v, `y${String(y).slice(2)}`) })).filter((x) => x.tax > 0);
      const res = ys.map((x) => ({ ...x, r: projectDebt({ tax: x.tax, due: DUE_DATES[x.y], filed: s(v, 'fl') === 'f' ? DUE_DATES[x.y] : null, until: TODAY }) }));
      const tot = res.reduce((a, x) => a + x.r.total, 0), taxes = res.reduce((a, x) => a + x.tax, 0);
      return {
        label: `All years, as of ${longDate(TODAY)}`, value: usd(tot),
        sub: `${usd(tot - taxes)} of penalties and interest on ${usd(taxes)} of tax.`,
        rows: res.map((x) => [`${x.y}: tax ${usd(x.tax)}`, usd(x.r.total), x.r.total] as [string, string, number]),
        table: { headers: ['Year', 'Late filing', 'Late payment', 'Interest', 'Total'], align: ['l', 'r', 'r', 'r', 'r'], rows: res.map((x) => [String(x.y), usd(x.r.ftf), usd(x.r.ftp), usd(x.r.interest), usd(x.r.total)]) },
        note: 'Each year runs from its own due date. An unfiled year can also be filed by the IRS itself (substitute for return), usually with a higher tax. Not tax advice.',
      };
    },
  }),

  /* What resolving it yourself costs against a resolution firm's quoted fee. */
  diy: (arg) => ({
    inputs: [
      MONEY('bal', 'Balance owed', Number(arg?.bal ?? 25000)),
      MONEY('cap', 'What you can pay each month', Number(arg?.cap ?? 600)),
      MONEY('fee', 'Fee a firm quoted you', Number(arg?.fee ?? 0), 'Type the quote you received, if any'),
    ],
    run: (v) => {
      const bal = n(v, 'bal'), cap = Math.max(1, n(v, 'cap')), fee = n(v, 'fee');
      const f = setupFee(true, true, false);
      const base = { tax: bal * 0.85, penalties: bal * 0.15, interest: 0, ftpSoFar: 0, taxOriginal: bal * 0.85, start: TODAY, filedOnTime: true, fee: 0 };
      const r = runPlan({ ...base, monthly: cap, maxMonths: 120 });
      const firmDelay = fee > 0 ? Math.ceil(fee / cap) : 0;
      return {
        label: 'Paying the IRS directly, online', value: r.paid ? `${r.months} months` : 'Over 10 years',
        sub: r.paid ? `${usd(cap)} a month clears ${usd(bal)} by ${monthYear(r.endDate)}, for ${usd(r.interest + r.ftp + f)} of interest, penalty and set-up fee.` : `${usd(cap)} a month does not clear the balance within 10 years: a partial-pay plan, hardship status or an offer is the question.`,
        rows: [['Set-up fee, direct debit online', usd(f), f], ['Interest and penalty over the plan', usd(r.interest + r.ftp), r.interest + r.ftp], ...(fee > 0 ? [[`Quoted fee, ${firmDelay} months of your payment`, usd(fee), fee] as [string, string, number]] : [])],
        note: 'Asking the IRS for a plan costs only the set-up fee shown. The Taxpayer Advocate Service is free, and Low Income Taxpayer Clinics help for free or a small fee.',
      };
    },
  }),
};

export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown calculator: ${kind}`);
  const spec = f(arg);
  // Every field takes the page's preset when one is given (toolArg, mini `d`), not only those that read `arg`.
  if (arg) spec.inputs = spec.inputs.map((i) => (i.id in arg ? ({ ...i, def: (i.kind === 'choice' || i.kind === 'select' ? String(arg[i.id]) : Number(arg[i.id])) } as Input) : i));
  return spec;
}
export const TOOL_KINDS = Object.keys(SPECS);
