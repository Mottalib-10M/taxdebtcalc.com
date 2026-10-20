import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, Y = P.plans.csedYears;
const D = (iso: string) => new Date(`${iso}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (s: string, n: number) => { const d = D(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const days = (a: string, b: string) => Math.round((D(b).getTime() - D(a).getTime()) / 86400000);
// A 2021 return assessed on a hypothetical date, then an offer and a plan request that each pause the clock.
const assessed = '2022-05-31';
const base = K.addMonths(assessed, 12 * Y);
const oicIn = '2024-02-12', oicOut = '2025-01-17';
const iaIn = '2025-03-03', iaOut = '2025-04-28';
const oicDays = days(oicIn, oicOut), iaDays = days(iaIn, iaOut);
const added = oicDays + 30 + iaDays;
const csed = addDays(base, added);
// Three filed years still owed, as the calculator shows them today.
const arg = { y25: 0, y24: 0, y23: 3800, y22: 6200, y21: 9100, fl: 'f' };
const yrs = K.tool('years', arg);

export default defineGuide({
  id: 'irs-collection-statute-of-limitations',
  group: 'collection',
  order: 470,
  slug: 'irs-collection-statute-of-limitations',
  nav: 'Collection statute (CSED)',
  card: `The ${Y}-year collection period from assessment, the events that pause it, and how to find your expiration date`,
  title: 'IRS Collection Statute of Limitations 2026: CSED, Pauses',
  description: `IRS collection statute of limitations 2026: ${Y} years from assessment, what pauses the clock (plans, offers, bankruptcy, hearings), and how to read the date.`,
  h1: 'IRS collection statute of limitations: the CSED and what stops the clock',
  intro: 'Enter the tax still owed for each year. The calculator shows what each year has become with penalties and interest; the text below explains when each of those balances stops being collectible.',
  facts: [['Collection period', `${Y} years from assessment`], ['Offer rejected', '+30 days'], ['Bankruptcy closed', '+6 months'], ['Hearing ends with under 90 days left', 'extended to 90 days']],
  resume: `The IRS generally has ${Y} years from the date a tax is assessed to collect it, with its penalties and interest, under section 6502 of the tax code. The end of that window is the collection statute expiration date, or CSED, and each assessment has its own: the original return, an amended return, an audit adjustment, a substitute for return and some penalties each start a separate clock. The clock pauses whenever the law bars the IRS from collecting. A pending installment agreement request, a pending offer in compromise and 30 days after its rejection, a bankruptcy plus 6 months after it ends, a collection due process hearing, an innocent spouse claim plus 60 days, combat zone service plus 180 days, and time abroad of 6 months or more all push the date back. The CSED appears in your account transcript. For a 2021 tax assessed on ${K.day(assessed)}, the base date is ${K.day(base)}; an offer pending ${oicDays} days and a plan request pending ${iaDays} days move it to ${K.day(csed)}.`,
  body: (h) => `
<h2>Ten years from what, exactly</h2>
<p>The ${h.src('csed', 'IRS page on the time it can collect')} starts the clock on the assessment date, not on the due date of the return or the year the income was earned. For a year the IRS audited, the additional tax gets its own assessment date and its own ${Y} years. When a person does not file and the IRS prepares a substitute for return, the clock starts when that tax is assessed; if the person later files a return showing more tax, the extra amount gets a new CSED while the original keeps its date. The legal basis is ${h.src('irc6502', 'section 6502')}, with the suspensions in section 6503 and other provisions listed on the IRS page.</p>
<h2>The events that pause or extend the clock</h2>
${h.table(['Event', 'Effect on the CSED'], [
    ['Installment agreement request', 'suspended while pending; +30 days if withdrawn, rejected or terminated; suspended during an appeal'],
    ['Offer in compromise', 'suspended while pending; +30 days after a rejection; suspended through an appeal'],
    ['Bankruptcy', 'suspended from the petition until discharge, dismissal or closing, then +6 months'],
    ['Collection due process hearing', 'suspended from the request to the final determination; at least 90 days left afterward'],
    ['Innocent spouse request', 'suspended until a waiver or the 90-day Tax Court window passes, or the court decides; then +60 days'],
    ['Combat zone', 'suspended for the time in the zone plus 180 days'],
    ['Certain military service', 'suspended for the service plus 270 days after the military notifies the IRS'],
    ['Living outside the United States', 'suspended for continuous absences of 6 months or more; at least 6 months after return'],
  ], 'From the IRS page "Time IRS can collect tax"', ['l', 'l'])}
<p>The list covers the time a plan request is under review, not the months of payments that follow approval, and it does not include a plan in good standing among the events that pause the clock. The innocent spouse suspension does not run against the other spouse. Some of these events, such as a payment plan request, are also what keeps a levy away, so the clock and the protection pause together.</p>
<h2>A worked timeline</h2>
<p>Take a 2021 return filed on time with a balance, assessed on ${K.day(assessed)}. Without any pause, the IRS could collect until ${K.day(base)}. The taxpayer files an offer in compromise on ${K.day(oicIn)}; the IRS rejects it on ${K.day(oicOut)}. A month later the taxpayer asks for an installment agreement on ${K.day(iaIn)}, and it is approved on ${K.day(iaOut)}.</p>
${h.table(['Step', 'Days added', 'CSED after the step'], [
    ['Assessment plus ten years', '', K.day(base)],
    [`Offer pending, ${K.day(oicIn)} to ${K.day(oicOut)}`, K.num(oicDays), K.day(addDays(base, oicDays))],
    ['30 days after the rejection', '30', K.day(addDays(base, oicDays + 30))],
    [`Plan request pending, ${K.day(iaIn)} to ${K.day(iaOut)}`, K.num(iaDays), K.day(csed)],
  ], 'Illustrative dates; the IRS computes the actual CSED for each assessment', ['l', 'r', 'r'])}
<p>The offer and the plan request together add ${K.num(added)} days. Had the offer been appealed, the whole appeal would have been added too, and a rejected plan request would have added another 30 days. Each pause is counted day for day, so the precise dates on the IRS letters, not the month, decide the result; a pause of a few weeks can matter when the original date is close. The IRS page says the transcript shows the CSED with any time added by law, and that the IRS will confirm the last day it can collect for a period on request.</p>
<h2>Several years, several clocks</h2>
<p>A person who owes for three years has three expiration dates, and the oldest is not necessarily the largest balance. The calculator above starts with ${yrs.value} owed today on three filed years, ${yrs.sub.replace(/\.$/, '')}. Each year's balance keeps growing with interest until its own CSED, and payments the IRS applies to one year do not move the date of another.</p>
${h.mini('years', { t: 'What each unpaid year has become', p: ['y22', 'y21'], d: arg })}
<h2>Finding and checking your date</h2>
<p>The CSED is on the account transcript, in the Transactions section: the IRS page describes a three-digit transaction code with a date under it, which is generally the CSED plus any time added by law. Transcripts come from the online account, Form 4506-T or the automated line at 800-908-9946. If the date looks wrong, the IRS asks you to call 800-829-1040 so it can explain the computation, and the Taxpayer Advocate Service can be asked for help on Form 911.</p>
<h2>When the date passes</h2>
<p>After the CSED, the IRS can no longer collect that assessment, whatever is still shown as owed. A levy on future income issued before the date can keep producing payments after it. Someone who paid after the CSED can ask for a refund of the overpayment before the refund statute expires, and the IRS may write to point out such payments. Currently not collectible status is not on the IRS list of events that pause the clock, which is why a long hardship can end with an expired debt; a ${h.a('partial-payment-installment-agreement', 'partial payment agreement')} relies on the same date. The dates above illustrate the rules on the IRS page; the IRS computes the date for each assessment, and this page does not determine yours.</p>
`,
  faqs: [
    { q: 'Where do I find the collection statute expiration date on my IRS transcript?', a: 'In the Transactions section of the account transcript for that tax year. The IRS page explains that a three-digit transaction code with a date below it shows the CSED, generally including any time added by law. You can get the transcript in your online account, with Form 4506-T or at 800-908-9946, and call 800-829-1040 if the date seems wrong.' },
    { q: 'Does an offer in compromise add time to the 10-year collection period?', a: 'Yes. The collection period is suspended for as long as the offer is pending, for 30 more days if the IRS rejects it, and for the whole of any appeal of the rejection. A long review can therefore add a year or more. The IRS page on offers also says plainly that filing an offer extends the collection period.' },
    { q: 'Can I get money back if I paid the IRS after the collection period expired?', a: 'Yes, in principle. The IRS page on the collection period says that if you paid a tax debt after its CSED, you may request a refund of the amount overpaid after the CSED, as long as the request is made before the refund statute expiration date. The IRS may also write to you about payments made beyond the collection period.' },
    { q: 'Does each tax year have its own collection expiration date?', a: `Yes, and often more than one. Every assessment has its own CSED: the tax on the original return, extra tax from an amended return or an audit, a substitute for return, and some penalties and interest. Someone owing for 2021, 2022 and 2023 has at least three dates, each ${Y} years after its assessment plus any suspensions.` },
  ],
  tool: 'years',
  toolArg: arg,
  related: ['currently-not-collectible', 'partial-payment-installment-agreement', 'offer-in-compromise', 'back-taxes', 'irs-wage-garnishment'],
  sources: ['csed', 'irc6502', 'oic', 'plans', 'tas'],
});
