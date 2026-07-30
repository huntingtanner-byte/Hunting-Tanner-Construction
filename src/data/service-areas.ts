/**
 * Centralized service-area data. The four featured markets have dedicated,
 * individually authored pages. "Nearby communities" are listed on pages but
 * intentionally do NOT get their own thin pages yet — see CITY-PAGE-GUIDE.md
 * before adding more.
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

export const featuredAreas: ServiceArea[] = [
  {
    name: "Saratoga Springs",
    state: "Utah",
    href: "/saratoga-springs-basement-finishing/",
    tier: "primary",
    blurb:
      "Newer homes with unfinished basements are everywhere in Saratoga Springs — finishing yours is often the most cost-effective way to add living space.",
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
    name: "Utah County",
    state: "Utah",
    href: "/utah-county-basement-finishing/",
    tier: "primary",
    blurb:
      "A Utah County–based residential contractor serving homeowners at their properties across the county.",
    schemaType: "AdministrativeArea",
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

/**
 * Additional Utah County communities served. Listed in copy and schema, but
 * without dedicated pages until there is genuinely distinct content for them.
 */
export const nearbyCommunities: string[] = [
  "Vineyard",
  "Eagle Mountain",
  "American Fork",
  "Pleasant Grove",
  "Lindon",
  "Orem",
  "Provo",
  "Spanish Fork",
  "Springville",
  "Highland",
  "Alpine",
  "Cedar Hills",
];
