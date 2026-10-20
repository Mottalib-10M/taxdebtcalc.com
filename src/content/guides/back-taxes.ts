import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const owed: Array<[number, number]> = [[2023, 6900], [2022, 4450], [2021, 2600]];
const capMonths = P.ftp.max / P.ftp.monthly;
const rows = owed.map(([y, tax]) => {
  const due = K.DUE_DATES[y];
  const r = K.projectDebt({ tax, due, filed: due, until: K.today });
  return { y, tax, due, r, capDate: K.addMonths(due, capMonths) };
});
const tot = rows.reduce((a, x) => a + x.r.total, 0), taxes = rows.reduce((a, x) => a + x.tax, 0);
const y21 = rows[2];
const rateYears = [2021, 2022, 2023, 2024, 2025, 2026].map((y) => [String(y), ...[1, 2, 3, 4].map((q) => K.rate(`${y}-Q${q}`))]);
const inYear = K.debt(owed[0][1], K.addMonths(K.today, 12), 0, K.DUE_DATES[2023]);
const now23 = rows[0].r.total;

export default defineGuide({
  id: 'back-taxes',
  group: 'penalties',
  order: 170,
  slug: 'back-taxes',
  nav: 'Back taxes',
  card: 'Old balances on filed returns: the penalty ceiling, the rate history and the collection clock',
  title: 'Back Taxes 2026: Old IRS Balances, Year by Year, Paid Today',
  description: `Back taxes 2026: what a 2021 to 2023 balance on a filed return has become, when the ${K.pct(P.ftp.max)} late payment penalty stops, and each year's ${P.plans.csedYears}-year IRS clock.`,
  h1: 'Back taxes: what an old balance has become',
  intro: 'Enter what was left unpaid for each year, as shown on the return or on the first bill. The calculator runs every year from its own due date to today and shows the penalty and interest piled onto each one.',
  facts: [['Late payment penalty ceiling', `${K.pct(P.ftp.max)} after ${capMonths} months`], ['Interest, ' + K.quarter(P.interest.current), K.rate(P.interest.current)], ['Collection period', `${P.plans.csedYears} years from assessment`]],
  resume: `Back taxes are balances from earlier years that were never paid in full, most often on returns that were filed on time. On those, there is no late filing penalty, but the late payment penalty of ${K.pct(P.ftp.monthly)} a month runs until it reaches ${K.pct(P.ftp.max)} of the tax, after ${capMonths} months, and interest keeps compounding daily at each quarter's rate, ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}. A 2021 balance has already hit the penalty ceiling; a 2023 balance has not. Take ${K.usd(rows[0].tax)} left from 2023, ${K.usd(rows[1].tax)} from 2022 and ${K.usd(rows[2].tax)} from 2021. On ${K.day(K.today)} they total ${K.usd(tot)}, against ${K.usd(taxes)} of original tax. Each year has its own collection period of ${P.plans.csedYears} years from the date the IRS assessed it, which can be suspended or extended, and the IRS keeps taking refunds until the balance is cleared.`,
  body: (h) => `
<h2>Old balances on returns that were filed</h2>
<p>This page is about years where the return went in but the money did not, or not all of it. The ${h.a('unfiled-tax-returns', 'unfiled returns page')} covers the other case. With the return on file, the IRS assessed the tax shown, sent a first bill, and has been adding the late payment penalty month by month and interest day by day ever since. The table counts both for the three example years.</p>
${h.table(['Year', 'Tax left unpaid', 'Months of penalty', 'Late payment', 'Interest', 'Owed today'], rows.map((x) => [String(x.y), K.usd(x.tax), String(x.r.ftpMonths), K.usd(x.r.ftp), K.usd(x.r.interest), K.usd(x.r.total)]), `Returns filed on time, nothing paid since the due date, counted to ${K.day(K.today)}`, ['l', 'r', 'r', 'r', 'r', 'r'])}
${h.mini('years', { t: 'Two older years, returns filed', p: ['y23', 'y22'], d: { y25: 0, y24: 0, y23: 5200, y22: 3100, y21: 0, fl: 'f' } })}
<h2>The penalty tops out; interest does not</h2>
<p>The ${h.src('ftp', 'late payment penalty')} stops at ${K.pct(P.ftp.max)} of the unpaid tax. At ${K.pct(P.ftp.monthly)} a month, that takes ${capMonths} months. For the 2021 example, due ${K.day(y21.due)}, the ceiling of ${K.usd(P.ftp.max * y21.tax)} was reached in ${K.month(y21.capDate)}. The 2022 balance gets there in ${K.month(rows[1].capDate)}, the 2023 balance in ${K.month(rows[0].capDate)}. After that point, an old balance grows only through interest, which is charged on the tax, the penalty and the interest already added. Left another twelve months, the 2023 balance alone would go from ${K.usd(now23)} to ${K.usd(inYear.total)}.</p>
<h2>The rates an old balance went through</h2>
<p>Interest on back taxes is not one rate. The underpayment rate is reset each quarter at the federal short-term rate plus three points, and every day of a balance uses the rate of its own quarter. A 2021 balance, due in April 2022, started at the ${K.rate('2022-Q2')} rate of the ${K.quarter('2022-Q2')} and went on to quarters at ${K.rate('2023-Q4')}, such as the ${K.quarter('2023-Q4')}. The ${h.src('rates', 'IRS quarterly rates page')} publishes the full series; the rows below are the underpayment rates the calculator applies.</p>
${h.table(['Year', 'Q1', 'Q2', 'Q3', 'Q4'], rateYears, 'IRS underpayment rate for individuals, by quarter', ['l', 'r', 'r', 'r', 'r'])}
<h2>Each year has its own collection clock</h2>
<p>The IRS generally has ${P.plans.csedYears} years from the date a tax was assessed to collect it, with the penalties and interest attached, as the ${h.src('csed', 'IRS page on the collection statute')} explains. For a return filed on time, assessment comes shortly after processing, so a 2021 balance assessed in 2022 is collectible until about ${2022 + P.plans.csedYears}. Each assessment has its own date: an amended return, an audit or a substitute return creates a new one. The date can move. A pending installment agreement request, a pending offer in compromise, a bankruptcy or six months or more living abroad suspend it, and the exact date for each year is on the account transcript.</p>
<h2>What the IRS does in the meantime</h2>
<p>An old balance does not sit quietly. Each refund for a later year is applied to it, and the IRS can file a ${h.a('irs-tax-lien', 'notice of federal tax lien')} or move toward a levy after its final notices; a ${h.a('cp504-notice', 'CP504')} is the step where the penalty can rise to ${K.pct(P.ftp.afterLevyNotice)} a month. A balance over ${K.usd((P.passport as Record<string, number>)['2026'])} with a lien or levy and nothing arranged can also lead to ${h.a('irs-passport-revocation', 'passport certification')}.</p>
<h2>Checking the real balance of each year</h2>
<p>The figures above assume nothing was paid after the due date. Real accounts rarely look like that: a refund was taken one year, a payment went in another, a notice was paid on time and stopped the interest on its amount. The individual online account shows the current amount owed and the payment history, and the account transcript of each year lists every charge, credit and the collection date. The IRS asks for one to three weeks before a recent payment shows, three for payments that are not electronic. Entering the unpaid tax of each year as the transcript shows it, rather than the figure on the original return, brings the calculator much closer to the real total.</p>
<h2>Paying several years with one plan</h2>
<p>A single installment agreement can cover every year owed, and the eligibility tests use the combined balance: ${K.usd(P.plans.simpleMax)} or less in tax, penalties and interest for a Simple Payment Plan, with every required return filed. The three example years, at ${K.usd(tot)}, fit under that limit. An approved plan with returns that were filed on time also halves the monthly penalty on any year not yet at its ceiling, to ${K.pct(P.ftp.withPlan)}. The ${h.a('irs-installment-agreement', 'installment agreement page')} compares the plan types. All figures here are estimates from the published rates; the balance on your transcript is the one that counts.</p>
`,
  faqs: [
    { q: 'Does the IRS stop adding the late payment penalty to back taxes after some years?', a: `Yes, once it reaches ${K.pct(P.ftp.max)} of the unpaid tax. At ${K.pct(P.ftp.monthly)} a month, that is ${capMonths} months after the due date, so a 2021 balance has already reached it. Interest keeps running after that, compounded daily on the tax, the penalty and earlier interest, until the balance is paid.` },
    { q: 'Can the IRS still collect a 2021 tax balance several years from now?', a: `Generally yes. The collection period is ${P.plans.csedYears} years from the assessment date, so a 2021 return assessed in 2022 can be collected until about ${2022 + P.plans.csedYears}, and longer if the clock was suspended, for example while an installment agreement request or an offer was pending. The exact date appears on the account transcript.` },
    { q: 'Will this year\'s federal refund be used to pay my back taxes?', a: 'Yes. The IRS applies refunds to any unpaid federal tax balance until it is paid in full, including while you are in a payment plan and while your account is in hardship status. In a plan, the scheduled monthly payments are still due even after a refund is applied to the balance.' },
    { q: 'Can one IRS payment plan cover back taxes from three different years?', a: `Yes. A plan covers the combined balance of all years, and the Simple Payment Plan test uses that combined figure: ${K.usd(P.plans.simpleMax)} or less in tax, penalties and interest, with all required returns filed. The example on this page, three years totaling ${K.usd(tot)}, fits within it.` },
  ],
  tool: 'years',
  toolArg: { y25: 0, y24: 0, y23: owed[0][1], y22: owed[1][1], y21: owed[2][1], fl: 'f' },
  related: ['unfiled-tax-returns', 'irs-installment-agreement', 'irs-collection-statute-of-limitations', 'cp504-notice', 'irs-penalty-and-interest-calculator'],
  sources: ['ftp', 'rates', 'csed', 'simple', 'interest'],
});
