# Hunting Tanner Construction — huntingtanner.com

Marketing website for **Hunting Tanner Construction LLC**, a Utah County
residential contractor specializing in basement finishing.

## Stack

- [Astro 5](https://astro.build) with **TypeScript (strict)** — fully static output, all pages prerendered
- Native Astro components only — no React/Vue/UI framework
- Modern CSS with custom properties (design tokens in `src/styles/global.css`)
- Self-hosted display font (`@fontsource-variable/source-serif-4`) + system sans body stack
- `@astrojs/sitemap` (generated only when the site is live)
- Vercel-ready (static deploy; `vercel.json` handles domain redirects)

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:4321
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run check      # astro check (TypeScript + template diagnostics)
npm run icons      # regenerate favicons + og-default.png from scripts/generate-icons.mjs
```

No environment variables are required to run, build, or preview locally.

## Project layout

```
src/
  config/business.ts      ← THE single source of truth: contact info, license,
                            site status, service areas, analytics IDs, form config
  config/navigation.ts    ← header/footer nav
  data/                   ← services, service areas, FAQs, process steps, projects
  lib/schema.ts           ← JSON-LD builders (see SCHEMA-TODO.md)
  layouts/BaseLayout.astro
  components/             ← Header, Footer, LeadForm, BeforeAfterSlider, etc.
  pages/                  ← one file per route (17 routes + robots.txt)
  server/contact/         ← validation + reference serverless endpoint (not yet deployed)
  assets/                 ← images (see ASSET-GUIDE.md); placeholders clearly labeled
  styles/global.css       ← design tokens + base styles
scripts/generate-icons.mjs
```

## Site status: staging vs. live

`src/config/business.ts` → `siteStatus` controls the whole posture. It
defaults to `"staging"` and can be overridden with the `PUBLIC_SITE_STATUS`
env var (set it in Vercel project settings).

| Behavior | staging | live |
| --- | --- | --- |
| `<meta name="robots">` | `noindex, nofollow` everywhere | `index, follow` (except /thank-you/, /404/) |
| robots.txt | `Disallow: /` | `Allow: /` + sitemap reference |
| Sitemap | not generated | generated (`/sitemap-index.xml`) |
| Lead forms | submission intercepted with a friendly notice; mock payload logged in dev | POST to `/api/contact` |
| Analytics/pixels | never injected | injected only if IDs are set |

**To go live:** set `PUBLIC_SITE_STATUS=live` in Vercel (or change the
default in `business.ts`), deploy, and work through LAUNCH-CHECKLIST.md.

## License activation process

The Utah contractor license is **pending**. The site currently makes no
licensing claims. When the license is issued:

1. In `src/config/business.ts`, set `licenseNumber: "<issued number>"` and
   `licenseActive: true`.
2. Rebuild. The footer legal line and the trust strip automatically begin
   showing licensed status. Nothing else needs editing.

Never set `licenseActive: true` without a real license number.

## Contact form / going live with `/api/contact`

The form architecture is complete but intentionally not deployed:

- Client: `src/components/LeadForm.astro` (validation, attribution capture,
  honeypot, staging interception)
- Server: `src/server/contact/validate.ts` (sanitization + validation) and
  `src/server/contact/endpoint.example.ts` (reference Vercel endpoint with
  step-by-step activation instructions in its header comment)

Secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, …) belong in Vercel env
vars — see `.env.example`. Nothing is hardcoded.

## Content editing

- **Copy** lives in the page files (`src/pages/*.astro`) and data files
  (`src/data/*.ts`). Editorial notes for unverified claims are in
  CONTENT-TODO.md — resolve those before launch.
- **Business facts** (phone, email, service areas, socials, GBP URL) live
  only in `src/config/business.ts`.
- **FAQs** live in `src/data/faqs.ts` (site-wide) and inside the four city
  pages (city-specific).

## Image replacement

All placeholder images live in `src/assets/placeholders/` and are labeled
as placeholders in their alt text and captions. To replace:

1. Drop real photos into the matching `src/assets/` folder (see
   ASSET-GUIDE.md for the shot list and size guidelines).
2. Update the import in the page/component that uses the placeholder.
3. Keep the `width`/`height` props accurate to avoid layout shift.

The owner family photo (`src/assets/family/`) is already real. Project
photos have a data-driven pipeline — see PROJECT-CONTENT-GUIDE.md.

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import into Vercel — framework preset "Astro", default build command
   (`npm run build`), output `dist/`.
3. Add domains: `huntingtanner.com` (primary), `www.huntingtanner.com`,
   and later `huntingtannerconstruction.com` (+www). `vercel.json`
   301-redirects all secondary hosts to the canonical apex.
4. Set env vars per `.env.example` when ready.
5. Follow LAUNCH-CHECKLIST.md before flipping `PUBLIC_SITE_STATUS=live`.

## Documentation index

| File | Purpose |
| --- | --- |
| CONTENT-TODO.md | Every missing fact/asset/decision needing Hunting's input |
| LAUNCH-CHECKLIST.md | Pre-launch verification, domain/DNS, analytics, GBP |
| SEO-CHECKLIST.md | Metadata, schema, indexability, Search Console |
| PERFORMANCE-CHECKLIST.md | Core Web Vitals testing and budgets |
| ASSET-GUIDE.md | Full photo shot list + usage rules |
| ANALYTICS-SETUP.md | GA4/Ads/Pixel setup + event validation |
| SCHEMA-TODO.md | Structured-data placeholders and validation |
| CITY-PAGE-GUIDE.md | How to add future city pages without thin content |
| PROJECT-CONTENT-GUIDE.md | How to document projects for web + social |
