/**
 * POST /api/contact — the live lead endpoint.
 *
 * Runs as a Vercel serverless function (prerender = false); every other
 * route on the site stays fully prerendered static HTML.
 *
 * Flow:
 *  - POST only (GET and friends get 405)
 *  - Honeypot hits pretend success and send nothing
 *  - Server-side validation + sanitization via src/server/contact/validate
 *  - Notification email to the office through Resend, with any photos or
 *    plans the visitor uploaded attached (they come from the private Blob
 *    store, then get deleted from it; src/lib/uploads.ts)
 *  - If the lead gave an email address: a fixed plain-text confirmation to
 *    that address (src/server/contact/confirmation.ts). It goes out only
 *    after the office notification has, and if it fails the lead is still
 *    delivered and the visitor still reaches /thank-you/.
 *  - 303 redirect to /thank-you/ on success
 *
 * Vercel env vars (see .env.example / README):
 *  - RESEND_API_KEY            — from resend.com
 *  - RESEND_FROM               — the notification's sender, on the domain
 *                                verified in Resend:
 *                                "Basement Pros Website <leads@utahcountybasementpros.com>".
 *                                It is also how this file knows a domain is
 *                                verified. Without it the only sender is
 *                                Resend's onboarding address, which delivers
 *                                to the Resend signup address and nowhere
 *                                else, so notifications fall back to that
 *                                address (office@huntingtanner.com, an alias
 *                                of the same inbox) and no confirmation is
 *                                sent.
 *  - CONTACT_NOTIFICATION_EMAIL (optional) — more addresses for the
 *                                notification, separated by commas. The
 *                                office (business.email) always gets it,
 *                                listed or not. Only used once RESEND_FROM
 *                                is set.
 *  - BLOB_READ_WRITE_TOKEN     — added by Vercel when the "lead-uploads" Blob
 *                                store was connected; reads the attachments
 *
 * If RESEND_API_KEY is missing, the lead is logged server-side and the
 * visitor still reaches /thank-you/ — check Vercel logs and configure the
 * key immediately; this fallback exists so a config gap never strands a
 * homeowner on an error page.
 */
import type { APIRoute } from "astro";
import type { Resend } from "resend";
import { business } from "@/config/business";
import {
  EMAIL_RE,
  validateLead,
  safeLogSummary,
  type LeadPayload,
} from "@/server/contact/validate";
import {
  STILL_SAVED,
  cleanUpUploads,
  fetchAttachments,
  parseAttachmentRefs,
  type FetchedAttachment,
  type MissedAttachment,
} from "@/server/contact/attachments";
import {
  CONFIRMATION_SUBJECT,
  buildConfirmationText,
} from "@/server/contact/confirmation";
import { formatBytes } from "@/lib/uploads";

export const prerender = false;

/** Set once the sending domain is verified in Resend (see the header). */
const VERIFIED_FROM: string | undefined =
  import.meta.env.RESEND_FROM || undefined;
const FROM = VERIFIED_FROM ?? "Basement Pros Website <onboarding@resend.dev>";
const NOTIFY_EMAILS = notificationRecipients(
  import.meta.env.CONTACT_NOTIFICATION_EMAIL,
);

/**
 * Who gets the lead notification: always the office (business.email), plus
 * any addresses in CONTACT_NOTIFICATION_EMAIL, separated by commas. That
 * list lives in Vercel so personal addresses stay out of the repo, and it
 * can only add people: a mistake in it never takes the office off a lead.
 * An entry that isn't an email address is skipped, because Resend would
 * refuse the whole lead over it.
 */
function notificationRecipients(listed: unknown): string[] {
  // No verified sender: Resend delivers to its signup address and nowhere else
  if (!VERIFIED_FROM) return ["office@huntingtanner.com"];
  const recipients: string[] = [business.email];
  for (const entry of (typeof listed === "string" ? listed : "").split(/[,;]/)) {
    const address = entry.trim();
    if (!address) continue;
    if (!EMAIL_RE.test(address)) {
      console.error(
        "CONTACT_NOTIFICATION_EMAIL has an entry that is not an email address. It was skipped.",
      );
    } else if (!recipients.some((seen) => seen.toLowerCase() === address.toLowerCase())) {
      recipients.push(address);
    }
  }
  return recipients;
}

