/**
 * POST /api/upload — hands the browser a short-lived token so a photo or
 * plan set can go straight into the private "lead-uploads" Blob store.
 * The file itself never passes through this function (see
 * src/lib/uploads.ts for the whole flow).
 *
 * A public lead form has no login to check, so the token is the guard:
 * photos and PDFs only, 25 MB at most, inside the leads/ folder, valid for
 * 15 minutes. The store is private, so nothing uploaded here can ever be
 * opened from the web; files only leave it as attachments on lead emails.
 *
 * Needs BLOB_READ_WRITE_TOKEN, which Vercel added to the project when the
 * store was connected (November 2026).
 */
import type { APIRoute } from "astro";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ALLOWED_TYPES, MAX_TOTAL_BYTES, PATHNAME_RE } from "@/lib/uploads";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  try {
    const result = await handleUpload({
      body,
      request,
      token: import.meta.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        if (!PATHNAME_RE.test(pathname)) {
          throw new Error("Unsupported file name");
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_TOTAL_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 15 * 60 * 1000,
        };
      },
    });
    return json(result);
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      400,
    );
  }
};

export const GET: APIRoute = () =>
  new Response("Method not allowed", { status: 405 });
