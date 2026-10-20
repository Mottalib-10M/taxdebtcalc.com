import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, A = P.aep;
const due24 = K.DUE_DATES[2024], due25 = K.DUE_DATES[2025];
/** 2024 return filed 120 days late, tax paid today: what first-time abatement can take off. */
const tax24 = 5300;
const r24 = K.debt(tax24, K.today, 120, due24);
const intTax24 = K.interestOn(tax24, due24, K.today);
const penInt24 = r24.interest - intTax24;
const removed24 = r24.ftf + r24.ftp + penInt24;
/** 2025 return filed 50 days late, tax paid today: what the automatic exemption never assesses. */
const tax25 = 4150;
const r25 = K.debt(tax25, K.today, 50);
const intTax25 = K.interestOn(tax25, due25, K.today);
const spared25 = r25.total - tax25 - intTax25;

export default defineGuide({
  id: 'first-time-penalty-abatement',
  group: 'penalties',
  order: 140,
  slug: 'first-time-penalty-abatement',
  nav: 'First-time penalty abatement',
  card: 'First Time Abate on request for 2024 and earlier, the automatic exemption for 2025 returns onward',
  title: 'First-Time Penalty Abatement 2026: FTA and the New AEP',
  description: `First-time penalty abatement 2026: who qualifies with ${A.lookbackYears} clean years, how to request FTA on older returns, and the automatic exemption for ${A.firstTaxYear} returns onward.`,
  h1: 'First-time penalty abatement and the automatic exemption',
  intro: 'Choose the tax year of the penalty, say whether the three years before it were clean, and enter the penalties charged. The result names the relief that fits and how much of the penalty, with its interest, would come off.',
  facts: [['Clean history needed', `${A.lookbackYears} prior years`], ['Automatic exemption starts', `${A.from}, ${A.firstTaxYear} returns`], ['Penalties covered', 'Late filing, late payment, deposit'], ['Interest on the tax', 'Never removed']],
  resume: `First Time Abate is an administrative waiver of the failure to file, failure to pay and failure to deposit penalties for a person who filed the same type of return on time for the ${A.lookbackYears} prior years and had no penalty in those years, other than an estimated tax penalty or one later removed for reasonable cause. It is granted on request, by phone or in writing, with no documents. From ${A.from}, the IRS is replacing it for ${A.firstTaxYear} returns and later with the Automatic Exemption from Penalty: the same clean history means the penalty is never assessed and nothing has to be asked. For a 2024 return filed 120 days late on ${K.usd(tax24)} of unpaid tax, paid on ${K.day(K.today)}, first-time abatement would remove ${K.usd(r24.ftf + r24.ftp)} of penalties and ${K.usd(penInt24)} of interest on them, ${K.usd(removed24)} in all. The ${K.usd(tax24)} of tax and ${K.usd(intTax24)} of interest on it stay due.`,
  body: (h) => `
<h2>A clean history: what the IRS checks</h2>
<p>The ${h.src('fta', 'IRS page on First Time Abate and the automatic exemption')} sets three conditions for an individual. The same return type as the one with the penalty was filed on time for each of the ${A.lookbackYears} prior years. No penalty was assessed in those years, except the estimated tax penalty, or a penalty was assessed and later removed for reasonable cause or IRS error. Businesses have two more conditions on deposit penalties. Returns filed once or infrequently, the daily delinquency penalty and information reporting that depends on another filing are excluded.</p>
<p>The relief covers three penalties whatever their size: failure to file under section 6651(a)(1), failure to pay under sections 6651(a)(2) and (a)(3), and failure to deposit under section 6656. Accuracy-related penalties, such as the one a CP2000 can propose, are outside it.</p>
<h2>What it takes off a 2024 return</h2>
<p>A 2024 return was due ${K.day(due24)}. Filed 120 days later with ${K.usd(tax24)} unpaid, it drew ${K.usd(r24.ftf)} of late filing penalty for ${r24.ftfMonths} months and, with the tax paid on ${K.day(K.today)}, ${K.usd(r24.ftp)} of late payment penalty for ${r24.ftpMonths} months. Interest on those penalties adds ${K.usd(penInt24)}. With a clean history, a call to the number on the notice can take all of that off.</p>
${h.table(['Line of the bill', 'Amount', 'After first-time abatement'], [
    ['Tax', K.usd(tax24), K.usd(tax24)],
    ['Interest on the tax', K.usd(intTax24), K.usd(intTax24)],
    ['Late filing penalty', K.usd(r24.ftf), K.usd(0)],
    ['Late payment penalty', K.usd(r24.ftp), K.usd(0)],
    ['Interest on the penalties', K.usd(penInt24), K.usd(0)],
    ['Total', K.usd(r24.total), K.usd(tax24 + intTax24)],
  ], `2024 return filed 120 days late, tax paid ${K.day(K.today)}, interest at the published quarterly rates`, ['l', 'r', 'r'])}
${h.mini('relief', { t: 'Your penalty year and amount', p: ['ty', 'pen'], d: { ty: '2023', pen: 1650 } })}
<h2>The Automatic Exemption from Penalty, from ${A.from}</h2>
<p>For ${A.firstTaxYear} tax year returns and later, and for 2026 quarterly returns, the IRS applies the clean-history test itself when the original return finishes processing. If the test is met, the late filing, late payment or deposit penalty is not assessed, the late payment penalty does not keep accruing on the unpaid tax, and a letter explains that the relief was applied. No reply is needed. The tax, the interest and any other penalty remain due.</p>
<p>Take a ${A.firstTaxYear} return filed 50 days after ${K.day(due25)} with ${K.usd(tax25)} unpaid, paid on ${K.day(K.today)}. Without relief, the penalties and their interest would come to ${K.usd(spared25)}. With a clean record, that amount is simply never charged, and the bill is the tax plus ${K.usd(intTax25)} of interest on it.</p>
${h.table(['', 'First Time Abate', 'Automatic Exemption from Penalty'], [
    ['Returns covered', `${A.firstTaxYear} and earlier years not considered for the exemption`, `${A.firstTaxYear} tax year and later, 2026 quarters and later`],
    ['How it is granted', 'On request', 'Automatically'],
    ['Taxpayer action', 'Call or write', 'None'],
    ['Penalty on the account', 'Assessed, then removed', 'Never assessed'],
    ['Late payment penalty', 'May keep accruing until the tax is paid', 'Does not accrue'],
  ], `Comparison table of the IRS relief page, read on ${K.day(P.meta.retrieved_at)}`, ['l', 'l', 'l'])}
<h2>How to ask for first-time abatement</h2>
<p>For years before the exemption, the request is yours to make. The IRS lists two routes: a call to the toll-free number in the top right corner of the notice, or a written statement or ${h.src('f843', 'Form 843')} sent to the address in the form instructions. The request does not have to name First Time Abate, and no supporting document is needed; the IRS reads the account history. The ${h.src('reasonable', 'reasonable cause page')} adds that when a caller asks for reasonable cause but qualifies for first-time abatement, the IRS applies first-time abatement. If the exemption should have applied to a ${A.firstTaxYear} return and a notice shows the penalty anyway, the IRS asks you to contact it.</p>
<h2>Timing a request against an open balance</h2>
<p>The IRS comparison table notes that under First Time Abate the late payment penalty may continue to accrue until the tax is fully paid. A request made while part of the tax is still open deals with the penalty charged up to that point, and each later month adds to the account again until the balance is cleared. That is why the example above is counted to the day the tax is paid in full, and why the calculator asks how many months have passed since the penalties were charged: it uses that period to estimate the interest the penalties have drawn, which comes off with them. For someone paying through a plan, the penalty figure on the final notice is therefore the complete one.</p>
<h2>What it never removes</h2>
<p>The tax is owed in every case. Interest on the tax stays too: the ${h.src('interest', 'IRS interest page')} states that interest is not reduced for reasonable cause or as first-time relief. What does disappear is the interest that was charged on the removed penalties, which the IRS reduces automatically. When the history is not clean, the remaining path is ${h.a('irs-penalty-abatement', 'reasonable cause relief')}, which needs facts and usually documents. Approval of either kind is the IRS\'s decision; this page computes the stakes, not the outcome.</p>
`,
  faqs: [
    { q: 'Can I ask for first-time penalty abatement over the phone, or does it have to be in writing?', a: 'Either works. The IRS accepts a call to the toll-free number in the top right corner of the notice, or a written statement or Form 843 sent to the address in the Form 843 instructions. You do not have to name First Time Abate or attach documents: the IRS checks your three prior years in its own records.' },
    { q: `Does the Automatic Exemption from Penalty cover a 2024 return that was filed late?`, a: `No. The automatic exemption starts with ${A.firstTaxYear} tax year returns and 2026 quarterly returns. Penalties on 2024 and earlier returns are still removed through First Time Abate, which has to be requested. On the 2024 example on this page, that request would take ${K.usd(removed24)} of penalties and related interest off the bill.` },
    { q: 'Does first-time abatement also wipe out the interest on the tax I paid late?', a: 'No. It removes the late filing, late payment and deposit penalties and the interest that was charged on those penalties. Interest on the tax itself stays, because the IRS does not reduce interest for reasonable cause or as first-time relief. Only an IRS error or delay can justify removing interest on the tax.' },
    { q: 'Does an estimated tax penalty in the last three years block first-time abatement?', a: `No. The clean-history test ignores the estimated tax penalty. It also ignores a penalty that was assessed and later removed for reasonable cause or IRS error. Any other penalty that stood in the ${A.lookbackYears} prior years, or a return filed late in those years, rules the relief out.` },
  ],
  tool: 'relief',
  toolArg: { ty: '2024', pen: Math.round(r24.ftf + r24.ftp) },
  related: ['irs-penalty-abatement', 'failure-to-file-penalty', 'failure-to-pay-penalty', 'irs-penalty-and-interest-calculator', 'unfiled-tax-returns'],
  sources: ['fta', 'f843', 'reasonable', 'interest', 'irc6651'],
});
