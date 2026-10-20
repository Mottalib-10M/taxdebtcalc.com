import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, O = P.oic;
// Couple in Franklin County, Ohio (Columbus), owing $58,000; other entries are the calculator's defaults.
const bal = 58000, inc = 5900, hh = 2, st = 'Ohio', co = 'Franklin County';
const exp = K.allowable({ state: st, county: co, persons: hh, over65: 0, cars: 1, carPayment: 400, operating: 280, housingActual: 2100, healthInsurance: 350, taxes: 650, childCare: 0, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
const eq = K.assetEquity({ bank: 2500, investments: 0, retirement: 8000, retirementLoan: 0, lifeCash: 0, homeValue: 0, homeLoan: 0, carValue: 14000, carLoan: 7000, car2Value: 0, car2Loan: 0, valuables: 6000, joint: true });
const rmi = Math.max(0, inc - exp.total);
const r = K.rcp(eq.total, rmi);
const upLump = K.upfront(r.lumpSum, 'lump');
const up12 = K.upfront(r.periodic, 'periodic', 12);
const up24 = K.upfront(r.periodic, 'periodic', 24);
const share = r.lumpSum / bal;

export default defineGuide({
  id: 'offer-in-compromise',
  group: 'settle',
  order: 300,
  slug: 'offer-in-compromise',
  nav: 'Offer in compromise',
  card: `The minimum offer from Form 433-A (OIC), the ${K.usd(O.fee)} fee and the payment sent with the application`,
  title: 'Offer in Compromise 2026: Minimum Offer, Fee, Who Qualifies',
  description: `Offer in compromise 2026: the minimum offer the IRS formula sets for your county and income, the ${K.usd(O.fee)} fee, the ${K.pct(O.lumpSumDeposit)} down payment, and who is eligible.`,
  h1: 'Offer in compromise: the smallest offer the IRS can accept',
  intro: 'Enter the balance, your county, the size of the household and its gross monthly income. The calculator runs Form 433-A (OIC) with the county standards and returns the reasonable collection potential, the floor every offer is measured against.',
  facts: [['Application fee', K.usd(O.fee)], ['Sent with a lump-sum offer', `${K.pct(O.lumpSumDeposit)} of the offer`], ['Periodic offer paid over', `${O.periodicMinMonths} to ${O.periodicMaxMonths} months`], ['Accepted by law if no decision within', `${O.autoAcceptYears} years`]],
  resume: `An offer in compromise settles a federal tax debt for less than the balance when the IRS agrees the full amount cannot be collected. The IRS does not bargain down from what you owe: it computes a reasonable collection potential on Form 433-A (OIC), which is the equity in your assets at ${K.pct(O.quickSale)} of market value, minus loans and the allowances printed on the form, plus the income left each month after allowable living expenses, multiplied by ${O.multiplierLumpSum} for a lump-sum offer or by ${O.multiplierPeriodic} for a periodic offer. An offer at or above that figure can be considered; an offer below it is usually rejected unless special circumstances are documented. Each application carries a ${K.usd(O.fee)} fee and either ${K.pct(O.lumpSumDeposit)} of a lump-sum offer or the first periodic payment, both waived under the Low-Income Certification. For a couple in ${co}, ${st}, owing ${K.usd(bal)} with ${K.usd(inc)} of monthly income, the formula gives ${K.usd(r.lumpSum)} paid within ${O.lumpSumMonths} months or ${K.usd(r.periodic)} over up to ${O.periodicMaxMonths} months.`,
  body: (h) => `
<h2>Three reasons the IRS will look at an offer</h2>
<p>Form 656 asks you to tick one reason, and only one. <strong>Doubt as to collectibility</strong> is the common case: assets and future income together fall short of the debt, and the offer equals at least the minimum worked out on ${h.src('f656b', 'Form 433-A (OIC)')}. <strong>Effective tax administration</strong> covers a person who could pay in full but for whom full payment would cause economic hardship (individuals only) or would be unfair for public policy or equity reasons. <strong>Doubt as to liability</strong> is a dispute about the tax itself and uses a separate form, Form 656-L; the booklet says not to file it at the same time as an offer based on ability to pay.</p>
<p>The IRS states the starting point plainly on its ${h.src('oic', 'offer in compromise page')}: it generally will not accept an offer if the debt can be paid in full through a payment plan, equity in assets, or both. That is why an offer is a calculation before it is a negotiation. Under ${h.src('irc7122', 'section 7122 of the tax code')}, the IRS has the authority to compromise; nothing obliges it to accept a particular amount.</p>
<h2>Who may apply</h2>
<p>Four conditions come before any figure. All required returns must be filed, at least one of the debts in the offer must already have been billed, the estimated tax payments for the current year must be made, and an employer must be current on federal tax deposits for the current quarter and the two before it. A person in an open bankruptcy cannot apply, and an open audit or innocent spouse claim has to be settled first. If returns are missing, the IRS keeps the initial payment, applies it to the debt and sends the rest back with no appeal.</p>
<h2>The Franklin County example, step by step</h2>
<p>The couple below rents, drives one financed car and has a small retirement account. Their figures are run through the same lines as the calculator at the top of the page.</p>
${h.table(['Step', 'Amount'], [
    ['Equity in bank, retirement, car and household goods, after the form\'s allowances', K.usd(eq.total)],
    ['Gross monthly household income', K.usd(inc)],
    [`Allowable monthly expenses, ${co} standards`, K.usd(exp.total)],
    ['Remaining monthly income', K.usd(rmi)],
    [`Lump-sum minimum: equity + ${O.multiplierLumpSum} months`, K.usd(r.lumpSum)],
    [`Periodic minimum: equity + ${O.multiplierPeriodic} months`, K.usd(r.periodic)],
    ['Balance owed', K.usd(bal)],
  ], `Married couple, two people, ${co}, ${st}; standards effective ${K.day(P.standards.effective)}`, ['l', 'r'])}
<p>The lump-sum figure equals ${K.pct(share, 0)} of what they owe. That ratio has no general meaning: a household with home equity or a larger paycheck can reach the full balance, in which case the IRS expects payment in full, usually through a plan. The ${h.a('reasonable-collection-potential', 'reasonable collection potential page')} goes through every line of the form.</p>
${h.mini('oic', { t: 'Minimum offer for your balance and income', p: ['bal', 'inc'], d: { bal, st, co, hh, inc } })}
<h2>What leaves your account with the application</h2>
<p>The fee and the first payment go with the form, and the IRS keeps the payments even if the offer is later rejected or returned; they are applied to the debt. Under the lump-sum option you send ${K.pct(O.lumpSumDeposit)} of the offer and pay the rest in ${O.lumpSumMonths} or fewer payments within ${O.lumpSumMonths} months of acceptance. Under the periodic option you send the first monthly payment and keep paying every month while the offer is reviewed, and a missed payment can get the offer returned.</p>
${h.table(['Option', 'With the application', 'While under review', 'Total offer'], [
    [`Lump sum, paid within ${O.lumpSumMonths} months`, K.usd(upLump.fee + upLump.deposit), 'nothing more', K.usd(r.lumpSum)],
    ['Periodic, 12 monthly payments', K.usd(up12.fee + up12.deposit), `${K.usd(up12.deposit)} a month`, K.usd(r.periodic)],
    [`Periodic, ${O.periodicMaxMonths} monthly payments`, K.usd(up24.fee + up24.deposit), `${K.usd(up24.deposit)} a month`, K.usd(r.periodic)],
  ], `Franklin County couple, minimum offers; amounts with the application include the ${K.usd(O.fee)} fee`, ['l', 'r', 'l', 'r'])}
<p>The periodic offer costs more in total because the formula counts ${O.multiplierPeriodic} months of remaining income instead of ${O.multiplierLumpSum}. A household that qualifies for the ${h.a('low-income-offer-in-compromise', 'Low-Income Certification')} sends neither the fee nor any payment until the offer is accepted.</p>
<h2>While the IRS reviews the file</h2>
<p>Once the IRS confirms eligibility, it suspends most collection, extends the period it has to collect, may ask for more documents and may file a Notice of Federal Tax Lien. Payments on an existing installment agreement for the same debt can stop during the review, and the plan is reinstated if the offer fails and no new debt has appeared. Two points catch people out. The IRS can still levy up to the day an IRS official signs the offer as pending, and it keeps what a levy collected. Any refund for a return assessed before acceptance is offset against the debt and does not count as a payment on the offer. Penalties and interest keep accruing until all the offer terms are met.</p>
<p>If the IRS has not accepted or rejected the offer within ${O.autoAcceptYears} years of receiving it, the offer is accepted by law; time spent in an appeal does not count toward that window.</p>
<h2>Accepted, rejected or returned</h2>
<p>An accepted offer comes with conditions in Section 7 of Form 656. You must file and pay every tax on time for ${O.complianceYears} years after acceptance, you cannot amend the returns covered, and a missed obligation lets the IRS default the offer and revive the original balance minus what was paid, with interest and penalties. The lien stays until the offer is paid in full, and the IRS publishes certain details of accepted offers in a public inspection file for one year.</p>
<p>A rejected offer can be appealed to the IRS Independent Office of Appeals within 30 days of the rejection letter; the fee is not refunded. A returned offer, for missing returns, missing payments or unanswered requests, has no appeal. The IRS ${h.src('prequal', 'Pre-Qualifier tool')} runs the same test without any contact details. This page reproduces the arithmetic of the forms; whether an offer is accepted is the IRS's decision alone, and nothing here is tax advice for your case.</p>
`,
  faqs: [
    { q: 'What percentage of the balance does an IRS offer in compromise usually settle for?', a: `There is no standard percentage. The IRS looks for an amount at least equal to the reasonable collection potential, which depends on assets, income and the county standards, not on the balance. In the Franklin County example on this page, the lump-sum minimum is ${K.pct(share, 0)} of the debt; a homeowner with equity, or a higher earner, could find the minimum equals the whole balance, and then no offer fits.` },
    { q: `Is the ${K.usd(O.fee)} offer in compromise fee refunded if the IRS rejects the offer?`, a: `No. The fee is returned only when the IRS does not accept the offer for processing, for example because a required return is missing. Once the offer is processed and later rejected, the fee is kept, and every payment sent with the offer or during the review is applied to the tax debt rather than sent back. Applicants under the Low-Income Certification pay no fee at all.` },
    { q: 'Does interest stop while an offer in compromise is under review?', a: `No. The Form 656 booklet states that penalties and interest continue to accrue while the IRS considers the offer, and they keep running until every payment term of an accepted offer is met. Interest is charged at the quarterly underpayment rate, ${K.rate(P.interest.current)} a year in the ${K.quarter(P.interest.current)}, compounded daily, so a long review raises the balance that comes back if the offer fails.` },
    { q: 'What happens if I file a tax return late in the five years after my offer is accepted?', a: `Section 7 of Form 656 makes on-time filing and payment for ${O.complianceYears} years a condition of the deal. A late return or an unpaid new tax lets the IRS default the offer. The original debt then comes back, minus the payments made, with the penalties and interest that accrued from the start, and the IRS may file a new lien, levy or sue to collect it.` },
  ],
  tool: 'oic',
  toolArg: { bal, st, co, hh, inc },
  related: ['reasonable-collection-potential', 'low-income-offer-in-compromise', 'irs-collection-financial-standards', 'currently-not-collectible', 'tax-relief-companies', 'partial-payment-installment-agreement'],
  sources: ['oic', 'f656b', 'prequal', 'irc7122', 'cfs'],
});
