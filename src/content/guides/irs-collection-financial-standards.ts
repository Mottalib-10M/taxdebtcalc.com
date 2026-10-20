import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, S = K.S, N = S.national, T = S.transport;
const op = T.operating as Record<string, number[]>;
// Household of three in Allegheny County, Pennsylvania (Pittsburgh, outside the listed metro areas), two cars.
const st = 'Pennsylvania', co = 'Allegheny County', hh = 3, inc = 6100;
const al = K.allowable({ state: st, county: co, persons: hh, over65: 0, cars: 2, carPayment: 350, operating: 300, housingActual: 1900, healthInsurance: 250, taxes: 820, childCare: 0, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
const rmi = inc - al.total;
const six = N.total[3] + 2 * N.additionalPerson;

export default defineGuide({
  id: 'irs-collection-financial-standards',
  group: 'settle',
  order: 330,
  slug: 'irs-collection-financial-standards',
  nav: 'Collection Financial Standards',
  card: `National, health, transport and housing allowances effective ${K.day(S.effective)}, and how the IRS applies them`,
  title: 'IRS Collection Financial Standards 2026: Allowable Expenses',
  description: `IRS Collection Financial Standards 2026, effective ${K.month(S.effective)}: food and clothing from ${K.usd(N.total[0])}, health care ${K.usd(S.health.under65)} a person, car ownership ${K.usd(T.ownership[0])}, county housing.`,
  h1: 'IRS Collection Financial Standards: the living allowance the IRS uses',
  intro: 'Choose the state, county and household size, then the income. The calculator applies every standard in force since June 29, 2026 and shows what the IRS treats as left over each month.',
  facts: [['In force since', K.day(S.effective)], ['Food, clothing, other: one person', K.usd(N.total[0])], ['Health care, under 65 / 65 and over', `${K.usd(S.health.under65)} / ${K.usd(S.health.age65plus)}`], ['Public transportation, per household', K.usd(T.public)]],
  resume: `The IRS Collection Financial Standards are the monthly amounts the IRS allows for living expenses when it measures how much a person can pay: for a payment plan above the Simple Payment Plan limit of ${K.usd(P.plans.simpleMax)}, for currently not collectible status, and for an offer in compromise. The current set took effect on ${K.day(S.effective)}. National standards for food, housekeeping, clothing, personal care and miscellaneous are allowed in full without receipts: ${K.usd(N.total[0])} for one person, ${K.usd(N.total[1])} for two, ${K.usd(N.total[3])} for four and ${K.usd(N.additionalPerson)} for each extra person. Out-of-pocket health care adds ${K.usd(S.health.under65)} a person under 65 and ${K.usd(S.health.age65plus)} at 65 or over. Housing and utilities (by county) and car costs (ownership up to ${K.usd(T.ownership[0])} a car, operating costs by region or metro area) are allowed at the lesser of the amount spent and the standard. A family of three in ${co}, Pennsylvania, earning ${K.usd(inc)} is allowed ${K.usd(al.total)}, leaving ${K.usd(rmi)} a month.`,
  body: (h) => `
<h2>Where the standards come into play</h2>
<p>Most people who owe never meet them. A balance within the Simple Payment Plan limit needs no financial statement, and the IRS's own ${h.src('cfs', 'standards page')} says that the vast majority of installment agreements its collection staff set up are of that kind. The standards apply when the IRS asks for Form 433-F, 433-A or 433-A (OIC): a larger plan, a ${h.a('partial-payment-installment-agreement', 'partial payment agreement')}, a request for ${h.a('currently-not-collectible', 'hardship status')} or an ${h.a('offer-in-compromise', 'offer in compromise')}. Income minus the allowed total is what the IRS treats as available each month.</p>
<p>The figures come from federal surveys: the Bureau of Labor Statistics Consumer Expenditure Survey for the national items, the Medical Expenditure Panel Survey for health care, Census and BLS data for housing. Since 2024 the IRS has adjusted them with the Personal Consumption Expenditures index instead of the Consumer Price Index. They serve federal tax collection only; bankruptcy means tests use the U.S. Trustee Program's figures.</p>
<h2>National standards: allowed as a flat amount</h2>
${h.table(['Item', 'One person', 'Two', 'Three', 'Four'], [
    ['Food', ...N.food.map(K.usd)],
    ['Housekeeping supplies', ...N.housekeeping.map(K.usd)],
    ['Apparel and services', ...N.apparel.map(K.usd)],
    ['Personal care products and services', ...N.personalCare.map(K.usd)],
    ['Miscellaneous', ...N.misc.map(K.usd)],
    ['<strong>Total</strong>', ...N.total.map((x) => `<strong>${K.usd(x)}</strong>`)],
  ], `Monthly; add ${K.usd(N.additionalPerson)} to the four-person total for each additional person. In force since ${K.day(S.effective)}`, ['l', 'r', 'r', 'r', 'r'])}
<p>You get the total for your household size whatever you actually spend, and you need proof only to claim more. A household of six is allowed ${K.usd(six)}. The miscellaneous line is the catch-all: it covers credit card minimums, bank fees, school supplies and any spending above other standards that the IRS will not allow as a deviation, and it cannot itself be increased. The number of people is normally the number claimed on the latest tax return.</p>
<h2>Health care and transportation</h2>
<p>The ${h.src('health', 'out-of-pocket health standard')} is ${K.usd(S.health.under65)} a month for each person under 65 and ${K.usd(S.health.age65plus)} for each person 65 or older, for doctor visits, prescriptions and supplies such as glasses. It comes on top of health insurance premiums, which are allowed as paid. Elective procedures are generally excluded.</p>
<p>The ${h.src('transport', 'transportation standards')} have two parts. Ownership covers a loan or lease payment, up to ${K.usd(T.ownership[0])} for one car and ${K.usd(T.ownership[1])} for two; with no payment, ownership is zero. Operating costs (fuel, insurance, repairs, registration, parking, tolls) depend on the census region or the metro area where you live. A single taxpayer is normally allowed one car. A household with no car gets ${K.usd(T.public)} for public transportation without receipts.</p>
${h.table(['Area', 'One car', 'Two cars'], [
    ['Northeast region', ...op['Northeast'].map(K.usd)], ['New York metro', ...op['New York'].map(K.usd)],
    ['Midwest region', ...op['Midwest'].map(K.usd)], ['Chicago metro', ...op['Chicago'].map(K.usd)],
    ['South region', ...op['South'].map(K.usd)], ['Miami metro', ...op['Miami'].map(K.usd)],
    ['West region', ...op['West'].map(K.usd)], ['Los Angeles metro', ...op['Los Angeles'].map(K.usd)],
  ], 'Monthly operating cost standards, selected areas (25 metro areas in all)', ['l', 'r', 'r'])}
<p>Three details change the result more than people expect. A metro area is defined county by county in the IRS conversion chart, so two suburbs a few miles apart can fall under different operating figures; the calculator looks the county up for you. A household that owns a car and also rides a train to work can claim both, if both are needed for health, welfare or earning income, each at the lesser of the actual cost and its standard. And the operating figure excludes personal property tax on the vehicle, which goes instead on the current taxes line of the financial statement, together with income and payroll taxes actually withheld.</p>
<h2>A Pittsburgh-area household of three</h2>
<p>Allegheny County is not one of the metro areas on the IRS list, so its operating allowance is the Northeast regional figure. The family below pays ${K.usd(1900)} for rent and utilities, under the county housing standard of ${K.usd(al.housingStandard ?? 0)}, so the full rent counts. Its two cars cost ${K.usd(350)} a month in loan payments and ${K.usd(300)} to run, both under their caps.</p>
${h.table(['Category', 'Allowed'], [
    ['Food, clothing and other items (three people)', K.usd(al.national)],
    ['Housing and utilities (actual, under the standard)', K.usd(al.housing)],
    ['Two cars: loan and operating costs', K.usd(al.ownership + al.operating)],
    ['Out-of-pocket health care and insurance premiums', K.usd(al.health + al.healthInsurance)],
    ['Current income and payroll taxes', K.usd(al.taxes)],
    ['Total allowed', `<strong>${K.usd(al.total)}</strong>`],
    ['Left from a gross income of ' + K.usd(inc), `<strong>${K.usd(rmi)}</strong>`],
  ], `${co}, ${st}, three people under 65`, ['l', 'r'])}
${h.mini('expenses', { t: 'Allowable expenses for your household', p: ['hh', 'inc'], d: { st, co, hh, inc, rent: 1900, cars: 2, tx: 820 } })}
<h2>Going above the standards</h2>
<p>The IRS may allow actual expenses when the standards leave a family without the means for basic living costs, but the taxpayer has to document why. A second route is the six-year rule: when a balance can be paid in full, penalties and interest included, within six years, the IRS can allow living costs above the standards and other payments such as minimum student loan or credit card payments, and it does not require proof of reasonable expenses. The rule was extended from five to six years in 2012. The housing figures by county are on the ${h.a('irs-housing-and-utilities-standards', 'housing and utilities standards page')}. How a particular case is treated is the IRS's call; this page shows the published amounts and the arithmetic, not advice for your file.</p>
`,
  faqs: [
    { q: 'Do I need receipts for food and clothing on an IRS collection information statement?', a: `No. The national standard is allowed in full for your household size without checking what you spend: ${K.usd(N.total[0])} a month for one person, ${K.usd(N.total[3])} for four. Receipts matter only if you claim more than the standard for food, housekeeping, apparel and personal care, and the miscellaneous part can never be raised.` },
    { q: 'How many cars does the IRS allow under its transportation standards?', a: `Up to two, with ownership capped at ${K.usd(T.ownership[0])} a month for one car and ${K.usd(T.ownership[1])} for two, and operating costs set by region or metro area. A single taxpayer is normally allowed one car. A car with no loan or lease gets operating costs only, and a household with no car gets ${K.usd(T.public)} for public transit.` },
    { q: 'What is the six-year rule in IRS collection?', a: 'When a person cannot pay in full now and does not fit a Simple Payment Plan, but the balance, with penalties and interest, can be paid within six years, the IRS can allow living expenses above the standards and payments such as minimum student loan or credit card payments. A financial statement is still required, but reasonable expenses do not have to be proven.' },
    { q: 'Can the IRS collection standards be used for a bankruptcy means test?', a: 'No. The IRS states that its Collection Financial Standards are for federal tax administration only and points to the U.S. Trustee Program for the expense figures used in bankruptcy. The two sets are built from similar surveys but are published separately and are not interchangeable.' },
  ],
  tool: 'expenses',
  toolArg: { st, co, hh, inc, rent: 1900, cars: 2, tx: 820 },
  related: ['irs-housing-and-utilities-standards', 'currently-not-collectible', 'reasonable-collection-potential', 'partial-payment-installment-agreement', 'irs-installment-agreement'],
  sources: ['cfs', 'national', 'health', 'transport', 'housing'],
});
