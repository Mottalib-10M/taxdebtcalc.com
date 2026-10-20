#!/usr/bin/env python3
"""Writes src/data/params-2026.json and src/data/housing-2026.json from the IRS pages cached in research/raw/
(scripts/fetch-standards.sh downloads them again). Never edit the two JSON files by hand.

Scalar rules (penalty rates, fees, OIC allowances) are copied below from the page or form named next to each
block, as read on 2026-10-20; the interest rates, the national, health and transportation standards and the
3,223 county housing standards are parsed from the cached HTML, so a new year is: fetch, build, run the tests.
"""
import glob, html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'research', 'raw')
RETRIEVED = '2026-10-20'


def text(name):
    t = open(os.path.join(RAW, name), encoding='utf-8', errors='ignore').read()
    m = re.search(r'<main.*?</main>', t, re.S)
    t = m.group(0) if m else t
    t = re.sub(r'<(script|style|noscript).*?</\1>', '', t, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', t)
    return re.sub(r'\s+', ' ', html.unescape(t))


def money(s):
    return int(s.replace('$', '').replace(',', ''))


def need(cond, msg):
    if not cond:
        sys.exit('build-params: ' + msg)


# ---------- Effective date of the Collection Financial Standards ----------
cfs = text('collection-financial-standards.html')
m = re.search(r'These Standards are effective on ([A-Z][a-z]+ \d{1,2}, \d{4})', cfs)
need(m, 'effective date of the standards not found')
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
mo, d, y = re.match(r'([A-Za-z]+) (\d+), (\d+)', m.group(1)).groups()
CFS_EFFECTIVE = f'{y}-{MONTHS.index(mo) + 1:02d}-{int(d):02d}'

# ---------- National standards: food, clothing and other items ----------
ns = text('national-standards-food-clothing-and-other-items.html')
rows = {}
for label in ['Food', 'Housekeeping supplies', 'Apparel & services', 'Personal care products & services', 'Miscellaneous', 'Total']:
    m = re.search(re.escape(label) + r' \$([\d,]+) \$([\d,]+) \$([\d,]+) \$([\d,]+)', ns)
    need(m, f'national standard row {label} not found')
    rows[label] = [money(x) for x in m.groups()]
m = re.search(r'For each additional person, add to four-person total allowance: \$([\d,]+)', ns)
need(m, 'additional person amount not found')
national = {
    'food': rows['Food'], 'housekeeping': rows['Housekeeping supplies'], 'apparel': rows['Apparel & services'],
    'personalCare': rows['Personal care products & services'], 'misc': rows['Miscellaneous'], 'total': rows['Total'],
    'additionalPerson': money(m.group(1)),
}
need(sum(national[k][0] for k in ['food', 'housekeeping', 'apparel', 'personalCare', 'misc']) == national['total'][0], 'national standard total mismatch')

# ---------- Out-of-pocket health care ----------
hc = text('national-standards-out-of-pocket-health-care.html')
m = re.search(r'Under 65 \$([\d,]+) 65 and older \$([\d,]+)', hc)
need(m, 'health care standard not found')
health = {'under65': money(m.group(1)), 'age65plus': money(m.group(2))}

# ---------- Transportation ----------
tr = text('local-standards-transportation.html')
m = re.search(r'Public transportation Location Allowed amount National \$([\d,]+)', tr)
need(m, 'public transportation not found')
public = money(m.group(1))
m = re.search(r'Ownership costs Location One car Two cars National \$([\d,]+) \$([\d,]+)', tr)
need(m, 'ownership costs not found')
ownership = [money(m.group(1)), money(m.group(2))]
operating = {}
REGIONS = {'Northeast': 'Northeast region', 'Midwest': 'Midwest region', 'South': 'South region', 'West': 'West region'}
MSAS = {
    'Northeast': ['Boston', 'New York', 'Philadelphia'],
    'Midwest': ['Chicago', 'Cleveland', 'Detroit', 'Minneapolis-St. Paul', 'St. Louis'],
    'South': ['Atlanta', 'Baltimore', 'Dallas-Ft. Worth', 'Houston', 'Miami', 'Tampa', 'Washington, D.C.'],
    'West': ['Anchorage', 'Denver', 'Honolulu', 'Los Angeles', 'Phoenix', 'San Diego', 'San Francisco', 'Seattle'],
}
for reg, lab in REGIONS.items():
    m = re.search(re.escape(lab) + r' \$([\d,]+) \$([\d,]+)', tr)
    need(m, f'operating costs {lab} not found')
    operating[reg] = [money(m.group(1)), money(m.group(2))]
    for msa in MSAS[reg]:
        m = re.search(r'(?<![A-Za-z])' + re.escape(msa) + r' \$([\d,]+) \$([\d,]+)', tr)
        need(m, f'operating costs {msa} not found')
        operating[msa] = [money(m.group(1)), money(m.group(2))]

# Census regions and MSA county lists (the "MSA definitions by census region" table of the same page).
STATE_REGION = {}
for reg in ['Northeast', 'Midwest', 'South', 'West']:
    m = re.search(reg + r' Census Region ?: ([A-Za-z ,.]+?) MSA Counties', tr)
    need(m, f'states of {reg} not found')
    for st in [s.strip() for s in m.group(1).split(',')]:
        STATE_REGION[st] = reg
need(len(STATE_REGION) == 51, f'{len(STATE_REGION)} states mapped to a region, 51 expected')
defs = tr[tr.index('MSA definitions by census region'):tr.index('For the 2019-2024 ALE updates')]
ABBR = {'MA': 'Massachusetts', 'NH': 'New Hampshire', 'NY': 'New York', 'NJ': 'New Jersey', 'PA': 'Pennsylvania', 'DE': 'Delaware', 'MD': 'Maryland',
        'IL': 'Illinois', 'IN': 'Indiana', 'OH': 'Ohio', 'MI': 'Michigan', 'MN': 'Minnesota', 'WI': 'Wisconsin', 'MO': 'Missouri', 'GA': 'Georgia',
        'TX': 'Texas', 'FL': 'Florida', 'DC': 'District of Columbia', 'VA': 'Virginia', 'WV': 'West Virginia', 'AK': 'Alaska', 'CO': 'Colorado',
        'HI': 'Hawaii', 'CA': 'California', 'AZ': 'Arizona', 'WA': 'Washington'}
msa_counties = {}  # (state, county name as written by the IRS) -> msa
names = [n for r in MSAS.values() for n in r]
pat = r'(' + '|'.join(re.escape(n) for n in sorted(names, key=len, reverse=True)) + r') (?=[A-Z]{2}: )'
chunks = re.split(pat, defs)
for i in range(1, len(chunks), 2):
    msa, body = chunks[i], chunks[i + 1]
    for ab, lst in re.findall(r'\b([A-Z]{2}): (.+?)(?= [A-Z]{2}: |$| [A-Z][a-z]+ Census Region| MSA Counties)', body):
        for c in lst.split(','):
            c = c.strip()
            if c:
                msa_counties[(ABBR[ab], c)] = msa
need(len(msa_counties) > 200, f'only {len(msa_counties)} MSA counties parsed')
need(set(msa_counties.values()) == set(names), 'an MSA has no county')

# ---------- Housing and utilities, county by county ----------
def norm(s):
    s = s.lower().replace('’', "'").replace("'s", '').replace('saint ', 'st. ').replace('.', '')
    return re.sub(r'\s+', ' ', s).strip()

housing = {}
matched = set()
for f in sorted(glob.glob(os.path.join(RAW, 'housing', '*.html'))):
    raw = open(f, encoding='utf-8', errors='ignore').read()
    need('2026 Published ALE' in raw, f'{os.path.basename(f)} is not the 2026 table')
    slug = os.path.basename(f).replace('-local-standards-housing-and-utilities.html', '')
    state = ' '.join(w.capitalize() if w != 'of' else w for w in slug.split('-'))
    counties = []
    for r in re.findall(r'<tr[^>]*>(.*?)</tr>', raw, re.S):
        cells = [html.unescape(re.sub(r'<[^>]+>', '', c)).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.S)]
        if len(cells) == 6 and cells[1].startswith('$'):
            name = cells[0]
            msa = None
            for (st, c), ms in msa_counties.items():
                if st != state:
                    continue
                a, b = norm(c), norm(name)
                # "Baltimore county" / "Baltimore city" must not swap; plain names match "X County", "X Parish", "X Municipality".
                if b == a or (not re.search(r' (county|city)$', a) and re.sub(r" (county|parish|borough|municipality|city and borough|census area|planning region)$", '', b) == a):
                    msa = ms; matched.add((st, c))
            counties.append([name, *[money(x) for x in cells[1:]], msa])
    need(counties, f'no county in {slug}')
    housing[state] = counties
