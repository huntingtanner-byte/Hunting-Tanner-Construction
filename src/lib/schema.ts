/**
 * JSON-LD structured data builders.
 *
 * Rules enforced here (see SCHEMA-TODO.md):
 *  - No street address (service-area business; residential address never published)
 *  - No aggregateRating / review / awards / employee counts / opening hours
 *  - Only factual, verified values from src/config/business.ts
 *  - Everything emitted must match visible page content
 */
import { business, activeSocialLinks } from "@/config/business";
import { featuredAreas } from "@/data/service-areas";

type JsonLd = Record<string, unknown>;

const SITE = business.domain;

/**
 * GeneralContractor is the most specific schema.org type for a residential
 * general contractor (subtype of HomeAndConstructionBusiness > LocalBusiness).
 */
export function organizationSchema(): JsonLd {
  const sameAs = activeSocialLinks.map((s) => s.url);
  if (business.googleBusinessProfileURL) {
    sameAs.push(business.googleBusinessProfileURL);
  }

  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE}/#organization`,
    name: business.publicName,
    legalName: business.legalName,
    url: `${SITE}/`,
    logo: `${SITE}/brand/logo.png`,
    image: `${SITE}/og-default.png`,
    telephone: business.phoneSchema,
    email: business.email,
    description:
      "Family-founded residential general contractor specializing in basement finishing and basement remodeling for homeowners in Saratoga Springs, Lehi, Herriman, and communities throughout Utah County, Utah.",
    founder: [
      { "@type": "Person", name: "Hunting Tanner", jobTitle: "Founder" },
      { "@type": "Person", name: "Gary Tanner", jobTitle: "Co-Founder" },
    ],
    areaServed: [
      ...featuredAreas.map((area) => ({
        "@type": area.schemaType,
        name:
          area.schemaType === "AdministrativeArea"
            ? `${area.name}, ${area.state}`
            : area.name,
        ...(area.schemaType === "City"
          ? { containedInPlace: { "@type": "State", name: "Utah" } }
          : {}),
      })),
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.phoneSchema,
      email: business.email,
      contactType: "customer service",
      areaServed: "US-UT",
      availableLanguage: "English",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Path beginning with "/", e.g. "/basement-finishing/" */
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}

/** Service schema for service pages — provider references the organization node. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: `${SITE}${opts.path}`,
    provider: { "@id": `${SITE}/#organization` },
    areaServed: featuredAreas.map((area) => ({
      "@type": area.schemaType,
      name:
        area.schemaType === "AdministrativeArea"
          ? `${area.name}, ${area.state}`
          : area.name,
    })),
  };
}

/** FAQPage schema — only for FAQs rendered verbatim on the same page. */
export function faqSchema(
  faqs: { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
