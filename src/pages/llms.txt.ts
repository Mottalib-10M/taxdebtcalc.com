/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> What an unpaid federal income tax balance costs and how to clear it, for 2026: the failure to file and failure to pay penalties of IRC 6651 with the minimum late filing penalty, interest at the IRS quarterly underpayment rates compounded daily since 2017, payment plans (short-term, Simple Payment Plan up to $50,000, set-up fees), the offer in compromise minimum computed with Form 433-A (OIC) and the IRS Collection Financial Standards of every county (effective June 29, 2026), currently not collectible status, First Time Abate and the Automatic Exemption from Penalty, wage levy exempt amounts of Publication 1494, liens, CP14, CP504 and CP2000 notices, and passport certification. Every figure read on irs.gov. Independent site published by Radif Partners; no form, no lead collection; general information, not tax advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
