import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, PL = P.plans, F = PL.fees;
const addDays = (iso: string, n: number) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
// $14,200 unpaid on a 2024 return filed 60 days late; the CP504 arrives today.
const tax = 14200, lateDays = 60;
const due = K.DUE_DATES[2024], filed = addDays(due, lateDays);
const at = (months: number, notice: boolean) => K.projectDebt({ tax, due, filed, until: K.addMonths(K.today, months), levyNotice: notice ? K.today : null });
const today = at(0, false);
const rows = [3, 6, 12, 24].map((m) => ({ m, with: at(m, true), without: at(m, false) }));
const y1 = rows.find((r) => r.m === 12)!;
const capMonths = Math.ceil(P.ftp.max / P.ftp.afterLevyNotice);

export default defineGuide({
  id: 'cp504-notice',
  group: 'collection',
  order: 410,
  slug: 'cp504-notice',
  nav: 'CP504 notice',
  card: `The notice of intent to levy: the penalty doubles to ${K.pct(P.ftp.afterLevyNotice)} a month, and what the IRS can seize next`,
  title: 'CP504 Notice 2026: Intent to Levy, Penalty Doubles, Options',
  description: `CP504 notice 2026: IRS notice of intent to levy. Ten days later the late payment penalty doubles to ${K.pct(P.ftp.afterLevyNotice)} a month; what can be seized, and how a plan stops it.`,
  h1: 'CP504 notice: intent to levy, and the penalty that doubles',
  intro: 'The calculator below starts with the "final notice of intent to levy" box ticked. Enter your unpaid tax, year and filing date to see what the higher penalty adds over the months you take to pay.',
  facts: [['Penalty after the notice', `${K.pct(P.ftp.afterLevyNotice)} a month`], ['Starts', '10 days after the notice'], ['Penalty ceiling', `${K.pct(P.ftp.max)} of the tax`], ['Online plan, direct debit', K.usd(F.ddiaOnline)]],
  resume: `The CP504 is the IRS Notice of Intent to Levy under section 6331(d) of the tax code, sent when earlier bills on a balance went unpaid. It tells you the IRS can levy your state income tax refund and will begin looking for other property to levy: wages and other income, bank accounts, business assets, your car and home, and Social Security benefits. It also warns that a Notice of Federal Tax Lien may be filed and mentions passport certification for seriously delinquent debts. Its cost is immediate: if the tax is not paid within 10 days of a notice of intent to levy, the late payment penalty rises from ${K.pct(P.ftp.monthly)} to ${K.pct(P.ftp.afterLevyNotice)} of the unpaid tax per month, until it reaches ${K.pct(P.ftp.max)}. On ${K.usd(tax)} of 2024 tax from a return filed ${lateDays} days late, the balance today is ${K.usd(today.total)}; paid a year from now it is ${K.usd(y1.with.total)} after the notice, against ${K.usd(y1.without.total)} at the old rate. A payment plan, full payment, or an appeal through the Collection Appeals Program are the replies the notice lists.`,
  body: (h) => `
<h2>What the notice permits, in order</h2>
<p>The ${h.src('cp504', 'IRS page on the CP504')} describes two stages. Right away, the IRS can levy any state tax refund you are due. If a balance remains after that, the IRS may send a notice of your right to a hearing before the Independent Office of Appeals, if you have not already received one, and it can then levy or seize your other property: wages, real estate commissions and other income, bank accounts, business assets, personal assets including a car and home, and Social Security benefits. The ${h.src('levy', 'IRS levy page')} sets the general rule behind that sequence: a levy usually comes only after a bill, a refusal or neglect to pay, and a Final Notice of Intent to Levy and Notice of Your Right to a Hearing sent at least 30 days before.</p>
<p>The CP504 also says the IRS can file a Notice of Federal Tax Lien if it has not done so, a public notice that makes selling or borrowing against property harder, and it explains that the State Department generally cannot issue or renew a passport for a person whose seriously delinquent tax debt the IRS has certified.</p>
<h2>The penalty after the notice</h2>
<p>The ${h.src('ftp', 'failure to pay penalty page')} states it in one line: if you do not pay within 10 days after a notice of intent to levy, the penalty is ${K.pct(P.ftp.afterLevyNotice)} per month or partial month. At that rate the ${K.pct(P.ftp.max)} ceiling can be reached in ${capMonths} months instead of ${Math.ceil(P.ftp.max / P.ftp.monthly)}, although penalties already charged count toward the same ceiling.</p>
${h.table(['Paid in full on', 'Balance at the old rate', 'Balance after the CP504', 'Extra cost of the notice'], rows.map((r) => [K.day(K.addMonths(K.today, r.m)), K.usd(r.without.total), K.usd(r.with.total), K.usd(r.with.total - r.without.total)]), `${K.usd(tax)} of 2024 tax, return filed ${lateDays} days late, notice dated ${K.day(K.today)}; interest at ${K.rate(P.interest.current)} carried forward`, ['l', 'r', 'r', 'r'])}
<p>The gap is pure penalty, plus the interest charged on that penalty. In this example the balance already carries a ${h.a('failure-to-file-penalty', 'late filing penalty')} of ${K.usd(today.ftf)} and ${K.usd(today.ftp)} of late payment penalty, so part of the ${K.pct(P.ftp.max)} room is used before the higher rate even starts.</p>
${h.mini('debt', { t: 'Your balance after a CP504', p: ['tax', 'pm'], d: { tax, ty: '2024', fs: 'l2', pm: 12, lv: 'yes' } })}
<h2>The replies listed on the notice</h2>
<p><strong>Pay the balance.</strong> The notice asks for immediate payment, online or by mail with the bottom part of the notice.</p>
<p><strong>Pay part and set up a plan.</strong> The CP504 page names the online payment agreement tool as the fastest way to get an installment agreement approved. A balance up to ${K.usd(PL.simpleMax)} qualifies for a Simple Payment Plan without a financial statement; set-up costs ${K.usd(F.ddiaOnline)} online with direct debit. The IRS payment plan page adds that while a plan request is pending, the IRS is generally prohibited from levying. A plan does not reverse the higher penalty rate already in force for months that have passed.</p>
<p><strong>Appeal.</strong> The Collection Appeals Program lets you ask for a review before collection action takes place, following the instructions on the notice. A collection due process hearing is a separate right tied to the final notice that precedes a levy on other property. The ${h.src('csed', 'IRS page on the collection period')} notes that a hearing request suspends the ten-year collection clock from receipt until the request is withdrawn or decided, appeals included, and that if fewer than 90 days remain at the final determination, the period is extended to 90 days after it.</p>
<p><strong>Tell the IRS what it does not know.</strong> If the balance was already paid or a plan is already in place, the IRS asks you to call the number on the notice anyway so the account reflects it. If you disagree with the amount, the same number applies.</p>
<h2>When the balance is too large for a plan</h2>
<p>For people who cannot pay even over time, the CP504 is the point at which the household numbers matter: ${h.a('currently-not-collectible', 'hardship status')} if income does not cover allowable expenses, or an ${h.a('offer-in-compromise', 'offer in compromise')} if the collection potential is below the debt. Form 656 warns that the IRS may levy up to the day an IRS official signs an offer as pending and may keep what that levy collected, so the timing of a request matters. The figures above apply the IRS penalty rules to an example; the amounts on your notice are the IRS's, and the IRS decides on every request.</p>
`,
  faqs: [
    { q: 'Can the IRS take my paycheck right after a CP504?', a: 'The CP504 itself lets the IRS levy a state tax refund. To levy wages, bank accounts or other property, the IRS generally must also have sent a Final Notice of Intent to Levy and Notice of Your Right to a Hearing at least 30 days before; the CP504 page says such a hearing notice may follow if you have not already received one.' },
    { q: 'Why did my late payment penalty go up after a CP504?', a: `Because the failure to pay penalty rises from ${K.pct(P.ftp.monthly)} to ${K.pct(P.ftp.afterLevyNotice)} of the unpaid tax per month if the tax is not paid within 10 days after a notice of intent to levy. The total penalty still stops at ${K.pct(P.ftp.max)} of the tax. Paying or arranging a plan does not undo the months already charged at the higher rate.` },
    { q: 'Does a CP504 mean my passport can be revoked?', a: `Only if the debt is seriously delinquent: more than ${K.usd((P.passport as Record<string, number>)['2026'])} in 2026 including penalties and interest, with a lien filed and appeal rights exhausted or a levy issued, and no plan, offer or hardship status in place. The CP504 mentions the passport rule because many accounts that receive it can reach that stage.` },
    { q: 'Should I call the IRS about a CP504 if I already set up a payment plan?', a: 'The IRS asks for it. Its CP504 page says that if you have already paid the liability or arranged an installment agreement, you still call the toll-free number on the notice to make sure your account reflects it. Notices can cross in the mail with a new plan, and the call confirms the levy will not go ahead.' },
  ],
  tool: 'debt',
  toolArg: { tax, ty: '2024', fs: 'l2', pm: 12, lv: 'yes' },
  related: ['cp14-notice', 'irs-bank-levy', 'irs-wage-garnishment', 'irs-tax-lien', 'irs-passport-revocation', 'irs-payment-plan'],
  sources: ['cp504', 'ftp', 'levy', 'irc6331', 'plans', 'simple'],
});
