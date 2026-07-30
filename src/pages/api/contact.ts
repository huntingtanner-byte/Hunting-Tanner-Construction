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
    console.error("contact endpoint failure", err);
    return new Response(
      JSON.stringify({
        ok: false,
        errors: {
          message:
            "Something went wrong sending your request. Please call (801) 901-8349 instead.",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

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
