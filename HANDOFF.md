# HANDOFF.md

**Purpose:** This file replaces the context of a very long Claude Code conversation. A fresh session should be able to read this and continue work on the Utah County Basement Pros website (formerly branded Hunting Tanner Construction) without any prior conversation history.

**Last updated:** October 5, 2026 (brand renamed to Utah County Basement Pros)
**Repo:** `C:\Users\hunti\HTC Website`
**Remote:** https://github.com/huntingtanner-byte/Hunting-Tanner-Construction.git
**Production:** https://huntingtanner.com (live, indexable)

---

## ⚠️ READ THIS FIRST — THE MOST IMPORTANT RULE

**DO NOT assume that an older version of the website is entirely better or entirely worse.**

The current website **intentionally combines two different things**:

> **NEWER homepage content / layout / organization**
> **+**
> **the preferred LIGHTER visual & color treatment**

These came from two different points in git history. The layout is new. The colors are old. That combination is deliberate and is the desired state.

**Therefore:**

- **Do not revert entire commits when only one aspect needs changing.** Reverting `32bc618` would destroy the good layout. Reverting `c30f2e0` would bring back colors the owner explicitly rejected.
- **Use surgical edits.** Change the specific token, rule, or line — not the whole file, not the whole commit.
- **Use git history as a reference, not as a rollback button.** `git show <commit>:<path>` and `git diff <a> <b> -- <path>` are the right tools. Read the old version, extract the exact value you need, and apply just that.
- **When the owner asks for a targeted change, make a targeted change.** Do not treat a small request as license for a redesign. This has been a repeated frustration.

---

## 🏷️ BRAND: "UTAH COUNTY BASEMENT PROS" (renamed October 2026)

The public brand is **Utah County Basement Pros**. It is a **DBA of Hunting Tanner Construction LLC**, which remains the legal entity that holds the contractor license.

| Where | Name used |
|---|---|
| Logo, page titles, copy, OG/site name, schema `name`, manifest, email sender | **Utah County Basement Pros** (short form: **Basement Pros**) |
| Footer DBA line, copyright, privacy policy, terms, schema `legalName`, About page "trade name" sentence | **Hunting Tanner Construction LLC** |

