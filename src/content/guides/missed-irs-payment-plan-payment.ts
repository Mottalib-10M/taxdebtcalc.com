import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, R = P.ftp, F = P.plans.fees;
const bal = 21000, term = 48, paidMonths = 9;
const full = K.plan(bal, term);
const base = { tax: bal, penalties: 0, interest: 0, ftpSoFar: 0, taxOriginal: bal, start: K.today, filedOnTime: true };
const part = K.runPlan({ ...base, monthly: full.monthly, maxMonths: paidMonths });
const left = part.rows[part.rows.length - 1].balance;
/** Payments go to the tax first, so the tax still unpaid is the original tax minus what was paid. */
const taxLeft = Math.max(0, bal - part.totalPaid);
const sixMonths = (rate: number) => Math.min(rate * taxLeft * 6, Math.max(0, R.max * bal - part.ftp));
const pen = { plan: sixMonths(R.withPlan), std: sixMonths(R.monthly), levy: sixMonths(R.afterLevyNotice) };
const int6 = K.interestOn(left, K.today, K.addMonths(K.today, 6));

export default defineGuide({
  id: 'missed-irs-payment-plan-payment',
  group: 'plans',
  order: 280,
  slug: 'missed-irs-payment-plan-payment',
  nav: 'Missed plan payment',
  card: 'Default, the CP523 notice, the 30 days to act and what reinstating a plan costs',
  title: 'Missed IRS Payment Plan Payment 2026: CP523, Reinstatement',
  description: `Missed an IRS payment plan payment in 2026? What triggers default, the CP523 and 30 days, reinstating online for ${K.usd(F.reviseOnline)}, and a penalty rising from ${K.pct(R.withPlan)} to ${K.pct(R.afterLevyNotice)}.`,
  h1: 'Missed an IRS payment plan payment: what happens, and how to fix it',
  intro: 'The calculator holds the example plan. Change the term to see the payment that would fit your budget better: a revised plan is usually the way out of a default, and the result shows what it costs in interest and penalty.',
  facts: [['Notice of intent to terminate', 'CP523'], ['Time to respond', '30 days from the notice'], ['Change or reinstate online', K.usd(F.reviseOnline)], ['Penalty rate in a plan, then without', `${K.pct(R.withPlan)}, then ${K.pct(R.monthly)}`]],
  resume: `A plan does not end the day a payment is missed. Default is a status the IRS assigns when a payment is not made on time, when a later return shows a balance that is not paid, or when financial information given to it turns out materially wrong. It then sends a CP523, a notice that it intends to terminate the installment agreement and levy wages or bank accounts, and asks you to make the payment before the termination date and to call within 30 days of the notice. Many defaults are cured there, by paying what is late or by reinstating the plan, which the online account allows for a ${K.usd(F.reviseOnline)} revision fee, or ${K.usd(F.reviseOther)} by phone; the IRS says a reinstatement fee may apply. Termination costs more than the fee: on the example plan, the ${K.usd(taxLeft)} of tax still unpaid would draw ${K.usd(pen.std)} of late payment penalty over six months at the standard rate instead of ${K.usd(pen.plan)} inside the plan, and ${K.usd(pen.levy)} after a levy notice.`,
  body: (h) => `
<h2>What puts a plan in default</h2>
<p>The ${h.src('i9465', 'Form 9465 instructions')} give the conditions. A plan is in default if payments are not made on time, or if a balance due on a return filed later is not paid on time. It can also be terminated if the financial information given to get the plan, or given later when the IRS asked for an update, was materially incomplete or inaccurate. The agreement includes a promise to file every future return on time and to have enough withholding or estimated payments to pay future taxes in full, so a new balance in April is as much a default as a skipped month.</p>
<p>A refund taken by the IRS is not a payment on the plan. The ${h.src('plans', 'IRS payment plan page')} says to make every scheduled payment even when a refund has been applied to the balance; the refund shortens the plan, it does not cover the month.</p>
<h2>The CP523 and its 30 days</h2>
<p>When the IRS decides a plan is in default, it sends a ${h.src('cp523', 'CP523')} (CP623 in some cases). The notice says the IRS intends to terminate the installment agreement and to levy wages or bank accounts, explains why, and mentions the denial or revocation of a passport for seriously delinquent tax debt. It asks for the late payment before the termination date it gives, and for contact as soon as possible and no later than 30 days from the notice date. Reinstatement may require a fee, or paying a new tax balance in full. If nothing happens, the IRS terminates the agreement and starts collection, which can include a federal tax lien and levies on wages or bank accounts.</p>
<p>Disagreeing is possible. If the reason given is wrong, or the problem was already fixed, the notice says to call; if the disagreement remains, you can appeal and request a hearing with the IRS Independent Office of Appeals. The IRS generally does not take enforced collection for 30 days after an agreement is terminated, nor while an appeal of the termination is being considered.</p>
<h2>What a lapse costs in penalty</h2>
<p>Take ${K.usd(bal)} on a ${term}-month plan at ${K.usd(full.monthly)} a month. After ${paidMonths} payments, ${K.usd(left)} is still owed, of which ${K.usd(taxLeft)} is tax. As long as the plan is in force and the return was filed on time, the late payment penalty is ${K.pct(R.withPlan)} a month on the unpaid tax. Once the plan ends, the reduced rate no longer applies, and ten days after a notice of intent to levy the rate becomes ${K.pct(R.afterLevyNotice)}, as the ${h.src('ftp', 'failure to pay penalty page')} sets out. Interest, about ${K.usd(int6)} over the same six months, runs at the same rate in every case.</p>
${h.table(['Status over the next six months', 'Monthly rate', 'Late payment penalty'], [
    ['Plan in force', K.pct(R.withPlan), K.usd(pen.plan)],
    ['Plan terminated', K.pct(R.monthly), K.usd(pen.std)],
    ['After a notice of intent to levy', K.pct(R.afterLevyNotice), K.usd(pen.levy)],
  ], `${K.usd(taxLeft)} of tax unpaid after ${paidMonths} payments on a ${K.usd(bal)} plan; penalty capped at ${K.pct(R.max)} of the original tax`, ['l', 'r', 'r'])}
${h.mini('plan', { t: 'A plan you can keep up', p: ['bal', 'mo'], d: { bal: 16800, mo: '60' } })}
<h2>Reinstating, or rewriting the plan</h2>
<p>The online account lists reinstatement after default among the changes an individual can make, along with a new payment amount, a new payment date, a switch to direct debit and new bank details. A change made online costs ${K.usd(F.reviseOnline)}; by phone, mail or in person it costs ${K.usd(F.reviseOther)}, and low-income taxpayers pay less or are reimbursed, as the ${h.a('irs-payment-plan-fees', 'fees page')} details. If the new payment proposed online does not meet the requirements, the system asks for a revised amount, and if that cannot be met it gives directions for a Form 433-F or 433-H financial statement.</p>
<p>A missed payment is often a sign that the payment was set too high. Stretching the term lowers it: the example balance over 60 months instead of ${term} would cost ${K.usd(K.plan(bal, 60).monthly)} a month. If no plan can be met, the ${h.a('partial-payment-installment-agreement', 'partial payment agreement')} and ${h.a('currently-not-collectible', 'hardship status')} are the routes that start from the household budget.</p>
<h2>Keeping it from happening again</h2>
<p>The IRS list for avoiding default is short: pay at least the monthly amount when due, file and pay every return on time, keep making payments in months when a refund is taken, and keep your address current with the IRS, using Form 8822 if you move. Direct debit removes the forgotten payment, and the online account lets you move the due date to a day of the month that follows payday. Paper checks need your name, address, SSN, phone number, tax year and form on them. Whether a plan is reinstated is up to the IRS; this page sets out the published rules and the arithmetic.</p>
`,
  faqs: [
    { q: 'What does a CP523 notice mean for my IRS installment agreement?', a: 'It means the IRS considers the agreement in default and intends to terminate it and levy wages or bank accounts. The notice says why. Paying what is due before the termination date it gives, and contacting the IRS within 30 days of the notice, are the ways to keep or reinstate the agreement. A fee may apply.' },
    { q: 'Can I reinstate a defaulted IRS payment plan online myself?', a: `Usually, yes. The individual online account lists reinstatement after default among the changes you can make, along with the payment amount and date. An online change costs ${K.usd(F.reviseOnline)}, against ${K.usd(F.reviseOther)} by phone or mail. If the IRS has sent a default notice and the online tool will not accept the change, the notice gives the number to call.` },
    { q: 'Does an IRS refund applied to my balance count as that month\'s plan payment?', a: 'No. The IRS applies refunds to the balance while a plan runs, and it asks you to keep making every scheduled payment even in a month when a refund was applied. The refund shortens the plan; it does not replace the installment. Skipping the payment because of a refund can put the plan in default.' },
    { q: 'Can the IRS levy my bank account as soon as my payment plan is terminated?', a: 'Generally not right away. According to the IRS payment plan page, it generally does not take enforced collection action for 30 days after an agreement is terminated, or while an appeal of the termination is under consideration. After that, a levy on wages or bank accounts and a federal tax lien become possible.' },
  ],
  tool: 'plan',
  toolArg: { bal, mo: String(term) },
  related: ['irs-installment-agreement', 'irs-payment-plan-fees', 'irs-payment-plan', 'cp504-notice', 'irs-bank-levy', 'partial-payment-installment-agreement'],
  sources: ['cp523', 'i9465', 'plans', 'ftp'],
});
