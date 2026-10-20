/** Every calculator runs on its defaults and on a few edge values without NaN. */
import { describe, expect, it } from 'vitest';
import { getTool, TOOL_KINDS } from '../src/lib/tool-specs';
import H from '../src/data/housing-2026.json';
import { primeHousing } from '../src/lib/engine/standards';
primeHousing(H.states as never);

describe('tools', () => {
  for (const k of TOOL_KINDS) it(k, () => {
    const spec = getTool(k);
    const d = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
    for (const over of [{}, ...spec.inputs.filter((i) => !i.kind || i.kind === 'num').map((i) => ({ [i.id]: 0 })), ...spec.inputs.filter((i) => !i.kind || i.kind === 'num').map((i) => ({ [i.id]: 'max' in i && i.max ? i.max : 1e8 }))]) {
      const out = spec.run({ ...d, ...over });
      const all = JSON.stringify(out);
      expect(all, `${k} ${JSON.stringify(over)}`).not.toMatch(/NaN|undefined|Infinity/);
    }
  });
});
