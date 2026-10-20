/**
 * IRS Collection Financial Standards (effective June 29, 2026): what the IRS allows for living expenses when it
 * measures ability to pay (payment plans over $50,000, currently not collectible, offer in compromise).
 * National standards are allowed in full; housing, vehicle and operating costs are the lesser of the amount
 * spent and the local standard; health insurance, taxes, child care and court-ordered payments are actual amounts.
 */
import P from '../../data/params-2026.json';

const S = P.standards;
export type Row = [string, number, number, number, number, number, string | null];
type Housing = Record<string, Row[]>;
let HOUSING: Housing = {};
/** Housing rows are loaded once in the browser (dynamic import) and passed as a seed for the first render. */
export function primeHousing(part: Housing) { HOUSING = { ...HOUSING, ...part }; }
export const housingLoaded = (state: string) => !!HOUSING[state];
export const countiesOf = (state: string) => (HOUSING[state] ?? []).map((r) => r[0]);
export const STATES = Object.keys(S.transport.stateRegion).concat('Puerto Rico').sort();

export function nationalStandard(persons: number) {
  const n = Math.max(1, Math.round(persons));
  const t = S.national.total;
  return n <= 4 ? t[n - 1] : t[3] + (n - 4) * S.national.additionalPerson;
}
export const healthStandard = (under65: number, over65: number) => Math.max(0, under65) * S.health.under65 + Math.max(0, over65) * S.health.age65plus;

/** Housing and utilities standard of a county for a household size (5 = five or more). Null if not loaded. */
export function housingStandard(state: string, county: string, persons: number): number | null {
  const rows = HOUSING[state];
  if (!rows) return null;
  const r = rows.find((x) => x[0] === county) ?? rows[0];
  return r[Math.min(5, Math.max(1, Math.round(persons)))] as number;
}
export function msaOf(state: string, county: string): string | null {
  const r = (HOUSING[state] ?? []).find((x) => x[0] === county);
  return r ? r[6] : null;
}
/** Operating cost standard for 1 or 2 cars: the MSA figure if the county is in one, else the census region. */
export function operatingStandard(state: string, county: string, cars: number) {
  if (cars <= 0) return 0;
  const op = S.transport.operating as Record<string, number[]>;
  const msa = msaOf(state, county);
  const region = (S.transport.stateRegion as Record<string, string>)[state] ?? 'South';
  const row = msa && op[msa] ? op[msa] : op[region];
  return row[Math.min(2, cars) - 1];
}
export const operatingArea = (state: string, county: string) => msaOf(state, county) ?? `${(S.transport.stateRegion as Record<string, string>)[state] ?? 'South'} region`;

export interface Household {
  state: string; county: string; persons: number; over65: number;
  cars: number; carPayment: number; operating: number; housingActual: number;
  healthInsurance: number; taxes: number; childCare: number; courtOrdered: number; lifeInsurance: number; other: number;
  publicTransit: boolean;
}
export interface Allowed {
  national: number; housing: number; housingStandard: number | null; ownership: number; operating: number; publicTransport: number;
  health: number; healthInsurance: number; taxes: number; childCare: number; courtOrdered: number; lifeInsurance: number; other: number; total: number;
  area: string;
}
/** Allowable monthly living expenses of a household (Form 433-A (OIC) Section 7, Form 433-F). */
export function allowable(h: Household): Allowed {
  const cars = Math.min(2, Math.max(0, Math.round(h.cars)));
  const hs = housingStandard(h.state, h.county, h.persons);
  const housing = hs === null ? h.housingActual : Math.min(h.housingActual, hs);
  const ownership = Math.min(h.carPayment, cars * S.transport.ownership[0]);
  const opStd = operatingStandard(h.state, h.county, cars);
  const operating = Math.min(h.operating, opStd);
  const publicTransport = cars === 0 || h.publicTransit ? S.transport.public : 0;
  const under65 = Math.max(0, h.persons - h.over65);
  const a = {
    national: nationalStandard(h.persons), housing, housingStandard: hs, ownership, operating, publicTransport,
    health: healthStandard(under65, h.over65), healthInsurance: h.healthInsurance, taxes: h.taxes, childCare: h.childCare,
    courtOrdered: h.courtOrdered, lifeInsurance: h.lifeInsurance, other: h.other, total: 0, area: operatingArea(h.state, h.county),
  };
  a.total = a.national + a.housing + a.ownership + a.operating + a.publicTransport + a.health + a.healthInsurance + a.taxes + a.childCare + a.courtOrdered + a.lifeInsurance + a.other;
  return a;
}