need(sum(len(v) for v in housing.values()) > 3000, 'fewer than 3,000 counties')
missing = [k for k in msa_counties if k not in matched]
need(not missing, f'MSA counties without a housing row: {missing}')

# ---------- Quarterly underpayment interest rates ----------
it = text('int.html')
rates = {}
for y, q4, q3, q2, q1 in re.findall(r'(\d{4}) interest rates by category .*? Underpayment \([Cc]orporate and [Nn]on-[Cc]orporate\) (\d+)% (\d+)% (\d+)% (\d+)%', it):
    for q, r in zip([4, 3, 2, 1], [q4, q3, q2, q1]):
        rates[f'{y}-Q{q}'] = int(r) / 100
need('2026-Q4' in rates and '2017-Q1' in rates, 'interest table incomplete')
need(rates['2026-Q4'] == 0.07, '2026-Q4 underpayment rate is not 7%')

# ---------- Penalties (failure to file, failure to pay) ----------
ftf = text('ftf.html')
mins = re.findall(r'(After 12/31/\d{4}|\d{2}/\d{2}/\d{4} to \d{2}/\d{2}/\d{4}) \$([\d,]+\.\d\d)', ftf.split('Forms 1040 and 1120 minimum failure to file penalty')[1][:600])
need(len(mins) >= 7, 'minimum FTF table not found')
ftf_min = []
for period, amt in mins:
    if period.startswith('After'):
        start = f'{int(period[-4:]) + 1}-01-01'
    else:
        a = period.split(' to ')[0]
        start = f'{a[6:10]}-{a[0:2]}-{a[3:5]}'
    ftf_min.append({'dueFrom': start, 'amount': float(amt.replace(',', ''))})
