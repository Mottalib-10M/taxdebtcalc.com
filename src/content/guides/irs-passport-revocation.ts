import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, PL = P.plans;
const TH = P.passport as Record<string, number>;
const years = Object.keys(TH).sort();
const th = TH['2026'];
// $71,800 of assessed tax, penalties and interest, with a lien filed: over the 2026 line.
const bal = 71800;
const gap = bal - th;
const p84 = K.plan(bal, 84);
const firstYear = years[0], rise = th - TH[firstYear];
// A $61,500 balance left alone: months until interest alone carries it over the line.
const near = 61500;
let crossMonths = 0;
while (crossMonths < 120 && near + K.interestOn(near, K.today, K.addMonths(K.today, crossMonths)) <= th) crossMonths++;

export default defineGuide({
  id: 'irs-passport-revocation',
  group: 'collection',
  order: 460,
  slug: 'irs-passport-revocation',
  nav: 'Passport and tax debt',
  card: `Seriously delinquent tax debt over ${K.usd(th)} in 2026: certification, denial or revocation, and how it is reversed`,
  title: `IRS Passport Revocation 2026: The ${K.usd(th)} Debt Threshold`,
  description: `IRS passport revocation 2026: tax debt over ${K.usd(th)} with a lien or levy can be certified to the State Department; exclusions, CP508C, how a plan reverses it.`,
  h1: 'IRS passport revocation: the seriously delinquent debt rule',
  intro: 'Enter the total assessed balance, what is arranged with the IRS, and whether a lien or levy exists. The calculator compares the balance with the 2026 threshold and the exclusions that block certification.',
  facts: [['Threshold for 2026', K.usd(th)], ['Notice when certified', 'CP508C'], ['Reversal sent within', '30 days of resolving'], ['Application held open', '90 days']],
  resume: `Under section 7345 of the tax code, the IRS certifies to the State Department any individual with a seriously delinquent tax debt, and the State Department then generally refuses to issue or renew a passport and may revoke a current one. A debt is seriously delinquent when the assessed federal tax, penalties and interest total more than ${K.usd(th)} in 2026 (the figure is adjusted each year for inflation), and the IRS has either filed a Notice of Federal Tax Lien with the appeal rights exhausted or lapsed, or issued a levy. Debts in a payment plan paid on time, under an accepted or pending offer in compromise, in currently not collectible status, under a pending installment agreement request, or in a timely collection due process hearing are not certified. Certification brings a CP508C notice. The IRS reverses it within 30 days once the debt is resolved, but not when partial payments simply bring the balance under the threshold. At ${K.usd(bal)} with a lien filed and nothing arranged, a debt is ${K.usd(gap)} over the line.`,
  body: (h) => `
<h2>The threshold, year by year</h2>
<p>The ${h.src('passport', 'IRS passport page')} publishes the threshold for each year since the rule took effect. It counts the total of assessed tax, penalties and interest, across all years and including some business taxes for which a person is personally liable and the trust fund recovery penalty.</p>
${h.table(['Year', 'Seriously delinquent above'], years.map((y) => [y, K.usd(TH[y])]), `Thresholds published by the IRS; ${K.usd(rise)} higher in 2026 than in ${firstYear}`, ['l', 'r'])}
<p>The amount is only one of two conditions. The IRS must also have filed a Notice of Federal Tax Lien and the taxpayer's administrative remedies on it must have lapsed or been exhausted, or the IRS must have issued a levy. A large balance that has never reached either stage is not certified on the size alone.</p>
<p>A balance below the line does not stay there by itself. Interest compounds daily on tax, penalties and earlier interest, so a debt of ${K.usd(near)} left alone at the ${K.rate(P.interest.current)} rate of the ${K.quarter(P.interest.current)} passes ${K.usd(th)} in about ${crossMonths} months from interest alone, before any late payment penalty is counted. The threshold also rises each year, but by much less than that in most years, as the table shows.</p>
<h2>Debts that are never certified</h2>
${h.table(['Excluded by the IRS', 'Reason on the IRS page'], [
    ['Payment plan paid on time', 'approved installment agreement'],
    ['Offer in compromise accepted and paid on time', 'accepted offer'],
    ['Installment agreement or offer request pending', 'pending request'],
    ['Currently not collectible because of hardship', 'hardship determination'],
    ['Collection due process hearing on a levy timely requested', 'hearing request'],
    ['Innocent spouse relief requested', 'collection suspended'],
    ['Bankruptcy, identity theft victim, federally declared disaster area', 'listed exclusions'],
    ['Child support, FBAR penalties, Justice Department settlements', 'not counted as tax debts here'],
  ], `${h.src('irc7345', 'IRC 7345')} and the IRS passport page`, ['l', 'l'])}
<p>Taxpayers serving in a designated combat zone or a contingency operation have certification postponed.</p>
${h.mini('passport', { t: 'Your balance against the threshold', p: ['bal'], d: { bal } })}
<h2>From certification to a refused passport</h2>
<p>When the IRS certifies a debt, it mails a CP508C to the last known address by regular mail, and it does not send a copy to a power of attorney. The State Department then generally will not issue a passport. If a certified person applies or renews, the State Department sends a letter and holds the application open for 90 days so the person can pay, set up a payment arrangement, or correct an erroneous certification; after 90 days the application is denied and closed, and a new one is needed. A person abroad may be issued a limited-validity passport to return directly to the United States. Before asking the State Department to revoke an existing passport, the IRS sends Letter 6152 asking the taxpayer to call and resolve the account.</p>
<h2>Getting the certification reversed</h2>
<p>The IRS reverses certification, and says so in a CP508R notice, when the debt is fully satisfied or becomes legally unenforceable, when it is no longer seriously delinquent because an exclusion now applies, or when the certification was wrong. It notifies the State Department within 30 days of resolving the debt. With travel booked within 45 days and an open application, the IRS can expedite the reversal to about 9 to 16 days, on proof of travel and a copy of the State Department letter.</p>
<p>One rule surprises people: paying the balance down below ${K.usd(th)} does not reverse certification by itself, and neither does part of the debt expiring under the collection statute. All certified debt has to be resolved, which in practice means full payment or an arrangement that excludes it. For ${K.usd(bal)}, a payment plan over 84 months comes to ${K.usd(p84.monthly)} a month; above the ${K.usd(PL.simpleMax)} Simple Payment Plan limit, the IRS asks for a financial statement first, as described on the ${h.a('irs-installment-agreement', 'installment agreement page')}. An ${h.a('offer-in-compromise', 'offer in compromise')} or ${h.a('currently-not-collectible', 'hardship status')} also count once in place.</p>
<h2>Disputes and court review</h2>
<p>A taxpayer who believes the amount is wrong or the certification erroneous calls the numbers on the CP508C, 855-519-4965, or 267-941-1004 from abroad. Proof of a payment already made can be sent through the IRS document upload tool. A refund from a recently filed return is applied to the debt and can satisfy it. The law also allows a suit in the U.S. Tax Court or a federal district court to decide whether a certification is erroneous or should have been reversed, without first filing an administrative claim; the court can order the IRS to notify the State Department, but cannot release a lien or levy or award damages. Only the State Department issues, limits, denies or revokes passports; this page sets out the IRS rules and is not legal advice.</p>
`,
  faqs: [
    { q: 'What is the passport tax debt threshold for 2026?', a: `More than ${K.usd(th)} of assessed federal tax, penalties and interest, up from ${K.usd(TH['2025'])} in 2025. The amount is adjusted for inflation each year. Reaching it is not enough on its own: the IRS must also have filed a lien with appeal rights exhausted or lapsed, or issued a levy, and no plan, offer or hardship status can be in place.` },
    { q: 'Will paying my IRS debt below the threshold restore my passport?', a: `No. The IRS passport page states that it will not reverse a certification when the debt falls below the threshold through partial payments or because some of it expired under the collection statute. To be decertified, the taxpayer must fully resolve all certified debt, by paying it or by entering an arrangement such as an installment agreement or an offer in compromise.` },
    { q: 'How fast can the IRS reverse a passport certification before a trip?', a: 'Normally within 30 days of the debt being resolved. With international travel planned within 45 days, or a residence abroad, and an open passport application, the IRS can expedite the reversal to about 9 to 16 days. It needs proof of travel and a copy of the State Department letter denying the application or revoking the passport, dated within the last 90 days.' },
    { q: 'Do child support or FBAR penalties count toward the passport threshold?', a: 'No. The IRS lists child support, Report of Foreign Bank and Financial Account (FBAR) penalties and settlements with the Department of Justice among the debts that are not seriously delinquent tax debts. The threshold counts federal income taxes, trust fund recovery penalties, business taxes for which a person is personally liable and other civil penalties.' },
  ],
  tool: 'passport',
  toolArg: { bal },
  related: ['cp504-notice', 'irs-tax-lien', 'irs-installment-agreement', 'offer-in-compromise', 'owe-irs-100000'],
  sources: ['passport', 'irc7345', 'plans', 'simple'],
});
