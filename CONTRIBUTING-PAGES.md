# Écrire une page de Tax Debt Calc (us-irs-tax-debt)

Notice pour les agents qui écrivent les pages. Lis-la en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §5, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

**Le site** chiffre une dette d'impôt fédéral sur le revenu aux États-Unis, en 2026 : pénalités de retard de dépôt et de paiement (IRC § 6651), intérêts aux taux trimestriels composés chaque jour, plans de paiement (court terme, Simple Payment Plan, frais), offer in compromise (Form 433-A (OIC), Collection Financial Standards du comté), currently not collectible, levée des pénalités (First Time Abate, Automatic Exemption from Penalty), avis CP14, CP504, CP2000, saisie sur salaire (Publication 1494), privilège (lien), passeport, délai de recouvrement de 10 ans.

Anglais américain seulement, sous `/en/`. Éditeur : **Radif Partners** (jamais le nom d'une personne).

**L'angle** : les premiers résultats Google sont des articles sans calcul ou des pages de cabinets « tax relief » qui collectent un nom et un téléphone (« free consultation »). Ce site donne tout de suite, sans contact, le chiffre que le cabinet garde pour l'appel. Rapport SERP : `~/Documents/GitHub/reports/us-irs-tax-debt-serp-2026-10-20.md`.

## Interdits

- Jamais « IRS » ni un nom d'administration dans le nom du site ; le site ne se présente jamais comme l'IRS.
- **Aucun conseil fiscal personnalisé** (« you should », « we recommend ») : on décrit la règle et on chiffre des exemples. Chaque page rappelle à sa façon que l'IRS décide (pas un conseil fiscal).
- **Aucun lien vers un cabinet**, un avocat, un prêteur, une société de « debt settlement », un éditeur de logiciel. Aucun nom de cabinet. Aucun lien vers un site du portefeuille (`~/Documents/GitHub/a-publier/Mottalib-10M/_trame/domaines-ovh.txt`), en particulier taxyearcalc.com et solotaxdesk.com.
- Pas de page « IRS interest rates » (taxyearcalc.com la couvre) ni « estimated tax penalty » (solotaxdesk.com).
- Liens externes : seulement des sources officielles (irs.gov, irs.treasury.gov, taxpayeradvocate.irs.gov, law.cornell.edu ou uscode.house.gov pour le Code, travel.state.gov, ftc.gov), par `h.src(clé)` ou `h.ext(url, texte)`. Pour une nouvelle source : ajoute-la dans TON fichier `scripts/sources-a.json` ou `scripts/sources-b.json` (`{"cle": ["https://…", "IRS, titre de la page"]}`), puis `python3 scripts/build-params.py`. Lis la page (curl) avant de la citer.
- **Un chiffre incertain ne se publie pas.** Tout montant ($) et tout taux (%) vient du kit (`K.…`) ou d'un calcul du moteur. Jamais un montant ni un taux tapé à la main. Les durées (« 30 days », « 10 years ») peuvent s'écrire si elles sont lues dans un texte de `research/text/` ou une page officielle que tu as lue. Si une page a besoin d'un montant absent de `params-2026.json` (par exemple un seuil de lien), **ne l'écris pas** : décris la règle sans le chiffre et signale-le dans ton compte rendu.
- Pas de tiret long ni demi-long, aucune tournure bannie de `tests/pages.test.ts`. Le mot « guaranteed » est banni : pour le « guaranteed installment agreement », écris « the installment agreement the IRS must accept (section 6159(c)) ».
- Ne modifie que tes fichiers de pages, ton fichier `scripts/sources-?.json`. Ne touche ni au moteur, ni à `tool-specs.ts`, ni à `kit.ts`, ni aux pages de l'autre agent. Si un calculateur ou le kit te manque, dis-le dans ton compte rendu.

## D'où viennent les chiffres

`src/data/params-2026.json`, écrit par `scripts/build-params.py` (ne jamais éditer le JSON à la main). Les textes officiels lus le 2026-10-20 sont dans `research/text/*.txt` (pp = payment plans, simple, ftf, ftp, fta (FTA et AEP), int et interest, cnc, csed, lien, levy, cp14, cp504, cp2000, oic, passport, collection-financial-standards, national-standards…, local-standards…) et `research/raw/f656b.txt`, `f433aoic.txt`, `p1494.txt`. **Lis le texte du sujet avant d'écrire une règle.**

| Bloc | Contenu |
|---|---|
| `interest` | `rates` par trimestre 2017-Q1 à 2026-Q4, `current`, `currentRate`, `nextQuarter.expected` (texte « à venir ») |
| `ftf` | 5 % par mois, plafond 25 %, minimum après 60 jours par année d'échéance (`K.ftfMinimum(due)`) |
| `ftp` | 0,5 %, 0,25 % en plan, 1 % après avis de saisie, plafond 25 % |
| `plans` | court terme 180 jours et < 100 000 $, Simple ≤ 50 000 $, 10 ans (`csedYears`), frais (`fees.ddiaOnline`…), `guaranteedMaxTax`, `guaranteedYears` |
| `oic` | frais 205 $, 20 %, ×12 / ×24, 80 %, 1 000 $, 3 450 $, 11 980 $, `lowIncome` (tables 250 % du seuil de pauvreté, base, Alaska, Hawaï), `formRevision` |
| `standards` | `effective` 2026-06-29, `national`, `health`, `transport` (ownership, operating par région et MSA, public) ; logement par comté dans `housing-2026.json` |
| `levy` | Publication 1494 2026 : déductions standard, 5 300 $ par personne à charge, périodes |
| `passport` | seuils 2018 à 2026 (2026 : 66 000 $) |
| `aep`, `cp2000` | AEP dès l'été 2026 pour les déclarations 2025 et suivantes ; pénalité de 20 %, test 10 % / 5 000 $ |
| `sources` | clés citables par `h.src` |

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`), id = slug = nom du fichier | `/en/<slug>/` |

Liste des pages : `src/lib/planned.ts`. **Modèle (copier la structure, jamais les phrases)** : `src/content/guides/irs-payment-plan.ts`.

Champs :
- `group` : `penalties`, `plans`, `settle` ou `collection` ; `order` : celui qu'on t'attribue.
- `title` : 50 à 60 caractères, terme-clé en tête (« IRS Payment Plan 2026: … », « Offer in Compromise 2026: … »), jamais une question ni « Calculator » en premier mot, contient 2026.
- `description` : 150 à 160 caractères (après rendu : `K.pct` donne « 7 % » avec espace insécable, compte-le), contient 2026.
- `facts` : 2 à 4 paires [libellé, valeur] tirées du kit.
- `resume` : un paragraphe de 120 mots ou plus, la réponse directe avec les chiffres.
- `body` : 650 mots de prose ou plus, au moins un `h.mini`, au moins un tableau, au moins une source officielle.
- `faqs` : 3 à 8 questions, réponses de 40 à 90 mots, question unique sur tout le site (vérifie avec `grep -rn "q: '" src/content`).
- `tool` et `toolArg` : une clé de `src/lib/tool-specs.ts` : `debt` (tax, ty, fs, pm, lv), `ftf` (tax, dl, pd), `ftp` (tax, mo, rt), `plan` (bal, mo, how, apply, taxp, ot, li), `expenses` (st, co, hh, inc, rent, cars, cp, op, hi, tx, cc, o65), `oic` (bal, st, co, hh, inc, hv, hl, rent…), `levy` (pay, per, fs, dep, add), `relief` (ty, h3, pp, pen, mo), `cp2000` (add, shown, ty, pm), `passport` (bal, stt, lien), `years` (y25…y21, fl), `diy` (bal, cap, fee). Les valeurs de `select` sont des chaînes (`mo: '36'`, `ty: '2024'`). Pour `st`/`co`, le nom exact de l'État et du comté tels que dans `housing-2026.json` (« Cook County », « Baltimore city »).
- `h.mini(kind, { t, p: [ids], d: {…} })` : 1 ou 2 champs, des valeurs par défaut propres à la page.
- `related` : 3 à 6 ids de `planned.ts`.

## Le kit

```ts
import { KIT as K } from '../../lib/kit';
K.P, K.S                                // params, standards
K.tool(kind, args)                      // lance un calculateur, renvoie sa carte {label, value, rows, …}
K.plan(balance, months, filedOnTime?)   // {monthly, interest, ftp, totalPaid, endDate, months, paid}
K.debt(tax, untilIso, filedLateDays|null, due?) // projectDebt : {ftf, ftp, interest, total, ftfMonths, …}
K.projectDebt, K.interestOn(amount, from, to), K.ftfMinimum(due), K.DUE_DATES[2025], K.rateOn(iso)
K.allowable({...}), K.nationalStandard(n), K.housingStandard(state, county, n), K.operatingStandard(state, county, cars), K.msaOf
K.assetEquity({...}), K.rcp(equity, rmi), K.lowIncomeLimit(n, 'base'|'alaska'|'hawaii'), K.upfront(offer, 'lump'|'periodic')
K.exemptAmount(status, period, deps), K.levyTake(pay, status, period, deps)
K.setupFee(debit, online, lowIncome), K.planOptions(balance, tax)
K.usd, K.usd2 (cents), K.pct, K.num, K.day(iso) "October 20, 2026", K.month(iso) "October 2026", K.rate('2026-Q4') "7 %", K.quarter('2026-Q4') "fourth quarter of 2026", K.today (date de build)
```

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-irs-tax-debt
PAGE_FILES=<id>,<id> npx vitest run tests/pages.test.ts
python3 scripts/sim-pages.py        # similarité entre pages (≤ 30 %), après le test pages
```

Pas de `npm run build`, pas de serveur, pas de Playwright, pas de commit : le coordinateur s'en charge.
