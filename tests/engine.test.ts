/** Engine cases: official examples (Publication 1494, IRS penalty pages) and hand-checked arithmetic. */
import { describe, it, expect } from 'vitest';
import P from '../src/data/params-2026.json';
import H from '../src/data/housing-2026.json';
import { monthsOrPart, addMonths, addDays } from '../src/lib/engine/dates';
import { projectDebt, interestOn, rateOn, ftfMinimum, DUE_DATES } from '../src/lib/engine/debt';
import { runPlan, paymentFor, setupFee, planOptions } from '../src/lib/engine/plan';
import { primeHousing, nationalStandard, housingStandard, operatingStandard, allowable, msaOf } from '../src/lib/engine/standards';
import { assetEquity, rcp, lowIncomeLimit, upfront } from '../src/lib/engine/oic';
import { exemptAmount } from '../src/lib/engine/levy';

primeHousing(H.states as never);

describe('dates', () => {
  it('counts each month or part of a month', () => {
    expect(monthsOrPart('2026-04-15', '2026-04-15')).toBe(0);
    expect(monthsOrPart('2026-04-15', '2026-04-16')).toBe(1);
    expect(monthsOrPart('2026-04-15', '2026-05-15')).toBe(1);
    expect(monthsOrPart('2026-04-15', '2026-05-16')).toBe(2);
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
  });
});

describe('parameters read on irs.gov', () => {
  it('rates, fees, standards and thresholds', () => {
    expect(P.interest.rates['2026-Q4']).toBe(0.07);
    expect(P.interest.rates['2026-Q2']).toBe(0.06);
    expect(P.interest.rates['2024-Q1']).toBe(0.08);
    expect(P.interest.rates['2021-Q3']).toBe(0.03);
    expect(P.standards.effective).toBe('2026-06-29');
    expect(ftfMinimum('2026-04-15')).toBe(525);
    expect(ftfMinimum('2025-04-15')).toBe(510);
    expect(ftfMinimum('2024-04-15')).toBe(485);
    expect(P.passport['2026']).toBe(66000);
    expect(setupFee(true, true, false)).toBe(29);
    expect(setupFee(false, false, false)).toBe(178);
    expect(setupFee(false, true, true)).toBe(43);
    expect(DUE_DATES[2025]).toBe('2026-04-15');
  });
});

describe('failure to file and failure to pay (IRC 6651)', () => {
  it('3 months late on $20,000: 4.5% + 0.5% a month', () => {
    const r = projectDebt({ tax: 20000, due: '2026-04-15', filed: '2026-07-15', until: '2026-07-15' });
    expect(r.ftfMonths).toBe(3);
    expect(r.ftf).toBeCloseTo(2700, 6);
    expect(r.ftp).toBeCloseTo(300, 6);
    expect(r.minimumApplied).toBe(false);
  });
  it('more than 60 days late on a small balance: minimum of $525 or 100% of the tax', () => {
    expect(projectDebt({ tax: 1000, due: '2026-04-15', filed: '2026-07-15', until: '2026-07-15' }).ftf).toBe(525);
    expect(projectDebt({ tax: 300, due: '2026-04-15', filed: '2026-07-15', until: '2026-07-15' }).ftf).toBe(300);
    expect(projectDebt({ tax: 1000, due: '2026-04-15', filed: '2026-06-10', until: '2026-06-10' }).minimumApplied).toBe(false);
  });
  it('late filing stops at 22.5% after five months, late payment goes on to 25% (50 months)', () => {
    const r = projectDebt({ tax: 10000, due: '2024-04-15', filed: null, until: '2026-10-15' });
    expect(r.ftf).toBeCloseTo(2250, 6);
    expect(r.ftp).toBeCloseTo(1500, 6); // 30 months x 0.5%
    expect(projectDebt({ tax: 10000, due: '2021-05-17', filed: null, until: '2026-10-15' }).ftp).toBeCloseTo(2500, 6);
  });
  it('filed on time: no late filing penalty; extension moves the filing date only', () => {
    const r = projectDebt({ tax: 10000, due: '2026-04-15', filed: '2026-10-10', extension: true, until: '2026-10-15' });
    expect(r.ftf).toBe(0);
    expect(r.ftp).toBeCloseTo(300, 6);
  });
  it('late payment penalty is 1% a month from 10 days after a notice of intent to levy', () => {
    const base = projectDebt({ tax: 10000, due: '2025-04-15', filed: '2025-04-15', until: '2026-04-15' });
    const levy = projectDebt({ tax: 10000, due: '2025-04-15', filed: '2025-04-15', until: '2026-04-15', levyNotice: '2025-12-20' });
    expect(base.ftp).toBeCloseTo(600, 6);
    expect(levy.ftp).toBeGreaterThan(base.ftp);
  });
});

