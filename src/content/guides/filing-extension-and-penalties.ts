import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const due = K.DUE_DATES[2025];
const extDate = K.addMonths(due, 6);
const plus = (iso: string, d: number) => { const x = new Date(`${iso}T00:00:00Z`); x.setUTCDate(x.getUTCDate() + d); return x.toISOString().slice(0, 10); };
const tax = 8600, paidApril = 7200;
const lateExt = plus(extDate, 46);
const run = (t: number, filed: string | null, extension: boolean, until: string) => K.projectDebt({ tax: t, due, filed, extension, until });
const withExt = run(tax, extDate, true, K.today);
const noExt = run(tax, extDate, false, K.today);
const missedExt = run(tax, lateExt, true, lateExt);
const mostPaid = run(tax - paidApril, extDate, true, K.today);
const nothing = run(tax, null, false, K.today);
const rows: Array<[string, ReturnType<typeof run>]> = [
  [`Extension, filed ${K.day(extDate)}`, withExt],
  [`Extension, ${K.usd(paidApril)} paid in April, filed ${K.day(extDate)}`, mostPaid],
  [`No extension, filed ${K.day(extDate)}`, noExt],
  [`Extension, filed ${K.day(lateExt)}`, missedExt],
  ['No extension, not filed yet', nothing],
];
const saved = noExt.ftf;

