import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, PL = P.plans, F = PL.fees;
// $21,400 owed, paid by direct debit over 60 months, the longest term the lien withdrawal route allows.
const bal = 21400, months = 60;
const p60 = K.plan(bal, months);
const p36 = K.plan(bal, 36);
const releaseBy = K.addMonths(K.today, months);

export default defineGuide({
  id: 'irs-tax-lien',
  group: 'collection',
  order: 450,
  slug: 'irs-tax-lien',
  nav: 'IRS tax lien',
  card: 'How a federal tax lien arises, what the public notice does, and the four ways to release, discharge, subordinate or withdraw it',
  title: 'IRS Tax Lien 2026: Release, Withdrawal, Discharge Explained',
  description: `IRS tax lien 2026: when it arises, what the public notice does to credit and a sale, release 30 days after payment, and withdrawal with a ${K.usd(F.ddiaOnline)} direct debit plan.`,
  h1: 'IRS tax lien: how it arises and the four ways out',
  intro: 'Type the balance and a term. A direct debit plan that pays everything within 60 months is one of the routes to having the public lien notice withdrawn; the calculator shows the monthly payment it takes.',
  facts: [['Release after full payment', 'within 30 days'], ['Withdrawal with a direct debit plan', 'after 3 consecutive debits'], ['Plan must pay in full within', '60 months'], ['Direct debit plan fee, online', K.usd(F.ddiaOnline)]],
  resume: `A federal tax lien is the government's legal claim on all your property, present and future, that arises automatically once the IRS has assessed a tax, sent a bill, and the bill has gone unpaid. The IRS then may file a public Notice of Federal Tax Lien to tell other creditors it has a claim; that notice is what affects credit, a home sale or a refinance. Paying in full is the standard way out: the IRS releases the lien within 30 days after the debt is paid. Three other remedies exist. A discharge removes the lien from one property, for example to let a sale close. A subordination lets a lender move ahead of the IRS. A withdrawal removes the public notice, and since the 2011 Fresh Start initiative it can be requested once a direct debit installment agreement that pays the balance within 60 months has made three consecutive payments, for balances under a ceiling the IRS sets. On ${K.usd(bal)}, that plan costs ${K.usd(p60.monthly)} a month.`,
  body: (h) => `
<h2>Lien and notice of lien are two different things</h2>
<p>The ${h.src('lien', 'IRS lien page')} describes the lien as existing once three things have happened: the IRS put the balance on the books, it sent a Notice and Demand for Payment, and you neglected or refused to pay in full in time. No filing is needed for the lien to exist. What the public sees is the Notice of Federal Tax Lien, a document the IRS files to alert creditors, and which it may file at any time, including while an offer in compromise is being reviewed or an account is in hardship status. It attaches to everything you own and to assets acquired later, and for a business it reaches business property and accounts receivable.</p>
<p>A lien is not a levy. The lien secures the government's interest; a ${h.a('irs-bank-levy', 'levy')} actually takes the property. A payment plan does not remove a lien already filed, but while a plan is pending or in force the IRS is generally barred from levying, so the two tools sit side by side for many people who pay over time.</p>
<h2>Four ways to get it off a property or off the record</h2>
${h.table(['Remedy', 'What it does', 'Debt still owed?', 'Where to apply'], [
    ['Release', 'ends the lien once the debt is satisfied, within 30 days of payment', 'no', 'automatic; Publication 1450 if a certificate is needed'],
    ['Discharge', 'removes the lien from one specific property', 'yes', 'Publication 783'],
    ['Subordination', 'lets another creditor move ahead of the IRS, for a loan or refinance', 'yes', 'Publication 784'],
    ['Withdrawal', 'removes the public notice; the IRS no longer competes with other creditors', 'yes, unless paid', 'Form 12277'],
  ], 'From the IRS page "Understanding a federal tax lien"', ['l', 'l', 'l', 'l'])}
<p>A certificate of nonattachment, explained in Publication 1024, addresses a different problem: a notice filed against someone with a similar name. For routine questions, such as checking that a lien exists, getting a payoff figure or asking for a release, the IRS's Centralized Lien Operation answers at 800-913-6050; discharge, subordination and withdrawal go to the Collection Advisory Group listed in Publication 4235.</p>
<h2>Withdrawal while you are still paying</h2>
<p>The lien page sets out the conditions of the direct debit route. You are an individual, a business with income tax debts only, or a business that has closed. The balance is at or under the ceiling set on the IRS page; above it, the page says the balance can be paid down first. Your direct debit installment agreement pays everything within 60 months or before the collection period ends, whichever comes first. You are current on all other filing and payment obligations, three consecutive direct debit payments have gone through, and you have never defaulted on a direct debit plan.</p>
${h.table(['Term', 'Monthly debit', 'Interest and penalty', 'Fits the 60-month condition'], [
    ['36 months', K.usd(p36.monthly), K.usd(p36.interest + p36.ftp), 'yes'],
    [`${months} months`, K.usd(p60.monthly), K.usd(p60.interest + p60.ftp), 'yes'],
  ], `${K.usd(bal)} of tax, return filed on time, interest at ${K.rate(P.interest.current)} carried forward, ${K.usd(F.ddiaOnline)} set-up fee online not included`, ['l', 'r', 'r', 'l'])}
${h.mini('plan', { t: 'Direct debit plan for your balance', p: ['bal'], d: { bal, mo: String(months), how: 'ddia' } })}
<p>The ${months}-month plan above ends in ${K.month(releaseBy)}; after the last payment, the lien itself is released within 30 days. A second withdrawal route applies after payment: once the debt is satisfied and the lien released, a person who has filed all individual, business and information returns for the past three years and is current on estimated payments and deposits can ask for the notice to be withdrawn as well. Both routes are part of what the lien page credits to the Commissioner's 2011 Fresh Start initiative.</p>
<h2>How a lien sits next to the other options</h2>
<p>Each settlement route treats the lien differently. With a payment plan, the IRS decides whether to file a notice at all; the Simple Payment Plan, for balances up to ${K.usd(PL.simpleMax)}, is offered without a lien determination. With an offer in compromise, the IRS may file a notice during the review and keeps the lien until the accepted amount is paid. In ${h.a('currently-not-collectible', 'currently not collectible')} status a notice may be filed to protect the government's interest. Each time the logic is the same: the lien protects the IRS's place among creditors while the debt is unpaid, and it goes when the debt goes.</p>
<h2>Credit, sales and bankruptcy</h2>
<p>The IRS says only that a filed notice "may limit your ability to get credit"; the CP504 page adds that it can make selling or borrowing against property difficult. A home sale with a lien usually closes through a discharge or by paying the lien from the proceeds; the Form 656 booklet warns that excess sale proceeds may be applied to the tax even after an offer is accepted, and the IRS does not release a lien under an offer until the offer is paid in full. The lien page also notes that a tax debt, its lien and the notice may survive a bankruptcy. Appeals against the filing of a notice are possible in some cases, under Publication 1660. These are the IRS's published rules; whether a discharge, subordination or withdrawal is granted is decided by the IRS on each application.</p>
`,
  faqs: [
    { q: 'How long after paying off my tax debt is the federal tax lien released?', a: 'The IRS releases the lien within 30 days after the tax debt is paid in full. The release does not erase the fact that a notice was filed; to have the public notice withdrawn as well, a person who has been compliant on filing for three years and is current on estimated payments can ask on Form 12277.' },
    { q: 'What is the difference between a lien withdrawal and a lien release?', a: 'A release ends the lien because the debt has been satisfied. A withdrawal removes the public Notice of Federal Tax Lien so the IRS no longer competes with other creditors, but the debt is still owed if unpaid. A withdrawal can come before payment, through a qualifying direct debit plan, or after release.' },
    { q: 'Can I sell my house with a federal tax lien on it?', a: 'Yes, but the lien follows the property until it is paid or removed from it. A certificate of discharge, explained in Publication 783, removes the lien from that one property, usually so a sale can close with the IRS paid from the proceeds. The Form 656 booklet warns that excess proceeds of a sale made before release may be applied to the tax debt.' },
    { q: 'Does bankruptcy remove a federal tax lien?', a: 'Not necessarily. The IRS lien page warns that a tax debt, the lien and the Notice of Federal Tax Lien may continue after a bankruptcy. Questions about whether a particular bankruptcy changed a tax debt go to the IRS Centralized Insolvency Operation at 800-973-0424.' },
  ],
  tool: 'plan',
  toolArg: { bal, mo: months },
  related: ['irs-bank-levy', 'irs-fresh-start-program', 'irs-payment-plan', 'cp504-notice', 'offer-in-compromise'],
  sources: ['lien', 'plans', 'cp504', 'f656b', 'p594'],
});
