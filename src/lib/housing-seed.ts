/** Build side: the housing rows of one state, passed to a calculator island as its seed. */
import H from '../data/housing-2026.json';
const ALL = H.states as Record<string, unknown[]>;
export const housingSeed = (state: string) => JSON.stringify({ [state]: ALL[state] ?? [] });
