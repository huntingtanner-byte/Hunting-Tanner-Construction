# SCHEMA-TODO — structured data status and maintenance

All JSON-LD is built in `src/lib/schema.ts` and rendered through
`StructuredData.astro`. Everything emitted matches visible page content.

## What's live now

| Schema | Where | Notes |
| --- | --- | --- |
| `GeneralContractor` (@id `…/#organization`) | Homepage | Most specific valid type for a residential GC (subtype of HomeAndConstructionBusiness → LocalBusiness) |
| `BreadcrumbList` | All inner pages | Mirrors the visible breadcrumbs |
| `Service` | /basement-finishing/, /basement-remodeling/ | Provider references the organization node |
| `FAQPage` | /faq/ only | Questions/answers rendered verbatim on that page |

## Deliberate omissions (do NOT add without real data)

- **No PostalAddress / street address** — service-area business; the
  owner's residential address is never published anywhere, including
  schema. This is intentional and permanent unless a real staffed office
  exists someday.
- **No aggregateRating / review** — the company has no reviews yet.
  Fabricated review markup is a Google penalty risk and dishonest.
  When real Google reviews exist, the right move is still usually to let
  Google surface them via the Business Profile rather than self-marking-up.
  Revisit only with real, on-site, verifiable testimonials.
- **No openingHours** — no committed public hours yet.
- **No foundingDate / priceRange / employee data** — pending verified
  values (see CONTENT-TODO.md).
- **No awards, certifications, or license claims** — license pending.

## Current placeholder-ish values to watch

- `logo`: points to `/brand/logo.png` (real wordmark ✅)
- `image`: points to `/og-default.png` (branded card; replace with a real
  photo URL when the hero photo exists — optional)
- `sameAs`: auto-populated from `business.ts` socials + GBP URL — empty
  today, fills itself as profiles are added to config

## How to update

- **License issued** → no schema change needed (license isn't a schema
  field we emit); just update `business.ts` for the visible site.
- **Social profiles / GBP** → add URLs in `business.ts`; `sameAs` updates
  automatically at next build.
- **New service page** → call `serviceSchema()` in that page's frontmatter
  with accurate name/description/path.

## Validation

1. Build the site, then test these URLs in Google's **Rich Results Test**
   (https://search.google.com/test/rich-results): `/`,
   `/basement-finishing/`, `/faq/`, one city page.
2. Also paste into **Schema.org validator** (https://validator.schema.org)
   for non-Google warnings.
3. After launch, watch Search Console → Enhancements for schema errors.
4. Re-validate whenever `schema.ts` or `business.ts` changes.
