/**
 * JSON-LD structured data builders.
 *
 * Rules enforced here (see SCHEMA-TODO.md):
 *  - Address, map pin, and hours are the staffed Lehi office exactly as the
 *    Google Business Profile shows them; never a residential address
 *  - No aggregateRating / review / awards / employee counts
 *  - Only factual, verified values from src/config/business.ts
 *  - Everything emitted must match visible page content
 */
import { business, activeSocialLinks, canClaimLicensed } from "@/config/business";
import { featuredAreas } from "@/data/service-areas";

type JsonLd = Record<string, unknown>;

const SITE = business.domain;

/**
 * GeneralContractor is the most specific schema.org type for a residential
 * general contractor (subtype of HomeAndConstructionBusiness > LocalBusiness).
 */
export function organizationSchema(): JsonLd {
  const sameAs: string[] = activeSocialLinks.map((s) => s.url);
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
      "Lehi, Utah based residential general contractor specializing in basement finishing and basement remodeling for homeowners throughout Utah County and the Salt Lake Valley.",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.location.streetAddress,
      addressLocality: business.location.locality,
      addressRegion: business.location.region,
      postalCode: business.location.postalCode,
      addressCountry: business.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.location.latitude,
      longitude: business.location.longitude,
    },
    ...(business.googleBusinessProfileURL
      ? { hasMap: business.googleBusinessProfileURL }
      : {}),
    openingHoursSpecification: business.hours.schedule.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    founder: [
      { "@type": "Person", name: "Hunting Tanner", jobTitle: "Founder" },
    ],
    /* The work the site describes, so search and AI tools can match the
       business to basement questions. Keep in step with /services/. */
    knowsAbout: [
      "Basement finishing",
      "Basement remodeling",
      "Basement bedrooms and egress windows",
      "Basement bathrooms",
      "Wet bars and kitchenettes",
      "Basement family and media rooms",
      "Basement home offices and gyms",
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
    /* Real, verifiable credential — only emitted once the license is active */
    ...(canClaimLicensed
      ? {
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: "Utah General Contractor License",
            identifier: business.licenseNumber,
            recognizedBy: {
              "@type": "GovernmentOrganization",
              name: "Utah Division of Professional Licensing",
            },
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * WebSite node for the homepage: tells Google which name to show for the
 * site in results (instead of the domain or the old brand).
 */
export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: business.publicName,
    alternateName: business.shortName,
    url: `${SITE}/`,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE}/#organization` },
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

/**
 * Service schema for service pages — provider references the organization
 * node. City pages pass `city` so the service is tied to that one city.
 */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  /** Defaults to `name` */
  serviceType?: string;
  city?: { name: string; county: string };
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType ?? opts.name,
    description: opts.description,
    url: `${SITE}${opts.path}`,
    provider: { "@id": `${SITE}/#organization` },
    areaServed: opts.city
      ? {
          "@type": "City",
          name: opts.city.name,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: `${opts.city.county}, Utah`,
          },
        }
      : featuredAreas.map((area) => ({
          "@type": area.schemaType,
          name:
            area.schemaType === "AdministrativeArea"
              ? `${area.name}, ${area.state}`
              : area.name,
        })),
  };
}

/** The Service node every city page emits, built from its own copy. */
export function cityServiceSchema(city: {
  name: string;
  county: string;
  description: string;
  path: string;
}): JsonLd {
  return serviceSchema({
    name: `Basement finishing in ${city.name}, UT`,
    serviceType: "Basement finishing",
    description: city.description,
    path: city.path,
    city: { name: city.name, county: city.county },
  });
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
