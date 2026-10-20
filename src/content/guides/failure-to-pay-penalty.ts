import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, R = P.ftp;
const tax = 11000;
const pen = (t: number, rate: number, mo: number) => Math.min(R.max * t, rate * t * mo);
const capAt = (rate: number) => Math.ceil(R.max / rate);
const horizons = [1, 6, 12, 18, 30, 50];
const m18 = pen(tax, R.monthly, 18), m18plan = pen(tax, R.withPlan, 18);
/** Partial payment: the tax unpaid for 4 months, then a payment, then 14 more months on the rest. */
const paid = 6500, before = 4, after = 14;
const partial = R.monthly * tax * before + R.monthly * (tax - paid) * after;
const noticeDays = R.noticeDays, noticeLarge = R.noticeDaysLarge;

export default defineGuide({
  id: 'failure-to-pay-penalty',
  group: 'penalties',
  order: 120,
  slug: 'failure-to-pay-penalty',
  nav: 'Failure to pay penalty',
  card: `${K.pct(R.monthly)} a month, ${K.pct(R.withPlan)} in a plan, ${K.pct(R.afterLevyNotice)} after a levy notice, up to ${K.pct(R.max)}`,
  title: 'Failure to Pay Penalty 2026: Monthly Rate, Ceiling, Plans',
  description: `Failure to pay penalty 2026: ${K.pct(R.monthly)} of unpaid tax a month, ${K.pct(R.withPlan)} under a payment plan, ${K.pct(R.afterLevyNotice)} after a levy notice, capped at ${K.pct(R.max)}. Work out your own months.`,
  h1: 'Failure to pay penalty: the monthly charge on tax left unpaid',
  intro: 'Enter the unpaid tax and the number of months it stays unpaid, then pick the rate that applies: the standard rate, the reduced rate under a payment plan, or the higher rate after a final notice of intent to levy.',
  facts: [['Standard rate', `${K.pct(R.monthly)} a month`], ['In an approved plan, return on time', `${K.pct(R.withPlan)} a month`], ['After a notice of intent to levy', `${K.pct(R.afterLevyNotice)} a month`], ['Ceiling', K.pct(R.max)]],
  resume: `The failure to pay penalty is ${K.pct(R.monthly)} of the tax still unpaid for each month or part of a month after the due date, and it never exceeds ${K.pct(R.max)} of that tax. Three things change the monthly rate. An individual who filed on time and has an approved payment plan pays ${K.pct(R.withPlan)} a month while the plan runs. Anyone who has not paid 10 days after a notice of intent to levy pays ${K.pct(R.afterLevyNotice)} a month from then on. And each payment shrinks the base, because the penalty is figured on the tax left unpaid, not on the original amount. At the standard rate the ceiling arrives after ${capAt(R.monthly)} months; in a plan it takes ${capAt(R.withPlan)}. On ${K.usd(tax)} of tax left unpaid for 18 months, the penalty is ${K.usd(m18)} at the standard rate and ${K.usd(m18plan)} under a plan. Interest is charged separately, on top.`,
  body: (h) => `
<h2>What the base of the penalty is</h2>
<p>The ${h.src('ftp', 'IRS failure to pay penalty page')} defines unpaid tax as the tax required to be shown on the return minus withholding, estimated payments and refundable credits. Penalties and interest already on the account are not part of the base. That is why a payment applied to the tax first lowers next month's penalty, while a payment applied to interest would not.</p>
<p>The IRS charges a full month even when the tax is paid partway through it. Paying on the third day of a new month still costs that whole month at the rate in force. The table below holds the tax at ${K.usd(tax)} and runs the three rates side by side.</p>
${h.table(['Months unpaid', `Standard (${K.pct(R.monthly)})`, `In a plan (${K.pct(R.withPlan)})`, `After levy notice (${K.pct(R.afterLevyNotice)})`], horizons.map((m) => [String(m), K.usd(pen(tax, R.monthly, m)), K.usd(pen(tax, R.withPlan, m)), K.usd(pen(tax, R.afterLevyNotice, m))]), `${K.usd(tax)} of unpaid tax, no payment during the period; the levy column assumes the higher rate for every month`, ['r', 'r', 'r', 'r'])}
${h.mini('ftp', { t: 'Your unpaid tax and the months', p: ['tax', 'mo'], d: { tax: 3900, mo: 9 } })}
<h2>Two due dates, depending on how the tax arose</h2>
<p>For tax shown on a return, the penalty runs from the return due date, April 15 for most individuals, and an extension to file does not move it. For tax the IRS adds later, after an audit or a matching notice, the penalty starts only if the amount is not paid by the date on the notice. That date is generally ${noticeDays} calendar days after the notice, or ${noticeLarge} business days when the amount is ${K.usd(R.largeAmount)} or more. Paying an added amount by the notice date avoids this penalty on it altogether; interest from the original due date still applies.</p>
<h2>Paying part of the tax early</h2>
<p>Every dollar of tax paid stops its share of the penalty from the next month. Suppose ${K.usd(tax)} stays unpaid for ${before} months, then ${K.usd(paid)} is paid and the remaining ${K.usd(tax - paid)} stays open another ${after} months. The penalty over those ${before + after} months is ${K.usd(partial)}, against ${K.usd(m18)} if nothing had been paid until the end. A partial payment made before the IRS sends any notice works the same way; it does not need a plan or a phone call.</p>
<h2>When the rate halves and when it doubles</h2>
<p>The reduced ${K.pct(R.withPlan)} rate is limited to individuals whose return was filed on time, including extensions, and only for months in which an approved installment agreement is in force. A person who filed late and then set up a long-term plan keeps the ${K.pct(R.monthly)} rate. The ${h.a('irs-installment-agreement', 'installment agreement page')} compares the plan types.</p>
<p>The higher ${K.pct(R.afterLevyNotice)} rate starts 10 days after the IRS issues a notice of intent to levy, such as a CP504 or a final notice under section 6331(d), and applies to tax still unpaid from then on. It is the most expensive stage of the debt, and the same ${K.pct(R.max)} ceiling still caps it, reached after ${capAt(R.afterLevyNotice)} months at that rate.</p>
<h2>Reading the penalty on a balance due notice</h2>
<p>The first bill after a return is processed, usually a CP14, shows the late payment penalty charged up to the notice date and gives a date to pay. Each later notice adds the months that have passed since. Because the penalty is counted in whole months from the due date, two notices a few weeks apart can show the same penalty, then jump. The IRS page on the penalty also gives the plainest way to stop it: send a payment or pay the tax in full, and the months that follow are no longer charged on the part that was paid. When a notice seems wrong, the route is the same as for any penalty: call the number on it or write to the address it gives, with the notice and an explanation.</p>
<h2>The ceiling, and why interest does not stop with it</h2>
<p>Once the penalty reaches ${K.pct(R.max)} of the tax, it stops. On ${K.usd(tax)} that is ${K.usd(R.max * tax)}, however long the balance stays open. Interest keeps running on the tax and on the penalty itself at the quarterly rate, ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}, compounded daily. The ${h.a('irs-penalty-and-interest-calculator', 'penalty and interest calculator')} adds the two.</p>
<p>The penalty can be removed for reasonable cause or through first-time abatement, and for 2025 returns onward it is not assessed when the Automatic Exemption from Penalty applies. Lack of money alone is not reasonable cause, according to the IRS, though other facts showing ordinary care may be. The IRS rules on each request.</p>
`,
  faqs: [
    { q: 'Do I pay the failure to pay penalty for a whole month if I settle the tax early in that month?', a: `Yes. The IRS applies full monthly charges even when the tax is paid before the month ends. On ${K.usd(tax)}, each month or part of a month at the standard rate costs ${K.usd(R.monthly * tax)} of penalty, so paying a few days into a new month costs that full amount.` },
    { q: `Does the ${K.pct(R.withPlan)} payment plan rate apply if my return was filed late?`, a: `No. The reduced rate is for individuals who filed on time, with any extension counted, and who have an approved installment agreement. A late filer in a plan keeps ${K.pct(R.monthly)} a month. On ${K.usd(tax)} over 18 months the gap is ${K.usd(m18 - m18plan)} of penalty.` },
    { q: 'When does the failure to pay penalty go up after a final notice?', a: `It rises to ${K.pct(R.afterLevyNotice)} a month if the tax is still unpaid 10 days after the IRS issues a notice of intent to levy. The higher rate applies only to the months that follow, and the total is still capped at ${K.pct(R.max)} of the unpaid tax.` },
    { q: 'Is the failure to pay penalty figured on penalties and interest already owed?', a: 'No. Its base is the unpaid tax only: the tax required on the return minus withholding, estimated payments and refundable credits, or the additional tax on a notice. Interest, on the other hand, runs on everything owed, including the penalty itself, which is why payments that go to the tax first keep the penalty lowest.' },
  ],
  tool: 'ftp',
  toolArg: { tax, mo: 18, rt: 'std' },
  related: ['failure-to-file-penalty', 'irs-installment-agreement', 'irs-penalty-and-interest-calculator', 'first-time-penalty-abatement', 'cant-pay-taxes'],
  sources: ['ftp', 'irc6651', 'interest'],
});
