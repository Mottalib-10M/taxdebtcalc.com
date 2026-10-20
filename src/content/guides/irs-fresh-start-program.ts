import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, PL = P.plans, F = PL.fees, O = P.oic;
// Two balances on either side of the Simple Payment Plan line, both over 72 months.
const under = 47500, over = 52500, months = 72;
const pu = K.plan(under, months), po = K.plan(over, months);
const small = 9200, smallPlan = K.plan(small, 12 * PL.guaranteedYears);

export default defineGuide({
  id: 'irs-fresh-start-program',
  group: 'settle',
  order: 360,
  slug: 'irs-fresh-start-program',
  nav: 'IRS Fresh Start program',
  card: 'What "Fresh Start" refers to today, matched to the IRS tools and limits in force in 2026',
  title: 'IRS Fresh Start Program 2026: What Exists, Real Limits',
  description: `IRS Fresh Start program 2026: no application exists. What the name covers today: plans up to ${K.usd(PL.simpleMax)}, ${PL.shortTermDays}-day plans, offers, lien withdrawal and the limits.`,
  h1: 'IRS Fresh Start program: what the name covers in 2026',
  intro: 'Type your balance and a term. The calculator shows which of the IRS payment options the balance falls into and what each month costs, the part of "Fresh Start" that can actually be put in numbers.',
  facts: [['Application form for "Fresh Start"', 'none'], ['Simple Payment Plan, balance up to', K.usd(PL.simpleMax)], ['Short-term plan', `${PL.shortTermDays} days, under ${K.usd(PL.shortTermMax)}`], ['Offer in compromise fee', K.usd(O.fee)]],
  resume: `There is no IRS program called Fresh Start that a taxpayer applies to, and no form bears that name. The phrase comes from the IRS Commissioner's 2011 Fresh Start initiative, which loosened several collection rules: easier installment agreements, more flexible offers in compromise and new ways to withdraw a Notice of Federal Tax Lien. Advertisements still use the name; the IRS today simply offers the tools themselves. In 2026 they are a short-term plan of up to ${PL.shortTermDays} days for balances under ${K.usd(PL.shortTermMax)}, a Simple Payment Plan with no financial statement for individuals owing ${K.usd(PL.simpleMax)} or less, larger plans with Form 433-F, an offer in compromise with a ${K.usd(O.fee)} fee, currently not collectible status, lien withdrawal after a direct debit plan, and penalty relief, now automatic for clean histories from the ${P.aep.firstTaxYear} returns. On ${K.usd(under)} over ${months} months, a Simple Payment Plan costs ${K.usd(pu.monthly)} a month; at ${K.usd(over)} the same term needs a financial statement first.`,
  body: (h) => `
<h2>Where the name comes from</h2>
<p>The only place the phrase survives on the IRS pages read for this site is the ${h.src('lien', 'federal tax lien page')}, which explains that two lien withdrawal options "resulted from the Commissioner's 2011 Fresh Start initiative". The other changes made at that time have since been folded into the ordinary rules and renamed. That is why a search for the program finds firms selling enrollment in it: the label is free to use, but the IRS has no Fresh Start application, queue or approval letter. Every outcome a firm can describe under that name is a standard request any taxpayer can make online, by phone or by mail, through the ${h.src('taxdebt', 'IRS tax debt help page')}.</p>
<h2>The 2011 ideas and their 2026 form</h2>
${h.table(['What ads call Fresh Start', 'What the IRS offers in 2026', 'Limit or cost in force'], [
    ['Streamlined installment agreement', 'Simple Payment Plan, no financial statement, up to the end of the collection period', `balance up to ${K.usd(PL.simpleMax)}; fee ${K.usd(F.ddiaOnline)} to ${K.usd(F.otherOther)}`],
    ['Short-term extension to pay', 'Short-term payment plan', `${PL.shortTermDays} days, balance under ${K.usd(PL.shortTermMax)}, no fee`],
    ['Plans for larger balances', 'Installment agreement with Form 433-F or 433-H', 'payment measured against the Collection Financial Standards'],
    ['Small balance plan the IRS cannot refuse', 'The installment agreement the IRS must accept (section 6159(c))', `tax up to ${K.usd(PL.guaranteedMaxTax)}, paid within ${PL.guaranteedYears} years`],
    ['Expanded offer in compromise', 'Offer in compromise, Form 656 and 433-A (OIC)', `${K.usd(O.fee)} fee and ${K.pct(O.lumpSumDeposit)} with a lump-sum offer, waived for low income`],
    ['Hardship relief', 'Currently not collectible status', 'income below allowable expenses'],
    ['Lien withdrawal', 'Withdrawal after a direct debit plan or after payment', 'three consecutive debits, conditions on the lien page'],
    ['Penalty forgiveness', 'First Time Abate; Automatic Exemption from Penalty', `automatic for ${P.aep.firstTaxYear} returns onward with ${P.aep.lookbackYears} clean years`],
  ], `Limits read on irs.gov on ${K.day(P.meta.retrieved_at)}`, ['l', 'l', 'l'])}
<h2>The line that matters most: ${K.usd(PL.simpleMax)}</h2>
<p>For an individual, the most useful piece of the old initiative is a payment plan without a financial statement. The ${h.src('simple', 'Simple Payment Plan page')} sets it at ${K.usd(PL.simpleMax)} or less in combined tax, penalties and interest, with all returns filed. Below that line the IRS does not ask about rent, cars or bank accounts, and does not make a lien determination; above it, the plan is still possible but the payment is tested against income and allowable expenses.</p>
${h.table(['Balance', 'Monthly over 72 months', 'Interest and penalty', 'Financial statement'], [
    [K.usd(under), K.usd(pu.monthly), K.usd(pu.interest + pu.ftp), 'not required'],
    [K.usd(over), K.usd(po.monthly), K.usd(po.interest + po.ftp), 'Form 433-F or 433-H'],
  ], `Tax only, return filed on time, interest at ${K.rate(P.interest.current)} carried forward, set-up fee not included`, ['l', 'r', 'r', 'l'])}
<p>Someone owing a little over the line can pay the excess first, then ask for a Simple Payment Plan on what remains. The ${h.a('owe-irs-50000', 'page for balances near the limit')} works through that case.</p>
${h.mini('plan', { t: 'Your balance, 72 months', p: ['bal'], d: { bal: under, mo: String(months) } })}
<h2>The plan the IRS must accept</h2>
<p>Section 6159(c) of the tax code obliges the IRS to accept an installment agreement from an individual whose tax, not counting penalties and interest, is ${K.usd(PL.guaranteedMaxTax)} or less, if, during the five preceding tax years, the person (and a spouse on a joint return) filed every return, paid the tax shown and did not have such an agreement, the IRS finds the person unable to pay in full when due, and the agreement pays the tax in full within ${PL.guaranteedYears} years. On ${K.usd(small)} of tax over ${12 * PL.guaranteedYears} months, the payment is ${K.usd(smallPlan.monthly)}. Because the Simple Payment Plan already covers far larger balances, this provision now matters mostly as a legal floor.</p>
<h2>Lien withdrawal, the rule that still carries the name</h2>
<p>The lien page describes the two withdrawal routes credited to the 2011 initiative. The first applies after the debt is paid and the lien released: a person who has filed every individual, business and information return for the past three years and is current on estimated payments and deposits can ask the IRS to withdraw the public notice, so that it no longer signals to other creditors that the IRS competes with them for the property. The second applies while the debt is still being paid. An individual, a business owing only income tax or a closed business can ask for withdrawal once a Direct Debit Installment Agreement is in place, if the balance is at or under the ceiling set on the lien page (a larger balance can be paid down to it first), the plan pays everything within 60 months or before the collection period ends, three consecutive debits have gone through, and no direct debit plan has ever defaulted. The request is made on Form 12277.</p>
<h2>What no program can deliver</h2>
<p>No IRS procedure erases the tax itself because a person enrolls in something. Penalties can be removed under First Time Abate or reasonable cause; the tax and the interest on it stay. An offer in compromise settles for less only when the reasonable collection potential is lower than the debt. A debt can expire at the end of the collection period, but the period pauses during many requests. Readers who see "Fresh Start" in an ad can match its promise against the table above; the offers that remain are the ones on ${h.a('tax-debt-relief', 'what the IRS itself offers')}. The IRS decides each request, and the figures here describe its published rules, not your case.</p>
`,
  faqs: [
    { q: 'Is there an application form for the IRS Fresh Start program?', a: `No. The IRS has no form, portal or approval called Fresh Start. You apply for the specific tool: a payment plan online or with Form 9465, an offer in compromise with Form 656 and the ${K.usd(O.fee)} fee, currently not collectible status by phone, or lien withdrawal with Form 12277. Each has its own conditions and the IRS decides each request separately.` },
    { q: 'What was the IRS Fresh Start initiative of 2011?', a: 'It was a set of changes announced by the IRS Commissioner in 2011 to make collection less harsh for people who could not pay: larger balances eligible for plans without financial statements, more room for offers in compromise and new options to withdraw a Notice of Federal Tax Lien. The IRS lien page still credits two withdrawal options to that initiative.' },
    { q: 'Is the IRS Fresh Start program still available in 2026?', a: `The tools it introduced still exist under their own names. In 2026 an individual can get a plan without a financial statement on a balance up to ${K.usd(PL.simpleMax)}, a ${PL.shortTermDays}-day plan under ${K.usd(PL.shortTermMax)}, an offer in compromise, hardship status and lien withdrawal. What does not exist is a separate program that grants anything beyond those rules.` },
  ],
  tool: 'plan',
  toolArg: { bal: under, mo: months },
  related: ['tax-debt-relief', 'irs-payment-plan', 'offer-in-compromise', 'irs-tax-lien', 'first-time-penalty-abatement', 'owe-irs-50000'],
  sources: ['lien', 'simple', 'plans', 'irc6159', 'oic', 'fta', 'taxdebt'],
});
