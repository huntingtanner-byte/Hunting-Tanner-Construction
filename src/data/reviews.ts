/**
 * Google Business Profile reviews shown on the homepage.
 *
 * RULES (non-negotiable, same standard as src/data/projects.ts):
 *  - Only real reviews that actually exist on the Google Business Profile.
 *  - Copy the reviewer name exactly as Google displays it (first name +
 *    last initial is what Google shows publicly; do not add surnames).
 *  - Never write, embellish, paraphrase, or "clean up" a review.
 *  - Never invent a rating.
 *
 * The homepage section renders ONLY when this array has entries, so an
 * empty list simply hides the section rather than showing empty stars.
 *
 * HOW TO ADD REVIEWS
 *  1. Open your Google Business Profile and find the review.
 *  2. Copy the reviewer's displayed name, the star rating, the review
 *     text, and the month/year it was posted.
 *  3. Add an entry below and redeploy.
 *
 * See CONTENT-TODO.md for the automated alternatives (Places API or a
 * third-party widget) and why this manual approach is used for now.
 */

export interface Review {
  /** Reviewer name exactly as Google displays it, e.g. "Sarah M." */
  author: string;
  /** Whole stars, 1-5, exactly as given */
  rating: 1 | 2 | 3 | 4 | 5;
  /** The review text, verbatim */
  text: string;
  /** Human-readable date as shown, e.g. "September 2026" */
  date: string;
  /** Optional: the city the project was in, if you know it */
  city?: string;
}

/**
 * Empty until the Google Business Profile is created and earns reviews.
 * The site does not display placeholder or sample reviews.
 */
export const reviews: Review[] = [];

/** Average rating, computed from real reviews only. */
export const averageRating: number | null =
  reviews.length > 0
    ? Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
      ) / 10
    : null;

export const reviewCount = reviews.length;
