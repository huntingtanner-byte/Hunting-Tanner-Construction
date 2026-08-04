# LAUNCH-CHECKLIST — before flipping PUBLIC_SITE_STATUS=live

Work top to bottom. Target: September launch.

## 1. Legal & licensing

- [x] Utah contractor license issued: #14298989-5501
- [x] `licenseNumber` + `licenseActive: true` set in `src/config/business.ts`
- [x] Footer license badge verified on all 47 pages + 404
- [ ] Insurance wording confirmed against actual carrier/coverage
      (trust strip currently says "Licensed & insured")
- [ ] Privacy policy + terms reviewed by attorney; effective dates updated

## 2. Content

- [ ] All 🔴/🟠 items in CONTENT-TODO.md resolved
- [ ] Final copy proofread on every page (read aloud, on a phone)
- [ ] All placeholder imagery replaced or consciously accepted for v1
- [ ] No remaining "coming soon" text that shouldn't be there
- [ ] Prelaunch language ("preparing to serve…", staging form notice)
      confirmed gone after status flip — search dist/ for "aren't live"

## 3. Domain & DNS

- [x] `huntingtanner.com` added to Vercel as primary domain (Cloudflare DNS,
      CNAME at apex, proxy DNS-only) — verified serving 2026-07-30
- [x] `www.huntingtanner.com` → 308 redirect to apex, verified
- [x] HTTPS certificate issued; http:// redirects to https://
- [x] Trailing-slash behavior spot-checked
- [x] Google Workspace MX records preserved (email unaffected)
- [ ] `huntingtannerconstruction.com` (+ www) added when acquired →
      vercel.json already contains the 301 rules

## 4. Forms

- [x] `/api/contact/` endpoint deployed (src/pages/api/contact.ts)
- [x] **Resend account created** (registered as office@huntingtanner.com)
- [x] **RESEND_API_KEY set in Vercel** (Production + Preview, sensitive)
- [x] Test submission → Resend reports "Delivered" to office@huntingtanner.com
- [ ] **huntingtanner.com domain verified in Resend** — until then mail
      sends from onboarding@resend.dev and often lands in spam
- [ ] RESEND_FROM set after domain verification
      (e.g. "HTC Website <leads@huntingtanner.com>")
- [ ] Re-test after verification: confirm mail arrives in the inbox, not spam
- [ ] Test submission (detailed form, contact page) → all fields present in email
- [x] Validation errors display correctly with fields preserved
- [x] Honeypot test (fill hidden field) → silently discarded
- [ ] Turnstile spam protection (optional hardening): set keys + enable widget
- [ ] SPF/DKIM/DMARC configured; test email not in spam

## 5. Site status flip

- [ ] `PUBLIC_SITE_STATUS=live` set in Vercel env
- [ ] Redeploy, then verify: `<meta name="robots" content="index, follow">`
- [ ] robots.txt allows crawling and references sitemap
- [ ] `/sitemap-index.xml` exists and lists all public pages (no /thank-you/)

## 6. Search & schema

- [ ] Google Search Console property verified (DNS or meta method —
      set PUBLIC_GOOGLE_SITE_VERIFICATION)
- [ ] Sitemap submitted in Search Console
- [ ] Rich Results Test run on homepage + one service page + FAQ page
      (see SCHEMA-TODO.md)
- [ ] URL Inspection on homepage: indexable, canonical correct

## 7. Analytics & profiles

- [ ] GA4 property created; PUBLIC_GA_MEASUREMENT_ID set; pageviews arriving
- [ ] Conversion events verified per ANALYTICS-SETUP.md
- [ ] Google Ads / Meta Pixel IDs set (only if campaigns are planned)
- [ ] Google Business Profile created, website set to https://huntingtanner.com,
      URL added to `googleBusinessProfileURL` in config
- [ ] Social profiles created and URLs added to config (footer + schema)

## 8. Quality pass

- [ ] Mobile testing: 320 / 375 / 430 / 768 px — nav, forms, sticky CTA, slider
- [ ] Browser testing: Chrome, Safari (iOS!), Edge, Firefox
- [ ] Keyboard-only pass: skip link, nav, accordion, slider, forms
- [ ] PageSpeed Insights on / and /basement-finishing/ (PERFORMANCE-CHECKLIST.md)
- [ ] Broken-link scan (e.g., `npx linkinator https://huntingtanner.com --recurse`)
- [ ] 404 page renders for a bogus URL
- [ ] Click-to-call and mailto links work on a real phone
- [ ] Final copy review by Hunting + one outside reader

## 9. Post-launch (first two weeks)

- [ ] Search Console: coverage report clean, no unexpected noindex
- [ ] Watch form deliverability daily for the first week
- [ ] Confirm GBP shows the website link and drives the profile
- [ ] Re-run PageSpeed after real images land