ftf_min.sort(key=lambda r: r['dueFrom'])
need(ftf_min[-1]['amount'] == 525.0, 'minimum FTF for 2026 returns is not $525')

pp = text('pp.html')
for frag in ['Apply online: $29 setup fee', 'Apply by phone, mail, or in-person: $107 setup fee', 'Apply online: $69 setup fee',
             'Apply by phone, mail, or in-person: $178 setup fee', 'Low income : Apply online, by phone, or in-person: $43 setup fee',
             'You owe $50,000 or less in combined tax, penalties and interest', 'You owe less than $100,000 in combined tax, penalties and interest',
             'Pay amount owed in 180 days or less']:
    need(frag in pp, f'payment plan page no longer says: {frag}')

pa = text('passport.html')
passport = {y: money(a) for y, a in re.findall(r'(20\d\d) \$([\d,]+)', pa.split('Threshold amount')[1][:400])}
need(passport.get('2026') == 66000, 'passport threshold 2026 is not $66,000')

SOURCES = {
    'cfs': ('https://www.irs.gov/businesses/small-businesses-self-employed/collection-financial-standards', 'IRS, Collection Financial Standards (effective June 29, 2026)'),
    'national': ('https://www.irs.gov/businesses/small-businesses-self-employed/national-standards-food-clothing-and-other-items', 'IRS, National Standards: food, clothing and other items'),
    'health': ('https://www.irs.gov/businesses/small-businesses-self-employed/national-standards-out-of-pocket-health-care', 'IRS, National Standards: out-of-pocket health care'),
    'housing': ('https://www.irs.gov/businesses/small-businesses-self-employed/local-standards-housing-and-utilities', 'IRS, Local Standards: housing and utilities, by county'),
    'transport': ('https://www.irs.gov/businesses/small-businesses-self-employed/local-standards-transportation', 'IRS, Local Standards: transportation'),
    'rates': ('https://www.irs.gov/payments/quarterly-interest-rates', 'IRS, Quarterly interest rates (underpayment rate by quarter)'),
    'interest': ('https://www.irs.gov/payments/interest', 'IRS, Interest: when it is charged and how it stops'),
    'ftf': ('https://www.irs.gov/payments/failure-to-file-penalty', 'IRS, Failure to file penalty'),
    'ftp': ('https://www.irs.gov/payments/failure-to-pay-penalty', 'IRS, Failure to pay penalty'),
    'irc6651': ('https://www.law.cornell.edu/uscode/text/26/6651', '26 U.S. Code § 6651, failure to file tax return or to pay tax'),
    'irc6621': ('https://www.law.cornell.edu/uscode/text/26/6621', '26 U.S. Code § 6621, determination of rate of interest'),
    'irc6622': ('https://www.law.cornell.edu/uscode/text/26/6622', '26 U.S. Code § 6622, interest compounded daily'),
    'irc6159': ('https://www.law.cornell.edu/uscode/text/26/6159', '26 U.S. Code § 6159, agreements for payment of tax liability in installments'),
    'irc6502': ('https://www.law.cornell.edu/uscode/text/26/6502', '26 U.S. Code § 6502, collection after assessment (10 years)'),
    'irc7122': ('https://www.law.cornell.edu/uscode/text/26/7122', '26 U.S. Code § 7122, compromises'),
    'irc6331': ('https://www.law.cornell.edu/uscode/text/26/6331', '26 U.S. Code § 6331, levy and distraint'),
    'irc6662': ('https://www.law.cornell.edu/uscode/text/26/6662', '26 U.S. Code § 6662, accuracy-related penalty'),
    'irc7345': ('https://www.law.cornell.edu/uscode/text/26/7345', '26 U.S. Code § 7345, revocation or denial of passport'),
    'plans': ('https://www.irs.gov/payments/payment-plans-installment-agreements', 'IRS, Payment plans (installment agreements): costs and fees'),
    'simple': ('https://www.irs.gov/payments/simple-payment-plans-for-individuals-and-businesses', 'IRS, Simple Payment Plans for individuals and businesses'),
    'f9465': ('https://www.irs.gov/forms-pubs/about-form-9465', 'IRS, About Form 9465, Installment Agreement Request'),
    'oic': ('https://www.irs.gov/payments/offer-in-compromise', 'IRS, Offer in compromise'),
    'f656b': ('https://www.irs.gov/pub/irs-pdf/f656b.pdf', 'IRS, Form 656-B booklet with Form 656 and Form 433-A (OIC), Rev. 4-2026 (PDF)'),
    'prequal': ('https://irs.treasury.gov/oic_pre_qualifier/', 'IRS, Offer in Compromise Pre-Qualifier tool'),
    'fta': ('https://www.irs.gov/payments/penalty-relief-due-to-first-time-abate-or-other-administrative-waiver', 'IRS, First Time Abate and the Automatic Exemption from Penalty'),
    'cnc': ('https://www.irs.gov/businesses/small-businesses-self-employed/temporarily-delay-the-collection-process', 'IRS, Temporarily delay the collection process (currently not collectible)'),
    'csed': ('https://www.irs.gov/filing/time-irs-can-collect-tax', 'IRS, Time IRS can collect tax (collection statute expiration date)'),
    'lien': ('https://www.irs.gov/businesses/small-businesses-self-employed/understanding-a-federal-tax-lien', 'IRS, Understanding a federal tax lien'),
    'levy': ('https://www.irs.gov/businesses/small-businesses-self-employed/what-is-a-levy', 'IRS, What is a levy'),
    'p1494': ('https://www.irs.gov/pub/irs-pdf/p1494.pdf', 'IRS, Publication 1494 (Rev. 12-2025): amounts exempt from levy on wages in 2026 (PDF)'),
    'p594': ('https://www.irs.gov/pub/irs-pdf/p594.pdf', 'IRS, Publication 594, The IRS collection process (PDF)'),
    'passport': ('https://www.irs.gov/businesses/small-businesses-self-employed/revocation-or-denial-of-passport-in-cases-of-certain-unpaid-taxes', 'IRS, Revocation or denial of passport for seriously delinquent tax debt'),
    'cp14': ('https://www.irs.gov/individuals/understanding-your-cp14-notice', 'IRS, Understanding your CP14 notice'),
    'cp504': ('https://www.irs.gov/individuals/understanding-your-cp504-notice', 'IRS, Understanding your CP504 notice'),
    'cp2000': ('https://www.irs.gov/individuals/understanding-your-cp2000-series-notice', 'IRS, Understanding your CP2000 series notice'),
    'taxdebt': ('https://www.irs.gov/payments/get-help-with-tax-debt', 'IRS, Get help with tax debt'),
    'tas': ('https://www.taxpayeradvocate.irs.gov/', 'Taxpayer Advocate Service (independent office within the IRS)'),
}

