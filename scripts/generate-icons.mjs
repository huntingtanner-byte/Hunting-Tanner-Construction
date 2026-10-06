/**
 * Generates every raster/vector brand asset from one lockup definition:
 *   - public/brand/logo.png              (schema.org logo Google reads)
 *   - public/og-default.png              (default social share image)
 *   - public/favicon.svg + PNG favicons  (browser tab, home screen)
 *   - src/assets/brand/wordmark-*.svg    (master wordmark files)
 *
 * Text is outlined from the same Source Serif 4 font the site header uses
 * (via @fontsource-variable + fontkitten), so the logo files match the
 * live HTML wordmark exactly and render identically on any machine,
 * with no dependence on system fonts.
 *
 * Run with: npm run icons
 */
import sharp from "sharp";
import { create } from "fontkitten";
import { readFileSync } from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";

/* ---- Brand ---- */
const CHARCOAL = "#2c3135";
const OFFWHITE = "#faf8f3";
const SEA_GLASS = "#aebfbc";
const MUTED = "#5c6367";

/** The lockup: small line above, large line below. Keep in sync with
 *  Header.astro / Footer.astro. Reads top to bottom as the full name. */
const SUB_TEXT = "UTAH COUNTY";
const NAME_TEXT = "BASEMENT PROS";
const MONOGRAM = "BP";

/* Ratios mirror the header CSS: name 1.25rem / 0.14em tracking,
   sub 0.66rem / 0.42em tracking. */
const SUB_RATIO = 0.528;
const NAME_TRACK = 0.14;
const SUB_TRACK = 0.42;

/* ---- Font outlining ---- */
const font = create(
  readFileSync(
    "node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2",
  ),
); // default instance of the variable font is wght 400, as in the header
const UPM = font.unitsPerEm;
const CAP = font.capHeight;

/**
 * Outlines `text` at `size` px with CSS-style letter-spacing (in em).
 * Returns path markup positioned with its left edge at x=0 and its
 * baseline at y=0, plus the visual width (trailing tracking excluded,
 * so centering is optical, same as the header's negative-margin trick).
 */
function outline(text, size, trackEm, fill) {
  const scale = size / UPM;
  const track = trackEm * size;
  let x = 0;
  const parts = [];
  [...text].forEach((ch, i) => {
    const glyph = font.glyphForCodePoint(ch.codePointAt(0));
    const d = glyph.path.toSVG();
    if (d) {
      parts.push(
        `<path transform="translate(${x.toFixed(2)} 0) scale(${scale} ${-scale})" d="${d}"/>`,
      );
    }
    x += glyph.advanceWidth * scale;
    if (i < text.length - 1) x += track;
  });
  return { svg: `<g fill="${fill}">${parts.join("")}</g>`, width: x };
}

/**
 * Builds the two-tier lockup. Returns inner SVG markup whose top-left is
 * (0,0), and its overall width/height.
 */
function lockup({ nameSize, ink, subInk, rule }) {
  const subSize = nameSize * SUB_RATIO;
  const name = outline(NAME_TEXT, nameSize, NAME_TRACK, ink);
  const sub = outline(SUB_TEXT, subSize, SUB_TRACK, subInk);

  const width = name.width;
  const subCap = (CAP / UPM) * subSize;
  const nameCap = (CAP / UPM) * nameSize;
  const lineGap = nameSize * 0.42; // space between the two tiers

  const subBaseline = subCap;
  const nameBaseline = subBaseline + lineGap + nameCap;
  const subX = (width - sub.width) / 2;

  // Hairlines run from the lockup edges to just short of the small line
  const gap = subSize * 0.9;
  const ruleY = subBaseline - subCap / 2;
  const ruleW = Math.max(0, subX - gap);
  const stroke = Math.max(1, nameSize * 0.022);
  const rules =
    ruleW > 0
      ? `<g fill="${rule}">
           <rect x="0" y="${(ruleY - stroke / 2).toFixed(2)}" width="${ruleW.toFixed(2)}" height="${stroke.toFixed(2)}"/>
           <rect x="${(width - ruleW).toFixed(2)}" y="${(ruleY - stroke / 2).toFixed(2)}" width="${ruleW.toFixed(2)}" height="${stroke.toFixed(2)}"/>
         </g>`
      : "";

  const svg = `
    ${rules}
    <g transform="translate(${subX.toFixed(2)} ${subBaseline.toFixed(2)})">${sub.svg}</g>
    <g transform="translate(0 ${nameBaseline.toFixed(2)})">${name.svg}</g>`;

  return { svg, width, height: nameBaseline };
}

