/**
 * Photo and plan uploads on the lead forms (added November 2026).
 *
 * How a file travels:
 *  1. The visitor picks photos or a plan set. The browser uploads each one
 *     straight to the private Vercel Blob store "lead-uploads", using a
 *     short-lived token from /api/upload. Files never pass through our
 *     function, which is how they get past Vercel's 4.5 MB request limit.
 *  2. The form posts only the stored pathnames. /api/contact downloads the
 *     files, attaches them to the lead email, then deletes them from the
 *     store. Uploads that are never sent get cleared after a week.
 *
 * These limits are shared by the browser and the server. The total keeps
 * every lead email under Resend's 40 MB cap, which is measured after
 * Base64 encoding (a third bigger than the files themselves).
 */

export const UPLOAD_FOLDER = "leads/";
export const MAX_FILES = 10;
export const MAX_TOTAL_BYTES = 25 * 1024 * 1024;

const TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
};

/** Photos and PDF plan sets only */
export const ALLOWED_TYPES = [...new Set(Object.values(TYPE_BY_EXTENSION))];

/** Stored pathnames: the folder, a cleaned file name, Blob's random suffix */
export const PATHNAME_RE = /^leads\/[A-Za-z0-9_-][A-Za-z0-9._-]{0,199}$/;

/**
 * The allowed media type for a file, or null if it isn't a photo or PDF.
 * Falls back to the extension because some browsers report HEIC files
 * with no type at all.
 */
export function uploadTypeFor(file: { name: string; type: string }): string | null {
  if (ALLOWED_TYPES.includes(file.type)) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return TYPE_BY_EXTENSION[extension] ?? null;
}

/** A storage-safe file name: letters, digits, dots, dashes, underscores. */
export function storageName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    // Keep the end, so the extension survives a very long name
    .slice(-120)
    .replace(/^[.-]+/, "");
  return cleaned || "file";
}

/** "840 KB" / "2.4 MB" sizes for the form and the lead email */
export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
