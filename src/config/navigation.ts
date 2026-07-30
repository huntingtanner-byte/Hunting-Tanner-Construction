/** Centralized navigation config. All hrefs use canonical trailing-slash URLs. */

export interface NavItem {
  label: string;
  href: string;
}

/** Primary header navigation */
export const headerNav: NavItem[] = [
  { label: "Basement Finishing", href: "/basement-finishing/" },
  { label: "Services", href: "/services/" },
  { label: "Process", href: "/process/" },
  { label: "Projects", href: "/projects/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

/** Footer: services column */
export const footerServices: NavItem[] = [
  { label: "Basement Finishing", href: "/basement-finishing/" },
  { label: "Basement Remodeling", href: "/basement-remodeling/" },
  { label: "All Services", href: "/services/" },
  { label: "Our Process", href: "/process/" },
  { label: "Projects", href: "/projects/" },
];

/** Footer: service-area column */
export const footerAreas: NavItem[] = [
  { label: "Saratoga Springs", href: "/saratoga-springs-basement-finishing/" },
  { label: "Lehi", href: "/lehi-basement-finishing/" },
  { label: "Utah County", href: "/utah-county-basement-finishing/" },
  { label: "Herriman", href: "/herriman-basement-finishing/" },
];

/** Footer: company column */
export const footerCompany: NavItem[] = [
  { label: "About", href: "/about/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Website Terms", href: "/terms/" },
];
