import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import H from '../../data/housing-2026.json';

const P = K.P, S = K.S, O = P.oic;
type Row = [string, number, number, number, number, number, string | null];
const STATES = H.states as unknown as Record<string, Row[]>;
// The ten most populous counties of the United States.
const big: Array<[string, string]> = [['California', 'Los Angeles County'], ['Illinois', 'Cook County'], ['Texas', 'Harris County'], ['Arizona', 'Maricopa County'], ['California', 'San Diego County'], ['California', 'Orange County'], ['Florida', 'Miami-Dade County'], ['Texas', 'Dallas County'], ['New York', 'Kings County'], ['California', 'Riverside County']];
const all = Object.entries(STATES).flatMap(([st, rows]) => rows.map((r) => ({ st, r })));
const top = all.reduce((a, b) => (b.r[1] > a.r[1] ? b : a));
const bottom = all.reduce((a, b) => (b.r[1] < a.r[1] ? b : a));
const tx = [...STATES['Texas']].sort((a, b) => b[3] - a[3]);
const txHi = tx[0], txLo = tx[tx.length - 1];
// Renter in Brooklyn, household of three, paying more than the county figure.
const st = 'New York', co = 'Kings County', hh = 3, inc = 9400, rent = 4700;
const base = { state: st, county: co, persons: hh, over65: 0, cars: 1, carPayment: 350, operating: 300, healthInsurance: 250, taxes: 700, childCare: 0, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false };
const capped = K.allowable({ ...base, housingActual: rent });
const std = capped.housingStandard ?? 0;
const excess = rent - std;
const bigTop = big.reduce((a, b) => ((K.housingStandard(b[0], b[1], 3) ?? 0) > (K.housingStandard(a[0], a[1], 3) ?? 0) ? b : a));
const la = [1, 2, 3, 4, 5].map((n) => K.housingStandard('California', 'Los Angeles County', n) ?? 0);

