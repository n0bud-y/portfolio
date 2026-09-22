/**
 * Project content. Only facts supplied by the developer are stated as facts.
 *
 * TODO markers below flag copy that is a sensible draft and should be reviewed:
 *  - `year`        : not supplied yet — leave undefined to hide it in the UI.
 *  - `role`        : assumed from current job title; confirm per project.
 *  - `technologies`: taken from the "potential technologies" list; remove anything not used.
 *  - `caseStudy`   : qualitative draft copy (no invented metrics). Edit freely.
 *
 * SCREENSHOTS: drop files into /public/projects using the project slug:
 *   /public/projects/<slug>.jpg        main screenshot   (.webp / .png also work)
 *   /public/projects/<slug>-2.jpg …-6  extra screenshots (project detail page)
 *   /public/projects/<slug>-mobile.jpg mobile view       (project detail page)
 * Until then a clearly-labelled placeholder is shown. Rebuild after adding files.
 */

export type ProjectAccent = 'purple' | 'mint' | 'neutral';

export type CaseStudy = {
  overview: string;
  challenge: string;
  approach: string;
  implementation: string[];
  keyFeatures: string[];
  responsive: string;
  outcome: string[];
};

export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  year?: string; // TODO: add when confirmed
  status: string;
  role: string; // TODO: confirm per project
  technologies: string[];
  description: string;
  accent: ProjectAccent;
  featured?: boolean;
  liveUrl?: string; // TODO: add real URLs when available
  caseStudy: CaseStudy;
};

const ROLE = 'CMS / Frontend Developer'; // TODO: confirm

