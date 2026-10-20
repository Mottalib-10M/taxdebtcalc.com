/** Every page id the site is meant to have (id = file name = URL slug). Content tests accept links to these ids
 *  while pages are being written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  // Penalties and interest
  'irs-penalty-and-interest-calculator', 'failure-to-file-penalty', 'failure-to-pay-penalty',
  'filing-extension-and-penalties', 'first-time-penalty-abatement', 'irs-penalty-abatement', 'unfiled-tax-returns', 'back-taxes',
  // Paying over time
  'irs-payment-plan', 'irs-installment-agreement', 'short-term-payment-plan', 'irs-payment-plan-fees', 'cant-pay-taxes',
  'owe-irs-10000', 'owe-irs-50000', 'owe-irs-100000', 'partial-payment-installment-agreement', 'missed-irs-payment-plan-payment',
  // Settling and hardship
  'offer-in-compromise', 'reasonable-collection-potential', 'irs-collection-financial-standards', 'irs-housing-and-utilities-standards',
  'currently-not-collectible', 'irs-fresh-start-program', 'tax-debt-relief', 'tax-relief-companies', 'low-income-offer-in-compromise',
  // Notices and collection
  'cp14-notice', 'cp504-notice', 'cp2000-notice', 'irs-wage-garnishment', 'irs-bank-levy', 'irs-tax-lien',
  'irs-passport-revocation', 'irs-collection-statute-of-limitations',
];
export const PLANNED_IDS = new Set<string>(PLANNED_GUIDES);
