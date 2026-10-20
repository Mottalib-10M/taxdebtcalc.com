import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.plans, F = L.fees, S = K.S;
const bal = 100000;
const hh = { st: 'Arizona', co: 'Maricopa County', persons: 3, inc: 9500, rent: 2250, cars: 1, cp: 350, op: 300, hi: 250, tx: 1150 };
const a = K.allowable({ state: hh.st, county: hh.co, persons: hh.persons, over65: 0, cars: hh.cars, carPayment: hh.cp, operating: hh.op, housingActual: hh.rent, healthInsurance: hh.hi, taxes: hh.tx, childCare: 0, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
const rmi = hh.inc - a.total;
const terms = [72, 84, 120].map((m) => ({ m, r: K.plan(bal, m) }));
const t120 = terms[2].r;
const fits = terms.filter((x) => x.r.monthly <= rmi);
const opts = K.planOptions(bal, bal);
const passport = (P.passport as Record<string, number>)['2026'];

export default defineGuide({
  id: 'owe-irs-100000',
  group: 'plans',
  order: 270,
  slug: 'owe-irs-100000',
  nav: `Owe the IRS ${K.usd(bal)}`,
  card: 'Past both online limits: the financial statement, the county standards and the payment they set',
  title: `Owe IRS ${K.usd(bal)} in 2026: Financial Statement and Payment`,
  description: `Owe the IRS ${K.usd(bal)} in 2026: past the short-term and ${K.usd(L.simpleMax)} online limits, the payment comes from your income minus IRS county expense standards. Test it.`,
  h1: `Owing the IRS ${K.usd(bal)}: the budget test behind the plan`,
  intro: 'Choose your state and county, the household size and gross monthly income. The calculator applies the IRS Collection Financial Standards and shows the income left after allowable expenses, which is the figure the IRS starts from when it sets a payment on a balance this size.',
  facts: [['Short-term plan', `Under ${K.usd(L.shortTermMax)} only`], ['Simple Payment Plan', `Up to ${K.usd(L.simpleMax)} only`], ['Standards in force since', K.day(S.effective)], ['Passport threshold, 2026', K.usd(passport)]],
  resume: `At ${K.usd(bal)} a balance is past both thresholds that make IRS plans easy. The short-term plan is for combined balances under ${K.usd(L.shortTermMax)}, and the Simple Payment Plan for ${K.usd(L.simpleMax)} or less. What remains is an installment agreement requested by phone, mail or in person with a financial statement, Form 433-F or 433-H. The IRS compares your expenses with its Collection Financial Standards, in force since ${K.day(S.effective)}: a national allowance for food and clothing, county figures for housing and transportation, a health care allowance per person. The income left over is the payment it expects. For a household of ${hh.persons} in ${hh.co}, ${hh.st}, earning ${K.usd(hh.inc)} a month, the allowable expenses come to ${K.usd(a.total)}, leaving ${K.usd(rmi)}. Clearing ${K.usd(bal)} over ${L.csedYears} years takes ${K.usd(t120.monthly)} a month at the current rate. The balance is also above the ${K.usd(passport)} passport threshold of 2026.`,
  body: (h) => `
<h2>Past the two online limits</h2>
<p>Below ${K.usd(L.simpleMax)}, a plan is a few clicks. Below ${K.usd(L.shortTermMax)}, a short-term plan of ${L.shortTermDays} days is available without a fee. At ${K.usd(bal)}, ${opts.shortTerm ? 'the short-term option still applies by a margin' : 'neither applies: the short-term limit is strictly below this amount'}. The request goes through the phone number on the notice, by mail with ${h.src('f9465', 'Form 9465')} and ${h.src('f433f', 'Form 433-F')}, or in person, and the set-up fee is the higher tier, ${K.usd(F.ddiaOther)} with direct debit or ${K.usd(F.otherOther)} without. The IRS decides how much it needs each month, using what the statement shows.</p>
<h2>What the statement and the standards produce</h2>
<p>The ${h.src('cfs', 'Collection Financial Standards')} work in two ways. National Standards for food, clothing and other items, and for out-of-pocket health care, are allowed in full for the household size without asking what was actually spent. Local Standards for housing and utilities, by county, and for vehicle ownership and operating costs, by region or metropolitan area, are caps: the IRS generally allows the amount actually spent or the standard, whichever is less. Current taxes, health insurance, court-ordered payments and child care are added on top. The ${h.a('irs-housing-and-utilities-standards', 'housing standards page')} lists the county figures.</p>
${h.table(['Allowable expense', 'Monthly amount'], [
    ['Food, clothing and other items (national)', K.usd(a.national)],
    [`Housing and utilities (paid ${K.usd(hh.rent)}, standard ${a.housingStandard === null ? 'not loaded' : K.usd(a.housingStandard)})`, K.usd(a.housing)],
    ['Vehicle ownership and operating, one car', K.usd(a.ownership + a.operating)],
    ['Out-of-pocket health care and insurance', K.usd(a.health + a.healthInsurance)],
    ['Current income and payroll taxes', K.usd(a.taxes)],
    ['Total allowed', K.usd(a.total)],
    [`Remaining from ${K.usd(hh.inc)} of gross income`, K.usd(rmi)],
  ], `Household of ${hh.persons} in ${hh.co}, ${hh.st}; standards effective ${K.day(S.effective)}`, ['l', 'r'])}
${h.mini('expenses', { t: 'Your county and income', p: ['co', 'inc'], d: { st: 'Arizona', co: 'Maricopa County', hh: 3, inc: 8700, rent: 2100, cars: 1, tx: 1000 } })}
<p>Form 433-F itself is four pages. It starts with the county of residence and the number of people in the household, split between those under and over 65, because both drive the standards. It then asks for bank accounts and lines of credit, real estate, other assets such as vehicles and whole life policies, credit cards, employment and other household income for the taxpayer and spouse, and monthly living expenses line by line. The IRS can ask for statements that back up each figure, and the figures it accepts are the ones the payment is built on.</p>
<h2>From remaining income to a monthly payment</h2>
<p>The remaining monthly income is the floor the IRS works from. If it is enough to clear the balance within the collection period, the plan is a full-pay installment agreement, and the IRS can ask for the whole remaining income even if a smaller payment would also do the job in time. The table sets the example household against three terms.</p>
${h.table(['Term', 'Payment that clears the balance', 'Interest and penalty added', `Within the ${K.usd(rmi)} left?`], terms.map((x) => [`${x.m} months`, K.usd(x.r.monthly), K.usd(x.r.interest + x.r.ftp), x.r.monthly <= rmi ? 'Yes' : 'No']), `${K.usd(bal)} of tax, return filed on time, interest at ${K.rate(P.interest.current)} carried forward`, ['l', 'r', 'r', 'l'])}
<p>${fits.length ? `For this household, a ${fits[0].m}-month plan fits inside the remaining income. The IRS could still ask for the full ${K.usd(rmi)} a month, which would shorten the plan and cut the interest.` : `For this household, even ${L.csedYears} years of payments needs more than the ${K.usd(rmi)} left each month. That is the situation the ${h.a('partial-payment-installment-agreement', 'partial payment installment agreement')} exists for: the IRS takes what the budget allows until the collection period ends.`} Actual expenses above the standards are allowed only with documentation that the standards would leave the household without basic living expenses.</p>
<h2>Bringing the balance under a threshold first</h2>
<p>Both limits are measured on the balance at the time of the request, so a payment made first can change the route. Any payment at all brings ${K.usd(bal)} under the short-term limit, but clearing the rest within ${L.shortTermDays} days is out of reach for most households. Getting down to the Simple Payment Plan takes a payment of ${K.usd(bal - L.simpleMax)} or more, after which the plan is available online with no financial statement and a ${K.usd(F.ddiaOnline)} direct debit fee. The statement route needs no such payment, at the price of the budget review.</p>
<h2>Three things that come with six figures</h2>
<p>The first is passport certification. Debt of more than ${K.usd(passport)} in 2026, with a lien filed or a levy issued and nothing arranged, can be certified to the State Department, which can then deny or revoke a passport; a plan, a pending request or an accepted offer excludes the debt. The ${h.a('irs-passport-revocation', 'passport page')} has the details. The second is speed: when the IRS bills additional tax of ${K.usd(P.ftp.largeAmount)} or more, the date to pay is generally ${P.ftp.noticeDaysLarge} business days after the notice instead of ${P.ftp.noticeDays} calendar days. The third is the collection statement itself, which asks about home equity, retirement accounts and vehicles that the simple plans never look at.</p>
<h2>When the budget does not carry it</h2>
<p>If the remaining income cannot clear the balance in time, the IRS considers a ${h.a('partial-payment-installment-agreement', 'partial payment agreement')}. If assets and future income together fall short of the balance, an ${h.a('offer-in-compromise', 'offer in compromise')} may be possible, and if there is no remaining income at all, ${h.a('currently-not-collectible', 'currently not collectible status')}. Each starts from the same statement and the same standards. The IRS makes every one of these decisions; the calculator only reproduces the published arithmetic.</p>
`,
  faqs: [
    { q: `Can I set up an IRS payment plan online if I owe ${K.usd(bal)}?`, a: `Not as an individual using the online tools. Online long-term plans stop at ${K.usd(L.onlineLongTermMax)} and online short-term plans at balances under ${K.usd(L.shortTermMax)}. At ${K.usd(bal)}, the request goes by phone, by mail with Form 9465 and Form 433-F, or in person, and the set-up fee is ${K.usd(F.ddiaOther)} with direct debit.` },
    { q: `How does the IRS decide the monthly payment on a ${K.usd(bal)} balance?`, a: `From the financial statement. It subtracts allowable expenses, national standards for food and health care plus county limits for housing and cars, from gross monthly income. What is left is the starting point for the payment. In the ${hh.co} example, ${K.usd(hh.inc)} of income leaves ${K.usd(rmi)} after ${K.usd(a.total)} of allowed expenses.` },
    { q: `Can a ${K.usd(bal)} federal tax debt put my passport at risk?`, a: `Yes, if nothing is arranged. In 2026 the IRS can certify debt above ${K.usd(passport)} as seriously delinquent once a lien has been filed or a levy issued. An installment agreement, a pending plan or offer request, an accepted offer or hardship status keeps the debt out of certification.` },
  ],
  tool: 'expenses',
  toolArg: { st: hh.st, co: hh.co, hh: hh.persons, inc: hh.inc, rent: hh.rent, cars: hh.cars, tx: hh.tx },
  related: ['owe-irs-50000', 'irs-installment-agreement', 'partial-payment-installment-agreement', 'irs-collection-financial-standards', 'irs-passport-revocation', 'offer-in-compromise'],
  sources: ['cfs', 'housing', 'f433f', 'f9465', 'passport', 'ftp'],
});
