import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.plans, F = L.fees;
const bal = L.simpleMax;
const terms = [24, 48, 72, 96, 120].map((m) => ({ m, r: K.plan(bal, m) }));
const t48 = terms[1].r, t120 = terms[4].r;
/** Days for daily compounding at the current rate to carry a balance from `b` over the limit. */
const below = 49600;
const daysToCross = Math.ceil(Math.log(bal / below) / Math.log(1 + P.interest.currentRate / 365));
const over = 53400;
const short = K.plan(bal, 6);
const passport = (P.passport as Record<string, number>)['2026'];

export default defineGuide({
  id: 'owe-irs-50000',
  group: 'plans',
  order: 260,
  slug: 'owe-irs-50000',
  nav: `Owe the IRS ${K.usd(bal)}`,
  card: 'The Simple Payment Plan limit to the dollar, and what happens one dollar above it',
  title: `Owe IRS ${K.usd(bal)} in 2026: At the Simple Payment Plan Limit`,
  description: `Owe the IRS ${K.usd(bal)} in 2026: the exact Simple Payment Plan limit, payments over up to ${L.csedYears} years, and what one dollar more changes: Form 433-F, IRS standards.`,
  h1: `Owing the IRS ${K.usd(bal)}: on the edge of the simple plan`,
  intro: `The calculator starts at ${K.usd(bal)} over 72 months. Move the balance a little above or below and watch the plan type in the result: it changes at exactly ${K.usd(L.simpleMax)}.`,
  facts: [['Simple Payment Plan limit', K.usd(L.simpleMax)], ['Longest term for most people', `${L.csedYears} years`], ['Above the limit', 'Form 433-F or 433-H'], ['Passport threshold, 2026', K.usd(passport)]],
  resume: `${K.usd(L.simpleMax)} is the exact ceiling of the IRS Simple Payment Plan for individuals: ${K.usd(L.simpleMax)} or less in assessed tax, penalties and interest, all returns filed, and the plan is granted online with no financial statement and no lien determination, for up to ${L.csedYears} years for most people. One dollar more and the request leaves that track. The IRS then asks for a collection information statement, Form 433-F or 433-H, and measures the payment against its living expense standards. Because the limit counts penalties and interest, a balance can cross it by itself: at ${K.rate(P.interest.current)}, ${K.usd(below)} passes ${K.usd(L.simpleMax)} in about ${daysToCross} days. At the limit, a 48-month plan costs ${K.usd(t48.monthly)} a month and adds ${K.usd(t48.interest + t48.ftp)}; the full ${L.csedYears} years lowers the payment to ${K.usd(t120.monthly)} but adds ${K.usd(t120.interest + t120.ftp)}.`,
  body: (h) => `
<h2>The line at ${K.usd(L.simpleMax)}, counted to the dollar</h2>
<p>The ${h.src('simple', 'IRS Simple Payment Plan page')} states the individual test in one line: ${K.usd(L.simpleMax)} or less in assessed taxes, penalties and interest, and current with all filing and payment requirements. The IRS writes that the large majority of individual taxpayers qualify. Inside the line, the plan needs no collection information statement, no lien determination and no trust fund recovery penalty determination, and it is offered online or by an IRS or private collection agency employee. The same ${K.usd(L.onlineLongTermMax)} figure is also the ceiling for applying online for a long-term plan.</p>
<p>The test uses the assessed balance, all years together. Someone with ${K.usd(30000)} owed for one year and ${K.usd(20000)} for another stands exactly at the limit, and a few days of interest later is over it.</p>
<h2>A balance that crosses the line by itself</h2>
<p>Interest is added every day and the late payment penalty every month, so a balance close to the limit does not stay put. At the ${K.rate(P.interest.current)} rate of the ${K.quarter(P.interest.current)}, interest alone carries ${K.usd(below)} past ${K.usd(L.simpleMax)} in about ${daysToCross} days, and the monthly penalty makes it sooner. Anyone near the line who wants the simple track has a reason to apply early, or to pay a little first.</p>
${h.table(['Term', 'Monthly payment', 'Interest', 'Late payment penalty', 'Fee, direct debit online'], terms.map((x) => [`${x.m} months`, K.usd(x.r.monthly), K.usd(x.r.interest), K.usd(x.r.ftp), K.usd(F.ddiaOnline)]), `${K.usd(bal)} of tax, return filed on time, interest at ${K.rate(P.interest.current)} carried forward`, ['l', 'r', 'r', 'r', 'r'])}
${h.mini('plan', { t: 'Your balance near the limit', p: ['bal', 'mo'], d: { bal: 47500, mo: '84' } })}
<h2>Just above the line: paying down or filing a statement</h2>
<p>Take ${K.usd(over)}. There are two ways forward. The first is to pay ${K.usd(over - L.simpleMax)} or a little more before applying, so the balance is back at or under ${K.usd(L.simpleMax)} and the online Simple Payment Plan is open again, with its ${K.usd(F.ddiaOnline)} direct debit fee. The second is to apply above the limit, by phone, mail or in person, with ${h.src('f433f', 'Form 433-F')}. That form lists income, bank balances, assets and monthly expenses. The IRS compares the expenses with the ${h.a('irs-collection-financial-standards', 'Collection Financial Standards')}, and the income left over sets the payment it expects. The fee on that route is ${K.usd(F.ddiaOther)} with direct debit and ${K.usd(F.otherOther)} without.</p>
<p>The statement route is not a penalty in itself, but it opens questions the simple plan does not ask: the equity in a house or a car, the balance in a retirement account, whether a lien should be filed. The ${h.a('owe-irs-100000', 'page on six-figure balances')} walks through that test with a county budget.</p>
<h2>Ten years is allowed, but it is expensive</h2>
<p>The Simple Payment Plan lets most people take up to ${L.csedYears} years. At the limit, the gap between a 48-month and a ${L.csedYears * 12}-month plan is ${K.usd(t48.monthly - t120.monthly)} a month in payment and ${K.usd(t120.interest + t120.ftp - t48.interest - t48.ftp)} in total cost. The IRS page says it directly: the longer the term, the more interest and penalties you owe. A plan can always be paid off early without penalty, so a longer term with extra payments when money comes in is one way to keep the required payment low without paying the full cost of the long term.</p>
<h2>What a lapse costs at this size</h2>
<p>At ${K.usd(bal)}, the reduced plan rate of the late payment penalty is worth real money. While an approved plan runs and the return was filed on time, the penalty is ${K.pct(P.ftp.withPlan)} a month of the unpaid tax, ${K.usd(bal * P.ftp.withPlan)} in the first month on this balance. If the plan ends through default, the rate goes back to ${K.pct(P.ftp.monthly)}, or ${K.usd(bal * P.ftp.monthly)} a month, and to ${K.pct(P.ftp.afterLevyNotice)} after a notice of intent to levy. A plan that has to be requested again from above the limit also goes through the financial statement, so keeping the first one alive is worth more here than on a small balance.</p>
<h2>What the limit does not change</h2>
<p>The short-term plan works at this size too, for balances under ${K.usd(L.shortTermMax)}, but clearing ${K.usd(bal)} in six months takes ${K.usd(short.monthly)} a month. Passport certification needs more than ${K.usd(passport)} of seriously delinquent debt in 2026, so a balance at the limit is below it, though interest can close the gap over a few years if nothing is arranged. And the collection period remains ${L.csedYears} years from each assessment, as described on the ${h.src('csed', 'IRS collection statute page')}. The IRS decides on every plan; these figures are estimates.</p>
`,
  faqs: [
    { q: `Is the ${K.usd(L.simpleMax)} Simple Payment Plan limit counted before or after penalties and interest?`, a: `After. The test is ${K.usd(L.simpleMax)} or less in assessed tax, penalties and interest combined, for all years owed. Because interest is added daily and the late payment penalty monthly, a balance just under the limit can cross it within weeks. At ${K.rate(P.interest.current)}, ${K.usd(below)} passes the limit in about ${daysToCross} days from interest alone.` },
    { q: `What is the monthly payment on ${K.usd(bal)} owed to the IRS over ${L.csedYears} years?`, a: `About ${K.usd(t120.monthly)} a month if the balance is all tax, the return was filed on time and the rate stays at ${K.rate(P.interest.current)}. Over the ${L.csedYears * 12} months the plan adds ${K.usd(t120.interest + t120.ftp)} of interest and penalty, plus the set-up fee, ${K.usd(F.ddiaOnline)} with direct debit online.` },
    { q: `What if I owe the IRS a little more than ${K.usd(L.simpleMax)}?`, a: `Either pay the excess first, so the balance falls back to ${K.usd(L.simpleMax)} or less and the online Simple Payment Plan applies, or request a plan by phone, mail or in person with Form 433-F or 433-H. On that second route the IRS reviews income, assets and expenses against its standards, and the set-up fee starts at ${K.usd(F.ddiaOther)}.` },
  ],
  tool: 'plan',
  toolArg: { bal, mo: '72' },
  related: ['irs-installment-agreement', 'owe-irs-10000', 'owe-irs-100000', 'irs-collection-financial-standards', 'irs-payment-plan-fees'],
  sources: ['simple', 'plans', 'f433f', 'csed'],
});
