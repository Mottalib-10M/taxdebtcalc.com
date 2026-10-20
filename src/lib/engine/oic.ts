/**
 * Reasonable collection potential of an offer in compromise, line by line as Form 433-A (OIC), Rev. 4-2026:
 * assets at quick-sale value (80%) minus loans, $1,000 kept on bank accounts, $3,450 off each car's equity
 * (one car per taxpayer, two on a joint offer), $11,980 off furniture and valuables; plus the remaining monthly
 * income (household income minus allowable expenses) times 12 for a lump-sum offer (5 payments within 5 months)
 * or 24 for a periodic offer (6 to 24 months).
 */
import P from '../../data/params-2026.json';

const O = P.oic;
export interface Assets {
  bank: number; investments: number; retirement: number; retirementLoan: number; lifeCash: number;
  homeValue: number; homeLoan: number; carValue: number; carLoan: number; car2Value: number; car2Loan: number;
  valuables: number; joint: boolean;
}
export function assetEquity(a: Assets) {
  const pos = (x: number) => Math.max(0, x);
  const bank = pos(a.bank - O.bankAllowance);
  const invest = pos(a.investments);
  const retire = pos(a.retirement * O.quickSale - a.retirementLoan);
  const life = pos(a.lifeCash);
  const home = pos(a.homeValue * O.quickSale - a.homeLoan);
  const car1 = pos(pos(a.carValue * O.quickSale - a.carLoan) - O.vehicleAllowance);
  const car2raw = pos(a.car2Value * O.quickSale - a.car2Loan);
  const car2 = a.joint ? pos(car2raw - O.vehicleAllowance) : car2raw;
  const valuables = pos(a.valuables * O.quickSale - O.personalEffects);
  return { bank, invest, retire, life, home, cars: car1 + car2, valuables, total: bank + invest + retire + life + home + car1 + car2 + valuables };
}
export function rcp(equity: number, remainingMonthly: number) {
  const r = Math.max(0, remainingMonthly);
  return { lumpSum: equity + r * O.multiplierLumpSum, periodic: equity + r * O.multiplierPeriodic, futureLump: r * O.multiplierLumpSum, futurePeriodic: r * O.multiplierPeriodic };
}
/** Low-Income Certification of Form 656: no fee and no payment while the offer is considered. */
export function lowIncomeLimit(persons: number, place: 'base' | 'alaska' | 'hawaii' = 'base') {
  const L = O.lowIncome as Record<string, number[] | number>;
  const t = L[place] as number[], add = L[place === 'base' ? 'add' : `${place}Add`] as number;
  const n = Math.max(1, Math.round(persons));
  return n <= 8 ? t[n - 1] : t[7] + (n - 8) * add;
}
/** Payments due on application: 20% of a lump-sum offer, or the first monthly payment of a periodic offer, plus $205. */
export function upfront(offer: number, kind: 'lump' | 'periodic', months = 24, lowIncome = false) {
  if (lowIncome) return { fee: 0, deposit: 0 };
  return { fee: O.fee, deposit: kind === 'lump' ? offer * O.lumpSumDeposit : offer / Math.max(O.periodicMinMonths, Math.min(O.periodicMaxMonths, months)) };
}