describe('interest compounded daily at the quarterly rate', () => {
  it('matches a hand computation across a rate change', () => {
    // 2026-04-15 to 2026-07-15: 77 days at 6% (Q2) then 14 days at 7% (Q3), 365-day year.
    const hand = 10000 * (1 + 0.06 / 365) ** 77 * (1 + 0.07 / 365) ** 14 - 10000;
    expect(interestOn(10000, '2026-04-15', '2026-07-15')).toBeCloseTo(hand, 6);
    expect(rateOn('2026-11-01')).toBe(0.07);
  });
  it('a full year at 7% compounded daily is about 7.25%', () => {
    expect(interestOn(10000, '2025-01-01', '2026-01-01')).toBeCloseTo(10000 * ((1 + 0.07 / 365) ** 365 - 1), 6);
  });
  it('total = tax + penalties + interest', () => {
    const r = projectDebt({ tax: 15000, due: '2025-04-15', filed: '2025-09-02', until: '2026-10-20' });
    expect(r.total).toBeCloseTo(15000 + r.ftf + r.ftp + r.interest, 6);
    expect(r.interest).toBeGreaterThan(0);
  });
});

describe('payment plans', () => {
  it('pays off, and the late payment penalty runs at 0.25% when the return was on time', () => {
    const base = { tax: 12000, penalties: 0, interest: 0, ftpSoFar: 0, taxOriginal: 12000, start: '2026-11-01', filedOnTime: true };
    const r = runPlan({ ...base, monthly: 500 });
    expect(r.paid).toBe(true);
    expect(r.ftp).toBeLessThan(12000 * 0.0025 * r.months);
    const late = runPlan({ ...base, monthly: 500, filedOnTime: false });
    expect(late.ftp).toBeGreaterThan(r.ftp);
    const m = paymentFor(base, 24);
    expect(runPlan({ ...base, monthly: m, maxMonths: 24 }).paid).toBe(true);
    expect(runPlan({ ...base, monthly: m - 2, maxMonths: 24 }).paid).toBe(false);
  });
  it('thresholds of the plans', () => {
    expect(planOptions(99999, 50000).shortTerm).toBe(true);
    expect(planOptions(100000, 50000).shortTerm).toBe(false);
    expect(planOptions(50000, 40000).simple).toBe(true);
    expect(planOptions(50001, 40000).needsFinancials).toBe(true);
    expect(planOptions(12000, 10000).guaranteed).toBe(true);
  });
});

describe('Collection Financial Standards (effective 2026-06-29)', () => {
  it('national, housing and transportation figures as published', () => {
    expect(nationalStandard(1)).toBe(867);
    expect(nationalStandard(4)).toBe(2176);
    expect(nationalStandard(6)).toBe(2176 + 2 * 397);
    expect(housingStandard('Alabama', 'Autauga County', 1)).toBe(1593);
    expect(housingStandard('Alabama', 'Autauga County', 7)).toBe(2234);
    expect(msaOf('Illinois', 'Cook County')).toBe('Chicago');
    expect(operatingStandard('Illinois', 'Cook County', 1)).toBe(334);
    expect(operatingStandard('Illinois', 'Adams County', 2)).toBe(526);
    expect(msaOf('Maryland', 'Baltimore city')).toBe('Baltimore');
    expect(msaOf('Missouri', 'St. Louis city')).toBe('St. Louis');
    expect(msaOf('Virginia', 'Fairfax County')).toBe('Washington, D.C.');
  });
  it('housing and car costs are the lesser of spent and standard', () => {
    const a = allowable({ state: 'Alabama', county: 'Autauga County', persons: 1, over65: 0, cars: 1, carPayment: 900, operating: 100, housingActual: 2500, healthInsurance: 300, taxes: 600, childCare: 0, courtOrdered: 0, lifeInsurance: 0, other: 0, publicTransit: false });
    expect(a.housing).toBe(1593);
    expect(a.ownership).toBe(703);
    expect(a.operating).toBe(100);
    expect(a.health).toBe(90);
    expect(a.total).toBe(867 + 1593 + 703 + 100 + 90 + 300 + 600);
  });
});

