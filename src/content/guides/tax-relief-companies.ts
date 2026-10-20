import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, PL = P.plans, F = PL.fees, O = P.oic;
// A $19,400 balance and a $450 monthly budget, the case a "free consultation" usually starts from.
const bal = 19400, cap = 450;
const d = K.tool('diy', { bal, cap });
const direct = Number(d.rows[0][2]) + Number(d.rows[1][2]);
const opts = K.planOptions(bal, bal);

export default defineGuide({
  id: 'tax-relief-companies',
  group: 'settle',
  order: 380,
  slug: 'tax-relief-companies',
  nav: 'Tax relief companies',
  card: 'What a resolution firm files for you, what no firm can obtain, and the IRS warning on "OIC mills"',
  title: 'Tax Relief Companies 2026: What They File, What They Cannot',
  description: `Tax relief companies 2026: the forms they file that you can file yourself for ${K.usd(0)} to ${K.usd(O.fee)}, what no firm can obtain from the IRS, and its warning on offer mills.`,
  h1: 'Tax relief companies: what they do and what they cannot get',
  intro: 'Enter your balance, what you can pay each month and, if you have one, the fee a firm quoted. The calculator shows what a direct plan with the IRS costs and how many months of your budget the quote represents.',
  facts: [['IRS Dirty Dozen 2026, item', '12, offer in compromise mills'], ['Online plan with direct debit', K.usd(F.ddiaOnline)], ['Offer in compromise fee', K.usd(O.fee)], ['Taxpayer Advocate Service', 'free']],
  resume: `A tax relief company, also sold as tax resolution, prepares and files the same requests a taxpayer can file alone: a payment plan, an offer in compromise on Form 656 with Form 433-A (OIC), a request for currently not collectible status, a penalty abatement, and a power of attorney (Form 2848) so it can speak to the IRS. It cannot obtain anything the IRS rules do not already allow. An offer is accepted only at or above the reasonable collection potential unless special circumstances are documented, interest cannot be waived for a fee, and the tax itself is never removed by penalty relief. The IRS listed aggressive offer marketing, "OIC mills" that overpromise and charge high fees to people who do not qualify, as item 12 of its 2026 Dirty Dozen scams. Asking the IRS directly costs ${K.usd(0)} to ${K.usd(F.otherOther)} for a plan and ${K.usd(O.fee)} for an offer. On ${K.usd(bal)} at ${K.usd(cap)} a month, a direct online plan takes ${d.value} and adds ${K.usd(direct)} in interest, penalty and set-up fee.`,
  body: (h) => `
<h2>What the IRS itself says about the market</h2>
<p>In its ${h.src('dirtydozen', '2026 Dirty Dozen list')} (IR-2026-30), the IRS describes aggressive or misleading Offer in Compromise marketing: offer mills "often overpromise results and charge high fees to taxpayers who don't qualify", and it points taxpayers to free IRS tools to check eligibility first. The warning targets a specific pattern: a promise to settle for a fraction of the balance, made before anyone has looked at the household's assets, income and county standards. Since the outcome of an offer is a formula, a quote that does not start from that formula is a sales figure.</p>
<h2>The work, step by step, and who can do it</h2>
${h.table(['What a firm does', 'What the IRS requires', 'Cost when filed directly'], [
    ['Pulls your account transcript', 'online account or Form 4506-T', K.usd(0)],
    ['Files missing returns', 'all required returns before any relief', K.usd(0)],
    ['Sets up a payment plan', 'online, by phone or Form 9465', `${K.usd(F.ddiaOnline)} to ${K.usd(F.otherOther)}, reduced for low income`],
    ['Prepares an offer in compromise', 'Form 656, Form 433-A (OIC), documents', `${K.usd(O.fee)} plus first payment, waived for low income`],
    ['Requests hardship status', 'phone call, Form 433-F or 433-A', K.usd(0)],
    ['Asks for penalty removal', 'phone call or Form 843', K.usd(0)],
    ['Talks to the IRS for you', 'Form 2848 (attorney, CPA, enrolled agent) or a third-party authorization', K.usd(0)],
  ], `IRS fees read on ${K.day(P.meta.retrieved_at)}; any firm fee comes on top`, ['l', 'l', 'l'])}
<p>The forms are public, and the IRS online account builds an offer and computes a possible amount. Representation is a real service when a case involves an audit, a business, trust fund penalties or litigation, and the people allowed to represent a taxpayer before the IRS under a power of attorney are mainly attorneys, certified public accountants and enrolled agents. For a wage earner with a balance in the Simple Payment Plan range, the request is the same with or without a representative.</p>
<h2>What no firm can obtain</h2>
${h.table(['Promise heard in ads', 'What the IRS rules say'], [
    ['"Settle for pennies on the dollar"', 'An offer must at least equal the reasonable collection potential from Form 433-A (OIC), unless special circumstances are documented'],
    ['"Stop the interest"', `Interest runs at the quarterly rate, ${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}, during plans, offers and hardship status`],
    ['"Remove the lien now"', 'The IRS releases a lien within 30 days after full payment; with an offer, not until the offer is paid'],
    ['"Erase the tax with penalty relief"', 'First Time Abate and reasonable cause remove penalties and their interest, never the tax'],
    ['"Get your offer approved faster"', `The IRS has ${O.autoAcceptYears} years to decide; every offer goes to the same centralized units`],
    ['"Enroll you in Fresh Start"', 'No such enrollment exists; see the Fresh Start page'],
  ], 'From the IRS offer, lien, interest and penalty relief pages and Form 656', ['l', 'l'])}
<p>The ${h.a('irs-fresh-start-program', 'Fresh Start page')} matches each piece of that marketing term to the tool that actually exists.</p>
<h2>Measuring a quote against your own plan</h2>
<p>Take ${K.usd(bal)} owed and ${K.usd(cap)} a month available. The balance is ${opts.simple ? 'within' : 'over'} the ${K.usd(PL.simpleMax)} Simple Payment Plan limit, so the IRS needs no financial statement. Applied online with direct debit, the plan takes ${d.value} and costs ${K.usd(direct)} beyond the balance, set-up fee included. A firm's fee is paid out of the same monthly budget: every month of your payment that goes to a fee is a month the IRS balance keeps accruing interest. Type the quote you received into the calculator to see how many months of your budget it represents.</p>
${h.mini('diy', { t: 'A quoted fee in months of your budget', p: ['fee'], d: { bal, cap, fee: 0 } })}
<p>An offer adds two costs that do not come back. The ${K.usd(O.fee)} application fee is kept if the offer is rejected, and every payment sent with or during the offer is applied to the debt rather than refunded. A firm that files an offer for someone whose collection potential exceeds the balance spends that money on a request the IRS states it generally will not accept.</p>
<h2>What a real estimate needs</h2>
<p>A settlement figure cannot be produced on a first phone call, because the inputs are not known yet. Form 433-A (OIC) needs the county of residence and the number of people in the household, to look up the housing and car standards; the gross monthly income of everyone who contributes; the market value and loan balance of the home, each car and each retirement account; bank balances from the last three months of statements; and the actual cost of health insurance, child care and current taxes. Without those, any percentage quoted is a guess. With them, the result is mechanical, and the ${h.a('reasonable-collection-potential', 'line-by-line page')} shows each step, so a quoted settlement can be checked against the same arithmetic before any fee is paid.</p>
<p>The same goes for a payment plan. Below the Simple Payment Plan limit, the only inputs are the balance and the term; the IRS fixes the fee and the penalty rate, and the interest follows the published quarterly rate.</p>
<h2>Free checks before signing anything</h2>
<p>The IRS ${h.src('prequal', 'Offer in Compromise Pre-Qualifier')} runs the eligibility test with no name or phone number. The ${h.src('tas', 'Taxpayer Advocate Service')} helps at no cost when a tax problem causes financial difficulty. Low Income Taxpayer Clinics represent eligible taxpayers for free or a small fee, including in collection disputes. The calculators on this site compute the plan, the allowable expenses and the minimum offer from the published IRS rules without collecting any contact details. None of them, and no firm, can promise an outcome: the IRS reviews each request and decides, and this page is general information, not tax advice.</p>
`,
  faqs: [
    { q: 'Can a tax relief company settle my IRS debt for pennies on the dollar?', a: 'Only if the IRS formula already says so. An offer in compromise must generally equal at least the reasonable collection potential: equity in assets at quick-sale value plus remaining monthly income times 12 or 24. If that figure is close to the balance, no firm can get a lower settlement accepted; if it is far below, the taxpayer can file the same offer directly.' },
    { q: 'What is an OIC mill according to the IRS?', a: 'It is the IRS name for aggressive or misleading offer in compromise marketing, item 12 of its 2026 Dirty Dozen list of tax scams. The IRS says these operators often overpromise results and charge high fees to taxpayers who do not qualify, and it points to free IRS tools for checking eligibility before paying anyone.' },
    { q: 'Who is allowed to represent a taxpayer before the IRS on a tax debt?', a: 'Under a power of attorney on Form 2848, mainly attorneys, certified public accountants and enrolled agents. Form 433-A (OIC) asks for that form if you want your attorney, CPA or enrolled agent to act for you. A relative or other person can also be authorized to contact the IRS on your behalf, and Low Income Taxpayer Clinics represent eligible people.' },
    { q: 'Is a payment plan easier to get through a resolution firm?', a: `No. For an individual owing ${K.usd(PL.simpleMax)} or less with all returns filed, the IRS sets up a Simple Payment Plan online without a financial statement, for a ${K.usd(F.ddiaOnline)} fee with direct debit. The same rules and the same fee apply when a representative files the request; the only extra cost is the representative's own fee.` },
  ],
  tool: 'diy',
  toolArg: { bal, cap },
  related: ['tax-debt-relief', 'irs-fresh-start-program', 'offer-in-compromise', 'reasonable-collection-potential', 'irs-payment-plan'],
  sources: ['dirtydozen', 'oic', 'prequal', 'tas', 'taxdebt', 'plans', 'lien'],
});