export default defineGuide({
  id: 'filing-extension-and-penalties',
  group: 'penalties',
  order: 130,
  slug: 'filing-extension-and-penalties',
  nav: 'Extensions and penalties',
  card: 'What a six-month extension removes, and the interest and penalty it leaves running from April',
  title: 'Tax Extension Penalties 2026: Filing Moves, Payment Does Not',
  description: `Tax extension penalties 2026: Form 4868 moves filing to ${K.day(extDate).replace(', 2026', '')}, not payment. The ${K.pct(P.ftp.monthly)} monthly penalty and interest still run from April on unpaid tax.`,
  h1: 'A filing extension and the penalties it does not stop',
  intro: 'The calculator is set to a return filed on extension by October 15. Enter the tax that was still unpaid on April 15 and when you pay it: the result shows the late payment penalty and interest that the extension leaves in place.',
  facts: [['Extended filing date, 2025 returns', K.day(extDate)], ['Payment due date', K.day(due)], ['Late payment penalty during the extension', `${K.pct(P.ftp.monthly)} a month`], ['Interest rate now', K.rate(P.interest.current)]],
  resume: `An extension gives six more months to file the return, not to pay the tax. For 2025 returns the filing date moves from ${K.day(due)} to ${K.day(extDate)}, which removes the failure to file penalty for anyone who files by then. The tax itself was still due on ${K.day(due)}: anything unpaid on that date carries the late payment penalty of ${K.pct(P.ftp.monthly)} a month and interest at the quarterly rate, ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}, exactly as if no extension existed. Take ${K.usd(tax)} unpaid in April and a return filed on ${K.day(extDate)}. With the extension, the balance on ${K.day(K.today)} is ${K.usd(withExt.total)}. Without it, the same filing date is six months late and adds ${K.usd(saved)} of late filing penalty, for ${K.usd(noExt.total)}. Paying ${K.usd(paidApril)} of the tax in April would have brought the extended case down to ${K.usd(mostPaid.total)}.`,
  body: (h) => `
<h2>Three ways the IRS accepts an extension</h2>
<p>The ${h.src('extension', 'IRS extension page')} lists three routes to the October date. You can pay all or part of the tax online and mark the payment as an extension payment, which counts as the request without a separate form. You can file the request electronically through Free File, which has no income limit for extensions. Or you can mail ${h.ext('https://www.irs.gov/forms-pubs/about-form-4868', 'Form 4868')}, on which you estimate the year\'s tax and subtract what was already paid. The request has to be made by the April due date. U.S. citizens and resident aliens living outside the country on that date get an automatic two-month extension, and people in a declared disaster area may get more time.</p>
<h2>What the extension changes in the numbers</h2>
<p>Only the filing penalty depends on the filing date. With the extension, the ${h.a('failure-to-file-penalty', 'failure to file penalty')} counts from ${K.day(extDate)} instead of ${K.day(due)}. Without one, a return filed in October is six months late and the filing penalty has already reached its ${K.pct(P.ftf.max)} ceiling, reduced by the late payment penalty of the same months. The table runs ${K.usd(tax)} of 2025 tax through five situations.</p>
${h.table(['Situation', 'Late filing', 'Late payment', 'Interest', 'Owed at the end'], rows.map(([l, r]) => [l, K.usd(r.ftf), K.usd(r.ftp), K.usd(r.interest), K.usd(r.total)]), `${K.usd(tax)} of tax due ${K.day(due)}; paid on ${K.day(K.today)}, except the late extension case, paid when filed`, ['l', 'r', 'r', 'r', 'r'])}
${h.mini('debt', { t: 'Unpaid in April, filed on extension', p: ['tax', 'pm'], d: { tax: 5800, fs: 'ext', pm: 3 } })}
<h2>Interest and the late payment penalty from April</h2>
<p>The ${h.src('interest', 'IRS interest page')} says it plainly: underpayment interest applies even if you file an extension, and extensions to file do not extend the date for payment. The ${h.src('ftp', 'late payment penalty')} runs at ${K.pct(P.ftp.monthly)} a month on the unpaid tax from ${K.day(due)}. Between April and October that is six months, or ${K.pct(6 * P.ftp.monthly)} of whatever was not paid, plus about half a year of interest.</p>
<p>This is why the amount paid in April matters more than the extension itself. In the table, the person who paid ${K.usd(paidApril)} with the extension request ends with ${K.usd(mostPaid.total)}, against ${K.usd(withExt.total)} for the person who paid nothing until October. A payment made with the extension also counts as the request, so it does two jobs.</p>
<h2>Missing the extended date</h2>
<p>An extension buys one fixed date. A return filed after ${K.day(extDate)} is late from that date: in the table, a return filed on ${K.day(lateExt)} picks up ${K.usd(missedExt.ftf)} of late filing penalty for ${missedExt.ftfMonths} months counted from the extended date. More than ${P.ftf.minimumAfterDays} days after it, the minimum penalty of ${K.usd(K.ftfMinimum(due))} for returns due in 2026 can also apply. Interest on a filing penalty runs from the extended due date when an extension was filed.</p>
<h2>The 2025 return on a calendar</h2>
<p>For a 2025 Form 1040, the dates line up as follows. ${K.day(due)} is the day both the return and the tax are due, and the last day to ask for an extension. From the next day, any tax not paid starts accruing interest daily and the late payment penalty monthly. ${K.day(extDate)} is the last day to file without a failure to file penalty for anyone who asked in time. A few weeks after the return is processed, the IRS mails a bill for the balance, with the penalty and interest counted to the bill date and a date to pay. Paying by that date stops further interest on the amount shown; paying later adds it again until the day of payment.</p>
<h2>When the return shows a refund or no balance</h2>
<p>If withholding and estimated payments covered the tax, an extension changes nothing in money terms: there is no unpaid tax for either penalty to apply to. The extension is still useful for the paperwork. For a person who owes and cannot pay, the order of steps is the one the IRS itself gives: file by the date that applies, pay what you can, and ask for a ${h.a('short-term-payment-plan', 'short-term plan')} or an ${h.a('irs-installment-agreement', 'installment agreement')} for the rest. The ${h.a('cant-pay-taxes', 'page on owing more than you can pay')} sets the two penalties side by side.</p>
<p>These are estimates from the published rates and the dates in the IRS pages, not tax advice. Disaster postponements, which change both dates for a county, are not modelled, and the IRS figure on your notice prevails.</p>
`,
  faqs: [
    { q: 'Does a tax filing extension give me more time to pay what I owe the IRS?', a: `No. The extension moves only the filing date, to ${K.day(extDate)} for 2025 returns. Tax unpaid on ${K.day(due)} carries the late payment penalty of ${K.pct(P.ftp.monthly)} a month and daily interest from that date, extension or not. Paying as much as possible with the request is what lowers those charges.` },
    { q: 'What happens if I file after October 15 even though I requested an extension?', a: `The return is late from the extended date. The failure to file penalty counts each month or part of a month from ${K.day(extDate)}, and after ${P.ftf.minimumAfterDays} more days the minimum of ${K.usd(K.ftfMinimum(due))} for returns due in 2026 can apply. The late payment penalty and interest have been running since April in any case.` },
    { q: 'Do I need to send Form 4868 if I pay online and mark the payment as an extension payment?', a: 'No. According to the IRS extension page, paying all or part of the tax online and checking the box that the payment is for an extension counts as the request. You get a confirmation number for your records and do not file a separate form. Free File and a mailed Form 4868 are the other two routes.' },
    { q: 'Do Americans living abroad get extra filing time without asking for it?', a: 'Yes, in part. A U.S. citizen or resident alien living outside the country on the regular due date gets an automatic two-month extension to file. Interest still runs on unpaid tax from the April date. More time beyond that is requested with Form 4868, like any other extension.' },
  ],
  tool: 'debt',
  toolArg: { tax, ty: '2025', fs: 'ext', pm: 0 },
  related: ['failure-to-file-penalty', 'failure-to-pay-penalty', 'cant-pay-taxes', 'short-term-payment-plan', 'irs-penalty-and-interest-calculator'],
  sources: ['extension', 'interest', 'ftp', 'ftf', 'irc6651'],
});