# Extra official sources added while writing pages: scripts/sources-*.json, {"key": ["url", "label"]}.
import glob as _glob
for _f in sorted(_glob.glob(os.path.join(ROOT, 'scripts', 'sources-*.json'))):
    for _k, (_u, _l) in json.load(open(_f)).items():
        assert _k not in SOURCES, f'{_f}: source key {_k} already exists'
        assert _u.startswith('https://') and any(d in _u for d in ('irs.gov', 'irs.treasury.gov', 'law.cornell.edu', 'govinfo.gov', 'uscode.house.gov', 'taxpayeradvocate.irs.gov', 'travel.state.gov', 'consumer.ftc.gov', 'ftc.gov')), f'{_f}: {_u} is not an official source'
        SOURCES[_k] = (_u, _l)

params = {
    'meta': {'retrieved_at': RETRIEVED, 'valid_from': '2026-01-01', 'valid_to': '2026-12-31', 'source': 'irs.gov pages, forms and publications listed in sources'},
    'interest': {
        'rates': dict(sorted(rates.items())), 'current': '2026-Q4', 'currentRate': rates['2026-Q4'],
        'nextQuarter': {'id': '2027-Q1', 'status': 'upcoming', 'expected': 'announced by the IRS in November 2026, set at the federal short-term rate plus 3 points (IRC 6621)'},
        'compounding': 'daily',
    },
    'ftf': {'monthly': 0.05, 'max': 0.25, 'minimumAfterDays': 60, 'minimum': ftf_min},
    'ftp': {'monthly': 0.005, 'withPlan': 0.0025, 'afterLevyNotice': 0.01, 'max': 0.25, 'noticeDays': 21, 'noticeDaysLarge': 10, 'largeAmount': 100000},
    'plans': {
        'shortTermDays': 180, 'shortTermMax': 100000, 'onlineLongTermMax': 50000, 'simpleMax': 50000, 'simpleTrustFundMax': 25000,
        'guaranteedMaxTax': 10000, 'guaranteedYears': 3, 'csedYears': 10,
        'fees': {'ddiaOnline': 29, 'ddiaOther': 107, 'ddiaLowIncome': 0, 'otherOnline': 69, 'otherOther': 178, 'otherLowIncome': 43, 'reviseOnline': 6, 'reviseOther': 89},
        'lowIncomePovertyMultiple': 2.5,
    },
    'oic': {
        'fee': 205, 'lumpSumDeposit': 0.2, 'lumpSumMonths': 5, 'periodicMinMonths': 6, 'periodicMaxMonths': 24,
        'multiplierLumpSum': 12, 'multiplierPeriodic': 24, 'quickSale': 0.8, 'bankAllowance': 1000, 'vehicleAllowance': 3450,
        'personalEffects': 11980, 'complianceYears': 5, 'autoAcceptYears': 2, 'formRevision': '4-2026',
        'lowIncome': {'base': [39900, 54100, 68300, 82500, 96700, 110900, 125100, 139300], 'add': 14200,
                      'alaska': [49875, 67625, 85375, 103125, 120875, 138625, 156375, 174125], 'alaskaAdd': 17750,
                      'hawaii': [45900, 62225, 78550, 94875, 111200, 127525, 143850, 160175], 'hawaiiAdd': 16325},
    },
    'standards': {
        'effective': CFS_EFFECTIVE, 'national': national, 'health': health,
        'transport': {'public': public, 'ownership': ownership, 'operating': operating, 'stateRegion': STATE_REGION},
    },
    'levy': {
        'year': 2026, 'standardDeduction': {'single': 16100, 'mfj': 32200, 'hoh': 24150, 'mfs': 16100}, 'perDependent': 5300,
        'additional': {'unmarried': 2050, 'married': 1650}, 'periods': {'daily': 260, 'weekly': 52, 'biweekly': 26, 'semimonthly': 24, 'monthly': 12},
        'examples': [{'status': 'single', 'period': 'weekly', 'deps': 3, 'exempt': 615.38}, {'status': 'mfj', 'period': 'biweekly', 'deps': 2, 'exempt': 1646.16}],
    },
    'passport': passport,
    'aep': {'from': 'summer 2026', 'firstTaxYear': 2025, 'lookbackYears': 3},
    'cp2000': {'accuracyPenalty': 0.2, 'understatementShare': 0.1, 'understatementFloor': 5000},
    'sources': {k: {'url': u, 'label': {'en': l}, 'retrieved_at': RETRIEVED} for k, (u, l) in SOURCES.items()},
}

out = os.path.join(ROOT, 'src', 'data')
json.dump(params, open(os.path.join(out, 'params-2026.json'), 'w'), indent=1, ensure_ascii=False)
json.dump({'effective': CFS_EFFECTIVE, 'columns': ['county', 'p1', 'p2', 'p3', 'p4', 'p5', 'msa'], 'states': housing},
          open(os.path.join(out, 'housing-2026.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
print(f'params-2026.json: standards effective {CFS_EFFECTIVE}, {len(rates)} quarters, {len(msa_counties)} MSA counties')
print(f'housing-2026.json: {sum(len(v) for v in housing.values())} counties in {len(housing)} states and territories')
