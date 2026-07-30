# SEO-CHECKLIST

How SEO is implemented on this site, and what to verify at launch and
after each significant content change.

## Implemented in code

- **Titles/descriptions**: unique per page, set via `BaseLayout` props →
  `SEOHead.astro`. One `<h1>` per page; logical H2/H3 below it.
- **Canonicals**: every page emits `<link rel="canonical">` pointing to
  `https://huntingtanner.com` + trailing-slash path. Astro is configured
  `trailingSlash: "always"`; internal links all use trailing slashes.
- **Indexability**: driven by site status (see README). `/thank-you/` and
  `/404/` are permanently noindex.
- **robots.txt**: generated at build from status (`src/pages/robots.txt.ts`).
- **Sitemap**: `@astrojs/sitemap`, generated only when live, excludes
  /thank-you/.
- **Structured data**: see SCHEMA-TODO.md.
- **Open Graph / Twitter**: per-page, with a branded default image
  (`/og-default.png`, regenerate via `npm run icons`).
- **Redirects**: `vercel.json` 301s www + huntingtannerconstruction.com
  (both hosts, both www states) → apex. HTTPS enforcement is automatic on
  Vercel.
- **Breadcrumbs**: visible component + BreadcrumbList JSON-LD on all inner
  pages.

## Internal-linking map (keep this intentional)

- Homepage → primary service page, both service pages, all 4 market pages,
  process, about, projects, FAQ, contact
- Service pages ↔ city pages (both directions)
- City pages → primary service page, process, each other, county hub
- FAQ → process + contact; Process → contact; About → process + contact
- Projects (future entries) → service + city pages

When adding a page, wire it into this map — no orphans.

## Verification steps (launch + after big edits)

1. `npm run build`, then spot-check `dist/` for:
   - unique `<title>` and `<meta name="description">` per page
   - correct canonical on each page
   - `noindex` ONLY on thank-you/404 (when live)
2. Search Console → URL Inspection on the changed pages.
3. Sitemap: confirm new pages appear; resubmit if needed.
4. Crawl for broken links: `npx linkinator https://huntingtanner.com --recurse`
5. Check image alt text on new content (descriptive; empty alt only for
   decorative images).

## Geographic-page quality bar

Before publishing ANY new city page, review against CITY-PAGE-GUIDE.md.
The standing rule: a city page must answer questions specific to that
market, or it doesn't ship. No find-and-replace city pages, no doorway
pages, no repeated city lists stuffed into paragraphs.

## What this site deliberately does NOT do

- No keyword stuffing, hidden text, or search-engine-only copy
- No fabricated reviews or review schema (see SCHEMA-TODO.md)
- No thin per-city pages beyond the four authored markets
- No duplicate content across the two domains (secondary domain 301s)
