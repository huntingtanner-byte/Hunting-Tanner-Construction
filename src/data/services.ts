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
    href: "/basement-finishing/",
    description:
      "Turn an unfinished basement into bedrooms, bathrooms, and living space, planned, permitted, and managed from framing to final walkthrough.",
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
      "Already finished but dated or poorly laid out? Reworking an existing basement can change how your whole home lives.",
    includes: [
      "Layout changes and wall reconfiguration",
      "Updated lighting and electrical",
      "New flooring, paint, and finishes",
      "Moisture and comfort improvements",
    ],
  },
  {
    title: "Basement Bathrooms & Bedrooms",
    href: "/basement-finishing/#bathrooms-bedrooms",
    description:
      "Add a conforming bedroom or a full bathroom downstairs: the two upgrades that add the most day-to-day function.",
    includes: [
      "Egress window planning for bedrooms",
      "Full and three-quarter bathrooms",
      "Plumbing rough-in completion",
      "Ventilation and lighting",
    ],
  },
  {
    title: "Wet Bars & Kitchenettes",
    href: "/basement-finishing/#wet-bars",
    description:
      "A well-planned wet bar or kitchenette makes a basement feel like a destination instead of a spare room.",
    includes: [
      "Cabinetry and countertop coordination",
      "Sinks, drink fridges, and appliances",
      "Task and accent lighting",
      "Snack centers for theater and family rooms",
    ],
  },
  {
    title: "Family & Entertainment Spaces",
    href: "/basement-finishing/#family-rooms",
    description:
      "Media rooms, game areas, and big family rooms designed around how you actually want to use the space.",
    includes: [
      "Media and theater areas",
      "Game and play spaces",
      "Built-ins and finish carpentry",
      "Sound and lighting planning",
    ],
  },
  {
    title: "Home Offices & Gyms",
    href: "/basement-finishing/#offices-gyms",
    description:
      "Purpose-built work and workout space that's quiet, comfortable, and separated from the rest of the house.",
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
