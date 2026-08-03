/**
 * Generates favicons and the default Open Graph image from inline SVG.
 * Run with: npm run icons
 * Uses sharp (already installed as an Astro dependency).
 */
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

/** Palette: deep marine / white / eucalyptus */
const CHARCOAL = "#1f3438";
const OFFWHITE = "#ffffff";
const EUCALYPTUS = "#98aa9d";

const monogramSvg = (size, radius) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${radius}" fill="${CHARCOAL}"/>
  <text x="50" y="66" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="46" letter-spacing="1" fill="${OFFWHITE}">HT</text>
</svg>`;

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${OFFWHITE}"/>
  <rect x="0" y="0" width="1200" height="10" fill="${EUCALYPTUS}"/>
  <text x="600" y="300" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="64" letter-spacing="6" fill="${CHARCOAL}">HUNTING TANNER</text>
  <text x="600" y="370" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="14" fill="${CHARCOAL}">CONSTRUCTION</text>
  <text x="600" y="470" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" letter-spacing="2" fill="#56635e">Basement Finishing · Utah County, Utah</text>
</svg>`;

await mkdir("public", { recursive: true });

// Browser-tab favicon (SVG, crisp at any size)
await writeFile("public/favicon.svg", monogramSvg(64, 18).trim());

// PNG fallbacks + manifest icons
for (const [file, size] of [
  ["public/favicon-192.png", 192],
  ["public/favicon-512.png", 512],
  ["public/apple-touch-icon.png", 180],
]) {
  await sharp(Buffer.from(monogramSvg(size, 18)))
    .resize(size, size)
    .png()
    .toFile(file);
}

// Default social share image
await sharp(Buffer.from(ogSvg)).png().toFile("public/og-default.png");

console.log("Icons and OG image generated.");
