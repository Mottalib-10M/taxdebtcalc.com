import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.plans, S = K.S;
const hh = { st: 'Illinois', co: 'Cook County', persons: 4, inc: 7200, rent: 2600, cars: 1, cp: 350, op: 300, hi: 250, tx: 800 };
const a = K.allowable({ state: hh.st, county: hh.co, persons: hh.persons, over65: 0, cars: hh.cars, carPayment: hh.cp, operating: hh.op, housingActual: hh.rent, healthInsurance: hh.hi, taxes: hh.tx, childCare: 0, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
const rmi = Math.max(0, hh.inc - a.total);
const bal = 72000;
/** Assessed in mid-2022: the collection date is ten years later, before any suspension. */
const assessed = '2022-06-13';
const csed = K.addMonths(assessed, L.csedYears * 12);
let monthsLeft = 0;
while (K.addMonths(K.today, monthsLeft + 1) <= csed) monthsLeft++;
const fullPay = K.plan(bal, monthsLeft);
const base = { tax: bal, penalties: 0, interest: 0, ftpSoFar: 0, taxOriginal: bal, start: K.today, filedOnTime: true };
const ppia = K.runPlan({ ...base, monthly: rmi, maxMonths: monthsLeft });
const leftAtCsed = ppia.rows.length ? ppia.rows[ppia.rows.length - 1].balance : bal;
const isPpia = rmi > 0 && rmi < fullPay.monthly;

export default defineGuide({
  id: 'partial-payment-installment-agreement',
  group: 'plans',
  order: 290,
  slug: 'partial-payment-installment-agreement',
  nav: 'Partial payment agreement',
  card: 'A monthly plan set by the household budget, which ends when the collection period does',
  title: 'Partial Payment Installment Agreement 2026: PPIA by Budget',
  description: `Partial payment installment agreement 2026: a payment set by income minus IRS standards, paid until the ${L.csedYears}-year collection date, the rest left unpaid.`,
  h1: 'Partial payment installment agreement: paying what the budget allows',
  intro: 'Enter the county, the household and gross monthly income. The calculator applies the IRS Collection Financial Standards and gives the income left after allowable expenses: in a partial payment agreement, that figure is the monthly payment.',
  facts: [['Payment', 'Income minus allowable expenses'], ['Ends', 'At the collection statute date'], ['Financial statement', 'Required, with records'], ['Standards in force since', K.day(S.effective)]],
  resume: `A partial payment installment agreement is a monthly plan that will not pay the full balance before the collection statute expiration date, ${L.csedYears} years after assessment unless the clock was suspended. The IRS sets the payment from a financial statement: gross income minus allowable living expenses under its Collection Financial Standards. It requires supporting records and reviews the agreement later, when the payment can go up, down or stay. Take a household of ${hh.persons} in ${hh.co}, ${hh.st}, with ${K.usd(hh.inc)} a month of income and ${K.usd(bal)} owed on a tax assessed in June 2022. The standards allow ${K.usd(a.total)} of expenses, leaving ${K.usd(rmi)} a month. Clearing the balance by ${K.day(csed)}, ${monthsLeft} months away, would take ${K.usd(fullPay.monthly)} a month. ${isPpia ? `Paying ${K.usd(rmi)} a month instead, the balance still owed when the collection period ends would be about ${K.usd(leftAtCsed)}.` : 'Here the budget does not point to a partial payment agreement; the page explains why.'}`,
  body: (h) => `
<h2>A plan that ends with the collection period</h2>
<p>The ${h.src('i9465', 'Form 9465 instructions')} define it in one sentence: an installment agreement that will not pay in full the entire balance before the collection statute expiration date is a partial payment installment agreement. The IRS asks for a financial statement and the records behind it, and an approved agreement is subject to future reviews. At a review the IRS may ask for a new statement, and the payment can be reduced, increased or left as it is. Under ${h.src('irc6159', 'section 6159')}, the IRS can enter into an agreement that provides for partial payment of a liability, which is the legal base for it.</p>
<p>The collection date is the other half. The ${h.src('csed', 'IRS page on the collection statute')} gives ${L.csedYears} years from assessment, with each assessment carrying its own date, visible on the account transcript. When the date arrives and the balance has not been paid, the IRS can no longer collect it, unless the period was suspended or extended along the way.</p>
<p>There is no separate form for it. On Form 9465, line 11a takes the payment you can make each month; if that amount would not pay the tax in full by the collection date, the instructions say the request may be considered for a partial payment agreement. When the proposed payment is below the amount the form computes, or the balance is over ${K.usd(L.simpleMax)}, Form 433-F goes with it, and the IRS may ask for more information after reading it. Bank statements, pay stubs and bills for the larger expenses are the usual records; the standards decide how much of each expense counts, the records prove that it exists.</p>
<h2>The budget that sets the payment</h2>
<p>The payment is not a number you choose. It is what the ${h.src('cfs', 'Collection Financial Standards')} leave: national amounts for food, clothing and health care by household size, county caps for housing and utilities, regional caps for cars, plus current taxes and health insurance. For housing and transportation, the IRS generally allows the smaller of the amount actually spent and the standard.</p>
${h.table(['Allowable expense', 'Monthly amount'], [
    ['Food, clothing and other items', K.usd(a.national)],
    [`Housing and utilities (paid ${K.usd(hh.rent)}${a.housingStandard === null ? '' : `, standard ${K.usd(a.housingStandard)}`})`, K.usd(a.housing)],
    ['One vehicle, ownership and operating', K.usd(a.ownership + a.operating)],
    ['Health care out of pocket and insurance', K.usd(a.health + a.healthInsurance)],
    ['Current taxes', K.usd(a.taxes)],
    ['Total allowed', K.usd(a.total)],
    [`Left from ${K.usd(hh.inc)} of income`, K.usd(rmi)],
  ], `Household of ${hh.persons} in ${hh.co}, ${hh.st}; standards effective ${K.day(S.effective)}`, ['l', 'r'])}
${h.mini('expenses', { t: 'Your household and income', p: ['hh', 'inc'], d: { st: 'Illinois', co: 'Cook County', hh: 4, inc: 6400, rent: 2400, cars: 1, tx: 700 } })}
<h2>What the example collects before the clock runs out</h2>
<p>A tax assessed on ${K.day(assessed)} has a collection date of ${K.day(csed)} if nothing suspends it, ${monthsLeft} months from ${K.day(K.today)}. Interest at ${K.rate(P.interest.current)} and the late payment penalty, at ${K.pct(P.ftp.withPlan)} a month in a plan if the return was filed on time, keep running on whatever is unpaid.</p>
${h.table(['', 'Monthly payment', 'Paid by the collection date', 'Still owed at that date'], [
    ['Full-pay plan', K.usd(fullPay.monthly), K.usd(fullPay.totalPaid), K.usd(0)],
    ['Payment set by the budget', K.usd(rmi), K.usd(ppia.totalPaid), K.usd(leftAtCsed)],
  ], `${K.usd(bal)} owed, interest at ${K.rate(P.interest.current)} carried forward, no suspension of the collection period`, ['l', 'r', 'r', 'r'])}
<p>${isPpia ? `The gap between ${K.usd(fullPay.monthly)} and ${K.usd(rmi)} is what makes this a partial payment case. The household pays ${K.usd(rmi)} each month; ${leftAtCsed > bal ? 'the balance keeps growing on paper, because the payment does not cover the interest and penalty, and ' : ''}what is left on ${K.day(csed)} is no longer collectible, unless a review raises the payment first.` : rmi <= 0 ? 'With nothing left after allowable expenses, there is no payment to set: that is the ground for currently not collectible status rather than an agreement.' : 'Here the remaining income covers the full-pay payment, so the IRS would expect a regular installment agreement, not a partial one.'}</p>
<h2>What can change the outcome</h2>
<p>Three things move the numbers. A review can find higher income and raise the payment. Events can suspend the collection date: while an installment agreement request is pending the period is suspended, a rejection or proposed termination adds 30 days, and an appeal suspends it until the decision is final; an offer in compromise or a bankruptcy also suspends it. And assets are on the table: the financial statement lists bank accounts, real estate, vehicles and other property, which the IRS reviews alongside income before agreeing to leave part of a debt unpaid.</p>
<h2>Partial payment, an offer, or hardship status</h2>
<p>The three routes start from the same statement. A partial payment agreement fits when there is some income left but not enough to pay in time. An ${h.a('offer-in-compromise', 'offer in compromise')} settles the debt now for the reasonable collection potential, the equity in assets plus a multiple of the monthly remainder, and ends the reviews if the IRS accepts it. ${h.a('currently-not-collectible', 'Currently not collectible status')} applies when nothing is left after allowable expenses. The ${h.a('owe-irs-100000', 'page on six-figure balances')} shows the same budget test for a plan that can still pay in full. The IRS decides which route it accepts; these figures follow its published standards, not its decision.</p>
`,
  faqs: [
    { q: 'Does a partial payment installment agreement cancel the rest of the tax debt?', a: 'Not at the start. The full balance stays owed, and interest and penalties keep accruing on it. You pay the monthly amount the budget allows. Whatever is still unpaid when the collection statute expiration date arrives can no longer be collected, unless the period was suspended or extended, or a review raised the payment before then.' },
    { q: 'Will the IRS review a partial payment installment agreement after it is approved?', a: 'Yes. The Form 9465 instructions say an approved partial payment agreement is subject to future reviews to confirm whether your financial situation has changed. The IRS may ask for a new financial statement and supporting records, and the monthly payment can be reduced, increased or left unchanged as a result.' },
    { q: 'Does asking for a partial payment agreement pause the ten-year collection clock?', a: 'Yes, while the request is pending. The IRS collection statute page says an installment agreement request suspends the collection period while it is reviewed, a rejection or proposed termination adds 30 days, and an appeal suspends it until the appeal ends. Those periods push the collection date back.' },
  ],
  tool: 'expenses',
  toolArg: { st: hh.st, co: hh.co, hh: hh.persons, inc: hh.inc, rent: hh.rent, cars: hh.cars, tx: hh.tx },
  related: ['irs-installment-agreement', 'currently-not-collectible', 'offer-in-compromise', 'irs-collection-statute-of-limitations', 'owe-irs-100000', 'irs-collection-financial-standards'],
  sources: ['i9465', 'irc6159', 'csed', 'cfs', 'housing', 'f433f'],
});
