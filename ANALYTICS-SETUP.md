# ANALYTICS-SETUP

Analytics is fully wired but **dormant**: no script loads unless the site
is live AND the relevant ID is configured. Nothing loads during staging.

## Inserting IDs

Set these in Vercel → Project → Settings → Environment Variables (they're
read by `src/config/business.ts`):

| Variable | Example | Enables |
| --- | --- | --- |
| `PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 |
| `PUBLIC_GOOGLE_ADS_ID` | `AW-XXXXXXXXX` | Google Ads conversion tag |
| `PUBLIC_META_PIXEL_ID` | `1234567890` | Meta Pixel |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | token | Search Console meta verification |

Redeploy after setting. `src/components/Analytics.astro` injects gtag
and/or the Pixel; `src/scripts/analytics.ts` forwards events.

## Standardized events (already firing)

| Event | Trigger |
| --- | --- |
| `cta_click` | Any tagged CTA (label identifies placement: hero, header, sticky-bar…) |
| `click_to_call` | Any tel: link |
| `click_to_email` | Any mailto: link |
| `social_click` | Footer social links (when profiles exist) |
| `form_start` | First focus into a lead form |
| `form_submit` | Valid submission (live mode) — also fires Meta `Lead` |
| `form_error` | Validation failure on submit |
| `service_page_view` | Service pages (via `data-page-type`) |
| `service_area_page_view` | City/county pages |
| `project_gallery_view` | /projects/ |

## UTM / click-ID capture

`utm_source/medium/campaign/term/content`, `gclid`, `fbclid`, landing
page, and referrer are captured **first-touch per session** into
sessionStorage and submitted with every lead as hidden fields — so lead
emails show which campaign produced them. No cookies are set by our code.

## Validation steps (after IDs are live)

1. **GA4 Realtime**: open the site with `?utm_source=test`, click a phone
   link → see `click_to_call` in Realtime events.
2. **DebugView**: add `?debug_mode=1` (or GA Debugger extension) and walk
   a form: `form_start` → `form_submit`.
3. **Google Ads**: mark the `form_submit` GA4 event as a conversion (or
   create an Ads conversion action and add its snippet — keep it in
   Analytics.astro, nowhere else).
4. **Meta**: use Meta Pixel Helper extension; verify `PageView` + `Lead`.
5. Submit a test lead and confirm UTM fields arrive in the notification
   email.

## Call tracking (future)

If ad campaigns justify call attribution, use a pool-number service that
supports **number swapping** (e.g., CallRail) so the real
(801) 901-8349 stays canonical for NAP consistency on GBP. Add its script
via Analytics.astro only, and re-run PERFORMANCE-CHECKLIST.md after.

## Privacy posture

- No marketing scripts during staging; none without IDs
- No invasive tracking (no session recording, no fingerprinting)
- Attribution data is used to answer "how did this lead find us," nothing
  more; privacy policy already discloses this
