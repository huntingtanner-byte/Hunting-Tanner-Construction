// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

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
  output: "static",
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
