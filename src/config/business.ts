/**
 * Centralized business configuration for Utah County Basement Pros, a DBA
 * of Hunting Tanner Construction LLC.
 *
 * This is the single source of truth for company facts, contact details,
 * site status, and third-party IDs. Update values here — never hardcode
 * them in pages or components.
 */

export type SiteStatus = "staging" | "live";

/**
 * Site status. The site launched in August 2026, so "live" is the default:
 * pages are indexable, robots.txt allows crawling, the sitemap is generated,
 * and the contact form submits. Override with the PUBLIC_SITE_STATUS env var
 * only if the site ever needs to be pulled back to staging.
 */
const envStatus = import.meta.env.PUBLIC_SITE_STATUS as SiteStatus | undefined;

export const business = {
  /** The registered entity. Used only where the law requires it: the DBA
   *  disclosure, the legal pages, copyright, and schema legalName. */
  legalName: "Hunting Tanner Construction LLC",
  /** The brand customers see everywhere else. */
  publicName: "Utah County Basement Pros",
  /** Short form for tight spaces (web app manifest, email sender). */
  shortName: "Basement Pros",
  /** Primary domain (moved from huntingtanner.com, October 2026). Change this,
   *  astro.config.mjs `site`, and vercel.json redirects together. */
  domain: "https://utahcountybasementpros.com",

  phoneDisplay: "(801) 901-8349",
  phoneHref: "tel:+18019018349",
  /** Text the same (Google Voice) number, with a starter message filled in.
   *  "?&body=" is the form both iOS and Android Messages accept. */
  smsHref:
    "sms:+18019018349?&body=Hi!%20I%27m%20interested%20in%20a%20free%20basement%20consultation.",
  /** E.164-style value for structured data */
  phoneSchema: "+1-801-901-8349",

  email: "office@utahcountybasementpros.com",
  emailHref: "mailto:office@utahcountybasementpros.com",

  /**
   * LICENSING — issued and active as of August 2026. The footer license
   * badge and the "Licensed & insured" trust-strip item are driven by
   * canClaimLicensed, which requires BOTH the flag and a number.
   */
  licenseNumber: "14298989-5501",
  licenseActive: true,

  /**
   * Insurance wording has been approved by ownership (insuranceClaimApproved).
   * Actual "insured" language still only appears alongside licensing once
   * licenseActive is true — see CONTENT-TODO.md.
   */
  insuranceClaimApproved: true,

  /** "live" = indexable + crawlable. "staging" would noindex the whole site. */
  siteStatus: (envStatus ?? "live") as SiteStatus,

  /**
   * Social profiles. Leave empty until profiles exist — empty entries are
   * skipped everywhere (footer, schema sameAs, etc.).
   */
  socialMediaURLs: {
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
  },

  /**
   * The staffed office shown on the Google Business Profile (Hunting
   * confirmed it is staffed and should be public, October 30, 2026).
   * Keep name, address, and phone identical to the GBP everywhere.
   * Never put a residential address here.
   * November 8, 2026: Hunting doesn't want walk-in visits. Show this as
   * the business address (footer, contact page, schema) to match the GBP,
   * and never add copy that invites office visits or meetings ("stop by",
   * "meet us at the office"). The "Get directions on Google Maps" link on
   * /contact/ and the footer's GBP link stay (Hunting wants what's best
   * for ranking). If the GBP address is ever hidden, remove the street
   * address from the site the same day.
   */
  location: {
    streetAddress: "2701 N Thanksgiving Way",
    locality: "Lehi",
    region: "UT",
    regionName: "Utah",
    postalCode: "84043",
    country: "US",
    /** The GBP map pin */
    latitude: 40.4209358,
    longitude: -111.8816934,
  },

  /**
   * Business hours, matching the GBP. Change both together. One entry per
   * group of days with the same hours: the footer and /contact/ show one
   * line each, and the schema emits one OpeningHoursSpecification each.
   * Saturday added November 8, 2026 (Hunting).
   */
  hours: {
    schedule: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
        display: "Mon–Fri, 8 AM – 8 PM",
      },
      {
        days: ["Saturday"],
        opens: "09:00",
        closes: "16:00",
        display: "Sat, 9 AM – 4 PM",
      },
    ],
    /** Single-line version for plain text (llms.txt) */
    display: "Mon–Fri, 8 AM – 8 PM; Sat, 9 AM – 4 PM",
  },

  /** Google Business Profile, by its permanent Maps listing ID (CID). */
  googleBusinessProfileURL: "https://maps.google.com/?cid=7629791764318187044",

  /**
   * Service-area summary used in copy and schema. The detailed per-city data
   * model lives in src/data/service-areas.ts.
   */
  serviceAreas: {
    primary: ["Saratoga Springs", "Lehi", "Eagle Mountain", "Utah County"],
    secondary: ["Herriman", "Salt Lake County"],
    summary:
      "Serving every community in northern Utah County and across the Salt Lake Valley.",
  },

  /** Analytics IDs — read from env; empty means the script is never injected.
   *  GA4 (November 2, 2026): property "utahcountybasementpros.com" under
   *  office@utahcountybasementpros.com. A measurement ID is public by design
   *  (it ships in every page), so it lives here as the default. */
  analytics: {
    gaMeasurementId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID || "G-1H7YJBHBFX",
    googleAdsId: import.meta.env.PUBLIC_GOOGLE_ADS_ID ?? "",
    metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID ?? "",
    googleSiteVerification:
      import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },

  /**
   * Form endpoint configuration. `enabled: true` makes the LeadForm POST to
   * the serverless endpoint (src/pages/api/contact.ts), which emails leads
   * to CONTACT_NOTIFICATION_EMAIL via Resend. Set enabled: false to fall
   * back to the friendly "call us instead" interception.
   */
  form: {
    enabled: true,
    endpoint: "/api/contact/",
    method: "POST" as const,
    redirectOnSuccess: "/thank-you/",
  },
} as const;

export const isLive = business.siteStatus === "live";
export const isStaging = business.siteStatus === "staging";

/** True only when it is accurate to describe the company as licensed. */
export const canClaimLicensed =
  business.licenseActive && business.licenseNumber.length > 0;

/** Social URLs that actually exist (for footer + schema sameAs). */
export const activeSocialLinks = Object.entries(business.socialMediaURLs)
  .filter(([, url]) => url.length > 0)
  .map(([network, url]) => ({ network, url }));
