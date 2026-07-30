/**
 * robots.txt — generated at build time from site status.
 * Staging: disallow everything (belt-and-suspenders with per-page noindex).
 * Live: allow all, reference the sitemap.
 */
import type { APIRoute } from "astro";
import { business, isLive } from "@/config/business";

export const GET: APIRoute = () => {
  const body = isLive
    ? [
        "User-agent: *",
        "Allow: /",
        "Disallow: /thank-you/",
        "",
        `Sitemap: ${business.domain}/sitemap-index.xml`,
        "",
      ].join("\n")
    : ["User-agent: *", "Disallow: /", ""].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
