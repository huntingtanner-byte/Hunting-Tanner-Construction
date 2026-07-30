# PROJECT-CONTENT-GUIDE — documenting real projects for web + social

Every completed basement is a marketing asset for years: website case
study, Google Business Profile posts, Instagram, TikTok, Facebook, and ad
creative. This guide is how to capture it without extra effort later.

## Ground rules

- **Written permission first.** Before publishing anything from a
  client's home, have them sign a simple photo/testimonial release
  (CONTENT-TODO: draft one). Track it in the project data
  (`permissionStatus`). No release → nothing publishes.
- **Never** stage stock photos as HTC work, invent testimonials, or
  publish a client's address/full name. City + first name (with
  permission) is the maximum.
- Testimonials go in the data model only with written permission
  (`testimonial` field).

## Shoot at three moments (minimum)

1. **Before (walkthrough day)** — wide shots of the unfinished space from
   2–3 positions. **Mark camera positions with tape on the slab** so the
   "after" matches. 5 minutes of phone photos is enough if steady and lit.
2. **Progress (each trade milestone)** — framing done, rough electrical,
   plumbing, insulation, drywall, trim, flooring. One or two shots each,
   plus 15–30s vertical video clips for TikTok/Reels (walkthroughs,
   time-lapse-able angles).
3. **After (post-clean, pre-handoff)** — the money shots: every room,
   matched to the "before" positions, all lights on, staged tidy.
   Consider hiring a real-estate photographer for the first few afters —
   it's cheap relative to the marketing value.

## Publishing to the website

Project entries live in `src/data/projects.ts` — the model is typed and
documented there (title, city, scope, before/progress/after images,
completion date, description, optional testimonial, permission status).

1. Put web-res photos in `src/assets/projects/` (filenames referenced by
   the data entry, e.g. `saratoga-media-room-after.jpg`).
2. Add the entry with `permissionStatus: "granted"`.
3. Build — the /projects/ page and homepage preview switch from
   "coming soon" cards to real entries automatically.

Write descriptions like a neighbor would ask: what was there before, what
the family wanted, what got built, anything tricky that got solved.

## Channel cheat sheet

| Channel | Format | Cadence |
| --- | --- | --- |
| Website /projects/ | Full case study (before/during/after) | Every completed project |
| Google Business Profile | 3–5 best afters + a post per project (city named, no address) | Every project — GBP photos influence local rankings |
| Instagram | Before/after carousel + Reels from progress clips | 1–3×/week during active projects |
| TikTok | Vertical progress/reveal videos, owner talking through decisions | As clips exist |
| Facebook | Cross-post IG; neighborhood groups ONLY where self-promo is allowed | Per project |
| Paid ads | Best matched-angle before/after pairs; UGC-style reveal video | Build a library; refresh creative monthly |

## The habit that makes this work

Photograph **every** project at the three moments above, even ones that
feel routine. The library compounds: ten documented basements is a
credibility moat no new competitor can fake.
