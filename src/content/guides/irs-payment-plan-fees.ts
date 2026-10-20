import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.plans, F = L.fees;
const bal = 6400;
const terms = [12, 24, 48].map((m) => ({ m, r: K.plan(bal, m) }));
const t24 = terms[1].r;
const combos: Array<[string, number]> = [
  ['Direct debit, online', K.setupFee(true, true, false)],
  ['Other payment, online', K.setupFee(false, true, false)],
  ['Direct debit, phone or mail', K.setupFee(true, false, false)],
  ['Other payment, phone or mail', K.setupFee(false, false, false)],
];
const cheap = combos[0][1], dear = combos[3][1];
const extra24 = t24.interest + t24.ftp;

export default defineGuide({
  id: 'irs-payment-plan-fees',
  group: 'plans',
  order: 230,
  slug: 'irs-payment-plan-fees',
  nav: 'Payment plan fees',
  card: `Set-up fees from ${K.usd(0)} to ${K.usd(F.otherOther)}, low-income waivers and the cost of changing a plan`,
  title: 'IRS Payment Plan Fees 2026: Set-Up, Low Income, Changes',
  description: `IRS payment plan fees 2026: ${K.usd(F.ddiaOnline)} to ${K.usd(F.otherOther)} to set up a long-term plan, waived or ${K.usd(F.otherLowIncome)} for low incomes, ${K.usd(F.reviseOnline)} to change it online, nothing for a ${L.shortTermDays}-day plan.`,
  h1: 'IRS payment plan fees: what each way of applying costs',
  intro: 'Enter the balance and the term, then switch between direct debit and other payments, online and by phone. The calculator adds the set-up fee to the interest and penalty of the plan, so you see which part of the cost the fee really is.',
  facts: [['Lowest set-up fee', `${K.usd(F.ddiaOnline)}, direct debit online`], ['Highest set-up fee', `${K.usd(F.otherOther)}, other payment by phone or mail`], ['Low income, direct debit', 'Waived'], ['Change a plan online', K.usd(F.reviseOnline)]],
  resume: `The IRS charges a one-time user fee when it approves a long-term payment plan, and nothing for a short-term plan of up to ${L.shortTermDays} days. The fee depends on two choices. Paying by direct debit from a checking account costs ${K.usd(F.ddiaOnline)} if you apply online and ${K.usd(F.ddiaOther)} by phone, mail or in person. Paying each month another way, by Direct Pay, card or check, costs ${K.usd(F.otherOnline)} online and ${K.usd(F.otherOther)} otherwise. Taxpayers whose adjusted gross income is at or below ${K.pct(L.lowIncomePovertyMultiple)} of the federal poverty guidelines pay nothing with direct debit, or ${K.usd(F.otherLowIncome)} without it, refundable once the plan is completed. Changing an existing plan costs ${K.usd(F.reviseOnline)} online and ${K.usd(F.reviseOther)} otherwise. On ${K.usd(bal)} over 24 months, the plan adds ${K.usd(extra24)} of interest and penalty, so the fee choice moves the total cost from ${K.usd(extra24 + cheap)} to ${K.usd(extra24 + dear)}.`,
  body: (h) => `
<h2>The schedule, line by line</h2>
<p>The fees below are the ones on the ${h.src('plans', 'IRS payment plan page')}, updated by the IRS on March 3, 2026 and read on ${K.day(P.meta.retrieved_at)}. They are charged once, when the plan is approved, and only for long-term plans. Older documents, including the July 2024 Form 9465 instructions, still print a lower direct debit figure; the payment plan page is the current one.</p>
${h.table(['Long-term plan', 'Standard fee', 'Low income'], [
    ...combos.map(([l, f]) => [l, K.usd(f), l.startsWith('Direct') ? 'Waived' : `${K.usd(F.otherLowIncome)}, may be reimbursed`]),
    ['Short-term plan, any method', K.usd(0), K.usd(0)],
    ['Change a plan online', K.usd(F.reviseOnline), `${K.usd(F.reviseOnline)}, may be reimbursed`],
    ['Change a plan by phone, mail or in person', K.usd(F.reviseOther), `${K.usd(F.otherLowIncome)}, may be reimbursed`],
  ], 'IRS user fees for individual payment plans', ['l', 'r', 'l'])}
<h2>How much of the cost is the fee</h2>
<p>For a small balance over a short term, the fee is a large share of what the plan costs; over a long term, interest takes over. The table keeps the balance at ${K.usd(bal)} and adds each fee to the interest and penalty of three terms.</p>
${h.table(['Term', 'Monthly', 'Interest and penalty', `With ${K.usd(cheap)} fee`, `With ${K.usd(dear)} fee`], terms.map((x) => [`${x.m} months`, K.usd(x.r.monthly), K.usd(x.r.interest + x.r.ftp), K.usd(x.r.interest + x.r.ftp + cheap), K.usd(x.r.interest + x.r.ftp + dear)]), `${K.usd(bal)} of tax, return filed on time, interest at ${K.rate(P.interest.current)}`, ['l', 'r', 'r', 'r', 'r'])}
${h.mini('plan', { t: 'Your balance, fee included', p: ['bal', 'mo'], d: { bal: 4200, mo: '24' } })}
<p>On a 12-month plan for this balance, the gap between the cheapest and the dearest fee, ${K.usd(dear - cheap)}, equals ${K.pct((dear - cheap) / (terms[0].r.interest + terms[0].r.ftp), 0)} of the interest and penalty the plan adds. Applying online with direct debit is the single largest saving available to someone who has to spread a small balance, and direct debit also removes the risk of a payment forgotten in a busy month.</p>
<h2>When the cheap tier is out of reach</h2>
<p>The online fees are only available to people who can apply online, and for a long-term plan that means an individual with ${K.usd(L.onlineLongTermMax)} or less in combined tax, penalties and interest and every required return filed. Above that amount, the request goes by phone, by mail with Form 9465 and a financial statement, or in person, so the lowest fee becomes ${K.usd(F.ddiaOther)} with direct debit and ${K.usd(F.otherOther)} without it. A person just over the line can sometimes pay enough to fall back under it before applying, which lowers both the fee and the paperwork; the ${h.a('owe-irs-50000', 'page on owing about the online limit')} works that through. The other common obstacle is the bank account: direct debit needs a checking account the IRS can draw on, and someone paid by card or money order stays on the higher tier of the schedule.</p>
<h2>Low income: waived, reduced or paid back</h2>
<p>The waiver applies to individuals whose adjusted gross income for the most recent year available is at or below ${K.pct(L.lowIncomePovertyMultiple)} of the federal poverty guidelines, for long-term plans entered into on or after April 10, 2018. With a direct debit agreement, the fee is waived. Without direct debit, the reduced fee of ${K.usd(F.otherLowIncome)} is charged and reimbursed when the plan is completed, but only if the person was unable, not merely unwilling, to pay by direct debit; the ${h.src('i9465', 'Form 9465 instructions')} tie that to a box on line 13c. The IRS system usually recognizes low-income status by itself and shows the right fee. If it did not, Form 13844, Application for Reduced User Fee for Installment Agreements, asks the IRS to reconsider; it has to be sent within 30 days of the letter accepting the plan.</p>
<h2>Changing a plan later</h2>
<p>Once a plan exists, the online account lets you change the payment amount or date, convert to direct debit, change the bank details of a direct debit plan, and reinstate a plan after default. A revision costs ${K.usd(F.reviseOnline)} online and ${K.usd(F.reviseOther)} by phone, mail or in person, with the low-income reductions in the table. The IRS also lists ${K.usd(0)} for changes made to existing direct debit agreements in its low-income section. A plan that lapsed through default may also carry a reinstatement fee, as the ${h.a('missed-irs-payment-plan-payment', 'missed payment page')} explains.</p>
<h2>Charges that do not go to the IRS</h2>
<p>Card payments, whether to pay in full or to make monthly installments, carry a processing fee that goes to the payment processor, not to the IRS, with limits set by each processor. Direct Pay, EFTPS and checks carry no such charge. The user fee itself exists because the Office of Management and Budget directs federal agencies to charge for services such as installment agreements; the IRS uses it to cover the cost of processing them. Fees change by regulation, and the figure the IRS states when it approves your plan is the one that applies.</p>
`,
  faqs: [
    { q: 'Why does the IRS charge a set-up fee for a long-term payment plan?', a: `The Office of Management and Budget directs federal agencies to charge user fees for services such as the installment agreement program, and the IRS uses the fee to cover the cost of processing agreements. Short-term plans of up to ${L.shortTermDays} days carry no fee, and low-income taxpayers have the fee waived or reimbursed under conditions.` },
    { q: 'How do I get the low-income payment plan fee if the IRS did not apply it?', a: `Send Form 13844, Application for Reduced User Fee for Installment Agreements, within 30 days of the letter accepting your plan. The test is adjusted gross income at or below ${K.pct(L.lowIncomePovertyMultiple)} of the federal poverty guidelines. With direct debit the fee is then waived; without it, the reduced ${K.usd(F.otherLowIncome)} fee can be reimbursed when the plan is completed.` },
    { q: 'What does the IRS charge to change the payment date on an existing plan?', a: `${K.usd(F.reviseOnline)} if you make the change online through your individual account, and ${K.usd(F.reviseOther)} by phone, mail or in person. Low-income taxpayers pay ${K.usd(F.reviseOnline)} online or ${K.usd(F.otherLowIncome)} otherwise, and these can be reimbursed under conditions. The same online tool changes the payment amount, the bank account or the plan type.` },
    { q: 'Do monthly card payments on an IRS installment plan cost extra?', a: 'Yes. Each card payment carries a processing fee charged by the payment processor, not by the IRS, within limits the processor sets. Payments from a bank account through Direct Pay or EFTPS, or by check or money order, carry no processing fee. Direct debit also gives the lowest set-up fee.' },
  ],
  tool: 'plan',
  toolArg: { bal, mo: '24' },
  related: ['irs-payment-plan', 'irs-installment-agreement', 'short-term-payment-plan', 'missed-irs-payment-plan-payment', 'owe-irs-10000'],
  sources: ['plans', 'i9465', 'simple'],
});
