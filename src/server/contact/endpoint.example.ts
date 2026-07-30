/**
 * FUTURE /api/contact ENDPOINT — reference implementation.
 *
 * The site currently builds fully static (no adapter), so this file is NOT
 * a live route. To activate at launch:
 *
 *   1. `npm install @astrojs/vercel resend`
 *   2. Add the Vercel adapter to astro.config.mjs:
 *        import vercel from "@astrojs/vercel";
 *        export default defineConfig({ ..., adapter: vercel() });
 *   3. Copy this file to src/pages/api/contact.ts and remove ".example"
 *      logic notes as needed.
 *   4. Set CONTACT_NOTIFICATION_EMAIL, RESEND_API_KEY, TURNSTILE_SECRET_KEY
 *      in Vercel project env vars (never commit secrets).
 *   5. Flip PUBLIC_SITE_STATUS to "live" so LeadForm stops intercepting.
 *
 * Design notes:
 *  - POST only; other methods get 405
 *  - Honeypot hits return 303 → /thank-you/ (indistinguishable to bots)
 *  - Validation errors return 400 with field errors (the client-side
 *    validation should normally prevent this path)
 *  - Success sends a notification email and 303-redirects to /thank-you/
 *  - Rate limiting: add per-IP limiting (e.g. Upstash Ratelimit) here
 *  - Turnstile: verify the token server-side before accepting
 *  - Logs never include message bodies or contact details in production
 */
import type { APIRoute } from "astro";
import { validateLead, safeLogSummary, type LeadPayload } from "./validate";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const result = validateLead(form);

  // Spam: pretend success, send nothing
  if (result.isSpam) return redirect("/thank-you/", 303);

  if (!result.ok || !result.lead) {
    return new Response(
      JSON.stringify({ ok: false, errors: result.errors }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const lead = result.lead;

  // TODO at launch: verify Turnstile token here (TURNSTILE_SECRET_KEY).
  // TODO at launch: add rate limiting keyed on client IP.

  try {
    // Example with Resend — swap for the chosen provider at launch.
    //
    // const { Resend } = await import("resend");
    // const resend = new Resend(import.meta.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "leads@huntingtanner.com",
    //   to: import.meta.env.CONTACT_NOTIFICATION_EMAIL,
    //   subject: `New consultation request — ${lead.projectCity} (${lead.projectType})`,
    //   text: buildLeadEmail(lead),
    // });

    console.info(safeLogSummary(lead));
    return redirect("/thank-you/", 303);
  } catch (err) {
    console.error("contact endpoint failure", err);
    // Generic message — never expose internals to the client
    return new Response(
      JSON.stringify({
        ok: false,
        errors: { message: "Something went wrong. Please call us instead." },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const GET: APIRoute = () => new Response("Method not allowed", { status: 405 });

/** Plain-text notification email body. */
export function buildLeadEmail(lead: LeadPayload): string {
  const l = lead as unknown as Record<string, string | undefined>;
  const line = (label: string, value?: string) =>
    value ? `${label}: ${value}` : "";
  return [
    "New basement consultation request",
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
    line("Landing page", l.landing_page),
    line("Referrer", l.referrer),
    line("Submitted", l.submitted_at),
  ]
    .filter((row) => row !== "")
    .join("\n");
}
