/**
 * City landing-page content model.
 *
 * Every city page is authored here with genuinely distinct copy: its own
 * angle, its own project list, its own planning notes, and its own FAQs.
 * The [city].astro dynamic route renders these with one of three layout
 * variants so pages differ in structure as well as words.
 *
 * RULES (see CITY-PAGE-GUIDE.md):
 *  - No invented city facts, permit fees, or timelines
 *  - No claimed offices or physical presence in any city
 *  - FAQs must be unique to the city's housing reality, not re-worded copies
 */
import type { FAQ } from "@/data/faqs";

export interface CitySection {
  heading: string;
  /** Paragraphs of body copy */
  body: string[];
}

export interface CityProjectItem {
  title: string;
  body: string;
}

export interface CityPage {
  /** URL slug prefix, e.g. "eagle-mountain" → /eagle-mountain-basement-finishing/ */
  slug: string;
  name: string;
  county: "Utah County" | "Salt Lake County";
  /** <title> (unique, ≤ 65 chars ideally) */
  metaTitle: string;
  /** meta description (unique, ~150 chars) */
  metaDescription: string;
  h1: string;
  lede: string;
  /** Opening section paragraphs */
  intro: string[];
  /** The city-specific angle section */
  angle: CitySection;
  /** What homeowners here actually build */
  projectsHeading: string;
  projects: CityProjectItem[];
  /** Local planning notes */
  planning: CitySection;
  /** Nearby communities; slugs link to their pages when present */
  neighbors: { name: string; slug?: string }[];
  faqsHeading: string;
  faqs: FAQ[];
  ctaHeading: string;
  ctaText: string;
  /**
   * Layout variant:
   *  "a" = intro → angle → projects → planning → neighbors → FAQs
   *  "b" = intro → projects → angle → planning → FAQs → neighbors
   *  "c" = intro → angle → planning → projects → neighbors → FAQs (with process strip)
   */
  layout: "a" | "b" | "c";
}

/** Canonical path for a city page. */
export const cityPath = (city: Pick<CityPage, "slug">): string =>
  `/${city.slug}-basement-finishing/`;
