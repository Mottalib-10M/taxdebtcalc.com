import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.plans;
const due = K.DUE_DATES[2025];
const tax = 13800, partPaid = 5000;
const at = K.addMonths(K.today, 12);
const daysSinceDue = Math.round((new Date(`${K.today}T00:00:00Z`).getTime() - new Date(`${due}T00:00:00Z`).getTime()) / 86400000);
const cases: Array<[string, ReturnType<typeof K.debt>]> = [
  [`Filed on time, ${K.usd(partPaid)} paid in April`, K.debt(tax - partPaid, at, 0)],
  ['Filed on time, nothing paid', K.debt(tax, at, 0)],
  [`Filed on ${K.day(K.today)}, nothing paid`, K.debt(tax, at, daysSinceDue)],
  ['Never filed, nothing paid', K.debt(tax, at, null)],
];
const filed = cases[1][1], never = cases[3][1], part = cases[0][1];
const gap = never.total - filed.total;
const short = K.plan(tax, 6), long = K.plan(tax, 48);

export default defineGuide({
  id: 'cant-pay-taxes',
  group: 'plans',
  order: 240,
  slug: 'cant-pay-taxes',
  nav: 'Can\'t pay your taxes',
  card: 'Why filing without paying costs far less than not filing, and the routes that follow',
  title: 'Taxes You Can\'t Pay 2026: File Anyway, Then Choose a Route',
  description: `Taxes you can't pay in 2026: not filing adds ${K.pct(P.ftf.monthly)} a month to the ${K.pct(P.ftp.monthly)} late payment penalty. See the gap in dollars, then payment plans, hardship and offers.`,
  h1: 'Can\'t pay your taxes: what to do first, in dollars',
  intro: 'Enter the tax you cannot pay and how the return stands. Try the filing options one after the other: the change in the late filing line is the cost of not filing, and it is usually the largest number on the screen.',
  facts: [['Not filing', `${K.pct(P.ftf.monthly)} a month, up to ${K.pct(P.ftf.max)}`], ['Not paying', `${K.pct(P.ftp.monthly)} a month, up to ${K.pct(P.ftp.max)}`], ['Short-term plan', `${L.shortTermDays} days, no fee`], ['Interest meanwhile', K.rate(P.interest.current)]],
  resume: `When the money is not there, the return still matters more than the payment. The penalty for not filing is ${K.pct(P.ftf.monthly)} of the unpaid tax a month, ${P.ftf.monthly / P.ftp.monthly} times the ${K.pct(P.ftp.monthly)} penalty for not paying, and it reaches ${K.pct(P.ftf.max)} within five months. The IRS's own advice on its payment plan page is to file on time even if you cannot pay in full, pay what you can, and then use a payment option for the rest. Take ${K.usd(tax)} of 2025 tax that cannot be paid. Twelve months from now, with the return filed on time and nothing paid, it will be ${K.usd(filed.total)}. With the return never filed, ${K.usd(never.total)}: ${K.usd(gap)} more for the same unpaid tax. Paying ${K.usd(partPaid)} in April would have brought the filed case to ${K.usd(part.total)}. From there, the routes are a short-term plan of ${L.shortTermDays} days, a monthly installment agreement, hardship status or an offer in compromise.`,
  body: (h) => `
<h2>Two failures, priced very differently</h2>
<p>Section 6651 punishes not filing and not paying separately, and the two penalties are not the same size. The ${h.src('ftf', 'failure to file penalty')} is ${K.pct(P.ftf.monthly)} a month for five months. The ${h.src('ftp', 'failure to pay penalty')} is ${K.pct(P.ftp.monthly)} a month for up to ${P.ftp.max / P.ftp.monthly} months. In the months both apply, the filing penalty is cut by the payment penalty, so the pair costs ${K.pct(P.ftf.monthly)} a month at first; after the fifth month only the slower one continues. A person who cannot pay but files on time keeps the filing penalty at zero for good.</p>
<p>The table follows ${K.usd(tax)} of 2025 tax, due ${K.day(due)}, to ${K.day(at)}, twelve months from now, under four ways of handling it.</p>
${h.table(['Situation', 'Late filing', 'Late payment', 'Interest', `Owed on ${K.day(at)}`], cases.map(([l, r]) => [l, K.usd(r.ftf), K.usd(r.ftp), K.usd(r.interest), K.usd(r.total)]), `Interest at the published quarterly rates, ${K.rate(P.interest.current)} carried forward`, ['l', 'r', 'r', 'r', 'r'])}
${h.mini('debt', { t: 'Your tax, filed or not', p: ['tax', 'fs'], d: { tax: 9900, fs: 'nf', pm: 6 } })}
<h2>Paying part of it still pays off</h2>
<p>A partial payment lowers both the penalty base and the interest base from the day it is made. In the example, ${K.usd(partPaid)} paid in April saves ${K.usd(filed.total - part.total - partPaid)} of penalty and interest by ${K.day(at)}, on top of the ${K.usd(partPaid)} itself. The IRS points the same way on its payment plan page: if you cannot pay the full amount, pay as much as you can, then look at the payment options. A payment made with an extension request also counts as the extension, as the ${h.a('filing-extension-and-penalties', 'extension page')} explains.</p>
<h2>Borrowing to pay, measured against a plan</h2>
<p>The Form 9465 instructions suggest looking at a bank loan or available credit before a payment plan, since they may cost less. The comparison is simple to set up. A plan costs the IRS interest rate, ${K.rate(P.interest.current)} a year in the ${K.quarter(P.interest.current)}, plus the late payment penalty, which in an approved plan with a return filed on time is ${K.pct(P.ftp.withPlan)} a month, about ${K.pct(12 * P.ftp.withPlan)} a year on the tax still unpaid. Together that is roughly ${K.pct(P.interest.currentRate + 12 * P.ftp.withPlan)} a year, plus the set-up fee. A loan with a lower annual rate and no fees costs less; a credit card at a higher rate costs more, and card payments to the IRS carry a processor fee as well. Whatever the source of the money, the ${K.pct(P.ftf.monthly)} monthly cost of a missing return outweighs both.</p>
<h2>When the balance arrives later, on a notice</h2>
<p>Not every unpaid tax starts in April. Tax the IRS adds after the return, for instance through a ${h.a('cp2000-notice', 'CP2000')} matching notice that you agree with, comes with a date to pay, generally ${P.ftp.noticeDays} days after the notice. Paid by then, it carries interest from the original due date but no late payment penalty. Past that date, the same ${K.pct(P.ftp.monthly)} monthly penalty starts, and the same routes apply: a short-term plan, an installment agreement or the others below.</p>
<h2>The routes, from quickest to slowest</h2>
<p>Each route costs less than the one after it, and each asks for more proof of what you can afford. The amounts below use the same ${K.usd(tax)} counted from today.</p>
${h.table(['Route', 'What it asks', 'On this balance'], [
    ['Short-term plan', `Pay within ${L.shortTermDays} days; balance under ${K.usd(L.shortTermMax)}`, `${K.usd(short.monthly)} a month for six months, ${K.usd(short.interest + short.ftp)} added, no fee`],
    ['Installment agreement', `Monthly payments; online up to ${K.usd(L.simpleMax)}`, `${K.usd(long.monthly)} a month for 48 months, ${K.usd(long.interest + long.ftp)} added, fee from ${K.usd(L.fees.ddiaOnline)}`],
    ['Currently not collectible', 'Proof that income does not cover allowable expenses', 'No payment while the status lasts; penalty and interest continue'],
    ['Offer in compromise', 'Form 433-A (OIC), fee and payment with the offer', 'Settles for the collection potential, if the IRS accepts'],
  ], 'Options for individuals; the IRS decides on each', ['l', 'l', 'l'])}
<p>The ${h.a('short-term-payment-plan', 'short-term plan')} and the ${h.a('irs-payment-plan', 'monthly payment plan')} cover most cases. ${h.a('currently-not-collectible', 'Currently not collectible status')} is for people whose income does not cover basic living expenses: the IRS stops most collection, but the ${h.src('cnc', 'IRS page on it')} is clear that the debt is not forgiven, penalties and interest keep running, a lien may be filed and refunds are applied to the balance. An ${h.a('offer-in-compromise', 'offer in compromise')} settles for less when the IRS agrees that the full amount cannot be collected.</p>
<h2>What happens when nothing is done</h2>
<p>Ignoring the balance does not freeze it. The first bill, a ${h.a('cp14-notice', 'CP14')}, is followed by reminders, then a ${h.a('cp504-notice', 'CP504')} notice of intent to levy, after which the late payment penalty doubles to ${K.pct(P.ftp.afterLevyNotice)} a month. Refunds for later years are kept and applied. A lien can be filed against property, and wages or bank accounts can be levied. Every one of those steps can be stopped or avoided by one of the routes above, and none of them needs a paid firm: the IRS sets up plans online, by phone and in person, and the Taxpayer Advocate Service and Low Income Taxpayer Clinics help for free or a small fee. These figures are estimates for planning; the IRS decides what it accepts.</p>
`,
  faqs: [
    { q: 'Is it worth filing my tax return on time if I cannot pay the balance?', a: `In dollars, yes. The IRS itself says to file on time even when you cannot pay in full. Filing keeps the ${K.pct(P.ftf.monthly)} monthly late filing penalty at zero; only the ${K.pct(P.ftp.monthly)} late payment penalty and interest run. On ${K.usd(tax)}, not filing would cost ${K.usd(gap)} more over the next twelve months.` },
    { q: `What does it cost to file but not pay a balance of about ${K.usd(tax)} for a year?`, a: `With the 2025 return filed on time and nothing paid, ${K.usd(tax)} becomes ${K.usd(filed.total)} by ${K.day(at)}: ${K.usd(filed.ftp)} of late payment penalty and ${K.usd(filed.interest)} of interest. An approved payment plan would lower the penalty rate to ${K.pct(P.ftp.withPlan)} a month while it runs.` },
    { q: 'Will the IRS stop collecting if I truly cannot pay anything right now?', a: 'It can place the account in currently not collectible status after reviewing your income, expenses and assets, often on Form 433-F. Most collection stops, but the debt is not forgiven: penalties and interest keep accruing, refunds are applied to the balance, a lien may be filed and the IRS can resume collection if your situation improves.' },
  ],
  tool: 'debt',
  toolArg: { tax, ty: '2025', fs: 'ontime', pm: 12 },
  related: ['short-term-payment-plan', 'irs-payment-plan', 'currently-not-collectible', 'offer-in-compromise', 'failure-to-file-penalty', 'filing-extension-and-penalties'],
  sources: ['ftf', 'ftp', 'plans', 'cnc', 'irc6651'],
});
