# PERFORMANCE-CHECKLIST

Targets: LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1 · Lighthouse ≥ 95/95/95 and
SEO 100 (clean test environment). Never hardcode or fake audit results —
measure.

## What's already engineered in

- Fully static prerendered HTML; no client framework, no hydration
- JS limited to: mobile nav, header shadow, before/after slider, form
  enhancement, analytics helpers (~a few KB, bundled by Astro)
- Self-hosted variable font (woff2 via Fontsource) — no external font CDN;
  body text uses the system stack (zero font cost)
- All images have explicit `width`/`height` (no CLS); hero eager +
  `fetchpriority="high"`, everything else lazy
- Astro `<Image>` optimizes raster images (family photo: 727 KB → 75 KB webp)
- No analytics/marketing scripts during staging; deferred loading when live
- `prefers-reduced-motion` respected globally
- Hashed immutable assets under `/_astro/` (long-lived caching on Vercel)

## How to test

1. **PageSpeed Insights** (https://pagespeed.web.dev) against the deployed
   URL — test `/`, `/basement-finishing/`, and one city page. Mobile tab
   first; that's the score that matters.
2. **Local Lighthouse**: Chrome DevTools → Lighthouse → Mobile, on
   `npm run preview` output (not `npm run dev` — dev is unminified).
3. After launch, watch **Core Web Vitals** in Search Console
   (Experience → Core Web Vitals) — field data beats lab data.

## Image guidelines (when real photos arrive)

- Source files: JPG/PNG at ~2000px on the long edge is plenty; Astro
  generates optimized derivatives
- Put images in `src/assets/` (NOT `public/`) so they go through the
  optimizer
- Always keep `width`/`height` props accurate to the real aspect ratio
- Hero image: aim under 200 KB optimized; verify it's preloaded/eager
- Gallery/below-fold images: `loading="lazy"` (default in our components)

## Video guidelines (future)

- No autoplay background video — ever (already a design rule)
- Host video off-origin (YouTube/Vimeo/Mux) with a click-to-load poster
  image; never ship multi-MB mp4 in the repo
- If a walkthrough video is added, lazy-embed it (facade pattern)

## Third-party script review (future additions)

Before adding ANY script (chat widget, call tracking, heatmaps):
1. Ask: does it earn its bytes? What's the conversion case?
2. Measure PageSpeed before/after on a preview deploy
3. Load it deferred, after interaction if possible
4. Document it in this file with its measured cost

Current allowed third parties (live only): gtag.js, Meta Pixel. That list
should grow reluctantly.

## Regression triggers

Re-run PageSpeed after: replacing placeholder images, adding a script,
adding a new section to the homepage, or enabling analytics for the first
time.
