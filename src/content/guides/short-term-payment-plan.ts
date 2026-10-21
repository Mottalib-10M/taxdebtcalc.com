import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.plans, F = L.fees;
const bal = 18500;
const six = K.plan(bal, 6);
const cases = [4000, bal, 46000, 92000].map((b) => ({ b, st: K.plan(b, 6), lt: K.plan(b, 24) }));
const mine = cases[1];
const int3 = K.interestOn(bal, K.today, K.addMonths(K.today, 3));
const end = K.addMonths(K.today, 6);

export default defineGuide({
  id: 'short-term-payment-plan',
  group: 'plans',
  order: 220,
  slug: 'short-term-payment-plan',
  nav: 'Short-term payment plan',
  card: `Up to ${L.shortTermDays} days, no set-up fee, for balances under ${K.usd(L.shortTermMax)}`,
  title: `Short-Term Payment Plan 2026: ${L.shortTermDays} Days, No Set-Up Fee`,
  description: `IRS short-term payment plan 2026: up to ${L.shortTermDays} days to pay a balance under ${K.usd(L.shortTermMax)}, no set-up fee, interest at ${K.rate(P.interest.current)} meanwhile. Compare it with a 24-month plan.`,
  h1: 'Short-term payment plan: six months, no fee, interest still running',
  intro: `The calculator is set to the short-term option. Type the balance on your notice: it gives the even monthly amount that clears it within ${L.shortTermDays} days and what the interest and penalty add, then compares longer terms.`,
  facts: [['Time to pay', `Up to ${L.shortTermDays} days`], ['Balance, combined', `Under ${K.usd(L.shortTermMax)}`], ['Set-up fee', K.usd(0)], ['Interest meanwhile', K.rate(P.interest.current)]],
  resume: `A short-term payment plan gives an individual up to ${L.shortTermDays} days to pay a combined balance of tax, penalties and interest under ${K.usd(L.shortTermMax)}. There is no set-up fee, by phone, mail, in person or online, which is where it beats a long-term installment agreement. It does not stop the meter: interest at the quarterly rate, ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}, and the late payment penalty keep running until the last dollar is paid. There is no required monthly amount, only the deadline, so paying early saves money. On ${K.usd(bal)}, six equal payments of ${K.usd(six.monthly)} clear the balance by ${K.month(end)} and add ${K.usd(six.interest + six.ftp)}. Spreading the same balance over 24 months would cut the payment to ${K.usd(mine.lt.monthly)} but add ${K.usd(mine.lt.interest + mine.lt.ftp)} plus a fee of at least ${K.usd(F.ddiaOnline)}.`,
  body: (h) => `
<h2>A deadline rather than a schedule</h2>
<p>The ${h.src('plans', 'IRS payment plan page')} describes the short-term plan in one line: pay the amount owed in ${L.shortTermDays} days or less. Once it is granted, payments can go through Direct Pay from a bank account, through the online account or EFTPS, or by check, money order or card, with processor fees on cards. Nothing fixes their size or date. One payment at day 170 is as acceptable as six monthly ones, though it costs more in interest. The page states the price twice: a ${K.usd(0)} set-up fee, plus accrued penalties and interest until the balance is paid in full.</p>
<p>Because it is a deadline, the cheapest way to use it is to pay the moment money is available. A tax refund, a bonus or a sale of assets inside the window shortens the period on which interest runs. On ${K.usd(bal)}, a single payment three months from now carries about ${K.usd(int3)} of interest alone, before any penalty month; paying a share each month instead lowers the base on which each day's interest is figured.</p>
<p>Two details shorten the real period. A federal refund issued inside the window is applied to the balance automatically, so it counts as a payment without any action. And the last payment has to be credited before the deadline: the IRS says to allow one to three weeks for a payment to appear on the account, three for a check sent by mail. Planning the final payment a few weeks before day ${L.shortTermDays} avoids a small leftover balance that would keep drawing interest.</p>
<h2>What ${L.shortTermDays} days costs on different balances</h2>
<p>The table spreads four balances evenly over six months and sets each against a 24-month installment agreement. The short-term plan has no fee; the long-term figure leaves out the fee, which starts at ${K.usd(F.ddiaOnline)} with direct debit online.</p>
${h.table(['Balance', 'Six payments of', 'Added in 6 months', '24 payments of', 'Added in 24 months'], cases.map((x) => [K.usd(x.b), K.usd(x.st.monthly), K.usd(x.st.interest + x.st.ftp), K.usd(x.lt.monthly), K.usd(x.lt.interest + x.lt.ftp)]), `Balances that are all tax, return filed on time, interest at ${K.rate(P.interest.current)} carried forward`, ['r', 'r', 'r', 'r', 'r'])}
${h.mini('plan', { t: `Your balance over ${L.shortTermDays} days`, p: ['bal'], d: { bal: 12600, mo: '6' } })}
<h2>Short-term or a monthly agreement</h2>
<p>The choice turns on one question: can the full balance be found within six months? If yes, the short-term plan is the cheaper of the two by the size of the fee and by the interest of the extra months. If not, committing to it and then missing the deadline leaves the balance unpaid and the penalty and interest running, while a monthly agreement would have set a payment that the budget can carry. A person with ${K.usd(cases[3].b)} to pay faces payments of ${K.usd(cases[3].st.monthly)} a month on a short-term schedule; few households carry that, and the ${h.a('irs-installment-agreement', 'installment agreement page')} sets out the alternatives.</p>
<p>The penalty side is worth checking too. The tax code cuts the late payment penalty to ${K.pct(P.ftp.withPlan)} a month, instead of ${K.pct(P.ftp.monthly)}, for an individual who filed on time and only for months in which an installment agreement under section 6159 is in force (${h.src('irc6651', 'IRC 6651(h)')}). A short-term plan is not such an agreement, so the figures on this page keep the ${K.pct(P.ftp.monthly)} rate for the ${L.shortTermDays}-day option and apply the reduced rate to the 24-month comparison only, as the calculator does. The IRS computes the actual penalty on your account.</p>
<h2>Who can ask, and how</h2>
<p>Individuals apply online for a short-term plan when they owe less than ${K.usd(L.shortTermMax)} in combined tax, penalties and interest; only individuals can do it online. Businesses call the number on their notice or the IRS business line. Anyone can also ask by phone, by mail or at a Taxpayer Assistance Center, still with no fee. The ${h.src('pastdue', 'IRS page on past due returns')} adds that the request goes through the Online Payment Agreement application or the individual phone line, and that no user fee is charged. The returns that are due have to be filed, since a missing return keeps every kind of plan out of reach.</p>
<h2>Protection while it runs, and what happens at the end</h2>
<p>The IRS generally does not take enforced collection action while a payment plan is being considered or while it is in effect, according to the payment plan page. If the balance is not cleared by day ${L.shortTermDays}, what is left is still owed, with its penalty and interest. The online account lets you revise the plan type, so the remaining balance can move into a long-term agreement, with that agreement\'s set-up fee, before the deadline passes. The IRS decides on each request and its terms; the amounts here are estimates.</p>
`,
  faqs: [
    { q: 'Is there a set-up fee for an IRS short-term payment plan?', a: `No. A short-term plan of up to ${L.shortTermDays} days has a ${K.usd(0)} set-up fee whether it is requested online, by phone, by mail or in person. Card payments carry the processor's own fee. Interest and the late payment penalty still accrue until the balance is paid in full, so the plan is free to set up but not free of charges.` },
    { q: 'Do I have to make equal monthly payments on a 180-day IRS plan?', a: `No. The short-term plan sets a deadline, not a schedule. You can pay in any amounts and on any dates, as long as the full balance is paid within ${L.shortTermDays} days. Each payment lowers the balance on which interest is figured, so earlier and larger payments cost less in the end.` },
    { q: 'Can a short-term payment plan be switched to a monthly installment agreement?', a: 'Yes. Through the online account, an individual can revise the plan type, the payment amount and the payment date. Moving to a long-term installment agreement brings that agreement\'s set-up fee and fixed monthly payments, but avoids running past the short-term deadline with a balance still open.' },
    { q: `What if I owe ${K.usd(L.shortTermMax)} or more and only need a few months?`, a: `The online short-term option is for combined balances under ${K.usd(L.shortTermMax)}. Above that, the request goes through the phone number on the notice, and a longer arrangement may require a financial statement, since the balance is also over the ${K.usd(L.simpleMax)} Simple Payment Plan limit. Paying part of the balance first can bring it under the online thresholds.` },
  ],
  tool: 'plan',
  toolArg: { bal, mo: '6' },
  related: ['irs-payment-plan', 'irs-installment-agreement', 'irs-payment-plan-fees', 'cant-pay-taxes', 'owe-irs-10000'],
  sources: ['plans', 'ftp', 'pastdue', 'interest'],
});
