# ASSET-GUIDE — photography needed and how assets are organized

## Folder structure (`src/assets/`)

```
brand/         wordmark SVGs (charcoal + white) — from reference-assets
owner/         owner portraits (EMPTY — needed)
family/        family photos (hunting-tanner-family.jpg — in use)
hero/          hero/basement feature shots (EMPTY — placeholder in use)
services/      per-service photos (EMPTY — needed over time)
cities/        local Utah context shots (EMPTY — optional, nice to have)
projects/      real project photography (EMPTY — fills as projects complete)
placeholders/  labeled SVG placeholders currently standing in
```

`public/brand/logo.png` is the raster logo referenced by schema.

## Rules for every image

- Placeholders are clearly labeled in-image, in alt text, and in captions.
  **Never** label placeholder or stock imagery as HTC work, and never
  attach it to a Project entry or Project schema.
- Real photos go in `src/assets/` (optimizer pipeline), get descriptive
  alt text, and accurate width/height at their point of use.
- Get written homeowner permission before publishing photos taken in a
  client's home (see PROJECT-CONTENT-GUIDE.md for the release).
- Keep originals somewhere safe outside the repo; commit web-res copies
  (~2000px long edge).

## Shot list

### Priority 1 — needed for launch polish
| Shot | Used where | Notes |
| --- | --- | --- |
| Professional owner portrait | About page (placeholder waiting) | Clean background, approachable; vertical 4:5 |
| Finished basement (wide) | Homepage hero | The single most important photo on the site; must be HTC-shot or properly licensed, and only labeled as HTC work if it is |
| Unfinished basement (wide) | Before/after slider "before" | Same angle as an "after" if possible |
| Finished basement matching angle | Before/after slider "after" | Matched to the shot above |
| Utah family photo | Home + About | ✅ have one in use; replace if desired |

### Priority 2 — service pages & sections
- Basement bathroom (finished)
- Basement bedroom with egress window visible
- Wet bar / kitchenette
- Entertainment / media space
- Home office; home gym

### Priority 3 — process credibility (shoot during first projects)
- Owner in construction environment (walkthrough, tape measure, plans)
- Framing stage; rough electrical; plumbing rough-in
- Drywall; trim carpentry; flooring install
- Local Utah exterior / neighborhood context (mountains help)

## Technical guidance for whoever shoots

- Landscape 4:3 or 3:2 for room shots; some verticals for social
- Shoot before/after pairs from the SAME position and height (mark the
  floor with tape during the "before" visit)
- Turn on all room lights + bring a bright LED panel for basements
- Wide lens but not fisheye (16–24mm full-frame equivalent)
- Declutter: no tools, cords, or trash in "after" shots
- Capture RAW or highest-quality JPG; deliver ~2000px web copies

## Replacing a placeholder

1. Add the real file to the right `src/assets/` folder.
2. Find the placeholder import (`src/assets/placeholders/...`) in the page
   or component and point it at the new file.
3. Update alt text to describe the real photo; remove `isPlaceholder`
   flags/captions where used (e.g., BeforeAfterSlider).
4. `npm run build` and glance at the page.
