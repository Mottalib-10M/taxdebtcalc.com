#!/bin/bash
# Re-downloads the IRS pages this site is built on into research/raw/ (run, then python3 scripts/build-params.py).
# The Collection Financial Standards change once a year (in force June 29, 2026 at the last run).
cd "$(dirname "$0")/../research/raw" || exit 1
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
B=https://www.irs.gov/businesses/small-businesses-self-employed
get() { curl -sL --max-time 40 -A "$UA" -o "$1" "$2"; echo "$1 $(wc -c < "$1")"; }
get collection-financial-standards.html $B/collection-financial-standards
get national-standards-food-clothing-and-other-items.html $B/national-standards-food-clothing-and-other-items
get national-standards-out-of-pocket-health-care.html $B/national-standards-out-of-pocket-health-care
get local-standards-transportation.html $B/local-standards-transportation
get local-standards-housing-and-utilities.html $B/local-standards-housing-and-utilities
mkdir -p housing
for s in $(grep -o 'small-businesses-self-employed/[a-z-]*-local-standards-housing-and-utilities' local-standards-housing-and-utilities.html | sort -u | sed 's#.*/##'); do
  get "housing/$s.html" "$B/$s"; sleep 0.3
done
get int.html https://www.irs.gov/payments/quarterly-interest-rates
get pp.html https://www.irs.gov/payments/payment-plans-installment-agreements
get ftf.html https://www.irs.gov/payments/failure-to-file-penalty
get ftp.html https://www.irs.gov/payments/failure-to-pay-penalty
get passport.html $B/revocation-or-denial-of-passport-in-cases-of-certain-unpaid-taxes
