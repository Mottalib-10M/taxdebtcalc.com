import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const due23 = K.DUE_DATES[2023];
/** 2023 return filed 240 days late after a hospital stay, tax paid today. */
const tax = 14500, daysLate = 240;
const r = K.debt(tax, K.today, daysLate, due23);
const intTax = K.interestOn(tax, due23, K.today);
const penInt = r.interest - intTax;
const pens = r.ftf + r.ftp;

export default defineGuide({
  id: 'irs-penalty-abatement',
  group: 'penalties',
  order: 150,
  slug: 'irs-penalty-abatement',
  nav: 'Penalty abatement',
  card: 'Reasonable cause, Form 843, and the interest that falls away with a removed penalty',
  title: 'IRS Penalty Abatement 2026: Reasonable Cause and Form 843',
  description: `IRS penalty abatement 2026: the reasonable cause standard, the records a request needs, Form 843, and when interest at ${K.rate(P.interest.current)} comes off with the penalty.`,
  h1: 'IRS penalty abatement for reasonable cause',
  intro: 'Use the calculator to see which relief fits your history. With a clean three-year record, first-time abatement is the simpler route; without one, the rest of this page explains the reasonable cause request and what it can take off the bill.',
  facts: [['Standard', 'Ordinary care and prudence'], ['Written request', 'Form 843 or signed letter'], ['Interest on removed penalties', 'Removed automatically'], ['Interest on the tax', 'Only for IRS error or delay']],
  resume: `The IRS removes a late filing or late payment penalty for reasonable cause when the taxpayer exercised ordinary care and prudence and still could not file or pay on time. The decision is made case by case. Fires, disasters, the death or serious illness of the taxpayer or close family, records that could not be obtained and system failures that blocked an electronic filing can qualify; reliance on a preparer, not knowing the rules, simple mistakes and lack of money on its own generally do not. The request can be made by phone with documents at hand, or in writing on Form 843. When a penalty is removed, the interest charged on it goes too. On a 2023 return filed ${daysLate} days late with ${K.usd(tax)} unpaid and paid on ${K.day(K.today)}, the penalties are ${K.usd(pens)} and their interest ${K.usd(penInt)}; the tax and its ${K.usd(intTax)} of interest stay due whatever the outcome.`,
  body: (h) => `
<h2>The standard: ordinary care, then something outside your control</h2>
<p>The ${h.src('reasonable', 'IRS page on penalty relief for reasonable cause')} frames the question in two parts. First, did you act as a careful person would, by keeping records, planning for the due date and trying to comply? Second, did something you could not reasonably prevent still make filing or paying on time impossible? The answer depends on the penalty and on all the facts, and the IRS judges each request on its own. Reasonable cause does not apply at all to some penalties, such as the estimated tax penalty.</p>
${h.table(['May qualify', 'Generally does not qualify on its own'], [
    ['Fire, natural disaster or civil disturbance', 'Relying on a tax professional'],
    ['Records that could not be obtained', 'Not knowing the rules or deadlines'],
    ['Death, serious illness or unavoidable absence of the taxpayer or immediate family', 'Mistakes and oversights'],
    ['System issues that delayed an electronic filing or payment', 'Lack of funds'],
  ], 'Examples from the IRS reasonable cause page for failure to file and failure to pay', ['l', 'l'])}
<p>The right column is not absolute. The IRS writes that a mistake can be excused when other facts show a real attempt to comply, and that lack of money, while not enough by itself, can be part of a case that shows reasonable care. A person who sold assets or borrowed to pay, and still fell short because of a medical emergency, tells a different story from one who simply had other priorities.</p>
<h2>What a request contains</h2>
<p>The IRS asks for three things in the explanation: what happened and when, how it prevented the filing or the payment, and what you did to try to file or pay. The supporting records are the dated ones: hospital or court records, or a doctor\'s letter giving start and end dates of an illness; documents on the disaster; copies of letters and replies; receipts. Dates matter because the IRS compares the period of the event with the months the penalty covers. An illness that ended in March does not explain a return filed in December unless something else carried the delay forward.</p>
<p>Many requests are settled on the phone, by calling the number on the notice with the notice, the penalty and the reasons ready. If the agent cannot approve it, the written route is ${h.src('f843', 'Form 843, Claim for Refund and Request for Abatement')}, or a signed letter to the address on the notice. A denial can be appealed; the ${h.src('penaltyrelief', 'IRS penalty relief page')} points to the appeal steps. That page also lists a third kind of relief besides first-time abatement and reasonable cause: the statutory exception, which applies when a provision of the law itself excuses the penalty in the situation at hand, independently of the taxpayer's history or diligence.</p>
${h.mini('relief', { t: 'Your history and penalties', p: ['h3', 'pen'], d: { ty: '2022', pen: 2750 } })}
<h2>The stakes on a 2023 return filed ${daysLate} days late</h2>
<p>Take a 2023 return due ${K.day(due23)}, filed ${daysLate} days late after a hospital stay, with ${K.usd(tax)} of tax unpaid until ${K.day(K.today)}. The late filing penalty reached ${K.usd(r.ftf)} over ${r.ftfMonths} months, the late payment penalty ${K.usd(r.ftp)} over ${r.ftpMonths} months, and interest on those two penalties ${K.usd(penInt)}. Those three lines are what a successful request removes.</p>
${h.table(['', 'Removed if the request succeeds', 'Stays due'], [
    ['Tax', '', K.usd(tax)],
    ['Interest on the tax', '', K.usd(intTax)],
    ['Late filing penalty', K.usd(r.ftf), ''],
    ['Late payment penalty', K.usd(r.ftp), ''],
    ['Interest on the penalties', K.usd(penInt), ''],
    ['Total', K.usd(pens + penInt), K.usd(tax + intTax)],
  ], `2023 return, interest at the published quarterly rates to ${K.day(K.today)}`, ['l', 'r', 'r'])}
<h2>Interest follows the penalty, with one narrow exception</h2>
<p>Interest is required by law, and the IRS does not reduce it for reasonable cause or as first-time relief. When a penalty is removed, though, the IRS automatically removes the interest that was charged on it. The separate ${h.src('intabate', 'interest abatement rule')} of section 6404(e) applies only when interest built up because of an unreasonable error or delay by an IRS officer or employee in a ministerial or managerial act, after the IRS had contacted you in writing, and with no contribution from you or your representative to the delay. The claim is made on Form 843 within three years of filing the return or two years of paying the tax, whichever is later, and it covers only the interest of the delay period.</p>
<h2>Before asking for reasonable cause</h2>
<p>If the three years before the penalty year were clean, ${h.a('first-time-penalty-abatement', 'first-time abatement')} needs no explanation at all, and for 2025 returns onward the automatic exemption may mean no penalty was assessed in the first place. Reasonable cause is the route when that history is missing, or when first-time abatement has already been used on an earlier penalty and a second removal is needed. The IRS decides every request; this page lays out the rule and the amounts at stake, not a prediction of the result.</p>
`,
  faqs: [
    { q: 'What records support a reasonable cause request for a late filed return?', a: 'Dated records that match the months of the penalty: hospital or court records, or a doctor\'s letter with the start and end of an illness; proof of a fire or disaster; copies of letters to and from the IRS; receipts. The written explanation states what happened and when, how it stopped you from filing, and what you tried to do.' },
    { q: 'Is a shortage of money reasonable cause for paying federal tax late?', a: 'Not by itself, according to the IRS. Lack of funds alone does not qualify for relief from the failure to pay penalty. It can be part of a request when other facts show you used reasonable care, for example an unexpected medical emergency that drained savings set aside for the tax.' },
    { q: 'Does a mistake made by my tax preparer count as reasonable cause?', a: 'Generally not. The IRS holds the taxpayer responsible for knowing what the preparer files and for getting proof that the return or payment went out on time. Reliance on an advisor is weighed differently for accuracy-related penalties, where the IRS asks whether you gave complete information to a competent advisor.' },
    { q: 'When does the IRS reduce interest because of its own error or delay?', a: 'Only under section 6404(e): the interest must come from an unreasonable error or delay by an IRS employee in a ministerial or managerial act, after the IRS contacted you in writing, with no part of the delay caused by you. You ask on Form 843 within three years of filing or two years of paying, whichever is later.' },
  ],
  tool: 'relief',
  toolArg: { ty: '2023', pen: Math.round(pens) },
  related: ['first-time-penalty-abatement', 'failure-to-file-penalty', 'failure-to-pay-penalty', 'irs-penalty-and-interest-calculator', 'back-taxes'],
  sources: ['reasonable', 'penaltyrelief', 'f843', 'intabate', 'interest'],
});
