import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const owed: Array<[number, number]> = [[2025, 4800], [2024, 3900], [2023, 2700]];
const years = owed.map(([y, tax]) => {
  const due = K.DUE_DATES[y];
  const nf = K.projectDebt({ tax, due, filed: null, until: K.today });
  const ot = K.projectDebt({ tax, due, filed: due, until: K.today });
  return { y, tax, due, nf, ot, gap: nf.total - ot.total };
});
const tot = years.reduce((a, x) => a + x.nf.total, 0), taxes = years.reduce((a, x) => a + x.tax, 0);
const gapAll = years.reduce((a, x) => a + x.gap, 0);
const y25 = years[0];
const refundYears = [2022, 2023, 2024, 2025].map((y) => ({ y, last: K.addMonths(K.DUE_DATES[y], 36) }));
const closed = refundYears.filter((x) => x.last < K.today).map((x) => x.y);
const open23 = refundYears.find((x) => x.y === 2023)!;

export default defineGuide({
  id: 'unfiled-tax-returns',
  group: 'penalties',
  order: 160,
  slug: 'unfiled-tax-returns',
  nav: 'Unfiled tax returns',
  card: 'Several years not filed: what each year has become, and what filing now still changes',
  title: 'Unfiled Tax Returns 2026: Cost per Year, What Filing Changes',
  description: `Unfiled tax returns 2026: the late filing penalty of up to ${K.pct(P.ftf.max)} per year, the substitute return the IRS can file, refund deadlines and what each year costs.`,
  h1: 'Unfiled tax returns: what several missing years cost now',
  intro: 'Enter the tax you expect each missing year to show, after withholding. The calculator runs each year from its own due date to today, with the late filing penalty, the late payment penalty and interest, and adds them up.',
  facts: [['Late filing penalty ceiling', `${K.pct(P.ftf.max)}, reached after 5 months`], ['Minimum, returns due in 2026', K.usd(K.ftfMinimum(K.DUE_DATES[2025]))], ['Refund claim window', '3 years from the due date'], ['Tax Court window after a CP3219N', '90 days']],
  resume: `Each unfiled year is its own debt with its own due date. Five months after that date, the failure to file penalty has reached its ceiling of ${K.pct(P.ftf.max)} of the unpaid tax, so for any year older than that, filing now no longer lowers that penalty; what it changes is everything else. A filed return lets the IRS assess your figures instead of building a substitute return without your deductions, it opens the door to a payment plan, which requires all returns to be filed, and it is the only way to claim a refund, which is lost three years after the due date. Take three missing years with ${K.usd(years[0].tax)}, ${K.usd(years[1].tax)} and ${K.usd(years[2].tax)} of tax unpaid for 2025, 2024 and 2023. On ${K.day(K.today)} they come to ${K.usd(tot)}, of which ${K.usd(gapAll)} is due only to the returns not being filed.`,
  body: (h) => `
<h2>Each missing year runs on its own clock</h2>
<p>The penalties of section 6651 are counted per return. A 2023 return due ${K.day(K.DUE_DATES[2023])} has been late far longer than a 2025 return due ${K.day(K.DUE_DATES[2025])}, so its late payment penalty and its interest are further along, while its late filing penalty is capped at the same ${K.pct(P.ftf.max)}. The table runs the three example years and shows, in the last column, how much of each balance exists only because the return is missing.</p>
${h.table(['Year', 'Tax', 'Late filing', 'Late payment', 'Interest', 'Owed today', 'Due to not filing'], years.map((x) => [String(x.y), K.usd(x.tax), K.usd(x.nf.ftf), K.usd(x.nf.ftp), K.usd(x.nf.interest), K.usd(x.nf.total), K.usd(x.gap)]), `Returns not filed, nothing paid, counted to ${K.day(K.today)}`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
${h.mini('years', { t: 'Two missing years', p: ['y25', 'y24'], d: { y25: 3300, y24: 2150, y23: 0, fl: 'nf' } })}
<h2>Five months in, the filing penalty is spent</h2>
<p>The ${h.src('ftf', 'late filing penalty')} adds ${K.pct(P.ftf.monthly)} a month, reduced by the late payment penalty of the same month, for five months. After that it does not grow. Even the 2025 return in the example, due in April, was past that point by ${K.day(K.today)}, with ${K.usd(y25.nf.ftf)} of filing penalty on ${K.usd(y25.tax)} of tax. So the reason to file an old year now is not to stop that penalty. The late payment penalty and interest continue with or without the return, and the filing penalty can only be reduced afterwards, through ${h.a('first-time-penalty-abatement', 'first-time abatement')} or reasonable cause.</p>
<p>Where filing changes the outcome is in the steps that follow. The ${h.src('simple', 'Simple Payment Plan')} and the other plans require every required return to be on file. The IRS holds refunds for any year while another year is past due. And self-employed income on an unfiled return is never reported to Social Security, so it earns no credits toward retirement or disability benefits.</p>
<h2>When the IRS files the return for you</h2>
<p>If a return stays missing, the IRS can prepare a substitute return from the W-2s and 1099s it holds. The ${h.src('pastdue', 'IRS page on past due returns')} warns that this return may not give credit for deductions and exemptions you are entitled to. The IRS then mails a Notice of Deficiency, CP3219N, and you have 90 days to file your own return or petition the Tax Court; if neither happens, the proposed tax is assessed and goes to collection, with lien and levy possible. The ${P.plans.csedYears}-year collection period starts at that assessment, as the ${h.src('csed', 'IRS collection statute page')} explains. Filing your own return afterwards is still possible: if it shows less tax, the IRS can reduce the assessment, but the collection date already set stays the same.</p>
<h2>Refund years have a deadline instead of a penalty</h2>
<p>A missing year that would show a refund carries no late filing penalty, because there is no unpaid tax. It has a different trap: the refund must be claimed within three years of the return due date. ${closed.length ? `For ${closed.join(' and ')}, that window has already closed.` : 'No year in the table below has reached that limit yet.'} A refund for 2023 can be claimed until ${K.day(open23.last)}. A refund that is still claimable can also be applied by the IRS to the balance of another year.</p>
${h.table(['Tax year', 'Return due', 'Last day to claim a refund'], refundYears.map((x) => [String(x.y), K.day(K.DUE_DATES[x.y]), `${K.day(x.last)}${x.last < K.today ? ' (passed)' : ''}`]), 'Three years from the due date, without extensions or disaster postponements', ['l', 'l', 'l'])}
<h2>Which year to file first</h2>
<p>The table suggests an order without any rule requiring it. Years that show a refund still inside the three-year window carry a deadline, so they cannot wait. Years with a large balance cost the most interest per day, but filing them does not change that interest; paying does. A year where the IRS has already sent a CP3219N has a 90-day clock that outranks the rest. And a year that the IRS has not yet touched can usually be filed alongside the others in one batch. Once every return is in, the balances can be combined into one request for a plan, which is the step the ${h.a('back-taxes', 'back taxes page')} takes up.</p>
<h2>Rebuilding the figures of an old year</h2>
<p>Most people with unfiled years no longer have every form. The IRS gives two sources: Form 4506-T with the box on line 8 checked, for a wage and income transcript listing the W-2s and 1099s reported under your number, and Get Transcript for prior return information. Free help to prepare a return is available through the VITA and TCE programs for those who qualify. A past due return is filed the same way and at the same place as an on-time return, or to the address on the notice if one came; the IRS says it takes about six weeks to process an accurate one. These estimates do not replace the figures the IRS will assess, and only it decides on penalty relief.</p>
`,
  faqs: [
    { q: 'What is a substitute for return, and can I still file my own return afterwards?', a: 'It is a return the IRS prepares from the income reported to it by employers and payers, often without the deductions and credits you could claim. A CP3219N then gives you 90 days to file or go to the Tax Court. You can still file your own return later; if it shows less tax, the IRS can reduce the assessment.' },
    { q: 'Until what date can I claim the refund on a 2023 return I never filed?', a: `Until ${K.day(open23.last)}, three years after the ${K.day(K.DUE_DATES[2023])} due date. After that the refund is lost for good. The same three-year rule applies to refundable credits such as the earned income credit. A refund that is claimed in time can be applied to tax you owe for another year.` },
    { q: 'Can I get an IRS payment plan while some of my returns are still unfiled?', a: 'No. The Simple Payment Plan requires applicants to be current with all filing requirements, and a request for an installment agreement is denied when required returns are missing. Filing the missing years comes first; the balances of all years can then go into one plan.' },
    { q: 'How do I find my W-2 and 1099 amounts for a year I never filed?', a: 'Request a wage and income transcript with Form 4506-T, checking the box on line 8, or use Get Transcript online. The transcript lists the income employers and payers reported under your number for that year. Your employer or the payer can also send copies of the forms.' },
  ],
  tool: 'years',
  toolArg: { y25: owed[0][1], y24: owed[1][1], y23: owed[2][1], y22: 0, y21: 0, fl: 'nf' },
  related: ['back-taxes', 'failure-to-file-penalty', 'first-time-penalty-abatement', 'irs-payment-plan', 'irs-collection-statute-of-limitations'],
  sources: ['pastdue', 'ftf', 'csed', 'simple', 'irc6651'],
});
