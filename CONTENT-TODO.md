# CONTENT-TODO — facts, assets, and decisions needed from Hunting

Everything on this list requires Hunting's input or verification before the
September launch. Nothing on the live site should depend on an unresolved
item here.

## 🔴 Blocking launch

- [ ] **Utah contractor license number** — site makes zero licensing claims
      until `licenseActive: true` + number are set in
      `src/config/business.ts`. Verify issuance at DOPL first.
- [ ] **Insurance wording** — `insuranceClaimApproved` is true in config,
      but "insured" language is currently held back until it can appear
      alongside licensing. Confirm carrier/coverage and the exact phrase
      Hunting wants (e.g., "licensed and insured").
- [ ] **Attorney review of /privacy-policy/ and /terms/** — drafts are
      plain-English placeholders; both pages carry an effective date that
      must be updated at approval.
- [ ] **Form endpoint decision** — confirm Resend (or alternative) as the
      mail provider and create the account; see
      `src/server/contact/endpoint.example.ts`.
- [ ] **Response-time commitment** — the site intentionally avoids
      promising "we respond within X hours." Decide if Hunting wants to
      commit to one publicly (contact + thank-you pages are the spots).

## 🟠 Facts to verify before adding (currently omitted on purpose)

- [ ] **City permitting specifics** — Saratoga Springs, Lehi, Herriman,
      and county cities each have editorial notes (search
      `EDITORIAL NOTE` in `src/pages/`) marking where verified
      building-department info (process, fees, timelines) could be added.
      Do not publish until confirmed with each city.
- [ ] **Lehi accessory-apartment rules** — the Lehi FAQ deliberately
      defers; verify city ordinance before saying anything specific.
- [ ] **Warranty terms** — no workmanship-warranty claim exists on the
      site yet. Decide the offering (e.g., 1-year workmanship) and where
      it appears.
- [ ] **Payment schedule specifics** — copy says "milestone-based" only.
      Confirm the actual structure before adding detail.
- [ ] **Founding date** — omitted from schema (`foundingDate`) until
      Hunting confirms the LLC registration date he wants public.
- [ ] **Price range** — schema `priceRange` omitted; add only if Hunting
      wants a public range.

## 🟡 Assets needed (see ASSET-GUIDE.md for full shot list)

- [ ] Professional owner portrait (About page placeholder waiting)
- [ ] Owner-in-construction-environment photo
- [ ] Hero: finished basement photo (currently labeled placeholder)
- [ ] Before/after matched-angle basement pair (slider uses placeholders)
- [ ] Service photos: bathroom, bedroom, wet bar, entertainment space
- [ ] Progress photos: framing, rough electrical, plumbing, drywall, trim, flooring
- [ ] Utah exterior/neighborhood context shot
- [ ] Confirm continued use of the current family photo (already live on
      home + about) or supply a preferred one
- [ ] Final logo files if the wordmark should be replaced by artwork
      (current header/footer use a styled text wordmark derived from
      `reference-assets/`)

## 🟢 Business decisions (non-blocking but soon)

- [ ] **Social profiles** — create Instagram/Facebook/TikTok/YouTube as
      desired; add URLs to `socialMediaURLs` in `business.ts` (footer +
      schema pick them up automatically).
- [ ] **Google Business Profile** — create/claim, then set
      `googleBusinessProfileURL` in config.
- [ ] **Analytics accounts** — GA4 property, Google Ads, Meta Pixel; see
      ANALYTICS-SETUP.md.
- [ ] **Call tracking** — decide whether to use a tracking number later
      (ANALYTICS-SETUP.md covers the tradeoffs re: NAP consistency).
- [ ] **Testimonial permission form** — draft a simple photo/testimonial
      release for future clients (needed before the Projects gallery can
      show anything).
- [ ] **Email deliverability** — set up SPF/DKIM/DMARC for
      huntingtanner.com when the mail provider is chosen.

## Copy items marked in source

Search the codebase for `EDITORIAL NOTE` — each marks a spot where a
verifiable fact could strengthen the page once confirmed. None are visible
to site visitors.
