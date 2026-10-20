import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, O = P.oic, L = O.lowIncome, F = P.plans.fees;
const sizes = [1, 2, 3, 4, 5, 6, 7, 8];
// Household of three on Oahu: the Hawaii column decides.
const hiInc = 6300, hiSize = 3, hiBal = 23500;
const hiYear = hiInc * 12, hiLimit = K.lowIncomeLimit(hiSize, 'hawaii'), baseLimit3 = K.lowIncomeLimit(hiSize, 'base');
// Couple in Anchorage.
const akInc = 5500, akYear = akInc * 12, akLimit = K.lowIncomeLimit(2, 'alaska'), akBase = K.lowIncomeLimit(2, 'base');
// Ten-person household in the 48 contiguous states.
const big = K.lowIncomeLimit(10, 'base');
// What the Hawaii household would have had to send without the certification.
const hiOffer = K.tool('oic', { bal: hiBal, st: 'Hawaii', co: 'Honolulu County', hh: hiSize, inc: hiInc });
const hiLump = Number(hiOffer.rows[0][2]) + Number(hiOffer.rows[1][2]);
const hiUp = K.upfront(hiLump, 'lump');

export default defineGuide({
  id: 'low-income-offer-in-compromise',
  group: 'settle',
  order: 320,
  slug: 'low-income-offer-in-compromise',
  nav: 'Low-income offer in compromise',
  card: `The Low-Income Certification table: no ${K.usd(O.fee)} fee and no payment while the offer is reviewed`,
  title: 'Low-Income Offer in Compromise 2026: Income Limits by Size',
  description: `Low-income offer in compromise 2026: Form 656 income table by household size, ${K.usd(L.base[0])} for one person, Alaska and Hawaii limits; no ${K.usd(O.fee)} fee, no down payment.`,
  h1: 'Low-income offer in compromise: the income table and what it waives',
  intro: 'Pick Hawaii, Alaska or any other state, the household size and the gross monthly income. The calculator tells you whether the household meets the Low-Income Certification and what the minimum offer remains.',
  facts: [['One person, 48 states and D.C.', K.usd(L.base[0])], ['Four people, 48 states and D.C.', K.usd(L.base[3])], ['Each person after eight', K.usd(L.add)], ['Fee and payments while under review', K.usd(0)]],
  resume: `The Low-Income Certification on Form 656 lets an individual file an offer in compromise without the ${K.usd(O.fee)} application fee, without the ${K.pct(O.lumpSumDeposit)} payment that normally goes with a lump-sum offer, and without monthly payments while a periodic offer is considered. You qualify if either your adjusted gross income on the latest Form 1040 or your household's gross monthly income times 12 is at or under the figure for your household size: ${K.usd(L.base[0])} for one person, ${K.usd(L.base[1])} for two, ${K.usd(L.base[3])} for four, plus ${K.usd(L.add)} for each person after eight in the 48 contiguous states, D.C. and the territories. Alaska and Hawaii have their own, higher columns, for example ${K.usd(L.alaska[0])} and ${K.usd(L.hawaii[0])} for one person. The certification changes when you pay, not how much: the minimum offer is still the reasonable collection potential, and the first payment falls due 30 days after the IRS accepts. A family of three in Honolulu earning ${K.usd(hiInc)} a month qualifies; the same family in Ohio would not.`,
  body: (h) => `
<h2>The table printed on Form 656</h2>
<p>The figures below are the Low-Income Certification chart of ${h.src('f656b', 'Form 656, revision ' + O.formRevision)}. The last column turns the yearly limit for the 48 states into a monthly figure, which is the number to compare with a paycheck or a benefit statement when you use the gross monthly income route.</p>
${h.table(['Household size', '48 states, D.C., territories', 'Alaska', 'Hawaii', '48 states, per month'], [
    ...sizes.map((n) => [String(n), K.usd(K.lowIncomeLimit(n, 'base')), K.usd(K.lowIncomeLimit(n, 'alaska')), K.usd(K.lowIncomeLimit(n, 'hawaii')), K.usd(K.lowIncomeLimit(n, 'base') / 12)]),
    ['Each additional person', `+ ${K.usd(L.add)}`, `+ ${K.usd(L.alaskaAdd)}`, `+ ${K.usd(L.hawaiiAdd)}`, `+ ${K.usd(L.add / 12)}`],
  ], 'Yearly income at or under which the Low-Income Certification applies', ['l', 'r', 'r', 'r', 'r'])}
<p>A household of ten in Texas or Florida therefore has a limit of ${K.usd(big)}: the eight-person figure plus two additional persons. The chart counts the "family unit", and the household on Form 433-A (OIC) includes everyone who shares the costs, so the number of people should match what the financial statement shows.</p>
<h2>Two ways to pass the test</h2>
<p>Form 656 offers two boxes, and ticking either one is enough. The first compares the adjusted gross income from your most recently filed return with the chart. The second takes the gross monthly household income reported on Form 433-A (OIC) and multiplies it by 12. The routes can give different answers: AGI leaves out some untaxed income and is reduced by certain adjustments, while the household income on the financial statement includes non-taxable benefits and the earnings of others who contribute to the household. The IRS verifies whichever box you tick.</p>
<h2>Three households measured</h2>
${h.table(['Household', 'Income × 12', 'Limit that applies', 'Certification'], [
    [`Three people, Honolulu County, Hawaii`, K.usd(hiYear), K.usd(hiLimit), hiYear <= hiLimit ? 'met' : 'not met'],
    ['Same three people in Ohio', K.usd(hiYear), K.usd(baseLimit3), hiYear <= baseLimit3 ? 'met' : 'not met'],
    ['Couple, Anchorage, Alaska', K.usd(akYear), K.usd(akLimit), akYear <= akLimit ? 'met' : 'not met'],
    ['Same couple in Oregon', K.usd(akYear), K.usd(akBase), akYear <= akBase ? 'met' : 'not met'],
  ], 'Gross monthly household income route', ['l', 'r', 'r', 'l'])}
<p>The Honolulu family earning ${K.usd(hiInc)} a month owes ${K.usd(hiBal)}. Its minimum lump-sum offer, with the calculator's default assets, is ${K.usd(hiLump)}. Without the certification it would mail ${K.usd(hiUp.fee + hiUp.deposit)} with the application, fee and ${K.pct(O.lumpSumDeposit)} together, money the IRS keeps even if the offer fails. With it, the application goes in with no payment at all. Moving the same paycheck to Columbus, Ohio, or Portland, Oregon, puts it over the line, because the limit there is ${K.usd(baseLimit3)} for three.</p>
${h.mini('oic', { t: 'Does your household meet the certification?', p: ['inc', 'hh'], d: { bal: 16800, st: 'Alaska', co: 'Anchorage Municipality', hh: 2, inc: akInc } })}
<h2>Claiming it on the application</h2>
<p>The certification is a box in Section 1 of Form 656, next to the chart, and nothing else has to be filed to claim it. An individual can build the whole offer in the IRS Individual Online Account, which prepares the forms and computes a possible offer; a paper offer goes to the Centralized Offer in Compromise Unit in Memphis or Brookhaven, depending on the state, with Form 433-A (OIC) and its attachments: recent pay stubs, three months of bank statements, loan statements. A spouse with separate debts files a separate Form 656, and each of those forms carries its own fee and payment unless the certification is met. Keep a copy: the IRS may write back for documents, and an unanswered request gets the offer returned without appeal rights.</p>
<h2>What the certification does not change</h2>
<p>The offer amount is the same arithmetic as for anyone else: equity in assets plus remaining monthly income times ${O.multiplierLumpSum} or ${O.multiplierPeriodic}, as worked through on the ${h.a('reasonable-collection-potential', 'reasonable collection potential page')}. A low income often means a small remaining income, but a paid-off car, a retirement account or home equity can still push the minimum close to the balance. The certification also does not speed up the review, stop interest, or prevent the IRS from filing a lien.</p>
<p>A few limits come from the booklet. Only individuals qualify, including a sole proprietor for debts of the business they own personally; a corporation, a partnership, an LLC filing as a business and the estate of a deceased person do not. If you qualify but send money anyway, the payment is applied to the debt and not returned. Once the offer is accepted, the first payment is due 30 calendar days later unless an amended offer sets another date, and the usual ${O.complianceYears}-year filing and payment conditions apply.</p>
<h2>The same idea in payment plans</h2>
<p>Payment plans have a separate low-income rule, based on adjusted gross income at or under ${K.pct(P.plans.lowIncomePovertyMultiple, 0)} of the federal poverty level: the set-up fee is ${K.usd(F.ddiaLowIncome)} with direct debit and ${K.usd(F.otherLowIncome)} otherwise, reimbursable in some cases (see ${h.a('irs-payment-plan-fees', 'payment plan fees')}). The two tests are written separately by the IRS and a household can meet one without the other. In both cases the IRS checks the claim against its records and has the last word; this page applies the published tables and is not tax advice.</p>
`,
  faqs: [
    { q: 'Do I send any money with my offer if I meet the Low-Income Certification?', a: `No. The Form 656 booklet tells qualifying applicants not to include the ${K.usd(O.fee)} fee or any offer payment, and periodic payments are not due while the IRS reviews the offer. Money sent anyway is applied to the tax debt and not returned. If the offer is accepted, the first payment is due 30 calendar days after acceptance.` },
    { q: 'Is the low-income offer test based on AGI or on gross monthly income?', a: 'Either one. Form 656 has two boxes: one compares the adjusted gross income from your most recent Form 1040 with the chart, the other multiplies the gross monthly household income from Form 433-A (OIC) by 12. Meeting either test is enough, and the IRS verifies the figure behind the box you tick.' },
    { q: 'What are the Alaska and Hawaii limits for a low-income offer in compromise?', a: `Form 656 prints separate columns. For one person the limit is ${K.usd(L.alaska[0])} in Alaska and ${K.usd(L.hawaii[0])} in Hawaii, against ${K.usd(L.base[0])} elsewhere; for four people, ${K.usd(L.alaska[3])} and ${K.usd(L.hawaii[3])} against ${K.usd(L.base[3])}. Each person after eight adds ${K.usd(L.alaskaAdd)} in Alaska and ${K.usd(L.hawaiiAdd)} in Hawaii.` },
    { q: 'Does qualifying as low income lower the offer amount the IRS will accept?', a: `No. The certification removes the ${K.usd(O.fee)} fee and the payments due while the offer is pending, but the minimum offer is still the reasonable collection potential from Form 433-A (OIC). A low-income household with a paid-off car, home equity or retirement savings can still have a minimum close to its balance.` },
  ],
  tool: 'oic',
  toolArg: { bal: hiBal, st: 'Hawaii', co: 'Honolulu County', hh: hiSize, inc: hiInc },
  related: ['offer-in-compromise', 'reasonable-collection-potential', 'irs-payment-plan-fees', 'currently-not-collectible', 'tax-debt-relief'],
  sources: ['f656b', 'oic', 'plans'],
});
