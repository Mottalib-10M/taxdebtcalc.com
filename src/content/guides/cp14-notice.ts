import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, PL = P.plans, F = PL.fees;
// A 2025 return filed on time, $6,300 left unpaid on April 15, 2026, first bill received.
const tax = 6300;
const due = K.DUE_DATES[2025];
const now = K.debt(tax, K.today, 0);
const perDay = now.total * (P.interest.currentRate / 365);
const delays = [0, 1, 3, 6, 12, 24].map((m) => { const until = K.addMonths(K.today, m); const r = K.debt(tax, until, 0); return { m, until, r }; });
const plan24 = K.plan(Math.round(now.total), 24);

export default defineGuide({
  id: 'cp14-notice',
  group: 'collection',
  order: 400,
  slug: 'cp14-notice',
  nav: 'CP14 notice',
  card: 'The first IRS bill: what the amount includes, what it costs to wait, and the replies that work',
  title: 'CP14 Notice 2026: What You Owe, Interest Per Day, Next Steps',
  description: `CP14 notice 2026: the first IRS bill, with its ${K.pct(P.ftp.monthly)} monthly late payment penalty and ${K.rate(P.interest.current)} interest, what each month of waiting adds, and how to pay or dispute.`,
  h1: 'CP14 notice: the first bill, and what waiting adds',
  intro: 'Enter the unpaid tax from your return, the tax year and when the return was filed. The calculator rebuilds the CP14 balance, penalty by penalty, and shows how it grows if you pay later.',
  facts: [['Late payment penalty', `${K.pct(P.ftp.monthly)} a month`], ['Interest rate, ' + K.quarter(P.interest.current), `${K.rate(P.interest.current)} a year`], ['Short-term plan, no fee', `${PL.shortTermDays} days`], ['Online plan with direct debit', K.usd(F.ddiaOnline)]],
  resume: `A CP14 is the first notice the IRS mails when a return shows tax that was not paid by the due date. It states the balance: the unpaid tax, the late payment penalty of ${K.pct(P.ftp.monthly)} of the unpaid tax for each month or part of a month since the due date, any late filing penalty, and interest at the quarterly rate (${K.rate(P.interest.current)} a year in the ${K.quarter(P.interest.current)}) compounded daily. It is a bill, not a levy notice: the IRS asks you to pay by the date printed on it, to set up a payment plan if you cannot, or to call if you disagree. Paying the full amount by that date stops further interest. After it, interest and penalty keep running, and unpaid balances lead to further notices and eventually to a notice of intent to levy. For ${K.usd(tax)} left unpaid on a 2025 return filed on time, the balance on ${K.day(K.today)} is ${K.usd(now.total)}, and it grows by about ${K.usd2(Math.round(perDay * 100) / 100)} a day.`,
  body: (h) => `
<h2>What the CP14 amount is made of</h2>
<p>The ${h.src('cp14', 'IRS page on the CP14')} says the notice is sent because you owe money on unpaid taxes, and that it explains how much and how to pay. The number is not arbitrary: it is the tax shown on your return minus what was paid by the due date, plus two charges set by law. The ${h.src('ftp', 'failure to pay penalty')} runs from the due date at ${K.pct(P.ftp.monthly)} a month, and ${h.src('interest', 'interest')} runs daily on the tax and on the penalties. If the return itself was late, a ${h.a('failure-to-file-penalty', 'late filing penalty')} is in the total too.</p>
<p>For a 2025 return filed by ${K.day(due)} with ${K.usd(tax)} left unpaid, the account on ${K.day(K.today)} looks like this:</p>
${h.table(['Line', 'Amount'], [
    ['Unpaid tax', K.usd(tax)],
    [`Late payment penalty, ${now.ftpMonths} months`, K.usd(now.ftp)],
    ['Interest, compounded daily', K.usd(now.interest)],
    ['Balance', `<strong>${K.usd(now.total)}</strong>`],
  ], `Return due ${K.day(due)}, filed on time`, ['l', 'r'])}
${h.mini('debt', { t: 'Rebuild your CP14 balance', p: ['tax', 'ty'], d: { tax, ty: '2025', fs: 'ontime', pm: 0 } })}
<h2>What a few months of silence cost</h2>
<p>The CP14 page answers the interest question directly: no further interest is charged if you pay the full amount by the date on the notice, but interest accrues on the unpaid amount after that date. The late payment penalty also continues, month by month, until it reaches ${K.pct(P.ftp.max)} of the tax. The table carries the same ${K.usd(tax)} forward at the current rate.</p>
${h.table(['Paid in full on', 'Penalty to date', 'Interest to date', 'Balance'], delays.map((x) => [K.day(x.until), K.usd(x.r.ftp), K.usd(x.r.interest), K.usd(x.r.total)]), `Interest at ${K.rate(P.interest.current)} carried forward; the next quarterly rate is ${P.interest.nextQuarter.expected}`, ['l', 'r', 'r', 'r'])}
<p>The cost of waiting is modest month to month, which is why CP14 balances tend to be left alone. The step that changes the slope comes later: once a final notice of intent to levy has gone unanswered for 10 days, the penalty rate doubles to ${K.pct(P.ftp.afterLevyNotice)} a month, as the ${h.a('cp504-notice', 'CP504 page')} shows.</p>
<h2>Paying part of it now</h2>
<p>A partial payment is not wasted while the rest is arranged. The late payment penalty is figured each month on the tax still unpaid at the start of the month, and interest runs on the whole balance, so every dollar sent early stops both from growing on that dollar. The site's calculators apply a payment to the tax first, the order that cuts the penalty fastest; the IRS's own allocation can differ. Notice 746, listed on the CP14 page, explains how the IRS computes the penalty and interest shown on the bill. For the following year, the IRS points to its Tax Withholding Estimator: a CP14 on a wage earner's return often means too little was withheld, and the same gap repeats unless the W-4 changes.</p>
<h2>The four replies the notice allows</h2>
<p><strong>Pay in full.</strong> Online from a bank account, through the online account, by card with a processor's fee, or by check with the bottom part of the notice. Paying by the notice date ends the interest on the bill.</p>
<p><strong>Pay over ${PL.shortTermDays} days.</strong> A short-term plan has no set-up fee for balances under ${K.usd(PL.shortTermMax)}; interest and penalty keep running until the balance is paid.</p>
<p><strong>Pay monthly.</strong> A long-term plan online with direct debit costs ${K.usd(F.ddiaOnline)}. On a filed-on-time return, the late payment penalty falls to ${K.pct(P.ftp.withPlan)} a month while the plan runs. Spreading the ${K.usd(now.total)} above over 24 months comes to ${K.usd(plan24.monthly)} a month. The ${h.a('irs-payment-plan', 'payment plan page')} compares terms.</p>
<p><strong>Disagree.</strong> Call the number in the IRS Help section of the notice with your records ready: cancelled checks, a payment confirmation, an amended return. A payment that was made but applied to the wrong year is a common cause, and the IRS can move it.</p>
<h2>CP14C, and when a CP14 is not the first letter</h2>
<p>If your address of record is in a federally declared disaster area, the IRS sends a CP14C instead. It means the deadline to file and pay has been postponed automatically, without a request. The IRS also mentions hardship: when paying would leave you unable to meet basic living costs, it may delay collection until your situation improves (see ${h.a('currently-not-collectible', 'currently not collectible status')}). The notice can be viewed and downloaded in the IRS online account, where you can also opt to receive some notices electronically. The arithmetic on this page follows the IRS penalty and interest rules; the amount on your own notice is the IRS's figure and governs.</p>
`,
  faqs: [
    { q: 'Is interest charged if I pay the CP14 amount by the date on the notice?', a: `No further interest is added if you pay the full amount shown by the date on the notice; the amount already includes the interest up to the notice. After that date, interest accrues daily on whatever remains unpaid, at ${K.rate(P.interest.current)} a year in the ${K.quarter(P.interest.current)}, and the late payment penalty keeps adding ${K.pct(P.ftp.monthly)} of the unpaid tax each month.` },
    { q: 'What is the difference between a CP14 and a CP14C notice?', a: 'A CP14C goes to taxpayers whose address of record is in a federally declared disaster area. It tells them they have additional time to file and to pay the amount that would have appeared on a CP14, and that the extension is automatic: no call or form is needed to get it. The disaster relief pages on irs.gov list the counties covered.' },
    { q: 'How do I dispute the balance on a CP14 notice?', a: 'Call the phone number in the IRS Help section of the notice and have your paperwork ready, such as cancelled checks, payment confirmations or an amended return. If a payment was credited to the wrong tax year or a return was processed with an error, the IRS can correct the account. Paying what is not in dispute keeps interest and penalty from growing on that part.' },
    { q: 'Can the IRS levy my bank account after a CP14?', a: 'Not on the CP14 alone. A CP14 is a bill. Before a levy, the IRS must send a Final Notice of Intent to Levy and Notice of Your Right to a Hearing at least 30 days ahead. Unpaid CP14 balances lead to reminder notices and then to that final notice, so the CP14 is the cheapest point to arrange payment.' },
  ],
  tool: 'debt',
  toolArg: { tax, ty: '2025', fs: 'ontime', pm: 0 },
  related: ['cp504-notice', 'irs-payment-plan', 'short-term-payment-plan', 'failure-to-pay-penalty', 'irs-penalty-and-interest-calculator'],
  sources: ['cp14', 'ftp', 'interest', 'rates', 'plans', 'levy'],
});
