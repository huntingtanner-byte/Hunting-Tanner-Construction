/**
 * Centralized business configuration for Hunting Tanner Construction LLC.
 *
 * This is the single source of truth for company facts, contact details,
 * site status, and third-party IDs. Update values here — never hardcode
 * them in pages or components.
 */

export type SiteStatus = "staging" | "live";

/** Site status. Override with PUBLIC_SITE_STATUS env var; defaults to staging. */
const envStatus = import.meta.env.PUBLIC_SITE_STATUS as SiteStatus | undefined;

export const business = {
  legalName: "Hunting Tanner Construction LLC",
  publicName: "Hunting Tanner Construction",
  domain: "https://huntingtanner.com",

  phoneDisplay: "(801) 901-8349",
  phoneHref: "tel:+18019018349",
  /** E.164-style value for structured data */
  phoneSchema: "+1-801-901-8349",

  email: "office@huntingtanner.com",
  emailHref: "mailto:office@huntingtanner.com",

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

  /** "staging" keeps the whole site noindex and disables form submission. */
  siteStatus: (envStatus ?? "staging") as SiteStatus,

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

  /** Google Business Profile share URL. Empty until the profile is live. */
  googleBusinessProfileURL: "",

  /**
   * Service-area summary used in copy and schema. The detailed per-city data
   * model lives in src/data/service-areas.ts.
   */
  serviceAreas: {
    primary: ["Saratoga Springs", "Lehi", "Utah County"],
    secondary: ["Herriman", "Salt Lake County"],
    summary:
      "Serving every community in northern Utah County and across the Salt Lake Valley.",
  },

  /** Analytics IDs — read from env; empty means the script is never injected. */
  analytics: {
    gaMeasurementId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? "",
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
