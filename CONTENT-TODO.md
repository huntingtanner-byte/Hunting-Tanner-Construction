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
- [x] **Resend account + API key** — DONE 2026-07-30. Account registered
      under office@huntingtanner.com; RESEND_API_KEY set in Vercel
      (Production + Preview, sensitive). End-to-end test confirmed
      "Delivered" in the Resend dashboard.
- [ ] **Verify huntingtanner.com in Resend + set RESEND_FROM** — until this
      is done, lead emails send from onboarding@resend.dev, which lands in
      spam far more often. Add the DNS records Resend provides, then set
      RESEND_FROM="HTC Website <leads@huntingtanner.com>" in Vercel.
      Required before launch.
- [ ] **Response-time commitment** — the site intentionally avoids
      promising "we respond within X hours." Decide if Hunting wants to
      commit to one publicly (contact + thank-you pages are the spots).

## 🟠 Facts to verify before adding (currently omitted on purpose)

- [ ] **"Licensed GC in Utah" phrasing** — the About-page bio intentionally
      omits "As the licensed GC in Utah, Hunting handles..." until the
      license is active. When it is, update the Hunting bio in
      `src/components/OwnerStory.astro` to add it.
- [ ] **Gary bio facts** — the site states: licensed GC in California 30+
      years, owned/operated Amaron Construction, tenant-improvement
      specialty. Provided by Hunting; confirm details are exactly right
      (spelling of Amaron, license history) before launch.
- [ ] **Portfolio attribution** — /projects/ presents three finished
      basements as work "from the team behind HTC." Confirm this framing
      is accurate and that HTC has rights + homeowner permission to
      publish all 14 photos. Add locations/dates to
      `src/data/projects.ts` only when confirmed.
- [ ] **Gary photo caption** — the About photo shows Gary with his wife;
      alt text currently says "Gary Tanner with his wife." Confirm or
      provide her name/preference.

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

Received 2026-07-30: hero + before/after pair, 14 portfolio photos across
three basements, Gary Tanner photo. Remaining:

- [ ] Professional individual owner portrait of Hunting (optional now;
      family photo is in use)
- [ ] Owner-in-construction-environment photo
- [ ] Progress photos: framing, rough electrical, plumbing, drywall, trim, flooring
- [ ] Utah exterior/neighborhood context shot
- [ ] Wet bar / theater / gym photos (services sections currently text-only)
- [ ] Final logo files if the wordmark should be replaced by artwork
      (current header/footer use a styled text wordmark derived from
      `reference-assets/`)

## ✅ Infrastructure completed 2026-07-30

- Domain `huntingtanner.com` live on Vercel via Cloudflare (apex CNAME,
  DNS-only proxy); www and http redirect to the canonical apex; SSL valid
- Contact form delivering to office@huntingtanner.com via Resend
- Site remains `noindex` until `PUBLIC_SITE_STATUS=live`

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
