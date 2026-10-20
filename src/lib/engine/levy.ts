/**
 * Take-home pay exempt from an IRS wage levy in 2026 (IRC 6334(d), Publication 1494 Rev. 12-2025): the standard
 * deduction of the filing status plus $5,300 per dependent claimed on the levy statement, plus the additional
 * standard deduction for age 65 or blindness, divided by the number of pay periods in the year. The rest of the
 * take-home pay goes to the IRS until the levy is released.
 */
import P from '../../data/params-2026.json';

const L = P.levy;
export type Status = 'single' | 'mfj' | 'hoh' | 'mfs';
export type Period = 'daily' | 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
export function exemptAmount(status: Status, period: Period, dependents: number, additional = 0) {
  // Publication 1494 rounds each part to the cent per pay period, then adds them (1,238.46 + 2 x 203.85 = 1,646.16).
  const married = status === 'mfj' || status === 'mfs';
  const per = (x: number) => Math.round((x / L.periods[period]) * 100) / 100;
  const total = per(L.standardDeduction[status]) + Math.max(0, Math.round(dependents)) * per(L.perDependent) + Math.max(0, Math.round(additional)) * per(married ? L.additional.married : L.additional.unmarried);
  return Math.round(total * 100) / 100;
}
export function levyTake(takeHome: number, status: Status, period: Period, dependents: number, additional = 0) {
  const exempt = exemptAmount(status, period, dependents, additional);
  return { exempt, levied: Math.max(0, takeHome - exempt), kept: Math.min(takeHome, exempt) };
}