export const projects: Project[] = [
  {
    slug: 'hanks-heating-cooling',
    number: '01',
    name: "Hank's Heating & Cooling",
    category: 'Business Website',
    status: 'Client work',
    role: ROLE,
    technologies: ['WordPress', 'Custom Theme', 'CMS', 'ACF', 'Responsive Frontend'],
    description:
      'A professional service-business website focused on clear service presentation, conversion-oriented sections, contact information, and responsive UX.',
    accent: 'purple',
    featured: true,
    caseStudy: {
      overview:
        'A service-business website for a heating and cooling company, built to present services clearly and make it easy for visitors to get in touch.',
      challenge:
        'A local service business needs a site that explains what it offers at a glance and turns visits into enquiries — on any device, and in a way the team can keep updating.',
      approach:
        'Structure the content around the services and the next step for the visitor, build it as a custom WordPress theme, and put editable content behind ACF fields.',
      implementation: [
        'Custom WordPress theme built for this project',
        'ACF-powered content sections so text and services stay editable',
        'Conversion-oriented layout with prominent contact information',
        'Responsive frontend tested across device sizes',
      ],
      keyFeatures: [
        'Clear service presentation',
        'Conversion-oriented sections',
        'Prominent contact information',
        'Responsive UX',
      ],
      responsive:
        'The layout adapts from desktop to mobile with the contact path kept visible at every size.',
      outcome: [
        'Improved content structure',
        'Responsive across devices',
        'Custom CMS controls',
        'Reusable sections',
        'Cleaner user experience',
      ],
    },
  },
  {
    slug: 'a1-window-cleaning',
    number: '02',
    name: 'A1 Window Cleaning',
    category: 'Business Website',
    status: 'Client work',
    role: ROLE,
    technologies: ['WordPress', 'Custom Theme', 'ACF', 'Responsive Frontend'],
    description:
      'A clean service-business website designed around strong visual hierarchy, service information, trust-building content, and contact conversion.',
    accent: 'mint',
    caseStudy: {
      overview:
        'A service-business website for a window cleaning company, designed around visual hierarchy, service information and trust.',
      challenge:
        'Communicate what the business does and why it can be trusted, then guide visitors towards getting in contact.',
      approach:
        'Lead with strong visual hierarchy, present services plainly, add trust-building content, and keep the contact step obvious.',
      implementation: [
        'Custom WordPress theme',
        'ACF fields for editable content',
        'Responsive layouts for service and contact sections',
      ],
      keyFeatures: [
        'Strong visual hierarchy',
        'Clear service information',
        'Trust-building content',
        'Contact conversion focus',
      ],
      responsive: 'Clean, readable layouts across desktop, tablet and mobile.',
      outcome: [
        'Clear structure for service information',
        'Responsive across devices',
        'Editable content through the CMS',
      ],
    },
  },
  {
    slug: 'twin-movers',
    number: '03',
    name: 'Twin Movers',
    category: 'Moving / Service Business',
    status: 'Client work',
    role: ROLE,
    technologies: ['WordPress', 'Custom Theme', 'CMS', 'Responsive Frontend'],
    description:
      'A service-focused website with strong calls to action, clear service information, and responsive layouts.',
    accent: 'neutral',
    caseStudy: {
      overview:
        'A website for a moving company, built around strong calls to action and clear service information.',
      challenge:
        'Help visitors understand the services quickly and move them towards requesting a service.',
      approach:
        'Prioritise calls to action and plain service information, on layouts that work well on phones.',
      implementation: [
        'Custom WordPress theme',
        'CMS-managed content',
        'Responsive layouts',
      ],
      keyFeatures: ['Strong calls to action', 'Clear service information', 'Responsive layouts'],
      responsive: 'Layouts respond cleanly from large screens down to mobile.',
      outcome: ['Clear calls to action', 'Responsive across devices', 'Editable content'],
    },
  },
  {
    slug: 'americaport',
    number: '04',
    name: 'AmericaPort',
    category: 'Corporate / Business Website',
    status: 'Client work',
    role: ROLE,
    technologies: ['WordPress', 'Custom Theme', 'CMS', 'Frontend Development'],
    description:
      'A corporate-style website focused on structured content, brand presentation, responsive layout, and a professional user experience.',
    accent: 'purple',
    caseStudy: {
      overview:
        'A corporate-style website focused on structured content and clear brand presentation.',
      challenge:
        'Present a business professionally with well-organised content across many kinds of pages.',
      approach:
        'Build a consistent, structured layout system that keeps the brand presentation coherent.',
      implementation: [
        'Custom WordPress theme',
        'CMS-managed structured content',
        'Frontend development for a polished, responsive result',
      ],
      keyFeatures: ['Structured content', 'Brand presentation', 'Responsive layout'],
      responsive: 'A professional layout that holds together on every screen size.',
      outcome: ['Well-structured content', 'Consistent brand presentation', 'Responsive across devices'],
    },
  },
  {
    slug: 'polygon-pt',
    number: '05',
    name: 'Polygon PT',
    category: 'Business / Professional Website',
    status: 'Client work',
    role: ROLE,
    technologies: ['WordPress', 'Custom Theme', 'Frontend Development'],
    description:
      'A professionally structured website focused on strong layout composition, responsive behavior, and polished frontend presentation.',
    accent: 'mint',
    caseStudy: {
      overview:
        'A professional website with emphasis on layout composition and polished frontend presentation.',
      challenge: 'Deliver a strong, professional layout that stays polished as the screen size changes.',
      approach: 'Focus on layout composition and careful frontend implementation.',
      implementation: ['Custom WordPress theme', 'Frontend development with attention to detail'],
      keyFeatures: ['Strong layout composition', 'Responsive behaviour', 'Polished frontend'],
      responsive: 'Responsive behaviour is treated as part of the layout, not an afterthought.',
      outcome: ['Polished presentation', 'Responsive across devices'],
    },
  },
  {
    slug: 'purplecan-apparel',
    number: '06',
    name: 'Purplecan Apparel',
    category: 'E-commerce',
    status: 'Client work',
    role: ROLE,
    technologies: ['WooCommerce', 'WordPress', 'Custom Frontend', 'Product Management', 'Responsive UI'],
    description:
      'An ecommerce website focused on product presentation, shopping flows, responsive design, and WooCommerce functionality.',
    accent: 'purple',
    caseStudy: {
      overview:
        'An ecommerce website for an apparel brand, built on WooCommerce with a custom frontend.',
      challenge: 'Present products well and keep the shopping flow simple on every device.',
      approach:
        'Build a custom frontend on top of WooCommerce, focused on product presentation and the path to purchase.',
      implementation: [
        'WooCommerce on WordPress',
        'Custom frontend for product presentation',
        'Product management setup',
        'Responsive UI',
      ],
      keyFeatures: ['Product presentation', 'Shopping flows', 'WooCommerce functionality', 'Responsive design'],
      responsive: 'Shopping and product pages are designed to work on phones as well as desktops.',
      outcome: ['Clear product presentation', 'Responsive shopping experience', 'Manageable product catalogue'],
    },
  },
];

/**
 * Space for additional WooCommerce projects.
 * The developer has worked on several — add entries here ONLY when confirmed.
 * Renders as a compact list under Selected Work once non-empty. No count is shown.
 */
export type AdditionalProject = { name: string; url?: string; note?: string };
export const additionalWooProjects: AdditionalProject[] = [
  // { name: 'Store name', url: 'https://…', note: 'WooCommerce · custom theme' },
];
