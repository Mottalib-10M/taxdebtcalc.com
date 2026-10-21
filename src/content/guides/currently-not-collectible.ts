import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, S = K.S;
// Household of three in Wayne County, Michigan (Detroit), whose income is below the allowance.
const st = 'Michigan', co = 'Wayne County', hh = 3, inc = 4300, rent = 1650, tax = 380;
const al = K.allowable({ state: st, county: co, persons: hh, over65: 0, cars: 1, carPayment: 350, operating: 300, housingActual: rent, healthInsurance: 250, taxes: tax, childCare: 0, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
const gap = inc - al.total;
// What the same income would need to reach before the IRS sees any room to pay.
const breakEven = al.total;
// Cost of time in hardship status on a $27,000 balance.
const owed = 27000;
const years = [1, 2, 3].map((y) => { const end = K.addMonths(K.today, 12 * y); const i = K.interestOn(owed, K.today, end); return { y, i, end }; });
// Retired single person in the same county, 65 or over, no car.
const ret = K.allowable({ state: st, county: co, persons: 1, over65: 1, cars: 0, carPayment: 0, operating: 0, housingActual: 1100, healthInsurance: 180, taxes: 0, childCare: 0, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: true });

export default defineGuide({
  id: 'currently-not-collectible',
  group: 'settle',
  order: 350,
  slug: 'currently-not-collectible',
  nav: 'Currently not collectible',
  card: 'Hardship status when income is below the allowable expenses: what stops, what keeps running',
  title: 'Currently Not Collectible 2026: IRS Hardship Status, Costs',
  description: `Currently not collectible 2026: when income falls below the IRS allowable expenses, collection pauses but interest at ${K.rate(P.interest.current)} still grows the debt. Test a county.`,
  h1: 'Currently not collectible: the hardship pause and what it costs',
  intro: 'Enter your state, county, household and income. If the allowable expenses of the IRS standards are higher than the income, the calculator says so and shows by how much: that gap is what a hardship request rests on.',
  facts: [['Debt forgiven', 'no'], ['Interest while paused', `${K.rate(P.interest.current)} a year, daily`], ['Fixed duration', 'none'], ['Request by', 'phone, with Form 433-F or 433-A']],
  resume: `Currently not collectible, or CNC, is the status the IRS gives an account when collecting would leave the taxpayer unable to meet basic living expenses. The test is arithmetic: gross monthly income against allowable expenses under the Collection Financial Standards in force since ${K.day(S.effective)}. When nothing is left, the IRS may suspend most collection, meaning no levy on wages or bank accounts while the status lasts. The debt is not forgiven. Penalties and interest keep accruing, the IRS may file a Notice of Federal Tax Lien, it applies any federal refund to the balance, and it can review your finances later and resume collection. There is no fixed duration. A household of three in ${co}, Michigan, with ${K.usd(inc)} of income is allowed ${K.usd(al.total)} a month, ${K.usd(-gap)} more than it earns. If its ${K.usd(owed)} balance sits in hardship status for two years, interest alone adds about ${K.usd(years[1].i)} at the current rate.`,
  body: (h) => `
<h2>The test behind the status</h2>
<p>The ${h.src('cnc', 'IRS page on delaying collection')} does not publish an income threshold. It asks for a financial statement, Form 433-F or Form 433-A, and documents for income, living costs, bank accounts and assets, then compares what comes in with what the ${h.a('irs-collection-financial-standards', 'Collection Financial Standards')} allow. If the household has no remaining income and no equity that could be used, the IRS may mark the account currently not collectible. Assets matter as well as income: a person with little income but a paid-off rental property or a brokerage account is expected to use them.</p>
<h2>A Detroit-area family below the line</h2>
<p>The household below has three people, one car with a loan, rent of ${K.usd(rent)} including utilities, and a gross income of ${K.usd(inc)} a month. Every figure is under its standard or is an actual cost the IRS accepts.</p>
${h.table(['Item', 'Allowed each month'], [
    ['Food, clothing and other items, three people', K.usd(al.national)],
    [`Rent and utilities (county standard ${K.usd(al.housingStandard ?? 0)})`, K.usd(al.housing)],
    [`Car loan and running costs (${al.area})`, K.usd(al.ownership + al.operating)],
    ['Out-of-pocket health care and insurance', K.usd(al.health + al.healthInsurance)],
    ['Current taxes withheld', K.usd(al.taxes)],
    ['Total allowable expenses', `<strong>${K.usd(al.total)}</strong>`],
    ['Gross income', K.usd(inc)],
    ['Shortfall', `<strong>${K.usd(gap)}</strong>`],
  ], `${co}, ${st}, three people under 65`, ['l', 'r'])}
<p>On these numbers the IRS has nothing to ask for each month: the income would have to reach ${K.usd(breakEven)} before any payment fits. A retired person living alone in the same county, 65 or older, without a car, renting for ${K.usd(1100)} and paying ${K.usd(180)} in premiums, is allowed ${K.usd(ret.total)}; a pension and Social Security below that figure leave no room either.</p>
${h.mini('expenses', { t: 'Is your income under the allowance?', p: ['inc', 'hh'], d: { st, co, hh, inc, rent, tx: tax } })}
<h2>What keeps running while collection is paused</h2>
<p>CNC stops enforcement, not the meter. Interest is charged at the quarterly underpayment rate, compounded daily, on the tax, the penalties and the interest already added, and the late payment penalty continues each month until it reaches its ${K.pct(P.ftp.max)} ceiling. The table shows interest alone on a ${K.usd(owed)} balance, at the ${K.rate(P.interest.current)} rate of the ${K.quarter(P.interest.current)} carried forward.</p>
${h.table(['Time in hardship status', 'Interest added', 'Balance before penalties'], years.map((x) => [`${x.y} year${x.y > 1 ? 's' : ''}, to ${K.month(x.end)}`, K.usd(x.i), K.usd(owed + x.i)]), 'Interest compounded daily; future quarterly rates are not yet published', ['l', 'r', 'r'])}
<p>Other effects listed by the IRS: a Notice of Federal Tax Lien may be filed to protect the government's interest, and a federal refund is applied to the debt instead of being paid out. A payment made voluntarily during the pause still reduces the balance and the interest that follows.</p>
<h2>Two side effects that help</h2>
<p>Hardship status changes more than the levy risk. The ${h.src('passport', 'IRS passport page')} says the IRS will not certify a seriously delinquent tax debt to the State Department when the account has been found currently not collectible because of hardship, so a balance above the ${h.a('irs-passport-revocation', 'passport threshold')} of ${K.usd((P.passport as Record<string, number>)['2026'])} is not reported while the status holds. And a household that is only slightly short is not forced into a payment it cannot make: if the allowance and the income are close, the gap between them is the figure the IRS looks at, so a small change in rent, a second car loan ending or a child leaving home can move a family from hardship status into a low monthly plan, or back. Rerunning the numbers after any such change shows which side of the line the household is on.</p>
<h2>How the status ends</h2>
<p>There is no set term. The IRS may review the household's finances periodically and resume collection if the ability to pay improves, for example after a new job or an inheritance; it then usually asks for a plan. The ${h.src('csed', 'IRS page on the collection period')} lists the events that suspend or extend the ${P.plans.csedYears}-year collection window, such as a pending installment agreement, an offer, bankruptcy or a collection due process hearing; hardship status is not among them. A balance that stays uncollectible long enough can therefore reach its ${h.a('irs-collection-statute-of-limitations', 'collection statute expiration date')}, at which point the IRS can no longer collect it.</p>
<h2>Asking for it</h2>
<p>The request is made by phone, at 800-829-1040 or the number on the latest notice, and the IRS may ask for the financial statement and supporting documents before deciding. All required returns must be filed. If the numbers show some room to pay, the IRS will point to a ${h.a('irs-payment-plan', 'payment plan')}, a ${h.a('partial-payment-installment-agreement', 'partial payment agreement')} or an ${h.a('offer-in-compromise', 'offer in compromise')} instead. The calculator shows where your household falls on the published standards; the IRS reviews the documents and makes the determination, and this page is not tax advice.</p>
`,
  faqs: [
    { q: 'How long can an IRS account stay currently not collectible?', a: 'The IRS sets no fixed period. The status lasts until the IRS reviews the finances again and finds that the taxpayer can pay, which may happen periodically or after new income shows up in its records, such as a higher wage on a W-2. While it lasts, the IRS still applies federal refunds to the balance and may file a lien.' },
    { q: 'Will the IRS keep my refund while my account is in hardship status?', a: 'Yes. The IRS page on currently not collectible status says that if you are due a federal tax refund, it will be applied to the unpaid tax debt. The refund reduces the balance and the interest that follows, but it is not paid to you while the debt remains, even though collection is otherwise paused.' },
    { q: 'Can the 10-year collection period run out while an account is currently not collectible?', a: `The IRS page on the collection statute expiration date lists the events that suspend or extend the ${P.plans.csedYears}-year period, including pending installment agreements, offers in compromise, bankruptcy and collection due process hearings. Currently not collectible status is not on that list, so the period generally keeps running. Your transcript shows the expiration date the IRS has computed for each assessment.` },
    { q: 'What income is low enough for the IRS to stop collecting?', a: `There is no single figure. The IRS compares your gross income with the allowable expenses for your household size and county. For a family of three in ${co}, Michigan, with typical rent and one car, the allowance is about ${K.usd(al.total)} a month, so income below that leaves nothing for the IRS; in a higher-cost county the line is higher.` },
    { q: 'I owe the IRS but I am unemployed: does collection stop?', a: 'Not by itself. Losing a job does not pause the account; the IRS has to be asked. It may place the account in currently not collectible status once a financial statement, Form 433-F or Form 433-A, shows that what comes in no longer covers the allowable living expenses. The request is made at 800-829-1040 or the number on the notice. Interest and penalties keep accruing, and a refund still goes to the balance.' },
  ],
  tool: 'expenses',
  toolArg: { st, co, hh, inc, rent, tx: tax },
  related: ['irs-collection-financial-standards', 'irs-collection-statute-of-limitations', 'offer-in-compromise', 'irs-tax-lien', 'cant-pay-taxes'],
  sources: ['cnc', 'cfs', 'csed', 'interest'],
});