- All three names live in `src/config/business.ts`: `publicName`, `shortName`, `legalName`. **Never hardcode them.**
- **Footer (small print, every page):** "Utah County Basement Pros is a DBA of Hunting Tanner Construction LLC, a licensed Utah general contractor (License #14298989-5501)." followed by "© {year} Hunting Tanner Construction LLC. All rights reserved." Keep both: the license belongs to the LLC, so the disclosure ties the brand to the licensed entity.
- **Hunting Tanner the person is unchanged:** still the founder and owner, still in the owner story, the About page, and schema `founder`. Only the *company* name changed.
- **Colson** (Hunting's new business partner, handshake agreement, not on the LLC) is **intentionally not on the website.** Do not add him unless Hunting asks.
- Gary remains **Senior Advisor** (see §1). The rename did not change any of those rules.
- **"HTC" is retired** in all visitor-facing copy. Use "we/us/our" or the full brand name. (The internal localStorage key `htc_attribution` was deliberately left alone: renaming it would drop attribution for returning visitors and nobody sees it.)
- **The domain is still `huntingtanner.com`** and email is still `office@huntingtanner.com`. Hunting plans to move to a domain matching the new name later. When that happens, change together: `business.domain`, `business.email`, `astro.config.mjs` `site`, `vercel.json` redirects (old domain → new, 301), Vercel domains, Cloudflare DNS, Resend sender domain, and add the new property in Google Search Console with a Change of Address from the old one.
- Copy rewritten for the rename (not just swapped): the About lede, the About "trade name" licensing sentence, "The name on the truck is a family name" (the brand is no longer the family name), the "Three generations of building, one family name" headings (now "...building experience"), and the Saratoga Springs / Utah County lines that would otherwise read "Utah County Basement Pros is based in Utah County".

---

## 1. PROJECT OVERVIEW

### The company

**Utah County Basement Pros**, a DBA of **Hunting Tanner Construction LLC**: a residential general contractor in Utah, specializing in **basement finishing**. (See the brand section above.)

- **Owner / Founder:** Hunting Tanner. Sole owner and founder. Third-generation contractor, BYU Finance degree. He is the licensed general contractor and is personally involved in every single project.
- **Gary Tanner:** Hunting's father, and the company's **Senior Advisor**. A general contractor with **more than 35 years of experience** (formerly licensed in **California**, owned Amaron Construction, tenant-improvement work). He holds **no equity**, but he **is involved in every project** and reviews scopes of work. His experience is used as *credibility*, never as a claim of ownership.
- **Utah contractor license:** `14298989-5501` — active. Stored in `src/config/business.ts` as `licenseNumber` with `licenseActive: true`.
- **Company age:** New company, deep family experience. The site is honest about this rather than hiding it.

> ### 🚨 CRITICAL FACTUAL RULE ABOUT GARY
>
> **Hunting Tanner is the ONLY founder and the sole owner.** His title is always **"Founder"** or **"Owner"** — never "co-founder."
>
> **Gary Tanner is the "Senior Advisor."** He holds **no equity** and is **NOT** an owner, officer, member, co-founder, partner, principal, or employee of Hunting Tanner Construction LLC, and he is **NOT licensed in Utah**.
>
> **NEVER** use these words for Gary: **co-founder, founder, partner, principal, owner, "our team."**
> **NEVER** state or imply Gary is licensed in Utah. (His past **California** license may be described in past tense, as it is on `/about/`.)
>
> **The goal is to use the family experience as CREDIBILITY without implying ownership.** Gary is genuinely involved in every project — say that. Just never attach an ownership word to it.
>
> **Experience figures (supplied by Hunting, Oct 7 2026):** lead with **"40+ years of combined experience"** between Hunting and Gary, both involved in every project. Do NOT frame the credibility as only "Hunting's father has 35 years." Gary's individual **35+ years** is used only where the sentence is about Gary's own career (his About bio, "how Gary ran projects").
>
> Approved framings currently live on the site:
>
> > "Hunting is a third-generation contractor who grew up on job sites alongside his dad, Gary. Together they bring more than 40 years of combined construction experience, and both are involved in every project: Hunting owns and runs each one start to finish, and Gary serves as senior advisor."
>
> > "**40+ years of combined experience.** Hunting Tanner and his father Gary, our senior advisor, are both involved in every project we build."
>
> > "As senior advisor to Utah County Basement Pros, Gary is involved in every project. He reviews scopes of work before they reach you and stays close to the details once construction begins."
>
> JSON-LD `founder` contains **Hunting Tanner only**. Gary is deliberately absent from the schema entirely, so no structured-data consumer can infer he is a principal.
>
> This was corrected site-wide on Aug 11, 2026. See §5B. Do not let it regress.

### What the company does

Full basement finishing and basement remodeling: bedrooms (with egress), bathrooms, family/entertainment rooms, wet bars and kitchenettes, home offices and gyms, storage planning, built-ins and finish carpentry.

### Target customer

Utah homeowners — largely in newer subdivisions with **unfinished, rough-plumbed basements**, plus owners of established homes with dated 1980s–90s basements that need remodeling. Family-driven buyers who want more living space without moving. The tone assumes an educated, quality-focused buyer who is wary of flaky contractors.

### Geographic / service-area focus

- **Primary:** northern **Utah County** — Saratoga Springs, Lehi (home base is northwest Utah County)
- **Secondary:** **Salt Lake County** / Salt Lake Valley — Herriman, Riverton, Bluffdale, South Jordan, etc.
- **Boundaries the owner set explicitly:** nothing **south of Spanish Fork**; nothing **north of the Salt Lake City airport**.
- 31 individual city landing pages exist (13 Utah County + 18 Salt Lake County), each with **genuinely distinct copy** — not name-swapped templates.

### Purpose & conversion goals

1. **Primary conversion:** submit the consultation form → lands in `office@huntingtanner.com`.
2. **Secondary conversion:** click-to-call `(801) 901-8349`.
3. **SEO:** rank for basement finishing terms across Utah County and the Salt Lake Valley.
4. **Trust:** overcome "new company" objection with the three-generation story, written scopes, licensing, and owner involvement.

Form friction was deliberately reduced to **Name + Phone required only** (everything else optional) on SEO advice.

---

## 2. TECHNICAL SETUP

### Stack

| Thing | Value |
|---|---|
| Framework | **Astro 5** (`^5.12.0`) |
| Language | TypeScript, strict |
| Output | `output: "static"` — every page is prerendered HTML |
| Adapter | `@astrojs/vercel@^8` |
| Sitemap | `@astrojs/sitemap@^3` |
| Email | `resend@^6` |
| Fonts | `@fontsource-variable/source-serif-4` |
| Node | Vercel runs Node 22. Local Node 24 emits a harmless build warning. |

> **Why the Vercel adapter exists at all:** *solely* so `/api/contact` can run as a serverless function. Every other route stays prerendered static. Do not convert the site to SSR.

> **`@astrojs/vercel@11` will NOT install** — it requires Astro 7. Stay on `^8` unless Astro is upgraded.

### Commands

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run check
```

### Key configuration

**`astro.config.mjs`**
- `site: "https://huntingtanner.com"`
- `trailingSlash: "always"` — ⚠️ this means the API must be called as **`/api/contact/`** with the trailing slash. Omitting it 404s.
- `security.checkOrigin: false` — ⚠️ **required**. Astro's origin check rejects same-origin form POSTs behind Vercel's proxy (the function sees a different internal origin), producing `403 Cross-site POST form submissions are forbidden`. The only server route is the public contact form with no session/auth to protect. **Do not re-enable this** without re-testing the form end to end.
- `build.format: "directory"`
- Sitemap integration is **conditional on `siteStatus === "live"`**, and filters out `/thank-you/`.
- `siteStatus` is duplicated here rather than imported from `business.ts` so the config stays dependency-free at load; both read `PUBLIC_SITE_STATUS`. **If you change the fallback in one, change it in the other.**

**`vercel.json`**
- `301` `/basement-finishing` and `/basement-finishing/` → `/`
- `www.huntingtanner.com` → apex (permanent)
- `huntingtannerconstruction.com` + `www.` → apex (permanent)
- ⚠️ **A `"comment"` key inside a redirect object silently fails Vercel's schema validation and blocks the entire deploy with no obvious error.** Never add comments inside `vercel.json`. This cost hours once.
- ⚠️ In the Vercel dashboard, the domain redirect must be **www → apex**. If it is set apex → www it creates an infinite loop against the `vercel.json` rule above.

**`src/config/business.ts`** — single source of truth for all business facts. Never hardcode business data elsewhere.
```ts
legalName: "Hunting Tanner Construction LLC"   // legal entity: DBA line, legal pages, copyright, schema legalName
publicName: "Utah County Basement Pros"        // the brand, everywhere else
shortName: "Basement Pros"                     // manifest short_name, email sender name
domain: "https://huntingtanner.com"
phoneDisplay: "(801) 901-8349"   phoneHref: "tel:+18019018349"
email: "office@huntingtanner.com"
licenseNumber: "14298989-5501"   licenseActive: true
insuranceClaimApproved: true
siteStatus: "live"
googleBusinessProfileURL: ""     // empty — not yet created
socialMediaURLs: { all empty }
form: { enabled: true, endpoint: "/api/contact/", method: "POST", redirectOnSuccess: "/thank-you/" }
```
Exports helpers: `isLive`, `isStaging`, `canClaimLicensed`, `activeSocialLinks`. Components gate licensing language on `canClaimLicensed` — that architecture exists because for a long time the license was pending. Leave the gating in place.

### Directory map

```
src/
  assets/        brand/ cities/ family/ hero/ owner/ placeholders/ projects/ services/
  components/    20 .astro components (list below)
  config/        business.ts          ← single source of truth
  data/          faqs.ts, process-steps.ts, projects.ts, reviews.ts,
                 service-areas.ts, services.ts, cities/
  data/cities/   types.ts, utah-county.ts (13), salt-lake-county.ts (18), index.ts
  layouts/       BaseLayout.astro
  lib/           schema.ts            ← all JSON-LD
  pages/         see below
  pages/api/     contact.ts           ← the ONLY serverless function
  scripts/
  server/contact/ validate.ts, (email/render helpers)
  styles/        global.css           ← the entire design system
```

**Components:** `Analytics`, `BeforeAfterSlider`, `Breadcrumbs`, `CTASection`, `DevBanner`, `FAQAccordion`, `Footer`, `GoogleReviews`, `Header`, `LeadForm`, `OwnerStory`, `PageIntro`, `ProcessSteps`, `ProjectCard`, `SEOHead`, `ServiceAreaCard`, `ServiceCard`, `StickyMobileCTA`, `StructuredData`, `TrustStrip`.

**Pages:** `index`, `about`, `services`, `process`, `projects`, `contact`, `faq`, `basement-remodeling`, `thank-you`, `404`, `privacy-policy`, `terms`, `robots.txt.ts`, plus area pages `utah-county-basement-finishing`, `salt-lake-county-basement-finishing`, `saratoga-springs-basement-finishing`, `lehi-basement-finishing`, `herriman-basement-finishing`, and the dynamic `[city].astro`.

### Forms — how the contact form actually works

- `src/components/LeadForm.astro` — the markup. Also rendered on the homepage with `id="home-lead-form"`.
- `src/pages/api/contact.ts` — Vercel serverless function. `export const prerender = false;` (this is what opts it out of static output).
- `src/server/contact/validate.ts` — validation. **Single `name` field** (not first/last — that was changed deliberately). Only `name` and `phone` are required. Email is format-checked *only when supplied*.
- **Honeypot** field → on trip, returns a *fake success* rather than an error, so bots get no signal.
- `replyTo` is set only when the user actually supplied an email.
- On send failure the handler renders a **branded HTML error page** and logs the full lead prefixed `UNDELIVERED LEAD (recover manually)` so nothing is lost.
- Success → `303` redirect → `/thank-you/` (which is `noindex` and excluded from the sitemap).
- Env var: `RESEND_API_KEY` in Vercel. `RESEND_FROM` is **not yet set** — see TODO.
- ⚠️ Regex in `validate.ts` uses `\u0000-\u001f\u007f` escapes, **not literal control characters**. Literal control chars broke the build once.

### CSS / design system

Everything lives in **`src/styles/global.css`**. It defines:
- brand primitives (`--brand-*`)
- semantic tokens (`--color-*`)
- legacy aliases (`--color-bg`, `--color-ink`, etc.) kept so older components keep working — **do not delete them**
- spacing (`--space-*`), type scale (`--text-*`), `--radius`, `--shadow-card`
- section classes, button classes, card styles

**Technique used throughout:** CSS custom properties inherit, so a section can retint a scoped child component by setting a variable on itself instead of fighting scoped-style specificity. Example: `.section--dark` sets `--process-body` / `--process-heading`, which `ProcessSteps.astro` reads via `var(--process-body, var(--color-text-muted))`. **Prefer this pattern over `!important` or deep selectors.**

### Accessibility standard

Every color decision on this project has been verified to **WCAG AA** (4.5:1 body, 3:1 large/UI) by computing luminance/contrast ratios in the browser before shipping. Maintain that bar. But see the hard constraint in §5: **contrast may not be "fixed" by darkening the Sea Glass** — use Charcoal text on the light Sea Glass instead.

---

## 3. CURRENT HOMEPAGE

`src/pages/index.astro` — ~580 lines, **10 sections**, roughly 810 words of body copy. This length and structure are **intentional**. Do not lengthen it back out.

**Sections in current order:**

| # | Section | Background | What it does |
|---|---|---|---|
| 1 | **Hero** | `.hero` — Charcoal backdrop with full-bleed photo | `<h1>Utah Basement<br />Finishing Specialists</h1>`. Overlaid copy + two CTAs (Sea Glass "Request Consultation" + ghost-light "Call"). |
| 2 | **TrustStrip** | light | 3–4 short credibility points: licensed & insured, *40+ years of combined experience* (Hunting + Gary), an owner on every project, organized scopes & planning. |
| 3 | **Start Here / lead form** | `.section--alt` (`#home-lead-form`) | "Tell us about your basement." **The page's only form.** Deliberately placed high for conversion. |
| 4 | **What We Build** | canvas | Service cards — the room types. Links out to `/services/` anchors. |
| 5 | **Our Work** | canvas | Real project photography grid + CTA to `/projects/`. |
| 6 | **Process** | canvas | **Six clear steps from first call to final walkthrough.** This is now the *primary* explanation of the basement-finishing process on the homepage. Compact `ProcessSteps` variant. |
| 7 | **Transformation** | canvas | Before/after slider — "From concrete and studs to the best floor in the house." |
| 8 | **Why HTC + founder story (MERGED)** | `.section--alt` | Merged section. Family photo + "Three generations of building experience" + Gary-as-senior-advisor paragraph + 4 trust bullets + link to `/about/`. |
| 9 | **Service areas** | canvas | Utah County / Salt Lake County cards → county hubs → city pages. |
| — | *Google reviews* | — | `GoogleReviews.astro` renders **nothing** while `src/data/reviews.ts` is empty. Intentional. |
| 10 | **FAQ** | canvas | `FAQAccordion` from `homeFaqs`, feeds FAQPage schema. |
| 11 | **Closing CTA** | `.section--dark` | Charcoal. Heading + buttons **only — deliberately not a second form.** |

### 🔒 Intentional — DO NOT UNDO

- **Only ONE `.section--dark` on the homepage** (the closing CTA). The hero has its own Charcoal treatment via `.hero`.
- **Only ONE form on the homepage** (§3, "Start Here"). The closing CTA is buttons only — there is an explanatory comment in the file saying exactly this. The page already carries a form high up plus the sticky mobile bar.
- **Why HTC and the founder story are MERGED into one section.** Do not split them apart again.
- **The large "What's Included" section is GONE from the homepage.** It lives on `/services/#whats-included`. Do not bring it back.
- **The Process section stayed** and is the stronger, fuller explanation. It was kept *instead of* the redundant What's Included block.
- **Section order above is deliberate** — form high, proof in the middle, story before geography, FAQ before the close.

---

## 4. RECENT HOMEPAGE REFINEMENT (commit `32bc618`)

The owner asked for a homepage that was **shorter, more varied, less content-heavy, and more editorial**. This work is **GOOD and should be preserved.** (Only the *colors* introduced alongside it were rejected — see §5.)

### What changed

**Shortened & de-duplicated**
- Homepage cut to ~810 words across 10 sections.
- Removed repeated restatements of the same value props. The same three ideas (owner involvement, written scopes, family experience) had been appearing in four different places; they now appear once each, in the section where they land hardest.

**Consolidated sections**
- **"Why Utah County Basement Pros" (originally "Why Hunting Tanner Construction") + the founder/company story → merged into a single section** (now homepage section 8). Previously two separate blocks that repeated each other.
- **"What's Included" removed from the homepage entirely.** It was a long, repetitive checklist that duplicated what the Process section already communicated better.
- **Process kept and strengthened** as the single, clearer explanation of the full basement-finishing process, first call → final walkthrough.

**Reduced duplicate forms**
- The homepage previously had a form high on the page **and** another in the closing CTA. The closing CTA is now **buttons only**. One form, plus the sticky mobile bar.

**Reduced long copy**
- Long multi-paragraph blocks compressed to short editorial paragraphs.
- More whitespace, fewer walls of text.

**Improved photography / content rhythm**
- Alternating text-led and image-led sections so the page breathes: hero photo → trust → form → cards → project photography → process → before/after slider → family photo + story → area cards → FAQ → close.

**Improved mobile length / spacing**
- Section padding tightened, the homepage got materially shorter on mobile (current mobile page height ≈ **13,973px** — a useful regression benchmark).

### What moved, and where it went

| Content | From | To |
|---|---|---|
| Full "What's Included" checklist | homepage | **`/services/#whats-included`** |
| Basement bathrooms & bedrooms detail | homepage | **`/services/#bathrooms-bedrooms`** |
| Family & entertainment room detail | homepage | **`/services/#family-rooms`** |
| Wet bars & kitchenettes detail | homepage | **`/services/#wet-bars`** |
| Home offices & gyms detail | homepage | **`/services/#offices-gyms`** |
| Cost & timeline detail | homepage | **`/services/#cost-and-timeline`** |

Nothing was deleted outright — it was **relocated**, and the homepage links to it. That preserved the SEO value. See §8.

---

## 5. MOST RECENT COLOR CORRECTION (commit `c30f2e0`) — ⭐ MOST IMPORTANT SECTION

### What happened

The refinement commit (`32bc618`) shipped good layout changes **but also changed colors**, which the owner disliked. The correction commit `c30f2e0` **surgically reverted only the colors**, keeping 100% of the layout and content.

### 🚫 The two things the owner explicitly rejected

> ### 1. THE DARKER TEAL / DEEP SEA GLASS CTA BUTTONS
>
> The refinement deepened the primary button to **`#54706B`** (a dark teal) with white lettering, plus a `#44605B` hover and a `.btn--dark` variant.
>
> **The owner's words: "I especially DO NOT LIKE the darker button colors."**
>
> **"Do NOT darken the Sea Glass simply to increase contrast. Do NOT replace it with `#54706B`."**
>
> The owner **prefers the lighter, softer, more coastal Sea Glass** — `#AEBFBC` with **Charcoal** text. That is the signature button.
>
> ⚠️ **The trap:** `#AEBFBC` only reaches **1.8:1** against white, so a well-meaning accessibility pass will "fix" it by darkening the button. **That is the wrong fix and it has happened before.** The correct fix is **Charcoal `#2C3135` text on the light Sea Glass = 6.87:1**, which passes AA comfortably. Never darken the Sea Glass to solve contrast.

> ### 2. THE TAN / PALE TAUPE BACKGROUND BEHIND "WHY HUNTING TANNER CONSTRUCTION"
>
> The refinement put that section on **solid Pale Taupe `#C7B9A9`** via a `.section--taupe` class.
>
> **The owner's words: "I also strongly dislike the TAN / PALE TAUPE background."**
>
> It is now on **`.section--alt`** — the **lighter cream / warm off-white** treatment, which is **the exact same token the Start Here section uses**. Not a new color; the identical existing treatment. This is what the owner asked for.
>
> `.section--taupe` has been **deleted from `global.css`** because nothing uses it. **Do not recreate it.**

### Also rejected earlier in the project (do not resurrect)

- **Eucalyptus green buttons** — *"i dont like that actually, revert it to how it was before."*
- **`#476B57`** deep eucalyptus — a compromise attempt, also gone.
- **`#546A7B`** blue-gray stone accent — superseded by the Coastal Luxury palette.

### ✅ CURRENT COLOR SYSTEM — THIS IS THE SOURCE OF TRUTH

All from `src/styles/global.css` `:root`, verified against the live site.

**Brand primitives (Coastal Luxury Palette 02)**
```css
--brand-soft-white: #faf8f3;   /* Soft White */
--brand-sea-glass:  #aebfbc;   /* Sea Glass — LIGHT. Keep it light. */
--brand-pale-taupe: #c7b9a9;   /* Pale Taupe — accents/rules ONLY, never a section background */
--brand-charcoal:   #2c3135;   /* Charcoal */
```

**Backgrounds**
```css
--color-background:      #faf8f3;  /* Soft White — dominant canvas */
--color-background-soft: #f1ede6;  /* 18% taupe wash — .section--alt warm band */
--color-background-cool: #eff0ec;  /* 15% sea glass wash — used rarely */
--color-surface:         #faf8f3;  /* cards sit ON the canvas, not above it */
--color-surface-raised:  #fffefb;  /* form fields, so inputs read as inputs */
```

**Text**
```css
--color-text:       #2c3135;  /* 12.38:1 on Soft White */
--color-text-muted: #5c6367;  /* 5.76:1 on Soft White, 5.24:1 on the taupe wash */
```

**Accent**
```css
--color-accent:           #aebfbc;  /* Sea Glass — fills and rules */
--color-accent-hover:     #9cb0ac;  /* pressed/hover fill */
--color-accent-ink:       #2c3135;  /* text ON Sea Glass — 6.87:1 */
--color-accent-secondary: #c7b9a9;  /* Pale Taupe — warmth, rules, details */
```

**Borders**
```css
--color-border:        #e8e2d9;
--color-border-strong: #d9cfc3;
--color-input-border:  #cfc4b6;
```

**Dark surfaces**
```css
--color-dark:            #2c3135;
--color-on-dark:         #faf8f3;  /* 12.38:1 */
--color-on-dark-muted:   #b8bcbd;  /* 6.86:1 */
--color-on-dark-accent:  #aebfbc;  /* Sea Glass on Charcoal — 6.87:1 */
```

**🔘 BUTTONS — exact current values**
```css
--color-button-primary:        #2c3135;  /* Charcoal */
--color-button-primary-text:   #faf8f3;  /* Soft White */
--color-button-secondary:      #aebfbc;  /* LIGHT Sea Glass — the signature CTA */
--color-button-secondary-text: #2c3135;  /* Charcoal text */
```

```css
.btn--primary            { background: #2c3135; border-color: #2c3135; color: #faf8f3; }
.btn--primary:hover      { background: #1e2226; border-color: #1e2226; color: #faf8f3; }

/* Light Sea Glass CTA — the signature button */
.btn--secondary          { background: var(--color-button-secondary);
                           border-color: var(--color-button-secondary);
                           color: var(--color-button-secondary-text); }
.btn--secondary:hover    { background: var(--color-accent-hover);   /* #9cb0ac */
                           border-color: var(--color-accent-hover);
                           color: var(--color-button-secondary-text); }

.btn--outline            { transparent bg, Charcoal text, --color-border-strong edge }
.btn--outline:hover      { fills Charcoal, text --color-on-dark }
.btn--light              { Soft White bg → hovers to Sea Glass }
.btn--ghost-light        { transparent, Soft White text, 50% Soft White border — DARK sections only }
```

**Base `.btn`:** `min-height: 50px`, `padding: 0.9rem 2rem`, `--radius` (2px), uppercase, `font-weight: 600`, `--text-xs`, `--tracking-label`, 0.18s color/background/border transition.

**"Request Consultation" button specifically:** the hero CTA and all homepage CTAs use **`.btn--secondary`** — light Sea Glass `#AEBFBC` with Charcoal `#2C3135` text. There are **7 Sea Glass buttons** on the homepage and all render identically at **6.87:1**. The mobile sticky bar's "Request Consultation" is the exception — it uses `--color-button-primary` (Charcoal) so it reads against the bar.

**Focus state**
```css
--color-focus: #2c3135;  /* charcoal ring — reads as brand, not as an OS default */
```

**Status**
```css
--color-error:   #8f3520;
--color-success: #2e6b3f;
```

**Shape**
```css
--radius: 2px;  --radius-lg: 3px;  --shadow-card: none;
```
Cards are defined by a **warm hairline, never a shadow.** Keep it that way.

**Typography**
```css
--font-display: "Source Serif 4 Variable", Georgia, "Times New Roman", serif;
--font-body:    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...
```
Serif display for headings, system sans for body. Buttons and eyebrows use the body font, uppercase, letterspaced.

### Section background treatments — current

| Class | Background | Where used on the homepage |
|---|---|---|
| *(none)* | `--color-background` `#FAF8F3` Soft White canvas | What We Build, Our Work, **Process**, Transformation, Service areas, FAQ |
| `.section--alt` | `--color-background-soft` `#F1EDE6` warm off-white | **Start Here (form)** and **Why HTC + founders** — the same token, by design |
| `.section--dark` | `--color-dark` `#2C3135` Charcoal | **Closing CTA only** |
| `.hero` | Charcoal backdrop + full-bleed photo | Hero |
| ~~`.section--taupe`~~ | **DELETED** | nowhere — do not recreate |

- **Why HTC background:** `.section--alt` (warm off-white). **Not taupe.**
- **Start Here background:** `.section--alt` — identical token.
- **Process background:** the **light canvas**. It was Charcoal during the refinement; that was reverted.
- **Closing CTA:** `.section--dark`, Charcoal. This **predates** the refinement (it was already `section--dark` at `bfaf4b9`), so it was correctly left alone.
- **Hero:** Charcoal backdrop also **predates** the refinement. Left alone.

Current homepage tally: `section--dark` ×1, `section--alt` ×2, `section--taupe` ×0.

### A real bug the revert exposed (now fixed — keep it)

Restoring the light buttons surfaced a genuine pre-existing specificity bug: **`.section--dark a` outranked `.btn--secondary`**, so the Sea Glass button inside the dark closing CTA rendered with **white text at 1.8:1** — unreadable. It was invisible before only because that button happened to be dark during the refinement.

Fix now in `global.css` — **do not remove:**
```css
/* Buttons keep their own text colour inside dark sections. Without this,
   the rule above wins on specificity and puts Soft White on the light
   Sea Glass button, which is only 1.8:1. */
.section--dark .btn--primary   { color: var(--color-button-primary-text); }
.section--dark .btn--secondary { color: var(--color-button-secondary-text); }
```

### Verification performed after the correction

- No `54706b`, `44605b`, or `section--taupe` anywhere in the codebase.
- All 7 Sea Glass buttons identical at **6.87:1**; **zero contrast failures** on desktop and mobile.
- Structure untouched: 9 section markers, mobile page height 13,973px, `/services/` anchors intact, removed sections did not return, exactly 1 `<h1>`, canonical + schema intact, no broken links, form POST → 303 → `/thank-you/`.

---

## 6. BRAND / DESIGN DIRECTION

### The feel

| It SHOULD feel | It should NOT feel |
|---|---|
| Luxury residential construction | Generic contractor website |
| Premium, high-end but approachable | Cheap, loud, salesy |
| Clean, refined, architectural | Cluttered, busy |
| **Light** — cream and white dominate | Dark, tech/SaaS |
| Slightly **coastal luxury** | Overly colorful |
| **Photography-forward** | Stock-art / clip-art driven |
| Lots of intentional white / cream space | Wall-to-wall text |

The reference direction came from four supplied images ("Coastal Luxury Palette 02" plus three example layouts): light, airy, editorial, generous margins, restrained color, real photography carrying the emotional weight.

**Core principle: the Soft White canvas dominates.** Color is used sparingly and deliberately. Sea Glass and Pale Taupe are *accents*, not section fills. One dark moment on the page (the close) is enough.

### Logo direction

The wordmark is a two-tier centered lockup in **Source Serif 4**, the same type system as the original Hunting Tanner Construction logo, which Hunting asked to keep:

```
 ──────  U T A H   C O U N T Y  ──────     small, 0.42em tracking, muted, Sea Glass hairlines
      B A S E M E N T   P R O S            large, 0.14em tracking, Charcoal
```

- **The small line sits on top** so the lockup reads in the correct order, "Utah County Basement Pros". The emphasis is on "Basement Pros", the memorable part.
- The **Sea Glass hairlines** flank "UTAH COUNTY" and stretch to the width of "BASEMENT PROS". They are CSS pseudo-elements in `Header.astro` / `Footer.astro`.
- **Header and footer wordmarks are live HTML text**, not images. Both are in `Header.astro` (`.wordmark`) and `Footer.astro` (`.footer-wordmark`).
- The name stays **on one line down to 320px** (`white-space: nowrap` and a font-size `clamp()`), with 16px clearance to the Menu button at 320px. Re-check 320px if you touch the header.
- **Every logo file is generated** by `npm run icons` (`scripts/generate-icons.mjs`). It outlines real Source Serif 4 glyphs from `@fontsource-variable` with `fontkitten`, so the files match the HTML exactly and don't depend on system fonts. Outputs: `public/brand/logo.png` (schema logo), `public/og-default.png` (share image), favicons (`favicon.svg`, 192, 512, apple-touch), and master SVGs `src/assets/brand/wordmark-charcoal.svg` / `wordmark-white.svg`. **To change the logo, edit `SUB_TEXT` / `NAME_TEXT` / `MONOGRAM` in that script and rerun it.** Don't hand-edit the PNGs.
- **Favicon monogram:** Soft White serif "BP" on a Charcoal rounded square, with a Sea Glass hairline beneath.
- Charcoal wordmark on light backgrounds; white on dark.

### Typography

- **Display / headings:** `Source Serif 4 Variable` (self-hosted via `@fontsource-variable`), fallback Georgia → Times New Roman → serif. The serif is what makes it read premium rather than generic-contractor.
- **Body / UI:** system stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, …`.
- **Buttons & eyebrows:** body font, **uppercase**, `font-weight: 600`, letterspaced via `--tracking-label`, small (`--text-xs`).
- **Radius is nearly square** (2–3px). Sharp, architectural. Not rounded/friendly/app-like.
- **No shadows.** Hairline borders only.

### Copywriting rules

- **No em dashes.** The owner asked for this explicitly to make the copy "less AI looking." (Phone numbers keep their hyphens.) Use commas, colons, or periods instead.
- Plain, direct, confident. Short sentences. No hype.
- **Never invent facts** — no fake projects, licenses, reviews, statistics, awards, addresses, or credentials. This is a standing rule.
- Owner involvement is the recurring theme: "When you hire Utah County Basement Pros, you get Hunting Tanner."

---

## 7. THINGS THE OWNER DOES NOT LIKE — DO NOT LET THESE RETURN

A checklist to run before shipping any visual or structural change.

### Color / visual
1. ❌ **Dark teal CTA buttons.** Specifically `#54706B` and its `#44605B` hover. Explicitly rejected.
2. ❌ **Excessively dark Sea Glass.** Sea Glass stays **`#AEBFBC`**. Never darken it — not for contrast, not for "polish," not for hierarchy.
3. ❌ **`.btn--dark`** as a homepage CTA variant. Deleted.
4. ❌ **Tan / Pale Taupe (`#C7B9A9`) background behind Why HTC** — or behind any full section. Taupe is an *accent* color only.
5. ❌ **`.section--taupe`.** Deleted. Do not recreate.
6. ❌ **Too many colored section blocks.** The light canvas must dominate. Current ratio (1 dark, 2 warm off-white, 6 canvas) is right.
7. ❌ **Eucalyptus / sage / green accents** (`#476B57`, earlier sage) — rejected earlier.
8. ❌ **Dark, tech/SaaS-looking design.** Heavy shadows, big radii, gradients, neon.
9. ❌ **Generic construction-company styling** — hard-hat clip art, orange/yellow safety colors, diagonal stripes, stock "guy in a vest" photography.

### Content / structure
10. ❌ **Huge walls of text.**
11. ❌ **Repetitive homepage content** — the same value prop restated in four sections.
12. ❌ **Reintroducing the detailed "What's Included" content to the homepage.** It lives on `/services/`.
13. ❌ **Splitting Why HTC and the founder story back into two sections.** They are merged on purpose.
14. ❌ **Making the homepage extremely long again.** ~810 words / 10 sections is the target.
15. ❌ **A second form on the homepage.** One form + the sticky mobile bar.

### Factual
16. ❌ **Calling Gary a co-founder / founder / partner / principal / owner**, or implying he is licensed in Utah, or that he holds equity. He is the **Senior Advisor**, involved in every project. See §1.
17. ❌ **"4-8 weeks"** for project duration. It is **6-10 weeks**.
18. ❌ **"30 years" / "three decades"** for Gary's experience. It is **35+ years**.
19. ❌ **Any residential address** anywhere — page copy, footer, contact page, structured data, source code, or metadata. Standing rule.
20. ❌ **Invented facts** of any kind.

### Process
21. ❌ **Unnecessary redesigns when a targeted change is requested.** This is the most-repeated frustration on the project. If asked to change a button color, change the button color. Nothing else.

---

## 8. SERVICES PAGE (`/services/`)

`src/pages/services.astro`. On SEO advice, the old `/basement-finishing/` page was deleted and 301'd to `/`, making the **homepage** the primary basement-finishing landing page. `/services/` then became the home for the **detailed, long-form service content** that no longer belongs on the homepage.

### Content that was moved here from the homepage

| Anchor | Heading | What it holds |
|---|---|---|
| `#whats-included` | "What a Utah basement finish includes" | The full What's Included checklist removed from the homepage. `.section--alt`. |
| `#bathrooms-bedrooms` | Basement bathrooms & bedrooms | Egress planning, full/three-quarter baths, plumbing rough-in completion, ventilation. |
| `#family-rooms` | Family & entertainment rooms | Media/theater, game space, built-ins, sound & lighting. |
| `#wet-bars` | Wet bars & kitchenettes | Cabinetry, sinks/drink fridges, task lighting, snack centers. |
| `#offices-gyms` | Home offices & gyms | Wired offices, gym flooring/mirrors, storage, comfort. |
| `#cost-and-timeline` | "What basement finishing costs in Utah" | Cost drivers + the **6-10 weeks** timeline. `.section--alt`. |

Also on the page: "The rooms Utah homeowners add most" (h2 over the room h3s), "Also part of the toolkit" (related services), and "Serving Utah County and Herriman."

### 🔒 Rule

**Do NOT move this content back to the homepage unless the owner specifically requests it.** The relocation was deliberate: it shortened the homepage, removed duplication, and preserved the SEO value of the long-form copy on a page built for it. The homepage links into these anchors via `src/data/services.ts` (`coreServices[].href`), so the internal linking is already wired — moving content back would break those links.

`src/data/services.ts` is the shared definition used by both the homepage cards and `/services/`. Edit service copy there, not in two places.

---

## 9. SEO

### Strategy

Local service-area SEO. The **homepage is the primary basement-finishing landing page** (a deliberate consolidation), supported by county hub pages, 31 distinct city pages, and topical pages (`/services/`, `/process/`, `/projects/`, `/faq/`, `/basement-remodeling/`, `/about/`).

Everything is **prerendered static HTML** — verified server-rendered, not client-hydrated. This was an explicit requirement.

### Keywords

- **Primary:** Utah basement finishing · basement finishing Utah · basement finishing company · basement finishing contractor
- **Service:** basement remodeling · basement finish · finished basement · basement bedrooms · basement bathrooms · egress windows · wet bar · basement family room · home office · home gym
- **Geographic:** Utah County · Salt Lake County / Salt Lake Valley · Saratoga Springs · Lehi · Herriman · Eagle Mountain · American Fork · Pleasant Grove · Orem · Provo · Highland · Mapleton · Spanish Fork · Riverton · Bluffdale · South Jordan · and every other city page
- **Trust:** licensed Utah general contractor · licensed and insured · third-generation contractor

### Canonicals

`src/components/SEOHead.astro` builds `canonical = business.domain + path` on every page. `trailingSlash: "always"` means paths always end in `/`. Consistency here matters — don't introduce a page whose `path` prop lacks the trailing slash.

### Robots / indexing

- `robots` meta is status-aware: `!isLive || noindex` → `noindex, nofollow`; otherwise `index, follow`.
- `/thank-you/` is `noindex` and excluded from the sitemap.
- `src/pages/robots.txt.ts` generates robots.txt at build time from `siteStatus`.
- Sitemap is generated **only when live**.
- Site is currently **live and indexable**. Verified in Google Search Console (domain property `huntingtanner.com`, auto-verified, sitemap submitted).

### Schema / JSON-LD

All in `src/lib/schema.ts`, injected via `StructuredData.astro`:
- **GeneralContractor** organization — name, legalName, url, logo, image, telephone, email, description, **`founder: [Hunting Tanner — "Founder"]` only**, `areaServed`. ⚠️ **No address** by owner instruction.
- **Service** — basement finishing / remodeling
- **BreadcrumbList** — on interior pages
- **FAQPage** — homepage + `/faq/`
- **EducationalOccupationalCredential** — the Utah license, gated on `canClaimLicensed`

### Redirects (in `vercel.json`)

- `/basement-finishing` and `/basement-finishing/` → `/` — **explicit `statusCode: 301`**, not `permanent: true`. ⚠️ `permanent: true` emits a **308**; the SEO consultant specifically wanted a **301**. Don't "simplify" this back.
- `www.huntingtanner.com` → apex
- `huntingtannerconstruction.com` and `www.` → apex

### Internal linking decisions

- Homepage service cards link into `/services/` anchors (via `src/data/services.ts`).
- Homepage service-area cards → county hubs → individual city pages.
- City pages cross-link to neighboring cities (`neighbors[]` in the city data).
- `/about/` links out to `/`, `/basement-remodeling/`, `/utah-county-basement-finishing/`, `/process/`, `/projects/`, `/contact/`.
- Why HTC section → `/about/`; Our Work → `/projects/`.

### Do not accidentally remove

- The 301 redirect chain
- `noindex` on `/thank-you/`
- The status-aware robots logic and the license gating
- Exactly **one `<h1>` per page**
- Any of the 31 city pages, or their distinctness (they are **not** name-swapped templates — real per-city copy about housing stock, builders, geography, and local permitting)

---

## 10. MOBILE / RESPONSIVE

### Sticky mobile CTA bar

`src/components/StickyMobileCTA.astro`
- `display: none` above 768px; visible **only** at `max-width: 767px`.
- Fixed to the bottom, `z-index: 40`, two equal columns (`1fr 1fr`) with a 1px gap showing `--color-line` through as a divider.
- **Left — "Call (801) 901-8349":** `--color-background` (Soft White) with `--color-text`. `data-event="click_to_call"`, label `sticky-bar`.
- **Right — "Request Consultation":** `--color-button-primary` (**Charcoal**) with `--color-button-primary-text`. Links to `/contact/`. `data-event="cta_click"`.
- `min-height: 54px` per tap target (comfortably above the 44px minimum).
- `padding-bottom: env(safe-area-inset-bottom, 0)` for iPhone home-indicator devices.
- `:global(body) { padding-bottom: 56px; }` inside the mobile media query so the fixed bar never covers page content. **If you change the bar height, change this too.**

### Section spacing

Section padding was tightened during the refinement specifically to shorten the mobile page. Current mobile homepage height ≈ **13,973px** — use this as a regression benchmark. If a change pushes it substantially higher, that's a regression against the owner's stated goal.

### Image cropping

- The hero image is taken **out of flow**: `.hero-media { position: absolute; inset: 0; }` with the image covering. ⚠️ This was a fix — previously the section height was driven by the **photograph's aspect ratio**, which made the hero absurdly tall on mobile. Height is now controlled by `min-height` and the copy. **Do not put the hero image back in flow.**
- Project and story images use Astro `<Image>` with explicit width/height and `loading="lazy"`.

### Process layout

`ProcessSteps.astro`, `compact` variant (used on the homepage):
- 1 column by default (mobile)
- 2 columns at `min-width: 700px`
- 3 columns at `min-width: 1024px`
- Each step: a `--brand-sea-glass` numbered chip with `--color-accent-ink` (Charcoal) text, then heading + summary.
- The full `/process/` page uses the non-compact variant with `step.detail` and larger body text.

### CTA behavior

- Buttons are `min-height: 50px` everywhere.
- No tap target under 40px anywhere on the homepage (verified).
- The hero stacks its two CTAs on mobile.
- Because the sticky bar always offers Call + Request Consultation, the closing CTA deliberately does **not** repeat a form.

---

## 11. IMAGES / ASSETS

All images live in `src/assets/` and are processed by Astro's `<Image>` (WebP output, hashed filenames, explicit dimensions to prevent CLS).

### Most important images

| File | Used where |
|---|---|
| `src/assets/hero/basement-after.png` | **Homepage hero backdrop** (`heroImage`) **and** the "after" side of the Transformation slider (`afterImg`) |
| `src/assets/hero/basement-before.png` | The "before" side of the Transformation slider (`beforeImg`) |
| `src/assets/family/hunting-tanner-family.jpg` | **Homepage Why HTC section** (720×1013) and the Hunting founder block on `/about/`. Alt: "Hunting Tanner with his wife and son" |
| `src/assets/family/gary-tanner.jpg` | Gary's block on `/about/` (720×1080). Alt: "Gary Tanner with his wife" |
| `src/assets/projects/basement-1-1…1-4.png` | Project 1 — 4 photos |
| `src/assets/projects/basement-2-1…2-5.png` | Project 2 — 5 photos |
| `src/assets/projects/basement-3-1…3-5.png` | Project 3 — 5 photos |
| `src/assets/brand/wordmark-charcoal.svg` | Master lockup, light backgrounds (generated by `npm run icons`) |
| `src/assets/brand/wordmark-white.svg` | Master lockup, dark backgrounds (generated) |
| `public/brand/logo.png` | Schema.org `logo` (generated) |
| `public/og-default.png` | Default social share image (generated) |

**14 real project photos across 3 real projects**, defined in `src/data/projects.ts` with `permissionStatus: "granted"`. These are the owner's actual work. Rendered on `/projects/` and in the homepage "Our Work" section via `ProjectCard.astro`.

Other asset dirs: `src/assets/cities/`, `src/assets/services/`, `src/assets/placeholders/`, `src/assets/owner/` (currently empty).

`public/`: `og-default.png`, `brand/logo.png`, favicons (generated by `npm run icons` → `scripts/generate-icons.mjs`).

### Photography rules

- **Real project photography only.** No stock images of other people's basements presented as HTC work.
- Only photos with owner permission (`permissionStatus` tracks this).

---

## 12. CURRENT GIT STATE

**Branch:** `main` (also the PR base branch)
**Git user:** huntingtanner-byte
**Remote:** `origin` → https://github.com/huntingtanner-byte/Hunting-Tanner-Construction.git

### Recent commits

```
(this)   Rename the brand to Utah County Basement Pros                  ← BRAND RENAME
e32042a  Stop volunteering that the company is new
f27321b  Correct Gary's role, project timeline, and years of experience
c30f2e0  Restore the pre-refinement colour system, keep the new layout   ← COLOR CORRECTION
32bc618  Homepage refinement: shorter, more varied, better paced          ← HOMEPAGE RESTRUCTURING
bfaf4b9  Redesign around the Coastal Luxury palette                       ← palette baseline
91149f5  Fix wordmark alignment when it wraps at narrow widths
c3c6388  Use an explicit 301 for the basement finishing redirect
bcaf7bb  Remove unsupported comment key from vercel.json redirect
7a3bb54  Consolidate basement finishing into the homepage; SEO and form work
15cb0a0  Replace first/last name inputs with a single Name field
16ccba7  Replace sage green accent with blue-gray stone #546A7B
5ab8b7c  Mark go-live verification complete in launch checklist
867356c  Take the site live: allow crawling and publish the sitemap
31c4e4f  Surface licensing in the bio, About copy, contact page, and schema
164e2eb  Activate Utah contractor license #14298989-5501
ad0e4eb  Shift accent from teal to deep eucalyptus green
```

### Which commit is which

| Concern | Commit |
|---|---|
| **Homepage restructuring** (shortening, consolidation, What's Included removal, Why HTC + founders merge, content moved to `/services/`) | **`32bc618`** — layout is GOOD, keep it |
| **Color correction** (light Sea Glass buttons restored, taupe Why HTC removed, Charcoal process reverted) | **`c30f2e0`** — current HEAD, colors are GOOD, keep them |
| **Coastal Luxury palette baseline** — the reference point for what the "correct" colors are | **`bfaf4b9`** |

> `32bc618` contains **both** the good layout **and** the bad colors. `c30f2e0` removed only the bad colors. **This is exactly why you must never revert either commit wholesale.**

### Useful commands for future rollback / reference

```bash
git diff bfaf4b9 32bc618 -- src/styles/global.css
```

```bash
git show bfaf4b9:src/styles/global.css
```

```bash
git diff 32bc618 c30f2e0
```

`git diff 32bc618 c30f2e0` shows exactly what the color correction touched — **only color declarations and class names, no copy or markup.** It is the model for how to do a surgical change on this project.

### Uncommitted changes

None. Per Hunting's standing instruction, every change is committed and pushed to `main` (which auto-deploys) as part of finishing the task.

---

## 13. IMPORTANT RULE FOR FUTURE CLAUDE SESSIONS

*(Repeated from the top because it is the single most important thing in this document.)*

> ### DO NOT assume that an older version of the website is entirely better or entirely worse.
>
> The current website **intentionally combines**:
>
> **NEWER homepage content / layout / organization**
> **+**
> **the preferred LIGHTER visual / color treatment**
>
> **Do not revert entire commits when only one aspect needs changing.**
>
> **Use surgical edits and git history whenever possible.**

**In practice:**

1. Read this file before touching anything visual or structural.
2. When the owner reports disliking something, isolate **that one thing**. Find it in git (`git log -S "<value>"`, `git diff <a> <b> -- <file>`), extract the exact prior value, and change only that.
3. Never bundle an unrequested improvement into a targeted fix.
4. Run the §7 "do not like" checklist before shipping.
5. Verify contrast — but **never** by darkening the Sea Glass.
6. Verify against the **live site or a build**, not assumption. `npm run build` then grep `.vercel/output/static/**/*.html` is a fast, reliable check that the rendered HTML actually contains what you think.

---

## 14. CURRENT STATUS / TODO

### 🔴 Blocking / highest priority

1. **Register the DBA and update the contractor license (owner action, legal).** The site now advertises as Utah County Basement Pros. Hunting needs to confirm the assumed name (DBA) is filed with the **Utah Division of Corporations** and that **DOPL** has the DBA on file for license #14298989-5501. Utah contractor advertising is generally expected to match the licensed name and show the license number. The footer DBA line and the About page "trade name" sentence already tie the brand to the LLC and license.

2. **Resend domain verification for `huntingtanner.com`.** Lead emails currently **deliver but land in SPAM**. Needs the Resend DNS records (SPF/DKIM) added in Cloudflare — while preserving the existing **Google Workspace MX records** — and then `RESEND_FROM` set in Vercel to a verified `@huntingtanner.com` sender. This is the biggest live business risk: leads are arriving but may go unseen.

### 🟡 Open items

3. **Google Business Profile** — not yet created. **Create it under "Utah County Basement Pros"** (matching the site's `publicName` and schema `name` exactly). `business.googleBusinessProfileURL` is `""`. Once created and reviews come in, populate `src/data/reviews.ts`; `GoogleReviews.astro` renders nothing while the array is empty (by design — **never add fake reviews**).
4. **Attorney review of `/privacy-policy/` and `/terms/`.** The effective date "July 30, 2026" is a **placeholder**.
5. **Confirm Gary's bio details**, particularly the spelling of **Amaron Construction**, and confirm the California license history is stated accurately.
6. **Confirm insurance wording** against the actual carrier/policy. `insuranceClaimApproved: true` currently gates "licensed & insured" language.
7. **Social media URLs** — all empty in `business.ts`. Footer/schema links appear only when populated.
8. **Analytics** — `PUBLIC_GA_MEASUREMENT_ID`, `PUBLIC_GOOGLE_ADS_ID`, `PUBLIC_META_PIXEL_ID` are all unset, so `Analytics.astro` injects nothing. Standing rules: **no marketing scripts during staging, no invasive tracking, never log sensitive data in production.**
9. **Turnstile** spam protection was planned for the contact form (referenced in the `checkOrigin` comment) but is **not implemented**. Only the honeypot is active.

### 🟢 QA worth re-running after any change

- `npm run build` — must pass clean.
- Contrast sweep on desktop **and** mobile — expect **zero** failures.
- Homepage section tally: `section--dark` ×1, `section--alt` ×2, `section--taupe` ×0.
- Grep the built HTML for regressions: `co-founder`, `4-8 weeks`, `54706b`, `44605b`, `section--taupe`, any em dash in copy, any residential address.
- Mobile homepage height ≈ 13,973px.
- Exactly one `<h1>` per page; canonicals and JSON-LD intact.
- Form: POST to `/api/contact/` → **303** → `/thank-you/`.
- Wordmark at 320px: one line, no overlap with the Menu button (see §6).
- No old brand in built HTML: `Hunting Tanner Construction` may appear **only** as `Hunting Tanner Construction LLC`, and `HTC` not at all in visible text.

### 🎨 Colour exploration in progress (October 2026)

Hunting is considering a new palette for the rebrand. Branch **** (pushed, Vercel preview deployment, never to be merged) adds a floating switcher comparing:

- **Current** (Coastal: Sea Glass & Charcoal, still live on main)
- **Option 1, Walnut & Linen** (Hunting's top pick): #3B302A Dark Walnut, #78604D Tobacco, #AB9988 Warm Taupe, #E8DDD1 Linen, #FAF8F4 Soft White
- **Option 2, Timber & Sage**: #3C342F Deep Brown, #765A48 Cedar, #858E7A Muted Sage, #E2D8C9 Oat, #F9F6EF Cream

plus **Light / Dark main buttons** and **Standard / Lighter section bands** (lighter = the band colour halfway to the canvas, because Hunting has rejected tan section backgrounds before). All six combinations were checked: zero text below 4.5:1 on the homepage. Sage light buttons use a tint (#B3BAA7) because Muted Sage itself can't carry readable text.

**When Hunting picks one:** on , copy only (1) the token-ization of the hard-coded colours (hero overlay, button hovers, translucent borders, focus ring; the ,  tokens) and (2) the chosen palette's values into  in global.css. Do **not** merge the branch (it contains the switcher). Also update  in BaseLayout, the colour constants in  (then ), and §5 of this file. Then delete the  branch.

### 💡 Discussed but NOT implemented

- Turnstile / captcha on the contact form.
- Blog or resource content for long-tail SEO.
- Expansion pages for kitchens, additions, and custom homes (mentioned as the company's future direction on `/about/`, but no pages exist).
- Any CRM or lead-tracking integration beyond the Resend email.
- A `CLAUDE.md` file — was requested once but superseded by this HANDOFF.md, which covers the same ground.

### Standing rules (never violate)

- **No residential address** anywhere — copy, footer, contact page, structured data, source, or metadata.
- **Never invent** projects, licenses, reviews, statistics, awards, addresses, or credentials.
- **No hardcoded secrets**; no secrets in client code; no open email relay.
- **No marketing scripts during staging**; no invasive tracking.
- **Never log sensitive data in production.**
- **Gary is the Senior Advisor — never an owner/co-founder/partner, no equity, and never licensed in Utah.** Hunting is the only founder.
