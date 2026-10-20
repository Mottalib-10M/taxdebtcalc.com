import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.plans, F = L.fees;
const gMonths = L.guaranteedYears * 12;
const ex = [
  { kind: `Must be accepted, section 6159(c)`, bal: 8800, m: gMonths, fee: F.ddiaOnline },
  { kind: 'Simple Payment Plan', bal: 27000, m: 72, fee: F.ddiaOnline },
  { kind: 'Non-streamlined, with Form 433-F', bal: 64000, m: 84, fee: F.ddiaOther },
].map((x) => ({ ...x, r: K.plan(x.bal, x.m) }));
const [g, s, n] = ex;

export default defineGuide({
  id: 'irs-installment-agreement',
  group: 'plans',
  order: 210,
  slug: 'irs-installment-agreement',
  nav: 'Installment agreement types',
  card: 'Simple plan, the agreement the IRS must accept, non-streamlined and partial pay, side by side',
  title: 'IRS Installment Agreement 2026: Types, Limits, Forms, Terms',
  description: `IRS installment agreement 2026: Simple Payment Plan up to ${K.usd(L.simpleMax)}, the 6159(c) agreement for tax up to ${K.usd(L.guaranteedMaxTax)}, Form 433-F above the limit, and what each costs.`,
  h1: 'IRS installment agreement: which type fits your balance',
  intro: 'Enter the balance and a term. The calculator gives the monthly payment and the cost, and names the kind of agreement the IRS uses for that amount; the page explains what each kind asks of you.',
  facts: [['Simple Payment Plan, combined balance up to', K.usd(L.simpleMax)], ['Agreement the IRS must accept, tax up to', K.usd(L.guaranteedMaxTax)], ['Term of that agreement', `${L.guaranteedYears} years`], ['Penalty rate in a plan, return on time', `${K.pct(P.ftp.withPlan)} a month`]],
  resume: `An installment agreement is the long-term payment plan of section 6159 of the tax code: monthly payments toward tax, penalties and interest, with a set-up fee and interest that keeps running at ${K.rate(P.interest.current)} a year. The IRS sorts requests by size. If the tax itself is ${K.usd(L.guaranteedMaxTax)} or less, the person filed and paid on time for the past five years without another agreement, and the balance will be paid within ${L.guaranteedYears} years, the IRS must accept the request under section 6159(c). Up to ${K.usd(L.simpleMax)} of combined tax, penalties and interest, with all returns filed, the Simple Payment Plan applies without a financial statement. Above that, the IRS wants Form 433-F or 433-H and checks the payment against its expense standards. When even that payment cannot clear the debt before the collection period ends, a partial payment agreement is possible. On ${K.usd(s.bal)} over 72 months, the payment is ${K.usd(s.r.monthly)} and the plan adds ${K.usd(s.r.interest + s.r.ftp)}.`,
  body: (h) => `
<h2>Four kinds of agreement, sorted by what you owe</h2>
<p>The ${h.src('plans', 'IRS payment plan page')} and the ${h.src('i9465', 'Form 9465 instructions')} describe the same ladder. Each step asks for more paperwork than the one before, and each is tested on a different figure: the tax alone for the first, the combined balance for the others.</p>
${h.table(['Agreement', 'Who it is for', 'What the IRS asks for'], [
    ['Section 6159(c), must be accepted', `Tax of ${K.usd(L.guaranteedMaxTax)} or less, clean five-year record, paid within ${L.guaranteedYears} years`, 'The request itself; no financial statement'],
    ['Simple Payment Plan', `${K.usd(L.simpleMax)} or less in tax, penalties and interest, all returns filed`, 'No financial statement, no lien determination'],
    ['Non-streamlined', `Over ${K.usd(L.simpleMax)}, or a payment the IRS finds too low`, 'Form 9465 with Form 433-F, or Form 433-H'],
    ['Partial payment', 'Balance that cannot be paid before the collection period ends', 'Financial statement, supporting records, later reviews'],
  ], 'Long-term plans for individuals', ['l', 'l', 'l'])}
<h2>The agreement the IRS must accept</h2>
<p>${h.src('irc6159', 'Section 6159(c)')} removes the IRS\'s discretion in one narrow case. The Form 9465 instructions list the conditions: the tax owed is not more than ${K.usd(L.guaranteedMaxTax)}; during the past five tax years you, and your spouse on a joint return, filed every income tax return on time, paid the tax due and did not enter into another installment agreement for income tax; you agree to pay in full within ${L.guaranteedYears} years and to comply with the tax laws while the agreement runs; and you are financially unable to pay in full when due. The test is on tax, so penalties and interest on top do not push a person out of it. On ${K.usd(g.bal)} over ${gMonths} months, the payment is ${K.usd(g.r.monthly)}.</p>
${h.table(['Example', 'Balance', 'Term', 'Monthly', 'Interest and penalty', 'Set-up fee'], ex.map((x) => [x.kind, K.usd(x.bal), `${x.m} months`, K.usd(x.r.monthly), K.usd(x.r.interest + x.r.ftp), K.usd(x.fee)]), `Returns filed on time, interest at ${K.rate(P.interest.current)}; direct debit, applied online except the last case, which is requested by mail or phone`, ['l', 'r', 'r', 'r', 'r', 'r'])}
${h.mini('plan', { t: 'Your balance and term', p: ['bal', 'mo'], d: { bal: 33500, mo: '60' } })}
<h2>Above the Simple Payment Plan limit</h2>
<p>Over ${K.usd(L.simpleMax)}, the plan stops being a formality. The Form 9465 instructions say to attach a completed ${h.src('f433f', 'Form 433-F, Collection Information Statement')} when the amount owed is greater than that limit; Form 433-H combines the request and the statement in one form. The statement lists income, bank accounts, assets and monthly expenses, and the IRS compares the expenses with its ${h.a('irs-collection-financial-standards', 'Collection Financial Standards')}. The income left after allowable expenses becomes the yardstick for the payment. In the ${K.usd(n.bal)} example, ${K.usd(n.r.monthly)} a month clears the debt over 84 months; if the statement shows more income left after allowable expenses, the IRS can ask for a higher payment. The ${h.a('owe-irs-100000', 'page on six-figure balances')} works through that test with a county budget.</p>
<p>If the form gives no payment amount, the instructions say the IRS divides the balance by 72 months. If the proposed payment would not clear the tax before the collection statute expiration date, the request can be considered as a ${h.a('partial-payment-installment-agreement', 'partial payment installment agreement')}.</p>
<h2>What both sides agree to</h2>
<p>By approving the request, the IRS lets the balance be paid over time. In return you agree to pay each installment on time, to file every future return on time and to have enough withholding or estimated payments that future years are paid in full, and to give updated financial information when asked. Refunds are applied to the balance while the agreement runs, and the monthly payment is still due in a month when a refund was taken. While a request is pending and while an agreement is in effect, the IRS generally may not levy, and the collection period is suspended while the request is pending. A notice of federal tax lien is generally not filed with the agreement the IRS must accept or a streamlined one, though it can be in some situations.</p>
<h2>Self-employed people and businesses</h2>
<p>A sole proprietor or independent contractor applies as an individual, through the same online account and under the same limits. A business that is still operating and owes employment taxes does not use Form 9465; it calls the number on its notice. The Simple Payment Plan for businesses has its own ceilings, lower when trust fund taxes such as withheld payroll taxes are involved, and a person who may be liable for the trust fund recovery penalty uses Form 9465 like any individual.</p>
<h2>How and when the IRS answers</h2>
<p>Online requests through the individual account get an answer at once. For a mailed Form 9465, the instructions say the IRS usually replies within 30 days, longer for a request sent with a return filed after March 31. You choose the payment day, from the 1st to the 28th of the month. Direct debit lowers the fee, to ${K.usd(F.ddiaOnline)} online against ${K.usd(F.otherOnline)} with other payment methods, and makes a missed payment less likely; the ${h.a('irs-payment-plan-fees', 'fees page')} has the full schedule. The IRS decides on every request, including the terms it will accept; this page only sets out the published rules and the arithmetic.</p>
`,
  faqs: [
    { q: 'Who qualifies for the installment agreement the IRS must accept under section 6159(c)?', a: `A person whose tax owed is ${K.usd(L.guaranteedMaxTax)} or less, who filed and paid on time for the past five tax years without another income tax installment agreement, who agrees to pay in full within ${L.guaranteedYears} years and to stay compliant, and who cannot pay the full amount when due. The limit applies to the tax, not to the penalties and interest added to it.` },
    { q: 'Does an approved installment agreement lead to a federal tax lien being filed?', a: 'Not usually for small balances. The Form 9465 instructions say a notice of federal tax lien is generally not filed with the agreement the IRS must accept or a streamlined agreement, but it can be in some situations. For larger balances in a non-streamlined agreement, the IRS may file one to protect its claim until the debt is paid.' },
    { q: 'How long does the IRS take to answer a mailed Form 9465 request?', a: 'Usually within 30 days of receiving it, according to the form instructions. A request attached to a return filed after March 31 can take longer. Requests made online through the individual account, for combined balances of up to the Simple Payment Plan limit, get an answer immediately and cost less in set-up fees.' },
    { q: 'Which day of the month can my IRS installment payment fall on?', a: 'Any day from the 1st to the 28th, chosen on the request. The Form 9465 instructions suggest picking a date that does not collide with rent or a mortgage. If the IRS has not answered by the date chosen for the first payment, that payment can be sent anyway, by mail or electronically.' },
  ],
  tool: 'plan',
  toolArg: { bal: s.bal, mo: '72' },
  related: ['irs-payment-plan', 'partial-payment-installment-agreement', 'irs-payment-plan-fees', 'owe-irs-50000', 'missed-irs-payment-plan-payment', 'irs-collection-financial-standards'],
  sources: ['plans', 'simple', 'irc6159', 'i9465', 'f433f'],
});