const svgDoc = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w)}" height="${Math.round(h)}" viewBox="0 0 ${w.toFixed(2)} ${h.toFixed(2)}">${
    bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ""
  }${body}</svg>`;

/** Wraps a lockup with padding into a standalone SVG document. */
function lockupDoc(opts, pad, bg) {
  const l = lockup(opts);
  const w = l.width + pad * 2;
  const h = l.height + pad * 2;
  return svgDoc(w, h, `<g transform="translate(${pad} ${pad})">${l.svg}</g>`, bg);
}

/* ---- Outputs ---- */
await mkdir("public/brand", { recursive: true });
await mkdir("src/assets/brand", { recursive: true });

// Master wordmarks (vector)
await writeFile(
  "src/assets/brand/wordmark-charcoal.svg",
  lockupDoc({ nameSize: 160, ink: CHARCOAL, subInk: MUTED, rule: SEA_GLASS }, 40),
);
await writeFile(
  "src/assets/brand/wordmark-white.svg",
  lockupDoc({ nameSize: 160, ink: OFFWHITE, subInk: "#b8bcbd", rule: SEA_GLASS }, 40),
);

// Schema logo: transparent, generous resolution
await sharp(
  Buffer.from(
    lockupDoc({ nameSize: 200, ink: CHARCOAL, subInk: MUTED, rule: SEA_GLASS }, 60),
  ),
)
  .png()
  .toFile("public/brand/logo.png");

// Default share image (1200x630): Soft White, Sea Glass band, lockup, tagline
{
  const W = 1200;
  const H = 630;
  const l = lockup({ nameSize: 76, ink: CHARCOAL, subInk: MUTED, rule: SEA_GLASS });
  const tag = outline(
    "Basement Finishing  ·  Utah County & Salt Lake Valley",
    25,
    0.04,
    MUTED,
  );
  const blockH = l.height + 70 + 25 * (CAP / UPM);
  const top = (H - blockH) / 2 + 5;
  const body = `
    <rect x="0" y="0" width="${W}" height="10" fill="${SEA_GLASS}"/>
    <g transform="translate(${((W - l.width) / 2).toFixed(2)} ${top.toFixed(2)})">${l.svg}</g>
    <g transform="translate(${((W - tag.width) / 2).toFixed(2)} ${(top + l.height + 70).toFixed(2)})">${tag.svg}</g>`;
  await sharp(Buffer.from(svgDoc(W, H, body, OFFWHITE)))
    .png()
    .toFile("public/og-default.png");
}

// Monogram favicon: Soft White serif initials over a Sea Glass hairline
const monogramSvg = (size, radius) => {
  const m = outline(MONOGRAM, 44, 0.06, OFFWHITE);
  const cap = (CAP / UPM) * 44;
  const baseline = 50 + cap / 2 - 4;
  const ruleW = m.width * 0.62;
  return svgDoc(
    size,
    size,
    `<g transform="scale(${size / 100})">
       <rect width="100" height="100" rx="${radius}" fill="${CHARCOAL}"/>
       <g transform="translate(${((100 - m.width) / 2).toFixed(2)} ${baseline.toFixed(2)})">${m.svg}</g>
       <rect x="${((100 - ruleW) / 2).toFixed(2)}" y="${(baseline + 9).toFixed(2)}" width="${ruleW.toFixed(2)}" height="2.4" fill="${SEA_GLASS}"/>
     </g>`,
  );
};

await writeFile("public/favicon.svg", monogramSvg(64, 18));
for (const [file, size] of [
  ["public/favicon-192.png", 192],
  ["public/favicon-512.png", 512],
  ["public/apple-touch-icon.png", 180],
]) {
  await sharp(Buffer.from(monogramSvg(size, 18))).png().toFile(file);
}

console.log("Brand assets generated.");
