import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.plans, F = L.fees;
const bal = 10000;
const gMonths = L.guaranteedYears * 12;
/** A balance of $10,000 on a notice is rarely all tax: here part of it is penalty and interest already charged. */
const taxPart = 8700;
const base = { tax: taxPart, penalties: bal - taxPart, interest: 0, ftpSoFar: 0, taxOriginal: taxPart, start: K.today, filedOnTime: true };
const run = (m: number) => { const monthly = K.paymentFor(base, m); return { m, monthly, ...K.runPlan({ ...base, monthly, maxMonths: m }) }; };
const terms = [6, 12, 24, gMonths, 60].map(run);
const g = terms.find((x) => x.m === gMonths)!, six = terms[0];
const allTax = K.plan(bal, gMonths);
const lateFiler = K.runPlan({ ...base, filedOnTime: false, monthly: g.monthly, maxMonths: gMonths });

export default defineGuide({
  id: 'owe-irs-10000',
  group: 'plans',
  order: 250,
  slug: 'owe-irs-10000',
  nav: `Owe the IRS ${K.usd(bal)}`,
  card: `The ${K.usd(L.guaranteedMaxTax)} line of section 6159(c), six months without a fee, or ${L.guaranteedYears} years`,
  title: `Owe IRS ${K.usd(bal)} in 2026: Payments, Terms, the 6159(c) Line`,
  description: `Owe the IRS ${K.usd(bal)} in 2026? Monthly payments from 6 to 60 months, why tax up to ${K.usd(L.guaranteedMaxTax)} gets an agreement the IRS must accept, and the fee of each route.`,
  h1: `Owing the IRS ${K.usd(bal)}: the payment and the plan that fit`,
  intro: `The calculator starts from a ${K.usd(bal)} balance. Change the term to see the monthly payment and what the plan adds; open the extra options to set the share of the balance that is tax, since penalties already charged do not count toward the ${K.usd(L.guaranteedMaxTax)} test.`,
  facts: [['Tax limit, agreement the IRS must accept', K.usd(L.guaranteedMaxTax)], ['Term of that agreement', `${L.guaranteedYears} years`], ['Short-term plan fee', K.usd(0)], ['Online direct debit fee', K.usd(F.ddiaOnline)]],
  resume: `A ${K.usd(bal)} balance sits right on a line drawn by section 6159(c) of the tax code: when the tax owed is ${K.usd(L.guaranteedMaxTax)} or less, the person filed and paid on time for the past five years without another agreement, and the debt will be paid within ${L.guaranteedYears} years, the IRS must accept the installment agreement. The test looks at tax only. A notice showing ${K.usd(bal)} that includes ${K.usd(bal - taxPart)} of penalties and interest on ${K.usd(taxPart)} of tax meets it; ${K.usd(bal)} of pure tax plus anything added does not. Either way, the balance also fits a short-term plan of ${L.shortTermDays} days with no fee, and the online Simple Payment Plan. On the mixed balance, paying over ${gMonths} months takes ${K.usd(g.monthly)} a month and adds ${K.usd(g.interest + g.ftp)}; six months takes ${K.usd(six.monthly)} a month and adds ${K.usd(six.interest + six.ftp)}, with no set-up fee.`,
  body: (h) => `
<h2>Ten thousand dollars and the agreement the IRS must accept</h2>
<p>Most installment agreements are a matter of IRS discretion. ${h.src('irc6159', 'Section 6159(c)')} is the exception: it lists conditions under which the IRS has to say yes. The ${h.src('i9465', 'Form 9465 instructions')} restate them for individuals. The tax you owe is not more than ${K.usd(L.guaranteedMaxTax)}. In the past five tax years you and your spouse, if the return is joint, filed every income tax return on time, paid the tax shown and had no installment agreement for income tax. You agree to pay in full within ${L.guaranteedYears} years and to stay current, and you cannot pay the full amount when it is due.</p>
<p>The figure that counts is the tax. A balance of ${K.usd(bal)} on a CP14 typically mixes tax, the late payment penalty and interest. With ${K.usd(taxPart)} of tax inside it, the condition is met with room to spare. Someone who owed ${K.usd(bal)} of tax before any penalty is just above the line, and falls back to the ordinary Simple Payment Plan, which is still available online at this size.</p>
<h2>Six months, three years, or longer</h2>
<p>The table spreads the mixed balance, ${K.usd(taxPart)} of tax and ${K.usd(bal - taxPart)} of penalties and interest, over five terms. Payments go first to the tax, so the late payment penalty, figured on unpaid tax, falls fastest on short terms.</p>
${h.table(['Term', 'Monthly payment', 'Interest', 'Late payment penalty', 'Plan type'], terms.map((x) => [`${x.m} months`, K.usd(x.monthly), K.usd(x.interest), K.usd(x.ftp), x.m <= 6 ? 'Short-term, no fee' : x.m <= gMonths ? 'Section 6159(c) or Simple' : 'Simple Payment Plan']), `Return filed on time, interest at ${K.rate(P.interest.current)} carried forward; set-up fee not included`, ['l', 'r', 'r', 'r', 'l'])}
${h.mini('plan', { t: 'Your balance near ten thousand', p: ['bal', 'mo'], d: { bal: 9600, mo: '12' } })}
<p>The six-month row is a short-term plan: no fee, but six payments of ${K.usd(six.monthly)}. From twelve months onward, a set-up fee is added, ${K.usd(F.ddiaOnline)} for direct debit online and ${K.usd(F.otherOnline)} with other payment methods online. The ${gMonths}-month row is the longest term the section 6159(c) agreement allows.</p>
<h2>Why the share of tax changes the bill</h2>
<p>If the whole ${K.usd(bal)} were tax, the ${gMonths}-month payment would be ${K.usd(allTax.monthly)} and the late payment penalty over the plan ${K.usd(allTax.ftp)}, against ${K.usd(g.ftp)} on the mixed balance. The difference is small at this size, but it is why the calculator asks for the share of tax: the penalty is ${K.pct(P.ftp.withPlan)} a month of the tax still unpaid, never of the penalties and interest. For a person who filed late, the rate stays at ${K.pct(P.ftp.monthly)}; on the same ${gMonths}-month schedule that penalty comes to ${K.usd(lateFiler.ftp)} instead of ${K.usd(g.ftp)}.</p>
<h2>Applying for a plan at this size</h2>
<p>A balance of ${K.usd(bal)} is well inside the online limits: under ${K.usd(L.shortTermMax)} for a short-term plan and at or below ${K.usd(L.simpleMax)} for a long-term one, with all returns filed. The online account gives an answer at once; no financial statement is asked for, and the IRS generally does not levy while the request is pending or the plan is in force. The ${h.src('simple', 'Simple Payment Plan page')} adds that payments can go by automatic withdrawal for the reduced fee, by Direct Pay, or by card through an approved processor.</p>
<h2>Liens, levies and passports at this size</h2>
<p>Three collection tools worry people who owe this much, and the plan changes each of them. A notice of federal tax lien is generally not filed with the agreement the IRS must accept or with a streamlined agreement, according to the Form 9465 instructions, though it can be in some situations. A levy on wages or a bank account is generally off the table while a request is being considered and while the plan is in force. And ${h.a('irs-passport-revocation', 'passport certification')} starts only above ${K.usd((P.passport as Record<string, number>)['2026'])} of seriously delinquent debt in 2026, far over this balance. Without any arrangement, the ordinary notices still follow, ending with a notice of intent to levy and a late payment penalty of ${K.pct(P.ftp.afterLevyNotice)} a month.</p>
<h2>Refunds, new taxes and the next April</h2>
<p>A plan for ${K.usd(bal)} usually spans at least one more filing season. Any refund is applied to the balance, and the monthly payment is still due that month. A new balance due on next year\'s return can put the plan in default, since the agreement requires future taxes to be paid on time; withholding and estimated payments are the levers that keep the next return at zero. If that happens anyway, the ${h.a('missed-irs-payment-plan-payment', 'missed payment page')} covers the notices and how a plan is reinstated. The IRS decides on each request; the numbers above are estimates at today\'s rate.</p>
`,
  faqs: [
    { q: `Does a ${K.usd(bal)} IRS balance qualify for the agreement the IRS must accept?`, a: `It depends on how much of it is tax. The section 6159(c) test is tax of ${K.usd(L.guaranteedMaxTax)} or less, plus five years of on-time filing and payment with no prior income tax agreement, and full payment within ${L.guaranteedYears} years. A ${K.usd(bal)} balance that includes penalties and interest usually passes the tax test; ${K.usd(bal)} of tax alone does not.` },
    { q: `What is the monthly payment on ${K.usd(bal)} owed to the IRS over ${L.guaranteedYears} years?`, a: `About ${K.usd(allTax.monthly)} a month if the whole balance is tax, and ${K.usd(g.monthly)} if ${K.usd(taxPart)} of it is tax and the rest is penalties and interest, at the ${K.rate(P.interest.current)} rate and with the return filed on time. The set-up fee comes on top: ${K.usd(F.ddiaOnline)} with direct debit online.` },
    { q: `Can I pay ${K.usd(bal)} to the IRS over six months without a set-up fee?`, a: `Yes. A short-term plan gives up to ${L.shortTermDays} days for balances under ${K.usd(L.shortTermMax)} with no set-up fee. Six even payments on the example balance come to ${K.usd(six.monthly)} each and add ${K.usd(six.interest + six.ftp)} of interest and penalty. Payments can be of any size as long as the balance is cleared in time.` },
  ],
  tool: 'plan',
  toolArg: { bal, mo: String(gMonths), taxp: Math.round((taxPart / bal) * 100) },
  related: ['irs-installment-agreement', 'short-term-payment-plan', 'irs-payment-plan-fees', 'owe-irs-50000', 'missed-irs-payment-plan-payment'],
  sources: ['irc6159', 'i9465', 'simple', 'plans'],
});
