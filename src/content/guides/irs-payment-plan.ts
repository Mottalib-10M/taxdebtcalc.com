import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, F = P.plans.fees;
const bal = 15000;
const terms = [6, 12, 24, 36, 60, 120];
const rows = terms.map((m) => ({ m, ...K.plan(bal, m) }));
const p36 = rows.find((r) => r.m === 36)!;
const late36 = K.plan(bal, 36, false);
const p120 = rows.find((r) => r.m === 120)!;

export default defineGuide({
  id: 'irs-payment-plan',
  group: 'plans',
  order: 200,
  slug: 'irs-payment-plan',
  nav: 'IRS payment plan',
  card: `Monthly payment, total cost and the ${K.usd(F.ddiaOnline)} to ${K.usd(F.otherOther)} set-up fee`,
  title: 'IRS Payment Plan 2026: Monthly Payment, Fees, Total Cost',
  description: `IRS payment plan 2026: the monthly payment for your balance and term, set-up fees from $0 to ${K.usd(F.otherOther)}, the ${K.pct(P.ftp.withPlan)} penalty rate and the interest added to the bill.`,
  h1: 'IRS payment plan: what you pay each month and in total',
  intro: 'Type what you owe today and the number of months. The calculator gives the payment that clears the balance on time, the interest and penalty the plan adds, and which kind of plan the IRS offers for that amount.',
  facts: [['Online plan, balance up to', K.usd(P.plans.simpleMax)], ['Short-term plan', `${P.plans.shortTermDays} days`], ['Set-up fee, direct debit online', K.usd(F.ddiaOnline)], ['Late payment penalty in a plan', K.pct(P.ftp.withPlan)]],
  resume: `The IRS offers two kinds of payment plan to individuals. A short-term plan gives up to ${P.plans.shortTermDays} days to pay a balance under ${K.usd(P.plans.shortTermMax)} and has no set-up fee. A long-term plan, called an installment agreement, takes monthly payments; for a balance of ${K.usd(P.plans.simpleMax)} or less in tax, penalties and interest, with all returns filed, it is a Simple Payment Plan that needs no financial statement and gives most people up to ${P.plans.csedYears} years. The set-up fee is ${K.usd(F.ddiaOnline)} online with direct debit, ${K.usd(F.otherOnline)} online with other payments, ${K.usd(F.ddiaOther)} or ${K.usd(F.otherOther)} by phone, mail or in person, and it is waived or reduced for low incomes. Interest keeps running at ${K.rate(P.interest.current)} a year, compounded daily, and the late payment penalty drops from ${K.pct(P.ftp.monthly)} to ${K.pct(P.ftp.withPlan)} a month if the return was filed on time. On ${K.usd(bal)}, a 36-month plan costs ${K.usd(p36.monthly)} a month and ${K.usd(p36.interest + p36.ftp)} of interest and penalty in total.`,
  body: (h) => `
<h2>The two plans and who gets them</h2>
<p>The ${h.src('plans', 'IRS payment plan page')} sorts every balance into one of two boxes. If you can pay in full within ${P.plans.shortTermDays} days and owe less than ${K.usd(P.plans.shortTermMax)} in combined tax, penalties and interest, you get a short-term plan: no user fee, no fixed monthly amount, only a deadline. Interest and the late payment penalty still run until the balance is paid. If you need longer, you ask for a long-term plan, the installment agreement of ${h.src('irc6159', 'section 6159 of the tax code')}.</p>
<p>A long-term plan for an individual who owes ${K.usd(P.plans.simpleMax)} or less and has filed all required returns is what the IRS now calls a ${h.src('simple', 'Simple Payment Plan')}. It requires no collection information statement and no lien determination, it is offered online, by phone or at a Taxpayer Assistance Center, and the IRS writes that most taxpayers have up to ${P.plans.csedYears} years to pay. Above ${K.usd(P.plans.simpleMax)} the plan is still possible, but the IRS asks for Form 433-F or 433-H and measures the payment against its ${h.a('irs-collection-financial-standards', 'Collection Financial Standards')}.</p>
${h.table(['Fee', 'Direct debit', 'Other payment', 'Low income'], [
    ['Long-term plan, applied online', K.usd(F.ddiaOnline), K.usd(F.otherOnline), `${K.usd(F.ddiaLowIncome)} with debit, ${K.usd(F.otherLowIncome)} otherwise`],
    ['Long-term plan, phone, mail or in person', K.usd(F.ddiaOther), K.usd(F.otherOther), `${K.usd(F.ddiaLowIncome)} with debit, ${K.usd(F.otherLowIncome)} otherwise`],
    ['Short-term plan', K.usd(0), K.usd(0), K.usd(0)],
    ['Changing an existing plan', `${K.usd(F.reviseOnline)} online`, `${K.usd(F.reviseOther)} by phone or mail`, 'may be reimbursed'],
  ], `Set-up fees on the IRS payment plan page, read on ${K.day(P.meta.retrieved_at)}`, ['l', 'r', 'r', 'l'])}
<h2>How the monthly payment is figured</h2>
<p>The IRS lets you propose the payment, as long as the balance is cleared within the term you choose. The calculator above finds the smallest whole-dollar payment that does it, month by month: interest is added every day at the rate of the quarter on everything still owed, the late payment penalty is added each month on the tax still unpaid, and each payment goes first to the tax, then to penalties, then to interest. Paying the tax first keeps the penalty as low as possible, since the penalty is figured on unpaid tax only.</p>
<p>The term matters more than the fee. On ${K.usd(bal)} of tax, a plan over 36 months costs ${K.usd(p36.monthly)} a month and adds ${K.usd(p36.interest + p36.ftp)}; stretched to 120 months, the payment falls to ${K.usd(p120.monthly)} and the extra cost climbs to ${K.usd(p120.interest + p120.ftp)}. The table runs the same balance over each term with the current rate.</p>
${h.table(['Term', 'Monthly payment', 'Interest', 'Late payment penalty', 'Total paid'], rows.map((r) => [`${r.m} months`, K.usd(r.monthly), K.usd(r.interest), K.usd(r.ftp), K.usd(r.totalPaid)]), `${K.usd(bal)} of tax, return filed on time, interest at ${K.rate(P.interest.current)} kept for future quarters (fee not included)`, ['l', 'r', 'r', 'r', 'r'])}
${h.mini('plan', { t: 'Your balance over 36 months', p: ['bal'], d: { bal, mo: '36' } })}
<h2>Why a return filed on time halves the penalty</h2>
<p>The ${h.src('ftp', 'failure to pay penalty page')} sets the rate at ${K.pct(P.ftp.monthly)} of the unpaid tax for each month or part of a month. For an individual who filed the return on time and has an approved plan, the rate drops to ${K.pct(P.ftp.withPlan)} while the plan runs. A person who filed late keeps the full rate. On the same ${K.usd(bal)} over 36 months, the late filer pays ${K.usd(late36.ftp)} of penalty instead of ${K.usd(p36.ftp)}. Either way the penalty stops at ${K.pct(P.ftp.max)} of the tax. Interest is not reduced by a plan; only paying sooner reduces it.</p>
<h2>Applying without a representative</h2>
<p>Individuals apply through their online IRS account, by calling the number on the notice, by mailing ${h.src('f9465', 'Form 9465')} with the return or the notice, or at a Taxpayer Assistance Center. The online route is the cheapest and gives an answer at once. You need the balance from your latest notice or your account, the payment you propose and, for direct debit, a checking account. All returns due must be filed first: a missing return blocks the plan, which is why a person with ${h.a('unfiled-tax-returns', 'unfiled years')} files them before asking.</p>
<h2>What happens once the plan is in place</h2>
<p>While a request is pending and while the plan is in force, the IRS generally may not levy, as the payment plan page explains. A plan does not stop a refund from being applied to the balance, and it does not release a lien already filed. Missing a payment or failing to file and pay later taxes can end the plan; the ${h.a('missed-irs-payment-plan-payment', 'missed payment page')} explains the notices and how to reinstate it. You can change the payment amount or date online for ${K.usd(F.reviseOnline)}.</p>
<p>A plan is the right tool when the full balance can be paid over time. When it cannot, because the monthly payment the IRS would require is more than the household has after its allowable expenses, the routes are a ${h.a('partial-payment-installment-agreement', 'partial payment installment agreement')}, an ${h.a('offer-in-compromise', 'offer in compromise')} or ${h.a('currently-not-collectible', 'currently not collectible status')}. None of them needs a paid representative, and the IRS decides on each one.</p>
`,
  faqs: [
    { q: 'How long can an IRS payment plan last?', a: `A short-term plan gives up to ${P.plans.shortTermDays} days. A long-term plan has no fixed limit in the law beyond the ${P.plans.csedYears}-year collection period, and the IRS writes that most people on a Simple Payment Plan have up to ${P.plans.csedYears} years to pay. A longer term lowers the payment but raises the interest and penalty you pay in total.` },
    { q: 'What is the minimum monthly payment on an IRS installment agreement?', a: 'There is no fixed minimum. The payment has to clear the balance, with the interest and penalty that keep running, within the term you choose and before the collection period ends. For balances over the Simple Payment Plan limit, the IRS can also require a payment equal to the income left after the allowable living expenses of its standards.' },
    { q: 'Does an IRS payment plan hurt your credit score?', a: 'The IRS does not report to the credit bureaus, so a plan itself does not appear on a credit report. A Notice of Federal Tax Lien is a public record, but the three main credit bureaus stopped including tax liens in credit reports in 2018. Lenders can still find a filed lien in county records.' },
    { q: 'Can I pay off an IRS payment plan early?', a: 'Yes, at any time and with no penalty for paying early. Every extra dollar cuts the interest, which is figured daily on the unpaid balance, and the late payment penalty, which is figured each month on the tax still unpaid. The set-up fee is not refunded, except in the low-income cases the IRS describes.' },
  ],
  tool: 'plan',
  toolArg: { bal, mo: 36 },
  related: ['irs-installment-agreement', 'short-term-payment-plan', 'irs-payment-plan-fees', 'owe-irs-10000', 'cant-pay-taxes'],
  sources: ['plans', 'simple', 'irc6159', 'ftp', 'interest', 'f9465'],
});
