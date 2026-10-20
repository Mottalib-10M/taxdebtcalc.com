import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, C = P.cp2000;
// Four CP2000 proposals on 2024 returns, answered and paid a month from now.
const cases = [
  { who: 'Freelance income on a 1099-NEC left off', add: 5800, shown: 11200 },
  { who: 'Brokerage sale reported without cost basis', add: 2600, shown: 18400 },
  { who: 'Retirement distribution omitted', add: 7400, shown: 61000 },
  { who: 'Second W-2 from a short job omitted', add: 6200, shown: 72000 },
].map((c) => { const r = K.tool('cp2000', { add: c.add, shown: c.shown, ty: '2024', pm: 1 }); return { ...c, correct: c.add + c.shown, pen: Number(r.rows[1][2]), int: Number(r.rows[2][2]), total: r.value }; });
const a = cases[0], d = cases[3];
const due = K.DUE_DATES[2024];

export default defineGuide({
  id: 'cp2000-notice',
  group: 'collection',
  order: 420,
  slug: 'cp2000-notice',
  nav: 'CP2000 notice',
  card: `A proposed change, not a bill: the extra tax, the ${K.pct(C.accuracyPenalty)} accuracy penalty test and interest from the due date`,
  title: 'CP2000 Notice 2026: Proposed Tax, Accuracy Penalty, Reply',
  description: `CP2000 notice 2026: what the proposed change adds with interest from the due date, when the ${K.pct(C.accuracyPenalty)} accuracy penalty applies (over ${K.usd(C.understatementFloor)} and ${K.pct(C.understatementShare)}), how to reply.`,
  h1: 'CP2000 notice: the proposed tax, the penalty test and your reply',
  intro: 'Enter the additional tax the notice proposes, the tax on your original return and the year. The calculator applies the substantial understatement test and adds interest from the original due date.',
  facts: [['Accuracy-related penalty', K.pct(C.accuracyPenalty)], ['Understatement test', `over ${K.pct(C.understatementShare)} of the correct tax and over ${K.usd(C.understatementFloor)}`], ['Interest runs from', 'the return\'s due date'], ['Is it a bill?', 'no, a proposal']],
  resume: `A CP2000 tells you that income or payment information the IRS received from employers, banks, brokers or payment platforms does not match your return, and proposes a change to the tax. It is not a bill. You reply by the date on the notice: agree, agree in part, or disagree with documents, by upload, fax or mail. The proposed amount usually has three parts. The additional tax; interest on it from the original due date of the return, compounded daily at the quarterly rates (${K.rate(P.interest.current)} in the ${K.quarter(P.interest.current)}); and often a ${K.pct(C.accuracyPenalty)} accuracy-related penalty. For an individual, a substantial understatement means the understated tax is more than both ${K.pct(C.understatementShare)} of the correct tax and ${K.usd(C.understatementFloor)}. A freelancer whose 2024 return left out ${K.usd(a.add)} of tax on ${K.usd(a.shown)} reported crosses both lines: agreeing and paying next month costs ${a.total}, of which ${K.usd(a.pen)} is penalty. A ${K.usd(d.add)} gap on a larger return of ${K.usd(d.shown)} stays under ${K.pct(C.understatementShare)} and carries no penalty on that ground.`,
  body: (h) => `
<h2>Why the notice was sent</h2>
<p>The ${h.src('cp2000', 'IRS page on CP2000 notices')} explains that the series (CP2000 and its A to E variants) is triggered when third-party information returns, such as Forms W-2, 1099, 1098 or a payment app's 1099-K, do not agree with the return. The difference may raise the tax, lower it or leave it unchanged. The notice lists each item the IRS matched, the amount it received from the payer and the change it proposes. Nothing is assessed until you reply or the response date passes.</p>
<h2>The penalty test, applied to four returns</h2>
<p>The ${h.src('irc6662', 'accuracy-related penalty of section 6662')} is ${K.pct(C.accuracyPenalty)} of the underpayment. The CP2000 usually proposes it on the ground of a substantial understatement, which for an individual means the understatement exceeds the larger of ${K.pct(C.understatementShare)} of the tax that should have been shown and ${K.usd(C.understatementFloor)}. The size of the return therefore matters as much as the size of the gap.</p>
${h.table(['Situation', 'Tax shown', 'Additional tax', 'Correct tax', 'Penalty', 'Interest', 'Total if paid next month'], cases.map((c) => [c.who, K.usd(c.shown), K.usd(c.add), K.usd(c.correct), K.usd(c.pen), K.usd(c.int), c.total]), `2024 returns due ${K.day(due)}; interest at the published quarterly rates, the current one carried forward`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The second case is under ${K.usd(C.understatementFloor)} and escapes the test whatever the percentage. The fourth is over ${K.usd(C.understatementFloor)} but under ${K.pct(C.understatementShare)} of a correct tax of ${K.usd(d.correct)}, so it escapes too. The first and third cross both lines. The test is not the only route to the penalty, though: negligence or disregard of rules can support it below the thresholds, and the IRS may remove it for reasonable cause shown in the reply.</p>
${h.mini('cp2000', { t: 'Your CP2000 proposal', p: ['add', 'shown'], d: { add: a.add, shown: a.shown, ty: '2024' } })}
<h2>Checking the match line by line</h2>
<p>Many proposals rest on a reporting gap rather than hidden income. A broker's form that shows sale proceeds without cost basis leads the IRS to treat the whole proceeds as gain; the brokerage statement with the purchase price usually settles it. Income reported on a business schedule instead of the line the payer's form points to can look missing. A 1099 issued twice, or to the wrong Social Security number, inflates the total. Comparing each item on the notice with the payer's form and the return, line by line, shows which part of the proposal is real before any reply is drafted.</p>
<h2>Interest is the part that cannot be argued down</h2>
<p>Interest on the additional tax runs from the original due date of the return, not from the date of the notice, because the tax was owed then. A CP2000 for a 2024 return arriving in late 2026 already carries well over a year of interest, and the penalty bears interest too. Paying the agreed part while the rest is discussed stops interest on what is paid. If the IRS later drops the penalty, the interest charged on it goes with it.</p>
<h2>Replying</h2>
<p>If a response form came with the notice, complete it, sign it, tick agree or disagree and attach support: a corrected 1099 from the payer, a brokerage statement showing cost basis, proof that income was reported on another line or another return. If you agree and have nothing else to report, you follow the notice and do not file an amended return. If the notice is right but you also have other income, credits or deductions to report, the IRS asks for a Form 1040-X marked "CP2000" at the top, sent with the response form.</p>
${h.table(['Channel', 'How'], [
    ['Upload', 'IRS document upload tool, with the access code on the CP2000 page; JPG, PNG or PDF'],
    ['Fax', 'the fax number of the IRS campus shown at the top left of the notice'],
    ['Mail', 'the address at the top left of the first page'],
    ['More time', 'send an extension request through one of the same channels'],
  ], 'Reply options listed by the IRS', ['l', 'l'])}
<p>Someone who did not earn the income at all, because another person used their name and Social Security number, sends the reply with Form 14039, the identity theft affidavit. A tax professional can be authorized on the response form itself or with Form 2848. Publication 5181 describes the whole review process, and the Taxpayer Advocate Service and Low Income Taxpayer Clinics can help at no or low cost.</p>
<h2>After the reply, or without one</h2>
<p>If you do not reply, or the discrepancy cannot be resolved, the IRS may send another notice and then a bill for the proposed amount, at which point the balance follows the usual path of ${h.a('cp14-notice', 'collection notices')}. If you agree but cannot pay, a ${h.a('irs-payment-plan', 'payment plan')} or an offer can be requested like for any other balance. The IRS page also suggests checking earlier returns for the same omission and amending them. The calculator shows what the rules produce; whether a penalty is asserted or removed is decided by the IRS on your documents.</p>
`,
  faqs: [
    { q: 'Is a CP2000 notice a bill I have to pay right away?', a: 'No. The IRS says the CP2000 is not a bill but a proposal to change your return, and that a response may be required by the date on the notice. You can agree, partly agree or disagree with documents. Only if you do not reply, or the issue is not resolved, does the IRS send another notice and then a bill.' },
    { q: `When does the ${K.pct(C.accuracyPenalty)} accuracy penalty apply on a CP2000?`, a: `On the ground of substantial understatement, when the additional tax is more than both ${K.pct(C.understatementShare)} of the correct tax and ${K.usd(C.understatementFloor)}. A ${K.usd(d.add)} gap on a correct tax of ${K.usd(d.correct)} misses the percentage, and any gap under ${K.usd(C.understatementFloor)} misses the floor. Negligence can still support the penalty below those lines, and reasonable cause shown in the reply can remove it.` },
    { q: 'Do I need to file an amended return to answer a CP2000?', a: 'Not if you agree and have nothing else to report: you follow the notice\'s instructions and the IRS makes the change. A Form 1040-X is needed only when the notice is correct but you also have other income, credits or expenses to report; write "CP2000" at the top and send it with the response form.' },
    { q: 'Can I get more time to answer a CP2000 notice?', a: 'Yes. The IRS page lists "request more time to respond" among the options: send the extension request through one of the reply channels, the document upload tool, the fax number for your IRS campus or the mailing address on the notice. Interest continues to accrue on any additional tax you end up owing while the extra time runs.' },
  ],
  tool: 'cp2000',
  toolArg: { add: a.add, shown: a.shown, ty: '2024' },
  related: ['cp14-notice', 'irs-penalty-abatement', 'irs-payment-plan', 'irs-penalty-and-interest-calculator', 'back-taxes'],
  sources: ['cp2000', 'irc6662', 'interest', 'rates'],
});
