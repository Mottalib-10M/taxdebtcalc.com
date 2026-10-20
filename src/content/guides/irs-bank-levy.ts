import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, PL = P.plans, F = PL.fees, O = P.oic;
// $9,700 left unpaid on a 2023 return filed on time; the final notice has arrived.
const tax = 9700;
const due = K.DUE_DATES[2023];
const at = (m: number, notice: boolean) => K.projectDebt({ tax, due, filed: due, until: K.addMonths(K.today, m), levyNotice: notice ? K.today : null });
const now = at(0, false);
const six = at(6, true);
const plan18 = K.plan(Math.round(now.total), 18);
const opts = K.planOptions(now.total, tax);

export default defineGuide({
  id: 'irs-bank-levy',
  group: 'collection',
  order: 440,
  slug: 'irs-bank-levy',
  nav: 'IRS bank levy',
  card: 'When the IRS can take money from a bank account, the notices it must send first, and the requests that hold it off',
  title: 'IRS Bank Levy 2026: Notices First, What Stops It, Your Cost',
  description: `IRS bank levy 2026: the notices required before the IRS can take money from an account, what holds a levy off, and the ${K.pct(P.ftp.afterLevyNotice)} monthly penalty while you wait.`,
  h1: 'IRS bank levy: what has to happen first, and what holds it off',
  intro: 'Enter the unpaid tax and year; the box for a final notice of intent to levy is already ticked. The calculator shows what the balance becomes at the higher penalty rate if nothing is arranged.',
  facts: [['Final notice sent at least', '30 days before a levy'], ['Penalty once the notice goes unpaid', `${K.pct(P.ftp.afterLevyNotice)} a month`], ['Online plan, direct debit', K.usd(F.ddiaOnline)], ['Levy power', 'IRC 6331']],
  resume: `A bank levy is the IRS seizing money held in your name at a bank to pay a tax debt. It is different from a lien, which is a claim on property; a levy actually takes it. Under section 6331 of the tax code and the IRS levy page, a levy usually comes only after four steps: the tax was assessed and a bill sent, you neglected or refused to pay, the IRS sent a Final Notice of Intent to Levy and Notice of Your Right to a Hearing at least 30 days before, and it gave advance notice that it may contact third parties such as your bank. A request for a payment plan generally bars a levy while it is pending, and most collection stops while an offer in compromise is under review or an account is currently not collectible. Ten days after a notice of intent to levy, the late payment penalty doubles to ${K.pct(P.ftp.afterLevyNotice)} a month. On ${K.usd(tax)} of 2023 tax, the balance is ${K.usd(now.total)} today and ${K.usd(six.total)} six months from now if nothing is arranged.`,
  body: (h) => `
<h2>The four conditions on the IRS page</h2>
<p>The ${h.src('levy', 'IRS page on levies')} sets out what normally has to happen before a levy is issued. The tax has been assessed and a Notice and Demand for Payment, the first bill, has been sent. You neglected or refused to pay. The IRS sent the Final Notice of Intent to Levy and Notice of Your Right to a Hearing at least 30 days before the levy, in person, at home or work, or by certified or registered mail to your last known address. And it sent advance notice of third-party contact. The page lists bank accounts among the property held by someone else that the IRS can levy, alongside wages, retirement accounts, dividends, commissions, rental income and the cash value of life insurance.</p>
<p>A state tax refund is the exception in timing: the ${h.a('cp504-notice', 'CP504 notice')} allows the IRS to levy it right away, and the hearing notice can come after that levy. For a bank account, the hearing notice comes first.</p>
<h2>What holds a levy off, according to the IRS texts</h2>
${h.table(['Situation', 'Levy', 'Where the IRS says so'], [
    ['Final notice not yet sent, or sent less than 30 days ago', 'generally not issued', 'levy page'],
    ['Installment agreement requested and pending', 'generally prohibited, with exceptions', 'payment plan page'],
    ['Installment agreement in force', 'generally prohibited', 'payment plan page'],
    ['Offer in compromise mailed but not yet signed as pending', 'still possible; proceeds kept', 'Form 656, Section 7(g)'],
    ['Offer in compromise pending', 'most collection suspended', 'offer in compromise page'],
    ['Currently not collectible status', 'most collection suspended', 'collection delay page'],
    ['Collection period suspended (bankruptcy, hearing, offer)', 'generally none, with exceptions', 'collection period page'],
    ['Collection period expired', 'no further collection', 'collection period page'],
  ], `IRS pages read on ${K.day(P.meta.retrieved_at)}`, ['l', 'l', 'l'])}
<p>The gap in the fourth row matters in practice. Form 656 says the IRS may levy up to the time an IRS official signs and acknowledges the offer as pending, and may keep what it collected; if a levy arrives after the offer was submitted, the booklet says to call the number on the levy at once. A payment plan request is the quicker shield for most people with a balance up to ${K.usd(PL.simpleMax)}, because it can be set up online the same day.</p>
<h2>What a levy notice costs while nothing happens</h2>
<p>The example below is a balance from a 2023 return filed on time, ${K.usd(tax)} of tax still unpaid. The final notice arrives today. If nothing is paid or arranged for six months, the penalty runs at ${K.pct(P.ftp.afterLevyNotice)} a month from the tenth day, and interest compounds daily.</p>
${h.table(['', 'Today', 'In six months, nothing arranged'], [
    ['Tax', K.usd(tax), K.usd(tax)],
    ['Late payment penalty', K.usd(now.ftp), K.usd(six.ftp)],
    ['Interest', K.usd(now.interest), K.usd(six.interest)],
    ['Balance', `<strong>${K.usd(now.total)}</strong>`, `<strong>${K.usd(six.total)}</strong>`],
  ], `Tax year 2023, due ${K.day(due)}; interest at ${K.rate(P.interest.current)} carried forward`, ['l', 'r', 'r'])}
${h.mini('debt', { t: 'Your balance after a levy notice', p: ['tax', 'pm'], d: { tax, ty: '2023', fs: 'ontime', pm: 6, lv: 'yes' } })}
<p>The same ${K.usd(now.total)} spread over 18 months comes to ${K.usd(plan18.monthly)} a month${opts.simple ? ', inside the Simple Payment Plan limit, so no financial statement is needed' : ''}, with the set-up fee of ${K.usd(F.ddiaOnline)} online by direct debit. Note that the doubled penalty rate is tied to the levy notice, and a plan set up afterward does not undo the months already charged at the higher rate.</p>
<h2>After a levy has taken money</h2>
<p>Money taken by a levy is applied to the debt. A levy that leaves a household unable to cover basic living costs, reaches money that belongs to someone else, or follows a missing notice can be raised with the IRS office named on the levy, through the Collection Appeals Program, or with the ${h.src('tas', 'Taxpayer Advocate Service')}, which helps when a tax problem causes financial difficulty. A levied account is also a sign that the IRS has the bank's details on file: as long as the balance is unresolved, nothing in the IRS texts prevents a further levy on the same or another account.</p>
<p>Three documents help when reading where an account stands. The account transcript, available in the IRS online account, shows each assessment, each payment and levy credited, and the dates that drive the collection period. ${h.src('p594', 'Publication 594')}, The IRS Collection Process, describes the sequence of notices from the first bill to enforced collection. And the levy notice itself names the office and phone number to contact about that levy. Comparing the transcript with the notices shows whether the 30-day final notice was in fact sent before the levy.</p>
<p>The ${h.src('csed', 'collection period page')} sets the outer limit: the IRS generally has ten years from assessment to collect, and it does not levy while the period is suspended, with some exceptions. A levy on future income issued before the period ends can keep producing payments after it. The dates and amounts here illustrate the rules; the IRS determines when a levy is issued or released on any account, and this is not tax advice.</p>
`,
  faqs: [
    { q: 'Can the IRS take money from my bank account without warning?', a: 'Not without notice. The IRS levy page says a levy usually comes only after a bill, a refusal or neglect to pay, a Final Notice of Intent to Levy and Notice of Your Right to a Hearing sent at least 30 days before, and advance notice of third-party contact. Those notices can go to your last known address, so a missed letter does not stop the clock.' },
    { q: 'Does asking for a payment plan stop an IRS bank levy?', a: `It generally prevents one. The IRS payment plan page says that, with certain exceptions, the IRS is generally prohibited from levying while an installment agreement request is pending and while the plan is in force. For balances of ${K.usd(PL.simpleMax)} or less the request can be made online and approved at once, for a ${K.usd(F.ddiaOnline)} fee with direct debit.` },
    { q: 'Will the IRS keep money it levied if I then file an offer in compromise?', a: `Yes. Section 7 of Form 656 says the IRS may levy up to the time an official signs the offer as pending and may keep the proceeds of that levy. Money already collected is not refunded and cannot be counted toward the offer amount, which still has to meet the minimum from Form 433-A (OIC); the ${K.usd(O.fee)} fee is extra unless the Low-Income Certification applies.` },
  ],
  tool: 'debt',
  toolArg: { tax, ty: '2023', fs: 'ontime', pm: 6, lv: 'yes' },
  related: ['irs-wage-garnishment', 'cp504-notice', 'irs-tax-lien', 'irs-payment-plan', 'currently-not-collectible'],
  sources: ['levy', 'irc6331', 'plans', 'oic', 'f656b', 'csed', 'cnc', 'tas'],
});
