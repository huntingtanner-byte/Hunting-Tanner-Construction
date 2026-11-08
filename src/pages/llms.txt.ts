/**
 * /llms.txt: a plain-text summary of the business and its key pages for AI
 * assistants and AI search tools (the llmstxt.org format). Built from the
 * same config as the site, so it can't drift from what the pages say.
 * Like robots.txt, it only carries content while the site is live.
 *
 * Facts only: everything here also appears on the site itself.
 */
import type { APIRoute } from "astro";
import { business, canClaimLicensed, isLive } from "@/config/business";
import {
  utahCountyServiceCities,
  saltLakeCountyServiceCities,
} from "@/data/cities";

const url = (path: string) => `${business.domain}${path}`;
const cityUrl = (slug: string) => url(`/${slug}-basement-finishing/`);
const { location: loc } = business;

export const GET: APIRoute = () => {
  if (!isLive) {
    return new Response("Not published while the site is in staging.\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const license = canClaimLicensed
    ? `, a licensed Utah general contractor (license #${business.licenseNumber})`
    : "";

  const body = [
    `# ${business.publicName}`,
    "",
    `> Basement finishing and basement remodeling contractor based in ${loc.locality}, Utah, serving homeowners in Utah County and the Salt Lake Valley. ${business.publicName} is a DBA of ${business.legalName}${license}.`,
    "",
    "## Key facts",
    "",
    `- Office: ${loc.streetAddress}, ${loc.locality}, ${loc.region} ${loc.postalCode}`,
    `- Office hours: ${business.hours.display}`,
    `- Phone: ${business.phoneDisplay}`,
    `- Email: ${business.email}`,
    `- Google Business Profile: ${business.googleBusinessProfileURL}`,
    "- Owner: Hunting Tanner, founder and owner, personally involved in every project",
    "- Getting started: a free consultation with an on-site walkthrough, then a detailed written bid within 48 hours of the walkthrough",
    "- Timeline: most projects take 6-10 weeks of construction, depending on size and scope",
    "- Permits: permits and inspections are coordinated as part of every project",
    "- Main cities: Lehi, Saratoga Springs, and Eagle Mountain, plus Herriman and communities across Utah County and the Salt Lake Valley",
    "- Formerly branded Hunting Tanner Construction; huntingtanner.com redirects to this site",
    "",
    "## Services",
    "",
    `- [Basement finishing](${url("/")}): full basement finishes, from planning and permits through framing, mechanicals, finishes, and the final walkthrough`,
    `- [Basement remodeling](${url("/basement-remodeling/")}): reworking dated or poorly finished basements`,
    `- [All services](${url("/services/")}): bedrooms and egress windows, bathrooms, family and media rooms, wet bars and kitchenettes, home offices and gyms, and what a finish includes`,
    `- [Our process](${url("/process/")}): six steps from the first call to the final walkthrough`,
    `- [Projects](${url("/projects/")}): photos of finished basements`,
    `- [FAQ](${url("/faq/")}): cost, timelines, permits, inspections, payments, and selections`,
    `- [About](${url("/about/")}): founder Hunting Tanner and senior advisor Gary Tanner`,
    `- [Free consultation](${url("/contact/")}): request form, phone, and office details`,
    "",
    "## Utah County service areas",
    "",
    `- [Utah County (all cities)](${url("/utah-county-basement-finishing/")})`,
    ...utahCountyServiceCities.map((c) => `- [${c.name}](${cityUrl(c.slug)})`),
    "",
    "## Salt Lake County service areas",
    "",
    `- [Salt Lake County (all cities)](${url("/salt-lake-county-basement-finishing/")})`,
    ...saltLakeCountyServiceCities.map((c) => `- [${c.name}](${cityUrl(c.slug)})`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
