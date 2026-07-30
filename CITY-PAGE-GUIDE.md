# CITY-PAGE-GUIDE — adding future city pages without creating junk

The site launches with four authored geographic pages (Saratoga Springs,
Lehi, Utah County, Herriman). Vineyard, Eagle Mountain, American Fork,
etc. are named on the county page but intentionally have **no** pages yet.

## The bar a new city page must clear

Ask before writing: *"If a homeowner in this city read our existing pages
AND this new one, would the new page tell them anything they didn't
already know?"* If not, don't build it — strengthen the county page
instead.

A worthy page needs genuinely local substance:
- The housing stock story (age, builders, typical basement condition)
- What homeowners in that market actually build and why
- Local planning considerations (verified — see permit rule below)
- FAQs a homeowner *in that city* would ask, with non-generic answers
- Its own headline structure — not the same sections in the same order

## Anti-patterns (never do these)

- Find-and-replace a city name into an existing page
- The same five FAQs reworded
- Repeating a list of city names in every paragraph
- Publishing permit/fee/timeline claims that haven't been verified with
  that city's building department (mark with `{/* EDITORIAL NOTE */}`
  until confirmed)
- Claiming an office or physical presence in the city
- Shipping ten pages at once — one good page per real content effort

## Mechanical steps

1. Create `src/pages/<city>-basement-finishing.astro` (kebab-case, same
   URL pattern as existing pages).
2. Frontmatter: breadcrumbs (Home → Service Areas → City) +
   `breadcrumbSchema`, unique title (≤60 chars) and description
   (~150 chars), `pageType="service-area"`.
3. Structure freely, but include: who the page is for, common local
   projects, planning considerations, how the consultation works (link
   /process/), nearby communities served, 4–6 unique FAQs, closing
   CTASection with city-specific copy.
4. Add the city to `featuredAreas` in `src/data/service-areas.ts` (and
   remove it from `nearbyCommunities`) — footer/county page/cards update
   automatically. Decide `tier`.
5. Cross-link: from the county page (automatic via featuredAreas), from
   at least one sibling city page, and from a service page if natural.
6. `npm run build && npm run check`; review against SEO-CHECKLIST.md.

## Priority order (when the time comes)

Based on proximity and market fit: Eagle Mountain → American Fork →
Vineyard → Highland/Alpine → Pleasant Grove → Orem → Provo. Reassess with
actual lead data — build pages where leads come from.
