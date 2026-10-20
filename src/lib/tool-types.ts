/** Declarative calculators (src/lib/tool-specs.ts), rendered by components/calc/SpecTool.tsx. */
export type V = Record<string, number | string>;
export interface Opt { value: string; label: string }
export interface NumIn { kind?: 'num'; id: string; label: string; def: number; unit?: string; max?: number; decimals?: number; help?: string; adv?: boolean; wide?: boolean }
export interface ChoiceIn { kind: 'choice'; id: string; label: string; def: string; options: Opt[]; help?: string; adv?: boolean; wide?: boolean }
export interface SelectIn {
  kind: 'select'; id: string; label: string; def: string; options: Opt[]; help?: string; adv?: boolean; wide?: boolean;
  /** Options that depend on other fields (county list of the chosen state). */
  optionsFor?: (v: V) => Opt[];
}
export type Input = NumIn | ChoiceIn | SelectIn;
export interface ToolOut {
  label: string; value: string; sub?: string;
  rows: Array<[string, string, number?]>;
  table?: { caption?: string; headers: string[]; rows: string[][]; align?: Array<'l' | 'r'> };
  note?: string;
}
export interface ToolSpec {
  inputs: Input[];
  run: (v: V) => ToolOut;
  /** The calculator reads the county housing standards (loaded in the browser after the first render). */
  housing?: boolean;
}
