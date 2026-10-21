/** Home page text. Every figure comes from the kit (src/lib/kit.ts). */
import type { FAQ, Helpers } from '../lib/page-types';
import { KIT as K } from '../lib/kit';

const P = K.P;
const due25 = K.DUE_DATES[2025];
// Worked case: $12,000 of 2025 tax, return filed on time, nothing paid, counted to the build day.
const tax = 12000;
const onTime = K.debt(tax, K.today, 0);
const notFiled = K.debt(tax, K.today, null);
const fee = P.plans.fees;
// The same balance cleared four ways, from the build day.
const bal = 20000;
const routes = [6, 36, 120].map((m) => ({ m, ...K.plan(bal, m) }));
const lastQuarters = Object.keys(P.interest.rates).sort().slice(-8);

export const HOME = {
  title: 'IRS Tax Debt Calculator 2026: Penalties, Plans and Offers',
  description: `IRS tax debt calculator 2026: late filing and late payment penalties, daily interest at ${K.rate(P.interest.current)}, payment plan cost and the minimum offer, with no name or phone.`,
  h1: 'What your IRS balance costs, and the ways to pay it',
  intro: 'Enter the tax you owe and when the return was filed. The calculator adds the penalties of the tax code and the interest the IRS charges each day, now and on the day you plan to pay. No name, no phone number, nothing is sent anywhere.',
  resume: `An unpaid federal tax balance grows from three sources. The failure to file penalty is ${K.pct(P.ftf.monthly)} of the unpaid tax for each month or part of a month the return is late, capped at ${K.pct(P.ftf.max)}, with a minimum of ${K.usd(K.ftfMinimum(due25))} (or the whole tax if smaller) for a 2025 return filed more than ${P.ftf.minimumAfterDays} days late. The failure to pay penalty is ${K.pct(P.ftp.monthly)} a month, cut to ${K.pct(P.ftp.withPlan)} while an installment agreement runs and raised to ${K.pct(P.ftp.afterLevyNotice)} after a final notice of intent to levy, capped at ${K.pct(P.ftp.max)}. Interest is the federal short-term rate plus 3 points, ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}, compounded every day on the tax and the penalties. On ${K.usd(tax)} of 2025 tax, filed on time and still unpaid on ${K.day(K.today)}, that is ${K.usd(onTime.total)}; had the return not been filed at all, ${K.usd(notFiled.total)}. A Simple Payment Plan, with no financial statement and up to ${P.plans.csedYears} years to pay for most people, is open online for balances up to ${K.usd(P.plans.simpleMax)}, for a set-up fee of ${K.usd(fee.ddiaOnline)} by direct debit.`,
  asOf: P.meta.retrieved_at,
  bal,
  /** Four ways to clear the same balance, from the calculator's engine. */
  routes: () => [
    ['Pay in full now', K.usd(bal), K.usd(0), 'Direct Pay, debit or credit card, check'],
    ...routes.map((r) => [
      r.m <= 6 ? `Short-term plan, ${r.m} months` : `Long-term plan, ${r.m} months`,
      `${K.usd(r.monthly)} a month`,
      K.usd(r.interest + r.ftp + (r.m <= 6 ? 0 : fee.ddiaOnline)),
      r.m <= 6 ? `Up to ${P.plans.shortTermDays} days, balance under ${K.usd(P.plans.shortTermMax)}, no fee` : `Online, direct debit, set-up fee ${K.usd(fee.ddiaOnline)}`,
    ]),
  ],
  rates: () => lastQuarters.map((q) => [K.quarter(q).replace(/^./, (c) => c.toUpperCase()), K.rate(q)]),
  notices: [
    ['CP14', 'First bill: balance due, with penalties and interest to date. Pay or set up a plan by the date printed.'],
    ['CP501, CP503', 'Reminders that the balance is still open; interest and the late payment penalty keep running.'],
    ['CP504', `Notice of intent to levy state tax refunds and other property. Ten days after it, the late payment penalty moves to ${K.pct(P.ftp.afterLevyNotice)} a month.`],
    ['LT11 or Letter 1058', 'Final notice of intent to levy and your right to a Collection Due Process hearing, to request within 30 days.'],
    ['Lien, levy, passport', `A Notice of Federal Tax Lien can be filed; wages and bank accounts can be levied; above ${K.usd((P.passport as Record<string, number>)['2026'])} the debt can be certified to the State Department.`],
  ],
  why: (h: Helpers) => `
<h2>Why the balance on your notice is not the amount you will pay</h2>
<p>A notice shows the balance on the day it was printed. The IRS keeps adding interest every day, at the rate of each quarter, and the late payment penalty at the start of each month, until the day the last dollar is received. The ${h.src('interest', 'interest page of the IRS')} says it plainly: interest is charged on the tax, on penalties and on interest already charged, compounded daily. The rate has moved between ${K.rate('2021-Q3')} in 2021 and ${K.rate('2024-Q1')} in 2024; it is ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}, and the rate for the first quarter of 2027 is ${P.interest.nextQuarter.expected}.</p>
<p>The penalties come from ${h.src('irc6651', 'section 6651 of the Internal Revenue Code')}. Filing late costs ten times more than paying late: ${K.pct(P.ftf.monthly)} a month against ${K.pct(P.ftp.monthly)}. In a month when both apply, the late filing penalty is reduced by the late payment penalty, so the pair costs ${K.pct(P.ftf.monthly)} a month for five months, then ${K.pct(P.ftp.monthly)} alone. That is why filing the return on time, even without the money, is the cheapest thing a person who cannot pay can do; the ${h.a('failure-to-file-penalty', 'late filing penalty page')} has the arithmetic.</p>
<p>Relief exists and costs nothing to ask for. For 2025 returns and later, the IRS applies an ${h.src('fta', 'Automatic Exemption from Penalty')} from summer 2026 to people with three clean prior years; for earlier years First Time Abate is granted on a phone call. Interest on the tax is never waived. The ${h.a('first-time-penalty-abatement', 'penalty relief calculator')} shows which route fits and what would go.</p>
`,
  sections: (h: Helpers) => [
    { title: 'What the calculator assumes', html: `<p>The tax entered is the tax shown on the return, minus withholding, estimated payments and credits, that was not paid by the original due date. The calculator applies the late filing penalty from that due date (or from October 15 with a valid extension), the late payment penalty from the due date, the minimum late filing penalty for returns more than ${P.ftf.minimumAfterDays} days late, the ${K.pct(P.ftp.max)} caps, and interest at each quarter's underpayment rate, compounded daily, on the tax and the penalties. Payments made after the due date, the estimated tax penalty and accuracy penalties are not in this calculator; the ${h.a('method', 'method page')} lists each rule and its source.</p>` },
    { title: 'Payment plans, offers and hardship: which one when', html: `<p>If the balance can be paid within ${P.plans.shortTermDays} days, a short-term plan costs no fee. If it can be paid over time, a Simple Payment Plan is set up online for balances up to ${K.usd(P.plans.simpleMax)} with no financial statement, and most people get up to ${P.plans.csedYears} years (${h.a('irs-payment-plan', 'payment plan calculator')}). Above that, or when the monthly payment the IRS would require is out of reach, the IRS measures what you can pay against its ${h.a('irs-collection-financial-standards', 'Collection Financial Standards')}: what is left becomes the payment, an ${h.a('offer-in-compromise', 'offer in compromise')} if the total could never be collected, or ${h.a('currently-not-collectible', 'currently not collectible')} status if nothing is left.</p>` },
    { title: 'Why there is no form on this site', html: `<p>The pages that rank for tax debt are mostly built to collect a name and a phone number for a resolution firm. Everything a firm would compute in a "free consultation" is here: the penalties, the interest, the plan, the allowable expenses of your county and the minimum offer. The IRS itself offers every one of these routes without a representative, and the ${h.src('tas', 'Taxpayer Advocate Service')} helps for free when a case is stuck. The ${h.a('tax-relief-companies', 'page on tax relief companies')} explains what they can and cannot do.</p>` },
  ],
  faqs: [
    { q: 'How much does the IRS charge per month on unpaid taxes?', a: `For a return filed on time, ${K.pct(P.ftp.monthly)} of the unpaid tax a month as a late payment penalty, plus interest at ${K.rate(P.interest.current)} a year compounded daily, which is a little over half a percent a month. If the return was also late, add ${K.pct(P.ftf.monthly - P.ftp.monthly)} a month for up to five months. The penalty drops to ${K.pct(P.ftp.withPlan)} under a long-term installment agreement.` },
    { q: 'Can I set up an IRS payment plan without calling anyone?', a: `Yes, online, if you owe ${K.usd(P.plans.simpleMax)} or less in tax, penalties and interest and have filed all required returns. Most people can take up to ${P.plans.csedYears} years, and the set-up fee is ${K.usd(fee.ddiaOnline)} with direct debit or ${K.usd(fee.otherOnline)} with other payments. A short-term plan of up to ${P.plans.shortTermDays} days has no set-up fee for balances under ${K.usd(P.plans.shortTermMax)}.` },
    { q: 'Does the IRS forgive tax debt after 10 years?', a: `The IRS generally has ${P.plans.csedYears} years from the assessment date to collect a tax, under section 6502. When that collection statute expiration date passes, the remaining balance can no longer be collected. The period is suspended while an offer is pending, during bankruptcy and in some other cases, so the date can be later than ten years after the assessment.` },
    { q: 'What is the least the IRS will accept in an offer in compromise?', a: `Usually the reasonable collection potential: the quick-sale equity in your assets, minus the allowances of Form 433-A (OIC), plus ${P.oic.multiplierLumpSum} months of the income left after allowable expenses for a lump-sum offer, or ${P.oic.multiplierPeriodic} months for a periodic offer. The offer calculator applies your county's standards to compute it.` },
    { q: 'Should I file my return even if I cannot pay the balance?', a: `Filing on time removes the larger of the two penalties. The late filing penalty is ${K.pct(P.ftf.monthly)} of the unpaid tax a month, ten times the late payment penalty of ${K.pct(P.ftp.monthly)}, and a return more than ${P.ftf.minimumAfterDays} days late carries a minimum of ${K.usd(K.ftfMinimum(due25))} or the whole tax. A return filed on time also halves the late payment penalty once a payment plan is approved.` },
    { q: 'Is anything sent to a tax firm when I use the calculator?', a: 'No. The calculator runs in your browser and asks for no name, phone number or e-mail. There is no form on the site and no partner firm. The pages link only to the IRS, the tax code and official sources, and the figures you type stay on your device unless you copy a share link yourself.' },
  ] as FAQ[],
  sources: ['irc6651', 'interest', 'rates', 'plans', 'oic', 'cfs', 'fta', 'cnc', 'tas'],
};
