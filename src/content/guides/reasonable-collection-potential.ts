import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, O = P.oic, S = K.S;
// Family of four in Maricopa County, Arizona (Phoenix), homeowners with a thin margin of equity.
const st = 'Arizona', co = 'Maricopa County', hh = 4, inc = 9600, bal = 74000;
const a = { bank: 5400, retirement: 42000, home: 340000, mortgage: 296000, car: 23000, carLoan: 9800, goods: 16500 };
const spend = { housing: 2950, carPayment: 455, operating: 390, healthIns: 610, taxes: 1150, childCare: 600 };
const eq = K.assetEquity({ bank: a.bank, investments: 0, retirement: a.retirement, retirementLoan: 0, lifeCash: 0, homeValue: a.home, homeLoan: a.mortgage, carValue: a.car, carLoan: a.carLoan, car2Value: 0, car2Loan: 0, valuables: a.goods, joint: false });
const al = K.allowable({ state: st, county: co, persons: hh, over65: 0, cars: 1, carPayment: spend.carPayment, operating: spend.operating, housingActual: spend.housing, healthInsurance: spend.healthIns, taxes: spend.taxes, childCare: spend.childCare, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
const boxF = inc - al.total;
const r = K.rcp(eq.total, boxF);
const homeQs = a.home * O.quickSale;
const carQs = a.car * O.quickSale - a.carLoan;

export default defineGuide({
  id: 'reasonable-collection-potential',
  group: 'settle',
  order: 310,
  slug: 'reasonable-collection-potential',
  nav: 'Reasonable collection potential',
  card: 'Form 433-A (OIC) line by line: Box A equity, Box F income, and the minimum offer it produces',
  title: 'Reasonable Collection Potential 2026: Form 433-A (OIC) Math',
  description: `Reasonable collection potential 2026, line by line on Form 433-A (OIC): ${K.pct(O.quickSale)} quick-sale value, ${K.usd(O.vehicleAllowance)} car allowance, county standards, ×${O.multiplierLumpSum} or ×${O.multiplierPeriodic} income.`,
  h1: 'Reasonable collection potential: Form 433-A (OIC) worked through',
  intro: 'The figure the IRS compares with your offer comes out of eight boxes on one form. Change the home value, the mortgage or the income in the calculator and watch which box moves the minimum offer.',
  facts: [['Quick-sale value', `${K.pct(O.quickSale)} of market value`], ['Bank balance kept out', K.usd(O.bankAllowance)], ['Off each car\'s equity', K.usd(O.vehicleAllowance)], ['Off furniture and valuables', K.usd(O.personalEffects)]],
  resume: `Reasonable collection potential, or RCP, is the amount the IRS believes it could collect from you before the collection period ends, and it is the floor for any offer in compromise based on doubt as to collectibility. Form 433-A (OIC), revision ${O.formRevision}, builds it in two blocks. Box A adds the equity in each asset at quick-sale value, ${K.pct(O.quickSale)} of market value minus the loan, after taking ${K.usd(O.bankAllowance)} off bank balances, ${K.usd(O.vehicleAllowance)} off one car's equity (two on a joint offer) and ${K.usd(O.personalEffects)} off furniture and valuables. Box F is gross monthly household income minus allowable expenses under the Collection Financial Standards. The minimum offer is Box A plus Box F times ${O.multiplierLumpSum} if paid within ${O.lumpSumMonths} months, or times ${O.multiplierPeriodic} if paid over ${O.periodicMinMonths} to ${O.periodicMaxMonths} months. For a family of four in ${co} with ${K.usd(inc)} of monthly income and a 401(k), Box A is ${K.usd(eq.total)}, Box F is ${K.usd(boxF)}, and the minimum lump-sum offer is ${K.usd(r.lumpSum)}.`,
  body: (h) => `
<h2>Section 3: the equity lines, one asset at a time</h2>
<p>The form wants the most recent statement for every account, including stored value cards, digital assets, foreign accounts and the cash value of life insurance. Each line ends in a whole-dollar figure that can never be negative: if a loan exceeds the quick-sale value, the line is zero, and the shortfall does not reduce another line. The family in this example owns a house with a large mortgage, one financed car, a 401(k), a checking account and ordinary household goods.</p>
${h.table(['Line', 'Rule on the form', 'Market value', 'Line result'], [
    ['(1) Bank accounts', `total minus ${K.usd(O.bankAllowance)}`, K.usd(a.bank), K.usd(eq.bank)],
    ['(3) Retirement account', `value × ${K.pct(O.quickSale)}, minus any loan`, K.usd(a.retirement), K.usd(eq.retire)],
    ['(5) Home', `value × ${K.pct(O.quickSale)}, minus the mortgage of ${K.usd(a.mortgage)}`, K.usd(a.home), K.usd(eq.home)],
    ['(6a), (6b) Car', `value × ${K.pct(O.quickSale)}, minus the loan of ${K.usd(a.carLoan)}, minus ${K.usd(O.vehicleAllowance)}`, K.usd(a.car), K.usd(eq.cars)],
    ['(7) Furniture and valuables', `value × ${K.pct(O.quickSale)}, minus ${K.usd(O.personalEffects)}`, K.usd(a.goods), K.usd(eq.valuables)],
    ['Box A', 'sum of lines (1) to (7)', '', `<strong>${K.usd(eq.total)}</strong>`],
  ], `Form 433-A (OIC) Rev. ${O.formRevision}, Section 3; family of four, ${co}, ${st}`, ['l', 'l', 'r', 'r'])}
<p>The house is worth ${K.usd(a.home)}, but ${K.pct(O.quickSale)} of that is ${K.usd(homeQs)}, less than the mortgage, so line (5) is zero. The retirement account, untouchable in the family's eyes, supplies most of Box A. The form adds a note here: the reduction from market value may be larger than ${K.pct(1 - O.quickSale)} because of the tax and early withdrawal penalty on a distribution, and the IRS adjusts it case by case. The car keeps ${K.usd(carQs)} of quick-sale equity, of which ${K.usd(O.vehicleAllowance)} is ignored. A self-employed person repeats the exercise for business assets in Box B, with an allowance for tools of the trade.</p>
<p>The allowances are not automatic. The Form 656 booklet says the bank and car exclusions apply only to individuals, and only once the IRS has found that the debt cannot be paid in full from equity, a plan, or both. The form repeats it: the ${O.multiplierLumpSum} and ${O.multiplierPeriodic} multipliers and those allowances do not apply if the IRS concludes the debt can be paid in full within the legal collection period.</p>
<p>Arizona adds a wrinkle the form asks about in Section 1. It is one of nine community property states listed on Form 433-A (OIC), with California, Idaho, Louisiana, New Mexico, Nevada, Texas, Washington and Wisconsin, and a taxpayer who was married and lived in one of them in the last ten years ticks a box. Real property owned by a spouse in a community property state belongs on the equity lines even when the offer is filed by one spouse alone.</p>
<h2>Section 7: Box D minus Box E</h2>
<p>Box D is every source of household income before tax, including Social Security, pensions, rent, child support received and gig work paid through an app. Box E is the expense side. On lines 39 (food, clothing and miscellaneous) and 45 (out-of-pocket health care) the form asks for the full national standard even if the household spends less. On the housing and vehicle lines the IRS allows the lesser of the amount paid and the ${h.a('irs-collection-financial-standards', 'local standard')}. Insurance premiums, child care and current taxes are taken as paid.</p>
${h.table(['Line', 'Paid each month', 'Allowed'], [
    ['(39) Food, clothing, miscellaneous: national standard, four people', '', K.usd(al.national)],
    [`(40) Housing and utilities: ${co} standard ${K.usd(al.housingStandard ?? 0)}`, K.usd(spend.housing), K.usd(al.housing)],
    [`(41) Car loan: ownership standard ${K.usd(S.transport.ownership[0])}`, K.usd(spend.carPayment), K.usd(al.ownership)],
    [`(42) Car running costs: ${al.area} standard`, K.usd(spend.operating), K.usd(al.operating)],
    ['(44) Health insurance premiums', K.usd(spend.healthIns), K.usd(al.healthInsurance)],
    [`(45) Out-of-pocket health care: ${K.usd(S.health.under65)} a person under 65`, '', K.usd(al.health)],
    ['(47) Child care', K.usd(spend.childCare), K.usd(al.childCare)],
    ['(49) Current federal, state and local taxes', K.usd(spend.taxes), K.usd(al.taxes)],
    ['Box E, total allowed', '', `<strong>${K.usd(al.total)}</strong>`],
    ['Box D, gross monthly income', '', K.usd(inc)],
    ['Box F, remaining monthly income', '', `<strong>${K.usd(boxF)}</strong>`],
  ], `Standards effective ${K.day(S.effective)}`, ['l', 'r', 'r'])}
<p>Two of the family's real costs fall away. The housing payment of ${K.usd(spend.housing)} is capped at the county figure, and the car's running costs are capped at the metro figure. Each capped dollar adds a dollar to Box F, which is then multiplied. The booklet also lists what the IRS generally does not count at all: private school tuition, college costs, charitable gifts and payments on unsecured debt such as credit cards beyond what the miscellaneous allowance covers.</p>
${h.mini('oic', { t: 'Your home equity in the formula', p: ['hv', 'hl'], d: { bal, st, co, hh, inc, hv: a.home, hl: a.mortgage } })}
<h2>Section 8: from boxes to an offer</h2>
${h.table(['', 'Lump sum (5 payments or fewer, within 5 months)', 'Periodic (6 to 24 months)'], [
    ['Box A equity', K.usd(eq.total), K.usd(eq.total)],
    ['Box F × multiplier', `${K.usd(boxF)} × ${O.multiplierLumpSum} = ${K.usd(r.futureLump)}`, `${K.usd(boxF)} × ${O.multiplierPeriodic} = ${K.usd(r.futurePeriodic)}`],
    ['Minimum offer', `<strong>${K.usd(r.lumpSum)}</strong>`, `<strong>${K.usd(r.periodic)}</strong>`],
    ['Balance owed', K.usd(bal), K.usd(bal)],
  ], 'Form 433-A (OIC) Section 8, Boxes G and H', ['l', 'r', 'r'])}
<p>The family owes ${K.usd(bal)}. A lump-sum offer of ${K.usd(r.lumpSum)} is under that, so an offer is arithmetically possible; the periodic version at ${K.usd(r.periodic)} ${r.periodic >= bal ? 'reaches the balance, which tells the IRS the debt can be paid in full over time' : 'still sits below the balance'}. Raising Box F by ${K.usd(100)} a month raises the lump-sum minimum by ${K.usd(100 * O.multiplierLumpSum)} and the periodic one by ${K.usd(100 * O.multiplierPeriodic)}: income is where a small error is most expensive.</p>
<h2>Offering less than the formula</h2>
<p>The form allows it in one situation. If special circumstances, such as a serious illness or a dependent's care, mean the household cannot pay the computed amount, you enter what you can pay on Form 656, Section 4, and explain the circumstances in Section 3 with documents. The IRS then decides whether to accept a lower figure. It also verifies every number against pay stubs, three months of bank statements, loan statements and its own records, and may raise a value it thinks is understated. The arithmetic here follows the published form; the IRS's own valuation of your case, and its decision, can differ, and this page is not tax advice.</p>
`,
  faqs: [
    { q: `Why does Form 433-A (OIC) count only ${K.pct(O.quickSale)} of an asset's market value?`, a: `The form uses quick-sale value, the price an asset would fetch if it had to be sold fast, and sets it at ${K.pct(O.quickSale)} of current market value for retirement accounts, real estate, vehicles and valuables. The loan balance is then subtracted. Cash in bank accounts is taken at face value instead, minus a ${K.usd(O.bankAllowance)} allowance, because it needs no sale.` },
    { q: 'Does a 401(k) I cannot withdraw from yet count toward my minimum offer?', a: `Yes. Line 3 of Form 433-A (OIC) counts retirement accounts at ${K.pct(O.quickSale)} of their value minus any loan against them, whether or not you plan to withdraw. A note on the form says the reduction may be larger because of income tax and early withdrawal penalties, so the IRS can accept a lower figure when the cost of cashing out is shown.` },
    { q: 'Which household expenses are left out of the offer in compromise calculation?', a: 'The Form 656 booklet says the IRS generally does not allow private school tuition, college costs, charitable contributions or payments on unsecured debts. Minimum credit card payments are expected to come out of the miscellaneous part of the national standard. Housing and car costs above the local standards are cut back to the standard unless the IRS accepts a documented deviation.' },
    { q: 'Can I offer less than the minimum shown on Form 433-A (OIC)?', a: 'Yes, but only by explaining special circumstances. You write the amount you can pay in Section 4 of Form 656 and describe the circumstances in Section 3, with documents such as medical records or proof of a dependent\'s care. Without that explanation, an offer below the computed amount is generally rejected.' },
  ],
  tool: 'oic',
  toolArg: { bal, st, co, hh, inc, hv: a.home, hl: a.mortgage },
  related: ['offer-in-compromise', 'irs-collection-financial-standards', 'irs-housing-and-utilities-standards', 'low-income-offer-in-compromise', 'currently-not-collectible'],
  sources: ['f656b', 'oic', 'cfs', 'housing', 'transport', 'national', 'health'],
});
