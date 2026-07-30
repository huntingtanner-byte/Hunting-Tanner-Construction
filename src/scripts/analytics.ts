/**
 * Lightweight analytics + attribution helpers.
 *
 * - Captures UTM parameters / click IDs once per session (first touch)
 * - Provides track() which forwards to gtag/Meta Pixel ONLY if those
 *   scripts were injected (live site with IDs configured)
 * - Wires delegated listeners for data-event elements, tel:, and mailto:
 *
 * No cookies are set by this module; attribution lives in sessionStorage.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const ATTRIBUTION_KEY = "htc_attribution";
const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

export type AttributionData = Partial<
  Record<(typeof ATTRIBUTION_PARAMS)[number], string>
> & {
  landing_page?: string;
  referrer?: string;
};

/** Store first-touch campaign data for the session. */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const data: AttributionData = {
      landing_page: window.location.pathname,
      referrer: document.referrer || "",
    };
    for (const key of ATTRIBUTION_PARAMS) {
      const value = params.get(key);
      if (value) data[key] = value.slice(0, 200);
    }
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable (private mode etc.) — attribution is optional
  }
}

export function getAttribution(): AttributionData {
  try {
    return JSON.parse(
      sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}",
    ) as AttributionData;
  } catch {
    return {};
  }
}

/** Send a standardized event to whichever analytics libraries are loaded. */
export function track(
  eventName: string,
  params: Record<string, string> = {},
): void {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
  if (typeof window.fbq === "function" && eventName === "form_submit") {
    window.fbq("track", "Lead");
  }
  if (import.meta.env.DEV) {
    console.debug("[analytics]", eventName, params);
  }
}

/** Delegated listeners for tagged elements and tel:/mailto: links. */
export function wireEventListeners(): void {
  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>(
      "a, button, [data-event]",
    );
    if (!el) return;

    const explicit = el.getAttribute("data-event");
    const label = el.getAttribute("data-event-label") ?? "";
    const href = el.getAttribute("href") ?? "";

    if (explicit) {
      track(explicit, { label });
    } else if (href.startsWith("tel:")) {
      track("click_to_call", { label: "untagged" });
    } else if (href.startsWith("mailto:")) {
      track("click_to_email", { label: "untagged" });
    }
  });
}

/** Page-type view events (service_page_view, service_area_page_view, ...). */
export function trackPageType(): void {
  const pageType = document.body.getAttribute("data-page-type");
  if (!pageType) return;
  const eventByType: Record<string, string> = {
    service: "service_page_view",
    "service-area": "service_area_page_view",
    projects: "project_gallery_view",
  };
  const event = eventByType[pageType];
  if (event) track(event, { path: window.location.pathname });
}

captureAttribution();
wireEventListeners();
trackPageType();
