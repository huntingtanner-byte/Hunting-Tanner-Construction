/**
 * Named photos of finished basements, shown on the homepage ("Our Work")
 * and the Projects page. Supplied by Hunting in October 2026; the files
 * carry ChatGPT (C2PA) credentials, presented here on his instruction as
 * photos of his own finished basements. Titles describe only what is
 * visible: no locations or project details are claimed.
 */

export interface GalleryPhoto {
  /** File name inside src/assets/gallery/ */
  src: string;
  title: string;
  alt: string;
}

export const galleryPhotos: GalleryPhoto[] = [
  {
    src: "walkout-basement-kitchen-living.png",
    title: "Walkout Basement Kitchen & Living Area",
    alt: "Finished walkout basement with a full kitchen, white shaker cabinets, stainless appliances, wood-look flooring, and an exterior door",
  },
  {
    src: "open-family-room-oak-flooring.png",
    title: "Open Family Room with Oak-Look Flooring",
    alt: "Open basement family room with oak-look plank flooring, recessed lighting, and two egress windows",
  },
  {
    src: "l-shaped-rec-room.png",
    title: "L-Shaped Rec Room with Plush Carpet",
    alt: "L-shaped basement rec room with plush carpet, egress windows, and a hallway off the stairs",
  },
  {
    src: "family-room-egress-windows.png",
    title: "Family Room with Large Egress Windows",
    alt: "Carpeted basement family room with large egress windows, white trim, and recessed lighting",
  },
  {
    src: "charcoal-carpet-rec-room.png",
    title: "Sunlit Rec Room with Charcoal Carpet",
    alt: "Bright basement rec room with charcoal carpet, egress windows, and a hallway to the bedrooms",
  },
];
