/**
 * Photos and plans sent with a lead (see src/lib/uploads.ts for the flow).
 *
 * The form posts only pathnames, so everything is re-checked here, and
 * reads go through the Blob SDK with our own token: a forged pathname
 * can't reach anything outside this store's leads/ folder.
 */
import { del, get, list } from "@vercel/blob";
import {
  MAX_FILES,
  MAX_TOTAL_BYTES,
  PATHNAME_RE,
  UPLOAD_FOLDER,
} from "@/lib/uploads";

/** Uploads that never made it into a sent lead are deleted after this. */
const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/** Where Hunting can still find a file that didn't go out with the email */
export const STILL_SAVED = "still saved in Vercel → Storage → lead-uploads";

export interface AttachmentRef {
  pathname: string;
  name: string;
}

export interface FetchedAttachment {
  pathname: string;
  filename: string;
  content: Buffer;
  size: number;
  contentType?: string;
}

export interface MissedAttachment {
  name: string;
  reason: string;
}

/** Display name for the email: no paths, no control characters. */
function cleanName(value: unknown, pathname: string): string {
  const name =
    typeof value === "string"
      ? value.replace(/[\u0000-\u001f\u007f/\\]/g, " ").trim().slice(0, 120)
      : "";
  return name || pathname.slice(UPLOAD_FOLDER.length);
}

/** Parses the form's hidden "attachments" field: [{ pathname, name }]. */
export function parseAttachmentRefs(
  raw: FormDataEntryValue | null,
): AttachmentRef[] {
  if (typeof raw !== "string" || raw === "") return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const refs: AttachmentRef[] = [];
  for (const item of data.slice(0, MAX_FILES)) {
    const pathname =
      typeof item?.pathname === "string" ? item.pathname : "";
    if (!PATHNAME_RE.test(pathname)) continue;
    if (refs.some((ref) => ref.pathname === pathname)) continue;
    refs.push({ pathname, name: cleanName(item?.name, pathname) });
  }
  return refs;
}

/** Downloads the files for the email, up to the 25 MB total. */
export async function fetchAttachments(
  refs: AttachmentRef[],
  token: string | undefined,
): Promise<{ attached: FetchedAttachment[]; missed: MissedAttachment[] }> {
  const attached: FetchedAttachment[] = [];
  const missed: MissedAttachment[] = [];
  let total = 0;

  for (const ref of refs) {
    try {
      const result = await get(ref.pathname, { access: "private", token });
      if (!result || result.statusCode !== 200 || !result.stream) {
        missed.push({
          name: ref.name,
          reason: "no longer in storage (it may have been sent already)",
        });
        continue;
      }
      if (total + (result.blob.size ?? 0) > MAX_TOTAL_BYTES) {
        await result.stream.cancel();
        missed.push({
          name: ref.name,
          reason: `over the 25 MB email limit, ${STILL_SAVED}`,
        });
        continue;
      }
      const content = Buffer.from(await new Response(result.stream).arrayBuffer());
      total += content.length;
      attached.push({
        pathname: ref.pathname,
        filename: ref.name,
        content,
        size: content.length,
        contentType: result.blob.contentType ?? undefined,
      });
    } catch (err) {
      console.error("lead attachment could not be read", err);
      missed.push({ name: ref.name, reason: `couldn't be read, ${STILL_SAVED}` });
    }
  }
  return { attached, missed };
}

/**
 * Deletes files that went out with a lead email, plus any upload older
 * than a week that was never sent. Best effort: a storage hiccup must
 * never turn a delivered lead into an error page.
 */
export async function cleanUpUploads(
  sentPathnames: string[],
  token: string | undefined,
): Promise<void> {
  try {
    if (sentPathnames.length > 0) await del(sentPathnames, { token });
  } catch (err) {
    console.error("could not delete sent lead attachments", err);
  }
  try {
    const { blobs } = await list({ prefix: UPLOAD_FOLDER, token });
    const cutoff = Date.now() - STALE_AFTER_MS;
    const stale = blobs
      .filter((blob) => new Date(blob.uploadedAt).getTime() < cutoff)
      .map((blob) => blob.pathname);
    if (stale.length > 0) await del(stale, { token });
  } catch (err) {
    console.error("stale lead upload cleanup failed", err);
  }
}