export default defineGuide({
  id: 'irs-housing-and-utilities-standards',
  group: 'settle',
  order: 340,
  slug: 'irs-housing-and-utilities-standards',
  nav: 'Housing and utilities standards',
  card: 'County housing allowance for one to five people, the ten largest counties, and the rent the IRS will not count',
  title: 'IRS Housing and Utilities Standards 2026: County Allowances',
  description: `IRS housing and utilities standards 2026 by county and household size: ${K.usd(std)} for three in Brooklyn, ${K.usd(top.r[1])} for one in ${top.r[0]}, and the rent left out.`,
  h1: 'IRS housing and utilities standards: what your county allows',
  intro: 'Pick your state and county, the household size and the rent or mortgage you pay with utilities. The calculator shows the county figure and how much of your housing cost the IRS will count.',
  facts: [['In force since', K.day(S.effective)], ['Counties and county equivalents', K.num(all.length)], ['Household columns', 'one to five or more'], [`Highest, one person (${top.r[0]})`, K.usd(top.r[1])]],
  resume: `The IRS housing and utilities standard is the most the IRS will count each month for the cost of your main home when it measures ability to pay for a large payment plan, hardship status or an offer in compromise. It is set for every county and for Puerto Rico, in five columns for households of one, two, three, four, and five or more people, and the current figures took effect on ${K.day(S.effective)}. It covers rent or mortgage, property tax, interest, insurance, maintenance and repairs, and all utilities including gas, electricity, water, trash, phone, cell phone, cable and internet. The IRS allows the lesser of what you pay and the standard. For three people the standard ranges from ${K.usd(K.housingStandard('Arizona', 'Maricopa County', 3) ?? 0)} in Maricopa County to ${K.usd(std)} in Kings County, Brooklyn. A Brooklyn household paying ${K.usd(rent)} has ${K.usd(excess)} a month left out, which raises the minimum lump-sum offer in compromise by ${K.usd(excess * O.multiplierLumpSum)}.`,
  body: (h) => `
<h2>The ten most populous counties</h2>
<p>The table gives the monthly standard for each household size in the counties where the most Americans live. The figures are taken from the ${h.src('housing', 'IRS county tables')}, which the IRS warns run to 125 printed pages; the calculator above holds all ${K.num(all.length)} of them.</p>
${h.table(['County', 'One', 'Two', 'Three', 'Four', 'Five or more'], big.map(([s, c]) => [`${c}, ${s}`, ...[1, 2, 3, 4, 5].map((n) => K.usd(K.housingStandard(s, c, n) ?? 0))]), `Housing and utilities standards, monthly, effective ${K.day(S.effective)}`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Between the nation's extremes the gap is wide. The highest single-person figure is ${K.usd(top.r[1])} in ${top.r[0]}, ${top.st}; the lowest is ${K.usd(bottom.r[1])} in ${bottom.r[0]}, ${bottom.st}. Within one state the spread can be nearly as large: in Texas, a family of three is allowed ${K.usd(txHi[3])} in ${txHi[0]} and ${K.usd(txLo[3])} in ${txLo[0]}. The steps between columns are uneven: in Los Angeles County a second person adds ${K.usd(la[1] - la[0])}, a third ${K.usd(la[2] - la[1])}, a fourth ${K.usd(la[3] - la[2])} and the fifth column only ${K.usd(la[4] - la[3])}, and that last column covers every household of five or more.</p>
<h2>What the figure covers, and what it does not</h2>
<p>The standard is a single envelope for the primary residence. For a renter it holds rent and every utility; for an owner it holds the mortgage payment with interest, property taxes, homeowner's insurance, maintenance and repairs, plus the same utilities. Cell phones, cable and internet are inside it, so they cannot be listed again elsewhere. A second home, a vacation property or a rental you own is not a living expense at all; its equity counts as an asset instead.</p>
<p>The household size is generally the number of people claimed on your latest return. When others share the home and pay part of the costs, the IRS looks at the household's income as a whole on Form 433-A (OIC), so their share of the rent and their income both enter the picture.</p>
<h2>Owners: the payment is capped, the equity is counted</h2>
<p>For a homeowner the standard works on the monthly cost, not on the house. The mortgage payment, property tax and insurance are added to the utilities and compared with the county figure, and the lesser amount is allowed. The house itself shows up somewhere else on Form 433-A (OIC): its market value times ${K.pct(O.quickSale)}, minus the loan, is equity that the IRS counts toward an offer. So an owner in an expensive county can see both effects at once, a monthly allowance that does not cover the full mortgage and a home equity line that raises the minimum offer. A paid-off home has no mortgage to cap but all of its quick-sale value counts as equity, as the ${h.a('reasonable-collection-potential', 'line-by-line example')} shows for a Phoenix-area family.</p>
<p>A home that is for sale, or that the owner plans to sell to fund an offer, is flagged on the form with its listing price. The Form 656 booklet adds that if property is sold before the lien is released, excess sale proceeds may be applied to the tax debt, even when an offer has been accepted.</p>
<h2>A Brooklyn renter over the line</h2>
<p>Take a household of three in ${co}, New York, with ${K.usd(inc)} of gross monthly income and rent and utilities of ${K.usd(rent)}. The county standard for three is ${K.usd(std)}, so ${K.usd(excess)} of the housing cost is not allowed. The remaining income the IRS sees rises by that amount every month, and on an offer in compromise it is multiplied.</p>
${h.table(['', 'Rent counted in full', 'Rent capped at the standard'], [
    ['Housing allowed', K.usd(rent), K.usd(capped.housing)],
    ['Total allowable expenses', K.usd(capped.total + excess), K.usd(capped.total)],
    ['Remaining monthly income', K.usd(inc - capped.total - excess), K.usd(inc - capped.total)],
    [`Future income in a lump-sum offer (× ${O.multiplierLumpSum})`, K.usd(Math.max(0, inc - capped.total - excess) * O.multiplierLumpSum), K.usd(Math.max(0, inc - capped.total) * O.multiplierLumpSum)],
    [`Future income in a periodic offer (× ${O.multiplierPeriodic})`, K.usd(Math.max(0, inc - capped.total - excess) * O.multiplierPeriodic), K.usd(Math.max(0, inc - capped.total) * O.multiplierPeriodic)],
  ], `${co}, three people, one car; other expenses at the calculator's defaults`, ['l', 'r', 'r'])}
${h.mini('expenses', { t: 'Your rent against the county figure', p: ['rent', 'hh'], d: { st, co, hh, inc, rent } })}
<p>The same rule works the other way. A household paying less than the standard is allowed only what it pays, so a low rent does not create a cushion that can be spent on something else. Moving to a cheaper home lowers the allowance too.</p>
<h2>When the standard is not enough</h2>
<p>The IRS can allow actual housing costs above the county figure when the taxpayer documents that the standards leave too little for basic living expenses, for example a home adapted for a disability or a lease that cannot be broken. In a payment plan that pays the balance in full within six years, the ${h.a('irs-collection-financial-standards', 'six-year rule')} also allows living costs above the standards without proof of reasonableness. Outside those cases the excess is treated as money that could go to the IRS. The figures in this page come from the published tables; whether an exception applies to a given household is decided by the IRS, and this is not tax advice.</p>
`,
  faqs: [
    { q: 'Does the IRS housing allowance include my cell phone and internet bills?', a: 'Yes. The IRS lists residential telephone, cell phone, cable television and internet service inside the housing and utilities standard, along with gas, electricity, water, heating oil and trash collection. Because they are part of that one envelope, they cannot be claimed again as separate expenses, and their total with rent or mortgage is capped at the county figure.' },
    { q: 'Which column of the housing standard applies to a household of six or seven?', a: `The fifth column, which covers every household of five or more people. Unlike the national standard for food and clothing, which adds ${K.usd(S.national.additionalPerson)} for each person beyond four, the housing table stops growing at five. A household of seven in ${co} is allowed ${K.usd(K.housingStandard(st, co, 5) ?? 0)}, the same as a household of five.` },
    { q: 'What if my rent is higher than the IRS standard for my county?', a: 'The IRS counts only the standard, and the rest is treated as income available to pay the tax. Two exceptions exist: documented circumstances showing the standards leave too little for basic needs, and the six-year rule for balances that can be paid in full within six years. Otherwise the excess raises the payment the IRS expects and the minimum of an offer in compromise.' },
    { q: 'Which county has the highest IRS housing and utilities standard in 2026?', a: `${top.r[0]}, ${top.st}, at ${K.usd(top.r[1])} a month for one person and ${K.usd(top.r[5])} for five or more, in the tables effective ${K.day(S.effective)}. The lowest single-person figure is ${K.usd(bottom.r[1])}, in ${bottom.r[0]}, ${bottom.st}. Among the ten most populous counties, ${bigTop[1]} in ${bigTop[0]} has the highest figure for three people, ${K.usd(K.housingStandard(bigTop[0], bigTop[1], 3) ?? 0)}.` },
  ],
  tool: 'expenses',
  toolArg: { st, co, hh, inc, rent },
  related: ['irs-collection-financial-standards', 'reasonable-collection-potential', 'currently-not-collectible', 'offer-in-compromise', 'owe-irs-100000'],
  sources: ['housing', 'cfs', 'f656b'],
});
