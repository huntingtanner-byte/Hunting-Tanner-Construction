/**
 * Project data model — prepared for real HTC projects.
 *
 * IMPORTANT RULES:
 *  - Only add projects HTC actually completed.
 *  - Only publish photos HTC has the right to use, with homeowner permission.
 *  - `permissionStatus` must be "granted" before a project renders publicly.
 *  - Never attach placeholder/stock imagery to a Project entry.
 *  - Testimonials require written permission; leave `testimonial` undefined
 *    until permission is on file.
 *
 * See PROJECT-CONTENT-GUIDE.md for how to photograph and document projects.
 */

export interface ProjectImage {
  /** Path under src/assets/projects/ */
  src: string;
  alt: string;
}

export interface Project {
  /** URL-safe unique id, e.g. "saratoga-springs-media-room-2026" */
  id: string;
  title: string;
  city: string;
  /** Short scope summary, e.g. "1,400 sq ft finish — 2 bedrooms, bath, family room" */
  scope: string;
  beforeImage?: ProjectImage;
  progressImages?: ProjectImage[];
  afterImage?: ProjectImage;
  /** ISO date, e.g. "2026-10-15" */
  completionDate?: string;
  description: string;
  /** Only with written homeowner permission */
  testimonial?: {
    quote: string;
    attribution: string;
  };
  permissionStatus: "pending" | "granted" | "declined";
}

/**
 * No completed projects yet — HTC is a new company and this site does not
 * simulate work that hasn't happened. The /projects/ page shows an honest
 * "photography coming soon" state until real entries are added here.
 */
export const projects: Project[] = [];

/** Projects that are cleared for public display. */
export const publishableProjects = projects.filter(
  (p) => p.permissionStatus === "granted",
);
