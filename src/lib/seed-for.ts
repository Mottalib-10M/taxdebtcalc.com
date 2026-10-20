/** Build side: the housing seed of a calculator (rows of its default state), or nothing if it does not use them. */
import { getTool } from './tool-specs';
import { housingSeed } from './housing-seed';
export function seedFor(kind: string, arg?: Record<string, number | string>) {
  const spec = getTool(kind, arg);
  if (!spec.housing) return undefined;
  const st = spec.inputs.find((i) => i.id === 'st');
  return housingSeed(String(st?.def ?? 'California'));
}
