/**
 * The instant confirmation email a lead gets when they leave an email
 * address. src/pages/api/contact.ts sends it once the office notification
 * has gone out.
 *
 * The wording is fixed (Hunting's, November 12, 2026). Only two things
 * vary: the first name and when Hunting will call. Nothing else a visitor
 * types reaches this email, and the first name is letters only. A form
 * that mails back whatever was typed into it gets used to send other
 * people spam with our name on it.
 *
 * No imports on purpose, so the logic can be run with plain Node.
 */

export const CONFIRMATION_SUBJECT = "We got your consultation request";

export type CallbackWhen = "today" | "tomorrow" | "on Monday";

/** Calls go out the same day for requests that arrive before this hour. */
const SAME_DAY_CUTOFF_HOUR = 17; // 5 PM Mountain Time

/**
 * When Hunting will call, from the moment the request arrived, in Mountain
 * Time (America/Denver follows daylight saving on its own):
 *   Monday to Friday before 5 PM              -> "today"
 *   Monday to Thursday from 5 PM              -> "tomorrow"
 *   Friday from 5 PM, Saturday and Sunday     -> "on Monday"
 */
export function callbackWhen(now: Date): CallbackWhen {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  if (!weekday || Number.isNaN(hour)) {
    throw new Error("could not read the Mountain Time weekday and hour");
  }

  const afterCutoff = hour >= SAME_DAY_CUTOFF_HOUR;
  if (weekday === "Sat" || weekday === "Sun") return "on Monday";
  if (weekday === "Fri") return afterCutoff ? "on Monday" : "today";
  return afterCutoff ? "tomorrow" : "today";
}

/** A first name: letters, plus the apostrophes and hyphens names carry. */
const FIRST_NAME_RE = /^\p{L}[\p{L}\p{M}'’-]{0,29}$/u;

/** First words of the name field that aren't a first name. */
const NOT_A_FIRST_NAME = new Set([
  "mr",
  "mrs",
  "ms",
  "miss",
  "mx",
  "dr",
  "prof",
  "the",
]);

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

/**
 * The name for "Hi ...": the first word of the name field, or "there" when
 * it's missing or isn't plainly a name (digits, dots, a web address, a
 * title such as "Mr").
 */
export function greetingName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] ?? "";
  if (!FIRST_NAME_RE.test(first) || NOT_A_FIRST_NAME.has(first.toLowerCase())) {
    return "there";
  }
  // "john" and "JOHN" read better as "John". Mixed case ("McKay", "DeAnn")
  // and two-letter initials ("AJ") stay as typed.
  const allLower = first === first.toLowerCase();
  const allUpper = first === first.toUpperCase() && first.length > 2;
  return allLower || allUpper
    ? first.split("-").map(capitalize).join("-")
    : first;
}

/** The fixed plain-text confirmation. */
export function buildConfirmationText(options: {
  /** The lead's name as typed in the form (may be empty) */
  name: string;
  /** The public brand name (business.publicName) */
  brand: string;
  /** When the request arrived */
  now: Date;
}): string {
  const { name, brand, now } = options;
  return (
    `Hi ${greetingName(name)}, thanks for reaching out to ${brand}! ` +
    `We got your request and Hunting will call you ${callbackWhen(now)}. ` +
    "If you have photos or plans of the space, just reply to this email with them. " +
    "They always help!"
  );
}
