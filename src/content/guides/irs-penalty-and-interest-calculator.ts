import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const tax = 7400;
const due = K.DUE_DATES[2025];
const scen: Array<[string, number | null]> = [['Filed on time', 0], ['Filed 25 days late', 25], ['Filed 100 days late', 100], ['Not filed yet', null]];
const byFiling = scen.map(([l, d]) => ({ l, r: K.debt(tax, K.today, d) }));
const onTime = byFiling[0].r, notFiled = byFiling[3].r;
const later = [0, 3, 6, 12, 24].map((m) => ({ m, r: K.debt(tax, K.addMonths(K.today, m), 0) }));
const in12 = later.find((x) => x.m === 12)!.r;
const old = K.debt(tax, K.today, 0, K.DUE_DATES[2023]);
const perDay = onTime.total * (P.interest.currentRate / 365);

export default defineGuide({
  id: 'irs-penalty-and-interest-calculator',
  group: 'penalties',
  order: 100,
  slug: 'irs-penalty-and-interest-calculator',
  nav: 'Penalty and interest calculator',
  card: 'Your balance today: tax, both late penalties and daily interest, split line by line',
  title: 'IRS Penalty and Interest Calculator 2026: Late Payment Cost',
  description: `IRS penalty and interest calculator 2026: late filing and late payment penalties of section 6651 plus interest at ${K.pct(P.interest.currentRate)}, compounded daily, to any payoff date.`,
  h1: 'IRS penalties and interest: what an unpaid tax becomes',
  intro: 'Enter the tax left unpaid, the year it belongs to and when the return went in. The result splits today\'s balance into tax, late filing penalty, late payment penalty and interest, then follows it month by month to the day you pay.',
  facts: [['Interest rate, ' + K.quarter(P.interest.current), K.rate(P.interest.current)], ['Late filing penalty', `${K.pct(P.ftf.monthly)} a month`], ['Late payment penalty', `${K.pct(P.ftp.monthly)} a month`], ['Ceiling of each penalty', K.pct(P.ftf.max)]],
  resume: `An unpaid federal income tax picks up three separate charges. The failure to file penalty is ${K.pct(P.ftf.monthly)} of the unpaid tax for each month or part of a month the return is late, and it stops growing after ${P.ftf.max / P.ftf.monthly} months at ${K.pct(P.ftf.max)}. The failure to pay penalty is ${K.pct(P.ftp.monthly)} a month on the tax still unpaid, up to ${K.pct(P.ftp.max)}, which takes ${P.ftp.max / P.ftp.monthly} months to reach. Interest runs on the tax and on the penalties at the underpayment rate of each quarter, ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}, compounded every day and with no ceiling. Take ${K.usd(tax)} of 2025 tax that was due on ${K.day(due)}. If the return was filed on time, the balance on ${K.day(K.today)} is ${K.usd(onTime.total)}. If the return is still not filed, it is ${K.usd(notFiled.total)}, because the late filing penalty alone adds ${K.usd(notFiled.ftf)}. Left another year with the return filed, the same debt reaches ${K.usd(in12.total)}.`,
  body: (h) => `
<h2>Three charges, three different clocks</h2>
<p>The two penalties come from ${h.src('irc6651', 'section 6651 of the Internal Revenue Code')} and work on months, not days. The ${h.src('ftf', 'failure to file penalty')} counts each month or part of a month from the due date, including any extension, to the day the return reaches the IRS. In a month where both penalties apply, the filing penalty is reduced by the payment penalty, so the combined charge is ${K.pct(P.ftf.monthly)}, not ${K.pct(P.ftf.monthly + P.ftp.monthly)}. A return filed more than ${P.ftf.minimumAfterDays} days late also triggers a minimum penalty of ${K.usd(K.ftfMinimum(due))} for returns due in 2026, or the whole tax if that is less.</p>
<p>The ${h.src('ftp', 'failure to pay penalty')} counts from the payment due date, which an extension never moves. Interest, set by ${h.src('irc6621', 'section 6621')} at the federal short-term rate plus three points and compounded daily under ${h.src('irc6622', 'section 6622')}, is the only charge that keeps going for as long as anything is owed. The table holds the tax at ${K.usd(tax)} and changes only the filing date.</p>
${h.table(['2025 return', 'Late filing', 'Late payment', 'Interest', `Balance on ${K.day(K.today)}`], byFiling.map((x) => [x.l, K.usd(x.r.ftf), K.usd(x.r.ftp), K.usd(x.r.interest), K.usd(x.r.total)]), `${K.usd(tax)} of tax due ${K.day(due)}, nothing paid since`, ['l', 'r', 'r', 'r', 'r'])}
${h.mini('debt', { t: 'Your tax and the filing date', p: ['tax', 'fs'], d: { tax: 9300, fs: 'l2' } })}
<h2>Interest is charged on the penalties too</h2>
<p>People often expect interest on the tax alone. The ${h.src('interest', 'IRS interest page')} says otherwise: interest runs on any unpaid tax, penalty, addition to tax or earlier interest. The late filing penalty is treated as due on the return due date, so it bears interest from that day. The late payment penalty is due when the IRS sends a notice or assesses it; this calculator starts interest on each month of that penalty as it accrues, which can put the result a few dollars above the notice. Because each day's interest is added to the next day's base, a balance growing at ${K.rate(P.interest.current)} a year grows slightly faster than ${K.rate(P.interest.current)} would suggest.</p>
<p>On the filed-on-time version of the example, interest now adds about ${K.usd2(Math.round(perDay * 100) / 100)} a day. That figure moves up as the penalties grow and down with every payment, since payments go to the tax first and the penalty is figured on unpaid tax only.</p>
<h2>What waiting costs, month by month</h2>
<p>Postponing the payment changes two lines: the late payment penalty, until it reaches its ceiling, and the interest, which never does. The filing penalty is fixed once the return is in. Here is the same ${K.usd(tax)}, return filed on time, paid on different dates.</p>
${h.table(['Paid', 'Late payment penalty', 'Interest', 'Total due'], later.map((x) => [x.m === 0 ? `Today (${K.day(K.today)})` : `In ${x.m} months`, K.usd(x.r.ftp), K.usd(x.r.interest), K.usd(x.r.total)]), `Interest at ${K.rate(P.interest.current)} kept for quarters not yet published; the next rate is ${P.interest.nextQuarter.expected}`, ['l', 'r', 'r', 'r'])}
<p>Rates for future quarters are not known yet, so the calculator carries the last published rate forward and says so under the result. The IRS posts each new quarter on its ${h.src('rates', 'quarterly interest rates page')}, and a new rate applies to the whole unpaid balance from the first day of its quarter.</p>
<h2>An older year carries its own rate history</h2>
<p>A balance from an earlier year has lived through rates that a 2025 balance never saw. The same ${K.usd(tax)} for tax year 2023, due ${K.day(K.DUE_DATES[2023])} and filed on time, crossed quarters at ${K.rate('2024-Q1')}, then ${K.rate('2025-Q1')}, then ${K.rate('2026-Q2')} in the ${K.quarter('2026-Q2')}. On ${K.day(K.today)} it stands at ${K.usd(old.total)}, with the late payment penalty already at ${K.usd(old.ftp)} and interest at ${K.usd(old.interest)}. Choosing the tax year in the calculator applies the right due date and the right sequence of rates.</p>
<h2>Reading the result next to an IRS notice</h2>
<p>A notice is computed to the date printed on it, and it includes payments, credits and refunds the IRS has already applied. Small gaps between the notice and this page usually come from the start date of interest on the late payment penalty, a payment credited on a different day, or a disaster postponement of the due date in your county, which this tool does not model. Large gaps usually mean a different tax figure: an amended return, a CP2000 adjustment or a substitute return prepared by the IRS.</p>
<p>The penalties can sometimes be removed, and their interest goes with them; the interest on the tax itself cannot be waived for reasonable cause. The ${h.a('first-time-penalty-abatement', 'first-time abatement page')} and the ${h.a('irs-penalty-abatement', 'penalty abatement page')} explain who qualifies. The figures here are an estimate for planning, not tax advice: the amount you owe is the one the IRS assesses, and only the IRS can change it.</p>
`,
  faqs: [
    { q: 'Does the IRS charge interest on the late filing penalty starting from the April due date?', a: `Yes. The IRS treats the failure to file penalty as due on the return due date, or the extended date if you had an extension, so interest on it runs from then at the quarterly rate, ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}. The late payment penalty is different: interest on it starts from the date of the notice or the assessment.` },
    { q: 'Is there a ceiling on IRS interest the way there is on the two late penalties?', a: `No. Each penalty stops at ${K.pct(P.ftf.max)} of the unpaid tax, the filing penalty after ${P.ftf.max / P.ftf.monthly} months and the payment penalty after ${P.ftp.max / P.ftp.monthly}. Interest has no ceiling: it is compounded daily on the whole unpaid balance, including the penalties and earlier interest, until the day the balance reaches zero.` },
    { q: 'Why can the penalty and interest on my IRS notice differ from this calculator?', a: 'The notice is figured to its own date and reflects payments, refund offsets and adjustments already posted to your account. This page starts interest on the late payment penalty month by month, while the IRS starts it at the notice date, and it does not model county disaster postponements. Small differences are normal; the notice is the official figure.' },
    { q: `How much does an unpaid federal tax balance of about ${K.usd(tax)} grow per day?`, a: `With the return filed on time and the ${K.rate(P.interest.current)} rate of the ${K.quarter(P.interest.current)}, interest on the example balance is about ${K.usd2(Math.round(perDay * 100) / 100)} a day today. The late payment penalty adds ${K.usd(tax * P.ftp.monthly)} for each further month or part of a month, until it reaches ${K.usd(tax * P.ftp.max)}.` },
  ],
  tool: 'debt',
  toolArg: { tax, ty: '2025', fs: 'ontime' },
  related: ['failure-to-file-penalty', 'failure-to-pay-penalty', 'first-time-penalty-abatement', 'irs-payment-plan', 'back-taxes'],
  sources: ['irc6651', 'ftf', 'ftp', 'interest', 'rates', 'irc6621', 'irc6622'],
});
