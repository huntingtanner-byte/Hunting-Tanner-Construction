/** Aggregated city-page data + helpers. */
import type { CityPage } from "./types";
import { utahCountyCities } from "./utah-county";
import { saltLakeCountyCities } from "./salt-lake-county";

export type { CityPage } from "./types";
export { cityPath } from "./types";
export { utahCountyCities, saltLakeCountyCities };

/** All data-driven city pages (excludes the four hand-authored pages). */
export const allCityPages: CityPage[] = [
  ...utahCountyCities,
  ...saltLakeCountyCities,
];

/**
 * Hand-authored pages that already exist as standalone .astro files.
 * Used for cross-linking; the dynamic route must NOT generate these slugs.
 */
export const handAuthoredCities = [
  { name: "Saratoga Springs", slug: "saratoga-springs", county: "Utah County" },
  { name: "Lehi", slug: "lehi", county: "Utah County" },
  { name: "Herriman", slug: "herriman", county: "Salt Lake County" },
] as const;

/** Every city with a page (data-driven + hand-authored), for hubs/footers. */
export const allServiceCities: { name: string; slug: string; county: string }[] =
  [
    ...handAuthoredCities,
    ...allCityPages.map((c) => ({
      name: c.name,
      slug: c.slug,
      county: c.county,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name));

export const utahCountyServiceCities = allServiceCities.filter(
  (c) => c.county === "Utah County",
);
export const saltLakeCountyServiceCities = allServiceCities.filter(
  (c) => c.county === "Salt Lake County",
);
