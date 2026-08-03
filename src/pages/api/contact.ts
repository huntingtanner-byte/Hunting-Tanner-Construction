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
 *  - Notification email to CONTACT_NOTIFICATION_EMAIL through Resend
 *  - 303 redirect to /thank-you/ on success
 *
 * Required Vercel env vars (see .env.example / README):
 *  - RESEND_API_KEY            — from resend.com (domain verified for
 *                                huntingtanner.com, or onboarding sender)
 *  - CONTACT_NOTIFICATION_EMAIL — defaults to office@huntingtanner.com
 *  - RESEND_FROM (optional)    — verified sender, e.g.
 *                                "HTC Website <leads@huntingtanner.com>"
 *
 * If RESEND_API_KEY is missing, the lead is logged server-side and the
 * visitor still reaches /thank-you/ — check Vercel logs and configure the
 * key immediately; this fallback exists so a config gap never strands a
 * homeowner on an error page.
 */
import type { APIRoute } from "astro";
import { validateLead, safeLogSummary, type LeadPayload } from "@/server/contact/validate";

export const prerender = false;

const NOTIFY_EMAIL =
  import.meta.env.CONTACT_NOTIFICATION_EMAIL ?? "office@huntingtanner.com";
const FROM =
  import.meta.env.RESEND_FROM ?? "HTC Website <onboarding@resend.dev>";

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

  try {
    if (apiKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: FROM,
        to: NOTIFY_EMAIL,
        replyTo: lead.email,
        subject: `New consultation request — ${lead.projectCity} (${lead.projectType})`,
        text: buildLeadEmail(lead),
      });
      if (error) throw new Error(`resend: ${error.message}`);
      console.info(safeLogSummary(lead));
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
        name: `${lead.firstName} ${lead.lastName}`,
        phone: lead.phone,
        email: lead.email,
        city: lead.projectCity,
        type: lead.projectType,
        message: lead.message,
      }),
    );
    return new Response(errorPage(), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};

/** Friendly fallback page shown if email delivery fails. */
function errorPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>We couldn't send your request | Hunting Tanner Construction</title>
<style>
  body { margin:0; background:#ffffff; color:#1f3438;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
    line-height:1.65; display:flex; align-items:center; justify-content:center;
    min-height:100vh; padding:1.5rem; }
  .card { max-width:34rem; background:#fff; border:1px solid #c8d4cd;
    border-radius:16px; padding:2rem; box-shadow:0 10px 34px -14px rgb(31 52 56 / .28); }
  h1 { font-family:Georgia,serif; font-size:1.6rem; margin:0 0 1rem; }
  a.btn { display:inline-block; background:#476b57; color:#fff; text-decoration:none;
    font-weight:600; padding:.75rem 1.5rem; border-radius:10px; margin-top:.5rem; }
  a.plain { color:#476b57; }
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
    <p>Or email <a class="plain" href="mailto:office@huntingtanner.com">office@huntingtanner.com</a>.</p>
    <p><a class="plain" href="/">Back to the homepage</a></p>
  </div>
</body>
</html>`;
}

export const GET: APIRoute = () =>
  new Response("Method not allowed", { status: 405 });

/** Plain-text notification email body. */
function buildLeadEmail(lead: LeadPayload): string {
  const l = lead as unknown as Record<string, string | undefined>;
  const line = (label: string, value?: string) =>
    value ? `${label}: ${value}` : "";
  return [
    "New basement consultation request from huntingtanner.com",
    "",
    line("Name", `${l.firstName} ${l.lastName}`),
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
