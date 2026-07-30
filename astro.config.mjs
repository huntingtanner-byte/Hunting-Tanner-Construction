// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

/**
 * Site status is duplicated here (instead of imported from src/config/business.ts)
 * so the config stays dependency-free at load time. Both files use the same
 * PUBLIC_SITE_STATUS override; the hardcoded fallback must match business.ts.
 */
const siteStatus = process.env.PUBLIC_SITE_STATUS ?? "staging";
const isLive = siteStatus === "live";

export default defineConfig({
  site: "https://huntingtanner.com",
  trailingSlash: "always",
  /**
   * All pages remain fully prerendered static HTML (best for SEO and speed).
   * The Vercel adapter exists solely so /api/contact can run as a
   * serverless function (it opts out via `export const prerender = false`).
   */
  output: "static",
  adapter: vercel(),
  security: {
    /**
     * Astro's origin check rejects same-origin form POSTs behind Vercel's
     * proxy (the function sees a different internal origin). The only
     * server route is the public contact form, which has no session or
     * auth to protect — spam control is handled by the honeypot and
     * (at launch) Turnstile — so the origin check is safely disabled.
     */
    checkOrigin: false,
  },
  build: {
    format: "directory",
  },
  integrations: [
    // The sitemap is only generated once the site is live. While staging,
    // every page is noindex and robots.txt disallows crawling.
    ...(isLive
      ? [
          sitemap({
            filter: (page) => !page.includes("/thank-you/"),
          }),
        ]
      : []),
  ],
});
