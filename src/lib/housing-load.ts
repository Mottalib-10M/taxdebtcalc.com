/**
 * County housing standards in the browser. The page passes the rows of the calculator's default state as a
 * seed (first render identical to the static HTML); the whole table (3,223 counties) is fetched after mount.
 * The visitor's date replaces the build date at the same moment (RECETTE §17.5).
 */
import { useEffect, useState } from 'react';
import { primeHousing, type Row } from './engine/standards';
import { setToday } from './tool-specs';

let full: Promise<void> | null = null;
export const seedHousing = (seed?: string) => { if (seed) primeHousing(JSON.parse(seed) as Record<string, Row[]>); };

/** Returns a counter that changes when the full table or the visitor's date arrives (to re-run the spec). */
export function useAfterMount(housing: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const d = new Date();
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    setTick((t) => t + 1);
    if (!housing) return;
    full ??= import('../data/housing-2026.json').then((m) => primeHousing((m.default as { states: Record<string, Row[]> }).states));
    full.then(() => setTick((t) => t + 1));
  }, [housing]);
  return tick;
}
