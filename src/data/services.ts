/** Centralized service definitions used on the homepage, services page, and internal links. */

export interface Service {
  title: string;
  /** Where the card links — a page or an anchored section */
  href: string;
  description: string;
  /** Short list of what this typically includes (used on /services/) */
  includes: string[];
}

export const coreServices: Service[] = [
  {
    title: "Full Basement Finishing",
    href: "/services/#whats-included",
    description:
      "Bedrooms, bathrooms, and living space, planned and managed from framing to final walkthrough.",
    includes: [
      "Space planning and layout design",
      "Framing, electrical, plumbing, and HVAC coordination",
      "Insulation, drywall, paint, and trim",
      "Flooring, doors, and finish details",
    ],
  },
  {
    title: "Basement Remodeling",
    href: "/basement-remodeling/",
    description:
      "Dated or poorly laid out? Reworking an existing basement changes how the whole home lives.",
    includes: [
      "Layout changes and wall reconfiguration",
      "Updated lighting and electrical",
      "New flooring, paint, and finishes",
      "Moisture and comfort improvements",
    ],
  },
  {
    title: "Basement Bathrooms & Bedrooms",
    href: "/services/#bathrooms-bedrooms",
    description:
      "A conforming bedroom and a full bath: the two upgrades that add the most function.",
    includes: [
      "Egress window planning for bedrooms",
      "Full and three-quarter bathrooms",
      "Plumbing rough-in completion",
      "Ventilation and lighting",
    ],
  },
  {
    title: "Wet Bars & Kitchenettes",
    href: "/services/#wet-bars",
    description:
      "A well-planned bar makes a basement feel like a destination, not a spare room.",
    includes: [
      "Cabinetry and countertop coordination",
      "Sinks, drink fridges, and appliances",
      "Task and accent lighting",
      "Snack centers for theater and family rooms",
    ],
  },
  {
    title: "Family & Entertainment Spaces",
    href: "/services/#family-rooms",
    description:
      "Media rooms, game areas, and family rooms designed around how you actually live.",
    includes: [
      "Media and theater areas",
      "Game and play spaces",
      "Built-ins and finish carpentry",
      "Sound and lighting planning",
    ],
  },
  {
    title: "Home Offices & Gyms",
    href: "/services/#offices-gyms",
    description:
      "Quiet, comfortable work and workout space, separated from the rest of the house.",
    includes: [
      "Dedicated office rooms with wiring for work",
      "Gym flooring and mirror planning",
      "Storage planning and built-ins",
      "Comfort: insulation, HVAC, lighting",
    ],
  },
];

/** Related capabilities listed on /services/ without dedicated pages yet. */
export const relatedServices: string[] = [
  "Storage planning and organization",
  "Built-ins and finish carpentry",
  "General residential remodeling inquiries",
];