/** The confirmation comes from the business address, so a reply reaches the office. */
const CONFIRMATION_FROM = `${business.publicName} <${business.email}>`;
/** How long the confirmation may take before the visitor moves on without it. */
const CONFIRMATION_TIMEOUT_MS = 10_000;

export const POST: APIRoute = async ({ request, redirect }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const result = validateLead(form);

  // Honeypot: indistinguishable success for bots, nothing sent
  if (result.isSpam) return redirect("/thank-you/", 303);

  if (!result.ok || !result.lead) {
    // Client-side validation normally prevents this path; respond generically
    return new Response(
      JSON.stringify({ ok: false, errors: result.errors }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const lead = result.lead;
  const apiKey = import.meta.env.RESEND_API_KEY;
  const blobToken = import.meta.env.BLOB_READ_WRITE_TOKEN;
  // Photos or plans uploaded with the form (pathnames in the Blob store)
  const uploads = parseAttachmentRefs(form.get("attachments"));

  try {
    if (apiKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const { attached, missed } =
        uploads.length > 0
          ? await fetchAttachments(uploads, blobToken)
          : { attached: [], missed: [] };
      // City and project type are optional now, so build a subject that
      // still reads well when they're missing.
      const subjectDetail = [lead.projectCity, lead.projectType]
        .filter(Boolean)
        .join(" · ");
      const subject = subjectDetail
        ? `New consultation request: ${subjectDetail}`
        : `New consultation request from ${lead.name}`;

      const send = async (
        files: FetchedAttachment[],
        notAttached: MissedAttachment[],
      ): Promise<{ error: { message: string } | null }> => {
        try {
          const { error } = await resend.emails.send({
            from: FROM,
            to: NOTIFY_EMAILS,
            // Reply-to only when an email was supplied; otherwise replying
            // would go nowhere useful.
            ...(lead.email ? { replyTo: lead.email } : {}),
            subject:
              files.length > 0
                ? `${subject} (${files.length} ${files.length === 1 ? "file" : "files"} attached)`
                : subject,
            text: buildLeadEmail(lead, files, notAttached),
            ...(files.length > 0
              ? {
                  attachments: files.map((file) => ({
                    filename: file.filename,
                    content: file.content,
                    contentType: file.contentType,
                  })),
                }
              : {}),
          });
          return { error };
        } catch (err) {
          return { error: { message: err instanceof Error ? err.message : String(err) } };
        }
      };

      let sentFiles = attached;
      let { error } = await send(attached, missed);
      if (error && attached.length > 0) {
        // The files are the likeliest cause. Never lose the lead over them:
        // send it again without attachments and say where they are.
        console.error(`resend rejected the email with attachments: ${error.message}`);
        sentFiles = [];
        ({ error } = await send([], [
          ...missed,
          ...attached.map((file) => ({
            name: file.filename,
            reason: `the email with files attached was rejected, ${STILL_SAVED}`,
          })),
        ]));
      }
      if (error) throw new Error(`resend: ${error.message}`);
      console.info(
        safeLogSummary(lead) + (sentFiles.length > 0 ? ` files=${sentFiles.length}` : ""),
      );
      // The office has the lead. Now tell the lead we got it.
      if (lead.email) await sendConfirmation(resend, lead);
      if (uploads.length > 0) {
        await cleanUpUploads(sentFiles.map((file) => file.pathname), blobToken);
      }
    } else {
      // Config gap: never strand the homeowner, but make the gap loud in logs
      console.error(
        "RESEND_API_KEY missing — lead NOT emailed. " + safeLogSummary(lead),
      );
    }
    return redirect("/thank-you/", 303);
  } catch (err) {
    /**
     * Delivery failed. Log the lead in full so it is recoverable from the
     * Vercel function logs — losing a homeowner's inquiry is far worse than
     * having their contact details in the business's own private logs — and
     * show a human page rather than raw JSON.
     */
    console.error("contact endpoint failure", err);
    console.error(
      "UNDELIVERED LEAD (recover manually):",
      JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        city: lead.projectCity,
        type: lead.projectType,
        message: lead.message,
        files: uploads.map((upload) => upload.pathname),
      }),
    );
    return new Response(errorPage(), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};

/**
 * Emails the lead the fixed confirmation. Best effort by design: it never
 * throws and gives up after CONFIRMATION_TIMEOUT_MS, so a problem here
 * can't turn a delivered lead into an error page.
 */
async function sendConfirmation(resend: Resend, lead: LeadPayload): Promise<void> {
  if (!VERIFIED_FROM) {
    console.warn("RESEND_FROM not set: no confirmation email sent to the lead");
    return;
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const { error } = await Promise.race([
      resend.emails.send({
        from: CONFIRMATION_FROM,
        to: lead.email,
        replyTo: business.email,
        subject: CONFIRMATION_SUBJECT,
        text: buildConfirmationText({
          name: lead.name,
          brand: business.publicName,
          now: new Date(),
        }),
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`no answer from Resend after ${CONFIRMATION_TIMEOUT_MS / 1000}s`)),
          CONFIRMATION_TIMEOUT_MS,
        );
      }),
    ]);
    if (error) throw new Error(error.message);
    console.info("confirmation email sent to the lead");
  } catch (err) {
    console.error(
      "confirmation email NOT sent (the lead itself was delivered):",
      err instanceof Error ? err.message : err,
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Friendly fallback page shown if email delivery fails. */
function errorPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>We couldn't send your request | Utah County Basement Pros</title>
<style>
  body { margin:0; background:#faf8f4; color:#3b302a;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
    line-height:1.65; display:flex; align-items:center; justify-content:center;
    min-height:100vh; padding:1.5rem; }
  .card { max-width:34rem; background:#faf8f4; border:1px solid #e8e2d9;
    border-radius:3px; padding:2rem; box-shadow:0 18px 48px -32px rgb(44 49 53 / .45); }
  h1 { font-family:Georgia,serif; font-size:1.6rem; margin:0 0 1rem; }
  a.btn { display:inline-block; background:#3b302a; color:#faf8f4; text-decoration:none;
    font-weight:600; padding:.75rem 1.5rem; border-radius:2px; margin-top:.5rem; }
  a.plain { color:#3b302a; }
  p { margin:0 0 1rem; }
</style>
</head>
<body>
  <div class="card">
    <h1>Sorry — we couldn't send that request</h1>
    <p>Something went wrong on our end, not yours. Your project details
       didn't reach our inbox, so please reach us directly and we'll take
       good care of you.</p>
    <p><a class="btn" href="tel:+18019018349">Call (801) 901-8349</a></p>
    <p>Or email <a class="plain" href="mailto:office@utahcountybasementpros.com">office@utahcountybasementpros.com</a>.</p>
    <p><a class="plain" href="/">Back to the homepage</a></p>
  </div>
</body>
</html>`;
}

export const GET: APIRoute = () =>
  new Response("Method not allowed", { status: 405 });

/** Plain-text notification email body. */
function buildLeadEmail(
  lead: LeadPayload,
  files: FetchedAttachment[],
  notAttached: MissedAttachment[],
): string {
  const l = lead as unknown as Record<string, string | undefined>;
  const line = (label: string, value?: string) =>
    value ? `${label}: ${value}` : "";
  return [
    "New basement consultation request from the Utah County Basement Pros website",
    "",
    line("Name", l.name),
    line("Phone", l.phone),
    line("Email", l.email),
    line("City", l.projectCity),
    line("Project type", l.projectType),
    line("Square footage", l.squareFootage),
    line("Timing", l.timing),
    line("Investment range", l.investmentRange),
    line("Heard about us", l.referralSource),
    line("Preferred contact", l.preferredContact),
    "",
    "Message:",
    l.message ?? "",
    ...(files.length > 0
      ? [
          `--- Photos and plans (${files.length} attached) ---`,
          ...files.map((file) => `${file.filename} (${formatBytes(file.size)})`),
        ]
      : []),
    ...(notAttached.length > 0
      ? [
          "--- Files NOT attached ---",
          ...notAttached.map((file) => `${file.name}: ${file.reason}`),
        ]
      : []),
    "",
    "--- Attribution ---",
    line("Source", l.utm_source),
    line("Medium", l.utm_medium),
    line("Campaign", l.utm_campaign),
    line("Term", l.utm_term),
    line("Content", l.utm_content),
    line("gclid", l.gclid),
    line("fbclid", l.fbclid),
    line("Landing page", l.landing_page),
    line("Referrer", l.referrer),
    line("Page", l.page_url),
    line("Submitted", l.submitted_at),
    line("Form", l.form_variant),
  ]
    .filter((row) => row !== "")
    .join("\n");
}