describe('offer in compromise (Form 433-A (OIC) Rev. 4-2026)', () => {
  it('quick-sale value and the three allowances', () => {
    const e = assetEquity({ bank: 3000, investments: 0, retirement: 20000, retirementLoan: 0, lifeCash: 0, homeValue: 300000, homeLoan: 250000, carValue: 15000, carLoan: 5000, car2Value: 0, car2Loan: 0, valuables: 20000, joint: false });
    expect(e.bank).toBe(2000);
    expect(e.retire).toBe(16000);
    expect(e.home).toBe(0); // 240,000 - 250,000 is negative
    expect(e.cars).toBe(15000 * 0.8 - 5000 - 3450);
    expect(e.valuables).toBe(16000 - 11980);
    const r = rcp(e.total, 250);
    expect(r.lumpSum).toBe(e.total + 3000);
    expect(r.periodic).toBe(e.total + 6000);
  });
  it('low-income certification and amounts due with the offer', () => {
    expect(lowIncomeLimit(1)).toBe(39900);
    expect(lowIncomeLimit(9)).toBe(139300 + 14200);
    expect(lowIncomeLimit(2, 'alaska')).toBe(67625);
    expect(upfront(10000, 'lump')).toEqual({ fee: 205, deposit: 2000 });
    expect(upfront(10000, 'lump', 24, true)).toEqual({ fee: 0, deposit: 0 });
  });
});

describe('wage levy (Publication 1494, 2026)', () => {
  it('examples printed in the publication', () => {
    expect(exemptAmount('single', 'weekly', 3)).toBe(615.38);
    expect(exemptAmount('single', 'weekly', 3, 1)).toBeCloseTo(654.8, 1);
    expect(exemptAmount('mfj', 'biweekly', 2)).toBe(1646.16);
    expect(exemptAmount('single', 'monthly', 0)).toBe(1341.67);
    expect(exemptAmount('hoh', 'monthly', 0)).toBe(2012.5);
  });
});

describe('dates helper sanity', () => {
  it('addDays', () => { expect(addDays('2026-12-31', 1)).toBe('2027-01-01'); });
});

describe('late filing penalty interest with an extension (IRC 6601(e)(2)(B))', () => {
  it('starts at the extended due date, not the original one', () => {
    // Filed 2026-12-20 under an extension to 2026-10-15: 3 months or part late, 4.5% x 3 = 1,350 on $10,000.
    const ext = projectDebt({ tax: 10000, due: '2026-04-15', filed: '2026-12-20', extension: true, until: '2026-12-20' });
    const noFtf = interestOn(10000, '2026-04-15', '2026-12-20');
    expect(ext.ftf).toBeCloseTo(1350, 6);
    // Interest on the penalty runs only from 2026-10-15: well under what 249 days would give.
    const onPenalty = ext.interest - noFtf;
    expect(onPenalty).toBeLessThan(1350 * 0.07 * 70 / 365 + 40);
  });
});

describe('short-term plan is not an installment agreement (IRC 6651(h))', () => {
  it('keeps 0.5% a month for a schedule of 6 months or less, 0.25% beyond', () => {
    const base = { tax: 20000, penalties: 0, interest: 0, ftpSoFar: 0, taxOriginal: 20000, start: '2026-10-20', filedOnTime: true };
    const st = runPlan({ ...base, monthly: 3500, maxMonths: 6 });
    // First month: 0.5% of $20,000 = $100.
    expect(st.rows[0].ftp).toBeCloseTo(100, 6);
    const lt = runPlan({ ...base, monthly: 700, maxMonths: 36 });
    expect(lt.rows[0].ftp).toBeCloseTo(50, 6);
  });
});
