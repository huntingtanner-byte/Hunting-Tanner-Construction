/**
 * Project/portfolio data.
 *
 * RULES:
 *  - Only publish photos HTC has the right to use, with permission on file.
 *  - `permissionStatus` must be "granted" before a project renders publicly.
 *  - Never attach stock imagery to a project entry.
 *  - Locations and dates appear only when confirmed. Don't guess.
 *  - Testimonials require written permission; leave undefined until then.
 *
 * Image files live in src/assets/projects/ and are referenced by filename.
 * See PROJECT-CONTENT-GUIDE.md for how to document future projects.
 */

export interface ProjectImage {
  /** Filename under src/assets/projects/ */
  src: string;
  alt: string;
}

export interface Project {
  /** URL-safe unique id */
  id: string;
  title: string;
  /** Optional, only when confirmed (e.g. "Saratoga Springs") */
  location?: string;
  /** Short scope summary shown on cards */
  scope: string;
  description: string;
  /** First image is the card cover */
  gallery: ProjectImage[];
  /** ISO date, e.g. "2026-10-15", only when confirmed */
  completionDate?: string;
  /** Only with written homeowner permission */
  testimonial?: {
    quote: string;
    attribution: string;
  };
  permissionStatus: "pending" | "granted" | "declined";
}

export const projects: Project[] = [
  {
    id: "open-concept-basement-kitchen-laundry",
    title: "Open-Concept Basement with Full Kitchen",
    scope: "Full kitchen, oversized family room, bathroom, bedroom, laundry",
    description:
      "A big, light-filled lower level built around one wide-open space: a full kitchen with shaker cabinetry, quartz counters, and brass fixtures, flowing into a family room with room for a sectional, a game table, and then some. Down the hall sit a bedroom with a double-door closet, a full bathroom with brass finishes, and a dedicated laundry nook with built-in shelving.",
    gallery: [
      {
        src: "basement-2-1.png",
        alt: "Open basement family room and kitchen with taupe shaker cabinets, stainless appliances, and light wood-look flooring",
      },
      {
        src: "basement-2-2.png",
        alt: "Wide basement family room with recessed lighting flowing into the kitchen area",
      },
      {
        src: "basement-2-3.png",
        alt: "Basement bathroom with tiled tub shower, taupe vanity, and brass fixtures",
      },
      {
        src: "basement-2-4.png",
        alt: "Basement hallway with laundry nook, front-load washer and dryer, and built-in shelf",
      },
      {
        src: "basement-2-5.png",
        alt: "Basement bedroom with egress window and double-door closet",
      },
    ],
    permissionStatus: "granted",
  },
  {
    id: "sage-brass-basement-finish",
    title: "Sage & Brass Basement Finish",
    scope: "Kitchenette with island, family area, bedroom, bathroom, laundry",
    description:
      "A basement with real personality: sage-green cabinetry, brass hardware and plumbing fixtures, and a quartz-topped island anchoring the kitchenette. The open family area connects to a bedroom with an egress window, a full bathroom with vertical-stack tile and a brass-framed mirror, and a hallway laundry closet that keeps the whole floor self-sufficient.",
    gallery: [
      {
        src: "basement-3-1.png",
        alt: "Sage green basement kitchenette with island, brass faucet, and stainless appliances",
      },
      {
        src: "basement-3-2.png",
        alt: "Open basement family area beside the sage kitchenette",
      },
      {
        src: "basement-3-3.png",
        alt: "Basement bedroom with window well window and double closet doors",
      },
      {
        src: "basement-3-4.png",
        alt: "Basement bathroom with sage vanity, brass fixtures, and glossy tiled tub shower",
      },
      {
        src: "basement-3-5.png",
        alt: "Basement hallway leading to the kitchenette, with laundry closet",
      },
    ],
    permissionStatus: "granted",
  },
  {
    id: "greige-basement-suite",
    title: "Greige Basement Suite",
    scope: "Kitchenette, full bathroom, two bedrooms, hallway storage",
    description:
      "A clean, quiet palette put to work: a kitchenette with a wraparound peninsula and stainless appliances, a full bathroom with a tiled tub shower and quartz-topped vanity, and two comfortable bedrooms, one with a walk-in closet. Warm greige cabinetry and light flooring keep the below-grade rooms feeling bright all day.",
    gallery: [
      {
        src: "basement-1-1.png",
        alt: "Greige basement kitchenette with peninsula seating, stainless appliances, and long daylight hallway",
      },
      {
        src: "basement-1-2.png",
        alt: "White basement bathroom with tub shower, tile niche, and greige vanity",
      },
      {
        src: "basement-1-3.png",
        alt: "Basement bedroom with window well window and closet",
      },
      {
        src: "basement-1-4.png",
        alt: "Basement bedroom with walk-in closet and wide egress window",
      },
    ],
    permissionStatus: "granted",
  },
];

/** Projects cleared for public display. */
export const publishableProjects = projects.filter(
  (p) => p.permissionStatus === "granted",
);
