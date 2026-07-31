/**
 * Featured service areas shown on the homepage and in schema.
 *
 * Two tiers, presented differently:
 *  - featuredCities: individual markets with hand-authored pages
 *  - featuredCounties: the county-wide hubs, which link out to every
 *    city page (data for those lives in src/data/cities/)
 */

export interface ServiceArea {
  /** City or region name */
  name: string;
  /** State */
  state: "Utah";
  /** Canonical path of the dedicated landing page */
  href: string;
  /** Whether this is a primary or secondary market */
  tier: "primary" | "secondary";
  /** Short blurb used on cards and the service-area section */
  blurb: string;
  /** schema.org type for areaServed entries */
  schemaType: "City" | "AdministrativeArea";
}

/** Individual markets, in display order. */
export const featuredCities: ServiceArea[] = [
  {
    name: "Saratoga Springs",
    state: "Utah",
    href: "/saratoga-springs-basement-finishing/",
    tier: "primary",
    blurb:
      "Newer homes with unfinished basements are everywhere in Saratoga Springs. Finishing yours is often the most cost-effective way to add living space.",
    schemaType: "City",
  },
  {
    name: "Lehi",
    state: "Utah",
    href: "/lehi-basement-finishing/",
    tier: "primary",
    blurb:
      "From Traverse Mountain to established neighborhoods near downtown, Lehi basements become offices, guest suites, and family space.",
    schemaType: "City",
  },
  {
    name: "Herriman",
    state: "Utah",
    href: "/herriman-basement-finishing/",
    tier: "secondary",
    blurb:
      "Just over the county line, Herriman's newer neighborhoods are full of basements waiting to become finished space.",
    schemaType: "City",
  },
];

/** County-wide hubs linking to every city page. */
export const featuredCounties: ServiceArea[] = [
  {
    name: "Utah County",
    state: "Utah",
    href: "/utah-county-basement-finishing/",
    tier: "primary",
    blurb:
      "A Utah County based residential contractor serving homeowners at their properties across the county.",
    schemaType: "AdministrativeArea",
  },
  {
    name: "Salt Lake County",
    state: "Utah",
    href: "/salt-lake-county-basement-finishing/",
    tier: "secondary",
    blurb:
      "From Draper and Sandy through the west valley, we serve homeowners across the Salt Lake Valley.",
    schemaType: "AdministrativeArea",
  },
];

/** Everything, for schema areaServed and cross-page link lists. */
export const featuredAreas: ServiceArea[] = [
  ...featuredCities,
  ...featuredCounties,
];

/**
 * Additional communities referenced in copy (no dedicated pages).
 * Full per-city page data lives in src/data/cities/.
 */
export const nearbyCommunities: string[] = ["Cedar Fort", "Fairfield", "White City"];
