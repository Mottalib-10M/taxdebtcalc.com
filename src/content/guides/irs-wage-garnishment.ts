import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.levy;
type St = 'single' | 'mfj' | 'hoh' | 'mfs';
const statuses: Array<[St, string]> = [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household'], ['mfs', 'Married filing separately']];
const deps = [0, 1, 2, 3, 4];
// Head of household paid every two weeks, two children, $2,350 take-home.
const pay = 2350, per = 'biweekly' as const, fs: St = 'hoh', dep = 2;
const t = K.levyTake(pay, fs, per, dep);
const yearly = t.levied * L.periods[per];
const single0 = K.exemptAmount('single', 'biweekly', 0);
const ex = L.examples;
const old = K.exemptAmount('single', 'weekly', 3, 1);

export default defineGuide({
  id: 'irs-wage-garnishment',
  group: 'collection',
  order: 430,
  slug: 'irs-wage-garnishment',
  nav: 'IRS wage garnishment',
  card: 'What an employer must leave you each payday under Publication 1494 in 2026, and how the levy ends',
  title: 'IRS Wage Garnishment 2026: Exempt Pay, Pub 1494 Table',
  description: `IRS wage garnishment 2026: the take-home pay exempt from levy under Publication 1494, by filing status, dependents and pay period, ${K.usd(L.perDependent)} a year per dependent.`,
  h1: 'IRS wage garnishment: how much of each paycheck you keep',
  intro: 'Enter your take-home pay, how often you are paid, the filing status and the number of dependents you claim on the levy statement. The calculator applies the 2026 Publication 1494 amounts.',
  facts: [['Exempt per dependent, per year', K.usd(L.perDependent)], ['Single, yearly base', K.usd(L.standardDeduction.single)], ['Married filing jointly, yearly base', K.usd(L.standardDeduction.mfj)], ['Table', 'Publication 1494, Rev. 12-2025']],
  resume: `An IRS wage levy, often called wage garnishment, is a continuous levy: once served, the employer sends the IRS part of every paycheck until the IRS releases it. Unlike most creditors, the IRS is not limited to a percentage of pay. The employer must leave you an exempt amount set by Publication 1494 and send the rest of your take-home pay. For 2026 the exempt amount equals the standard deduction for your filing status (${K.usd(L.standardDeduction.single)} single, ${K.usd(L.standardDeduction.mfj)} married filing jointly, ${K.usd(L.standardDeduction.hoh)} head of household) plus ${K.usd(L.perDependent)} for each dependent you claim on the levy statement, plus an extra amount for age 65 or blindness, divided by the number of pay periods. A single person paid every two weeks with no dependents keeps ${K.usd2(single0)} per paycheck. A head of household with two dependents taking home ${K.usd(pay)} every two weeks keeps ${K.usd2(t.exempt)} and loses ${K.usd(t.levied)} a paycheck, about ${K.usd(yearly)} a year, until the levy is released.`,
  body: (h) => `
<h2>The exempt amount, by status and dependents</h2>
<p>The figures below come from ${h.src('p1494', 'Publication 1494 (Rev. 12-2025)')}, which the IRS issues for levies served in 2026. They are amounts per two-week pay period; the calculator converts them for weekly, twice-monthly, monthly and daily pay. The levy statement your employer hands you, Parts 3, 4 and 5 of the levy form, is where the filing status, dependents and any additional standard deduction are declared.</p>
${h.table(['Filing status', ...deps.map((n) => `${n} dependent${n === 1 ? '' : 's'}`)], statuses.map(([k, label]) => [label, ...deps.map((n) => K.usd2(K.exemptAmount(k, 'biweekly', n)))]), 'Take-home pay exempt from levy each two-week pay period, 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Publication 1494 gives its own worked examples, which the calculator reproduces to the cent: a single taxpayer paid weekly who claims three dependents has ${K.usd2(ex[0].exempt)} exempt; a married couple filing jointly, paid every two weeks with two dependents, has ${K.usd2(ex[1].exempt)}. If the single taxpayer in the first example is over 65 and claims one additional standard deduction, the exempt amount rises to ${K.usd2(old)}.</p>
<h2>A head of household paid every two weeks</h2>
<p>Take a parent filing as head of household with two children, taking home ${K.usd(pay)} every two weeks after the deductions that were already in place before the levy. The exempt amount is the yearly base of ${K.usd(L.standardDeduction.hoh)} plus two dependents at ${K.usd(L.perDependent)}, divided by ${L.periods.biweekly} pay periods.</p>
${h.table(['', 'Each paycheck'], [
    ['Take-home pay', K.usd(pay)],
    ['Exempt under Publication 1494', K.usd2(t.exempt)],
    ['Sent to the IRS', `<strong>${K.usd(t.levied)}</strong>`],
    ['Share of take-home pay levied', K.pct(t.levied / pay, 1)],
  ], `Head of household, two dependents, paid every two weeks; about ${K.usd(yearly)} a year if the levy runs twelve months`, ['l', 'r'])}
${h.mini('levy', { t: 'Your paycheck under a levy', p: ['pay', 'dep'], d: { pay, per, fs, dep } })}
<p>The share levied rises steeply with pay: since the exempt amount is fixed, every extra dollar earned above it goes to the IRS. A raise or overtime during a levy ends up almost entirely with the IRS, which is one reason the levy tends to push people toward an arrangement quickly. The reverse also holds: a parent whose take-home pay is at or below the exempt amount loses nothing to the levy, though the debt, the interest and the levy itself all remain on file.</p>
<h2>What the employer receives</h2>
<p>The levy reaches the employer on Form 668-W, in the version used by the IRS's automated collection unit or by a revenue officer, and Publication 1494 is printed for both. Its tables are titled for wages, salary and other income. The table works on take-home pay: what the paycheck would have been after the taxes and deductions in place before the levy arrived. Two employees with the same salary can therefore keep the same exempt amount but lose different sums, because their withholding and benefit deductions differ. The weekly column, divided by five, gives the daily figure for people paid by the day.</p>
<h2>Before the levy: the notices that come first</h2>
<p>The ${h.src('levy', 'IRS levy page')} lists what normally precedes a levy: the tax assessed and a bill sent, a refusal or neglect to pay, a Final Notice of Intent to Levy and Notice of Your Right to a Hearing sent at least 30 days before the levy, and an advance notice that the IRS may contact third parties. Wages appear first in the IRS's list of property held by others that it can levy, ahead of retirement accounts, bank accounts and commissions. The authority is ${h.src('irc6331', 'section 6331 of the tax code')}; section 6334 sets the exemption that Publication 1494 turns into tables.</p>
<h2>Filling in the levy statement</h2>
<p>The employer gives the employee the statement of exemptions. On it you write your filing status, the number of dependents you can claim, and a number in the "additional standard deduction" space if you or your spouse are 65 or older or blind. Dependents claimed must be people you could claim on your tax return. Child support ordered by a court before the levy is also left to you, on top of the exempt amount.</p>
<h2>How the levy ends</h2>
<p>A wage levy stops when the balance is paid, when the IRS releases it, or when the collection period expires. Release usually follows a ${h.a('irs-payment-plan', 'payment plan')}, an accepted ${h.a('offer-in-compromise', 'offer')} or a finding of ${h.a('currently-not-collectible', 'hardship')}, the status the IRS uses when collecting would leave a household without its basic living expenses. The ${h.src('csed', 'collection period page')} adds a detail: if the IRS levies future income before the collection period expires, it can keep receiving payments from that levy. Exempt amounts here reproduce the publication; your employer applies the figure the IRS sends, and the IRS decides on any release.</p>
`,
  faqs: [
    { q: 'How much of my paycheck can the IRS take with no dependents in 2026?', a: `Everything above the exempt amount. For a single filer with no dependents, Publication 1494 exempts ${K.usd2(single0)} of take-home pay every two weeks, or ${K.usd2(K.exemptAmount('single', 'monthly', 0))} a month. Someone taking home ${K.usd(1900)} every two weeks would see ${K.usd(K.levyTake(1900, 'single', 'biweekly', 0).levied)} of each paycheck go to the IRS until the levy is released.` },
    { q: 'Does an IRS wage levy stop after one paycheck?', a: 'No. A levy on wages and salary is continuous: the employer keeps sending the non-exempt part of every paycheck until the IRS issues a release, the balance is paid, or the collection period ends. Each paycheck is measured against the same exempt amount, so the levy keeps taking the excess for as long as it stands.' },
    { q: 'What do I write on the levy statement my employer gives me?', a: 'Your filing status, the number of dependents you can claim, and, in the additional standard deduction space, how many of you and your spouse are 65 or older or blind. The employer uses those entries to read the Publication 1494 tables, so a dependent left off the statement is a dependent whose share of pay is not protected. The figures change each year with the standard deduction.' },
    { q: 'Is more pay exempt from an IRS levy if I am over 65 or blind?', a: `Yes. Each additional standard deduction claimed on the levy statement adds ${K.usd(L.additional.unmarried)} a year for an unmarried taxpayer or ${K.usd(L.additional.married)} for a married one, spread over the pay periods. For a single person paid weekly with three dependents, one additional deduction raises the exempt amount from ${K.usd2(ex[0].exempt)} to ${K.usd2(old)}.` },
  ],
  tool: 'levy',
  toolArg: { pay, per, fs, dep },
  related: ['irs-bank-levy', 'cp504-notice', 'currently-not-collectible', 'irs-payment-plan', 'irs-collection-statute-of-limitations'],
  sources: ['p1494', 'levy', 'irc6331', 'csed'],
});
