import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const due = K.DUE_DATES[2025];
const plus = (iso: string, d: number) => { const x = new Date(`${iso}T00:00:00Z`); x.setUTCDate(x.getUTCDate() + d); return x.toISOString().slice(0, 10); };
/** Return filed `d` days late and the tax paid the same day: the filing penalty and the payment penalty of that period. */
const late = (tax: number, d: number) => K.debt(tax, plus(due, d), d);
const tax = 6200;
const ladder = [1, 31, 45, 61, 92, 122, 153, 240].map((d) => ({ d, r: late(tax, d) }));
const d45 = late(tax, 45), d153 = late(tax, 153);
const small = [380, 1100, 2600, 9400].map((t) => ({ t, r: late(t, 75) }));
const min26 = K.ftfMinimum(due);
const maxMonths = P.ftf.max / P.ftf.monthly;
const minRows = [...P.ftf.minimum].reverse().map((m, i, a) => {
  const from = Number(m.dueFrom.slice(0, 4));
  const to = i === 0 ? null : Number(a[i - 1].dueFrom.slice(0, 4)) - 1;
  return [to === null ? `Due in ${from} or later` : from === to ? `Due in ${from}` : `Due ${from} to ${to}`, K.usd(m.amount)];
});

export default defineGuide({
  id: 'failure-to-file-penalty',
  group: 'penalties',
  order: 110,
  slug: 'failure-to-file-penalty',
  nav: 'Failure to file penalty',
  card: `${K.pct(P.ftf.monthly)} a month for ${maxMonths} months, and the ${K.usd(min26)} minimum after ${P.ftf.minimumAfterDays} days`,
  title: `Failure to File Penalty 2026: ${K.pct(P.ftf.monthly)} a Month, ${K.usd(min26)} Minimum`,
  description: `Failure to file penalty 2026: ${K.pct(P.ftf.monthly)} of the unpaid tax per month late, up to ${K.pct(P.ftf.max)}, and a ${K.usd(min26)} minimum once a return is over ${P.ftf.minimumAfterDays} days late. Count it by the day.`,
  h1: 'Failure to file penalty: the cost of each month a return is late',
  intro: 'Type the tax that was not paid by the due date and how many days late the return was filed. The result counts the months the IRS charges, applies the offset for the late payment penalty and checks whether the minimum penalty takes over.',
  facts: [['Rate per month or part of a month', K.pct(P.ftf.monthly)], ['Ceiling', `${K.pct(P.ftf.max)} after ${maxMonths} months`], [`Minimum, returns due in 2026, over ${P.ftf.minimumAfterDays} days late`, K.usd(min26)]],
  resume: `The failure to file penalty is ${K.pct(P.ftf.monthly)} of the tax left unpaid on the due date for each month or part of a month the return is late, with a ceiling of ${K.pct(P.ftf.max)} reached after ${maxMonths} months. When the late payment penalty runs in the same month, the filing penalty drops by that amount, so the usual monthly charge is ${K.pct(P.ftf.monthly - P.ftp.monthly)} for filing plus ${K.pct(P.ftp.monthly)} for payment. Once a return is more than ${P.ftf.minimumAfterDays} days late, a minimum applies: ${K.usd(min26)} for returns due in 2026, or the whole unpaid tax if that is less. The penalty is figured on unpaid tax only, so a return showing a refund or a balance paid on time carries none. On ${K.usd(tax)} of 2025 tax, a return filed ${45} days late costs ${K.usd(d45.ftf)} in late filing penalty; at ${153} days it reaches ${K.usd(d153.ftf)}, and waiting longer adds nothing more to this penalty.`,
  body: (h) => `
<h2>How the IRS counts the months</h2>
<p>The ${h.src('ftf', 'IRS failure to file penalty page')} lays the calculation out in four steps: the tax required to be shown on the return, minus tax paid on time through withholding or estimated payments, minus refundable credits, multiplied by ${K.pct(P.ftf.monthly)} for each month or partial month. The clock starts on the due date, or the extended due date if an extension was filed, and stops on the day the IRS receives the return. One day late is one month. The same date one month later is still one month; the next day is two.</p>
<p>That rule makes the first days the most expensive per day. On ${K.usd(tax)} unpaid, the first day late costs ${K.usd(ladder[0].r.ftf)} of filing penalty. Day ${ladder[1].d} starts a second month. The table runs the same tax through the calendar, with the tax paid on the day the return is filed.</p>
${h.table(['Days late', 'Months counted', 'Late filing', 'Late payment', 'Both'], ladder.map((x) => [String(x.d), String(x.r.ftfMonths), K.usd(x.r.ftf), K.usd(x.r.ftp), K.usd(x.r.ftf + x.r.ftp)]), `${K.usd(tax)} of 2025 tax due ${K.day(due)}, paid when the return is filed; interest not included`, ['r', 'r', 'r', 'r', 'r'])}
${h.mini('ftf', { t: 'Your tax and the days late', p: ['tax', 'dl'], d: { tax: 4700, dl: 70 } })}
<h2>The ${K.pct(P.ftf.monthly - P.ftp.monthly)} plus ${K.pct(P.ftp.monthly)} split</h2>
<p>Section 6651(a) of the tax code stacks the two penalties, but the IRS does not charge both at full rate for the same month. In any month where the ${h.a('failure-to-pay-penalty', 'late payment penalty')} applies, the filing penalty is cut by the same amount. Over the five filing months, that leaves ${K.pct(P.ftf.max - maxMonths * P.ftp.monthly)} of late filing penalty and ${K.pct(maxMonths * P.ftp.monthly)} of late payment penalty, ${K.pct(P.ftf.max)} in all. From the sixth month the filing penalty is spent, while the payment penalty keeps adding ${K.pct(P.ftp.monthly)} a month toward its own ceiling.</p>
<h2>The minimum penalty after ${P.ftf.minimumAfterDays} days</h2>
<p>A return more than ${P.ftf.minimumAfterDays} days late triggers a floor. For a small balance, the floor can be larger than the monthly percentage. Three months at the reduced rate on ${K.usd(small[1].t)} would be well under ${K.usd(min26)}, so the minimum replaces it; on ${K.usd(small[0].t)} the minimum is capped at the tax itself, which doubles what is owed. The amount depends on the year the return was due, without extensions.</p>
${h.table(['Return 75 days late, tax unpaid', 'Late filing penalty', 'Minimum used?'], small.map((x) => [K.usd(x.t), K.usd(x.r.ftf), x.r.minimumApplied ? 'Yes' : 'No, the percentage is higher']), `2025 returns, due ${K.day(due)}`, ['l', 'r', 'l'])}
${h.table(['Return due date (without extension)', 'Minimum penalty'], minRows, `Forms 1040 and 1120, from the IRS failure to file penalty page read on ${K.day(P.meta.retrieved_at)}`, ['l', 'r'])}
<h2>Who owes nothing for filing late</h2>
<p>The penalty is a percentage of unpaid tax. A return that shows a refund, or a balance fully covered by withholding and payments made by the due date, has nothing to multiply, so filing it late costs no failure to file penalty. The risk there is different: a refund not claimed within three years of the due date is lost, as the ${h.src('pastdue', 'IRS page on past due returns')} explains. Partnerships and S corporations follow another formula, a fixed amount per partner or shareholder per month, which this page does not cover.</p>
<p>An ${h.a('filing-extension-and-penalties', 'extension to file')} moves the start of the count by six months for this penalty only. It does not move the payment date, so the late payment penalty and interest still run from April.</p>
<h2>The notice, and how to contest the amount</h2>
<p>The IRS does not wait for you to compute the penalty. It sends a notice or letter that names the penalty, the months counted and the interest added. If the count looks wrong, typically because the IRS dated the return later than the postmark or the e-file acknowledgment, the IRS page says to call the number on the notice or write a signed letter to the address on it. The letter names the notice, the penalty in question and, for each penalty, why it should be reconsidered, with supporting documents such as the e-file acceptance or a certified mail receipt. A dated proof of filing is usually the strongest piece, since the whole calculation hangs on the day the return was received.</p>
<h2>Getting the penalty removed</h2>
<p>The IRS removes the failure to file penalty for reasonable cause, such as a serious illness, a disaster or records that could not be obtained, and on request under first-time abatement for people with three clean prior years. For 2025 returns and later, the Automatic Exemption from Penalty means the penalty is not assessed at all when that clean history exists. Interest charged on the penalty goes away with it. See ${h.a('first-time-penalty-abatement', 'first-time abatement and the automatic exemption')} and ${h.a('irs-penalty-abatement', 'reasonable cause relief')}. Each request is decided by the IRS; this page only shows the arithmetic.</p>
`,
  faqs: [
    { q: 'Is there a failure to file penalty when my late return shows a refund?', a: `No. The penalty is ${K.pct(P.ftf.monthly)} of the tax left unpaid after withholding, timely payments and refundable credits, so a refund return has nothing to apply it to. The refund itself is at risk, though: it has to be claimed within three years of the return due date, or it is lost.` },
    { q: 'Does a return filed one day after the deadline count as a full month late?', a: `Yes. The IRS charges for each month or part of a month. One day late counts as one month, which on a balance of ${K.usd(tax)} means a late filing penalty of ${K.usd(ladder[0].r.ftf)} once the late payment offset is applied. Filing within the first month keeps it at one month.` },
    { q: `What is the minimum failure to file penalty on a 2025 return filed after ${P.ftf.minimumAfterDays} days?`, a: `For returns due in 2026, which includes 2025 Forms 1040 due ${K.day(due)}, the minimum is ${K.usd(min26)} or the entire unpaid tax, whichever is less. It applies only if the return is more than ${P.ftf.minimumAfterDays} days late and the percentage penalty comes to less than that floor.` },
    { q: 'Does the late filing penalty keep growing after the fifth month?', a: `No. It stops at ${K.pct(P.ftf.max)} of the unpaid tax after ${maxMonths} months. What keeps growing is the late payment penalty, ${K.pct(P.ftp.monthly)} a month up to its own ${K.pct(P.ftp.max)} ceiling, and interest compounded daily on the whole balance, penalties included.` },
  ],
  tool: 'ftf',
  toolArg: { tax, dl: 45 },
  related: ['failure-to-pay-penalty', 'filing-extension-and-penalties', 'unfiled-tax-returns', 'first-time-penalty-abatement', 'irs-penalty-and-interest-calculator'],
  sources: ['ftf', 'irc6651', 'pastdue'],
});
