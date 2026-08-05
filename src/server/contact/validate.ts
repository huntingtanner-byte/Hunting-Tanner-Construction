/**
 * Server-side validation and sanitization for the contact endpoint.
 * Framework-agnostic and fully typed — used by the future /api/contact
 * serverless route (see endpoint.example.ts).
 */

export interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  projectCity: string;
  projectType: string;
  message: string;
  // Optional qualifiers
  squareFootage?: string;
  timing?: string;
  investmentRange?: string;
  referralSource?: string;
  preferredContact?: string;
  // Attribution
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
  page_url?: string;
  submitted_at?: string;
  form_variant?: string;
}

export interface ValidationResult {
  ok: boolean;
  /** Field-level errors (safe to return to the client) */
  errors: Partial<Record<keyof LeadPayload, string>>;
  /** Sanitized payload — only present when ok */
  lead?: LeadPayload;
  /** True when the honeypot was filled: respond 200 but discard silently */
  isSpam?: boolean;
}

const MAX_LENGTHS: Partial<Record<keyof LeadPayload, number>> = {
  name: 120,
  phone: 25,
  email: 120,
  projectCity: 60,
  projectType: 80,
  message: 3000,
  squareFootage: 12,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Strip control characters and trim; never interpolate into HTML unescaped. */
function sanitize(value: unknown, maxLength = 200): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Normalize US phone numbers to +1XXXXXXXXXX where possible. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return raw.trim();
}

export function validateLead(form: FormData): ValidationResult {
  // Honeypot: real users never fill this field
  if (sanitize(form.get("companyWebsite"))) {
    return { ok: false, errors: {}, isSpam: true };
  }

  const errors: ValidationResult["errors"] = {};
  const get = (key: keyof LeadPayload) =>
    sanitize(form.get(key), MAX_LENGTHS[key] ?? 200);

  const lead: LeadPayload = {
    name: get("name"),
    phone: normalizePhone(get("phone")),
    email: get("email"),
    projectCity: get("projectCity"),
    projectType: get("projectType"),
    message: get("message"),
    squareFootage: get("squareFootage"),
    timing: get("timing"),
    investmentRange: get("investmentRange"),
    referralSource: get("referralSource"),
    preferredContact: get("preferredContact"),
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_term: get("utm_term"),
    utm_content: get("utm_content"),
    gclid: get("gclid"),
    fbclid: get("fbclid"),
    landing_page: get("landing_page"),
    referrer: get("referrer"),
    page_url: get("page_url"),
    submitted_at: get("submitted_at"),
    form_variant: get("form_variant"),
  };

  if (!lead.name) errors.name = "Name is required.";
  if (lead.phone.replace(/\D/g, "").length < 10)
    errors.phone = "A valid phone number is required.";
  if (!EMAIL_RE.test(lead.email))
    errors.email = "A valid email address is required.";
  if (!lead.projectCity) errors.projectCity = "Project city is required.";
  if (!lead.projectType) errors.projectType = "Project type is required.";
  if (!lead.message) errors.message = "Please include a short message.";

  const ok = Object.keys(errors).length === 0;
  return ok ? { ok, errors, lead } : { ok, errors };
}

/** Safe log line — no message body, no attribution, just enough to debug. */
export function safeLogSummary(lead: LeadPayload): string {
  return `lead received: city=${lead.projectCity} type=${lead.projectType} variant=${lead.form_variant ?? "?"}`;
}
