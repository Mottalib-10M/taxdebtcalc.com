import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, PL = P.plans, F = PL.fees, O = P.oic;
// A $31,000 balance, three monthly budgets, paid to the IRS directly with an online direct debit plan.
const bal = 31000;
const caps = [540, 720, 960];
const runs = caps.map((cap) => { const r = K.tool('diy', { bal, cap }); return { cap, value: r.value, cost: Number(r.rows[1][2]) + Number(r.rows[0][2]), sub: r.sub }; });
const mid = runs[1];

export default defineGuide({
  id: 'tax-debt-relief',
  group: 'settle',
  order: 370,
  slug: 'tax-debt-relief',
  nav: 'Tax debt relief',
  card: 'Every relief route the IRS offers directly, what it costs to ask, and what it changes',
  title: 'Tax Debt Relief 2026: Every IRS Option and What It Costs',
  description: `Tax debt relief 2026 straight from the IRS: payment plans from ${K.usd(F.ddiaOnline)}, offers in compromise for ${K.usd(O.fee)}, hardship status and penalty relief for ${K.usd(0)}, no firm needed.`,
  h1: 'Tax debt relief: what the IRS offers without an intermediary',
  intro: 'Type the balance and what you can pay each month. The calculator shows how long a direct plan with the IRS takes and what it adds in interest, penalty and fee, the baseline any paid service should be compared with.',
  facts: [['Online plan with direct debit', K.usd(F.ddiaOnline)], ['Offer in compromise application', K.usd(O.fee)], ['Hardship status or penalty relief request', K.usd(0)], ['Taxpayer Advocate Service', 'free']],
  resume: `Tax debt relief is not a product the IRS sells through anyone; it is a short list of options the IRS grants directly to the taxpayer who asks. Paying in full within ${PL.shortTermDays} days through a short-term plan costs no set-up fee on balances under ${K.usd(PL.shortTermMax)}. A long-term plan costs ${K.usd(F.ddiaOnline)} online with direct debit, up to ${K.usd(F.otherOther)} by phone or mail, and is waived or reduced for low incomes. An offer in compromise, which settles for less than the balance when the reasonable collection potential is lower, costs ${K.usd(O.fee)} plus a first payment. Currently not collectible status, which pauses collection during hardship, and penalty relief such as First Time Abate cost nothing to request. All of them require filed returns. The Taxpayer Advocate Service is free, and Low Income Taxpayer Clinics work for free or a small fee. On ${K.usd(bal)}, paying ${K.usd(mid.cap)} a month directly to the IRS takes ${mid.value} and adds ${K.usd(mid.cost)} in interest, penalty and set-up fee.`,
  body: (h) => `
<h2>The full menu, as the IRS lists it</h2>
<p>The ${h.src('taxdebt', 'IRS page on help with tax debt')} names five routes: make a payment, a payment plan, an offer in compromise, a delay in collection and penalty relief, plus relief for spouses, disaster areas, military deployment and identity theft. The table puts a cost and an effect on each.</p>
${h.table(['Option', 'Who it fits', 'Cost to ask', 'What it changes'], [
    ['Pay in full now', 'anyone who can', K.usd(0), 'stops interest and penalties the day the balance is paid'],
    ['Short-term plan', `can pay within ${PL.shortTermDays} days, owes under ${K.usd(PL.shortTermMax)}`, K.usd(0), 'more time; interest and penalty keep running'],
    ['Simple Payment Plan', `owes ${K.usd(PL.simpleMax)} or less, returns filed`, `${K.usd(F.ddiaOnline)} to ${K.usd(F.otherOther)}`, `monthly payments; late payment penalty drops to ${K.pct(P.ftp.withPlan)} a month if the return was on time`],
    ['Larger installment agreement', `owes more than ${K.usd(PL.simpleMax)}`, `${K.usd(F.ddiaOnline)} to ${K.usd(F.otherOther)}`, 'payment set from income and allowable expenses'],
    ['Partial payment agreement', 'cannot pay in full before the collection period ends', 'same fees', 'monthly payments; the rest expires with the collection period'],
    ['Offer in compromise', 'collection potential below the debt', `${K.usd(O.fee)} + first payment, waived for low income`, 'settles for less once paid'],
    ['Currently not collectible', 'income below allowable expenses', K.usd(0), 'collection paused; debt and interest remain'],
    ['First Time Abate, Automatic Exemption, reasonable cause', 'clean history or a documented reason', K.usd(0), 'removes penalties and their interest, never the tax'],
  ], `Fees and limits read on irs.gov on ${K.day(P.meta.retrieved_at)}`, ['l', 'l', 'l', 'l'])}
<h2>One step before any of them</h2>
<p>The IRS writes that most payment plans and relief options require all tax returns to be filed, that the first step toward resolving a debt is to file missing returns, and that more options open once they are filed. A return can be filed without paying the balance. Someone with ${h.a('unfiled-tax-returns', 'years still unfiled')} is outside most of the table until those returns are in, and a year the IRS has filed itself through a substitute for return usually shows more tax than the person's own return would.</p>
<h2>A ${K.usd(bal)} balance paid directly</h2>
<p>The calculator above starts from a balance of ${K.usd(bal)} and an online direct debit plan, the cheapest way to set one up. The table shows how the monthly budget changes the length and the cost. Interest is figured daily at the ${K.rate(P.interest.current)} rate of the ${K.quarter(P.interest.current)}, carried forward, and the penalty at the reduced plan rate.</p>
${h.table(['Monthly payment', 'Time to clear', 'Interest, penalty and set-up fee'], runs.map((r) => [K.usd(r.cap), r.value, K.usd(r.cost)]), `${K.usd(bal)} owed, return filed on time, direct debit plan applied online`, ['r', 'l', 'r'])}
<p>Raising the payment from ${K.usd(runs[0].cap)} to ${K.usd(runs[2].cap)} saves ${K.usd(runs[0].cost - runs[2].cost)}, because interest runs on a smaller balance for less time. No relief option lowers the interest rate itself; only time and the size of the balance do.</p>
${h.mini('diy', { t: 'Your balance and budget', p: ['cap'], d: { bal, cap: mid.cap } })}
<h2>When the arithmetic says a plan will not work</h2>
<p>If the payment you can afford does not clear the balance before the ${PL.csedYears}-year collection period ends, three routes remain, and all are decided from the same financial statement. A ${h.a('partial-payment-installment-agreement', 'partial payment agreement')} takes what the household can pay each month and lets the rest expire with the collection period. An ${h.a('offer-in-compromise', 'offer in compromise')} settles for the reasonable collection potential, which only makes sense when that figure is clearly below the balance. ${h.a('currently-not-collectible', 'Currently not collectible')} status pauses collection when nothing is left after allowable expenses. The ${h.a('irs-collection-financial-standards', 'Collection Financial Standards')} decide which one the numbers point to.</p>
<h2>Relief that depends on who you are</h2>
<p>Four situations have their own track on the IRS page. A spouse who should not be held liable for a joint return's tax can ask for innocent spouse or other spousal relief; the request pauses the collection clock on that debt. People living in a federally declared disaster area get extra time to file and pay automatically, which on a first bill shows up as a CP14C notice instead of a ${h.a('cp14-notice', 'CP14')}. For service members in a combat zone or in certain types of military service, the collection period is suspended for the time of service plus 180 or 270 days. Identity theft victims are, among other things, kept out of passport certification.</p>
<h2>The cost of choosing none of them</h2>
<p>A balance nobody addresses follows a fixed path: the first bill, reminders, then a ${h.a('cp504-notice', 'notice of intent to levy')}. Ten days after that notice the late payment penalty doubles to ${K.pct(P.ftp.afterLevyNotice)} a month, a lien may be filed, and wages, bank accounts and state refunds become reachable. Any of the options above, requested before that point, keeps the penalty lower and the levy off.</p>
<h2>Free help that exists</h2>
<p>The ${h.src('tas', 'Taxpayer Advocate Service')}, an independent office inside the IRS, helps at no charge when a tax problem causes financial difficulty or the usual channels have failed. Low Income Taxpayer Clinics, independent of both, represent eligible people in collection disputes, audits and appeals for free or for a small fee. The IRS ${h.src('prequal', 'Offer in Compromise Pre-Qualifier')} checks eligibility for an offer without any contact details. Anyone can also authorize a relative or a professional to deal with the IRS on their behalf. Each option above is granted or refused by the IRS; this page lays out its published terms and does not replace advice on a particular file.</p>
`,
  faqs: [
    { q: 'Can the IRS forgive tax debt without an offer in compromise?', a: 'Partly. Penalties can be removed by First Time Abate, by the Automatic Exemption from Penalty on 2025 and later returns, or for reasonable cause, and the interest on those penalties goes with them. The tax itself is reduced only by an accepted offer, a corrected assessment, or the end of the ten-year collection period. Hardship status pauses collection but forgives nothing.' },
    { q: 'What does it cost to set up tax debt relief directly with the IRS?', a: `A short-term plan has no fee. A long-term plan costs ${K.usd(F.ddiaOnline)} online with direct debit, ${K.usd(F.otherOnline)} online with other payments, ${K.usd(F.ddiaOther)} or ${K.usd(F.otherOther)} by phone or mail, with a waiver or reduction for low incomes. An offer in compromise costs ${K.usd(O.fee)} plus a first payment unless the Low-Income Certification applies. Hardship status and penalty relief requests are free.` },
    { q: 'Who gives free help with an IRS tax debt?', a: 'The Taxpayer Advocate Service, an independent office within the IRS, helps for free when a tax problem causes financial difficulty or normal IRS channels have not worked; it can be reached at 877-777-4778. Low Income Taxpayer Clinics represent eligible taxpayers for free or a small fee. Both are listed on IRS pages, with no sales call involved.' },
    { q: 'Do I have to file my missing tax returns before asking for relief?', a: 'In most cases, yes. The IRS states that most payment plans and relief options require all tax returns to be filed, and an offer in compromise is returned without appeal if a required return is missing. A return can be filed even if the tax cannot be paid, and filing it also stops the late filing penalty from growing.' },
  ],
  tool: 'diy',
  toolArg: { bal, cap: mid.cap },
  related: ['tax-relief-companies', 'irs-fresh-start-program', 'irs-payment-plan', 'offer-in-compromise', 'currently-not-collectible', 'first-time-penalty-abatement'],
  sources: ['taxdebt', 'plans', 'oic', 'cnc', 'fta', 'tas', 'prequal'],
});
