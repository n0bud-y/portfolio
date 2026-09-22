/**
 * Central site configuration — edit values here, nowhere else.
 * Anything marked TODO is a placeholder waiting for real information.
 */
export const siteConfig = {
  name: 'Muhammad Ayan Asif',
  shortName: 'AYAN',
  brand: 'AYAN.DEV',
  logo: 'AYAN.', // navbar wordmark
  /** Small technical details shown in the hero corner. */
  heroMeta: ['KHI / 24.86°N', 'PK / WEB'],
  role: 'Full-Stack / Web Developer',
  secondaryRole: 'CMS Developer • WordPress • React • Next.js • JavaScript',
  location: 'Karachi, Pakistan',
  coordinates: '24.8607° N, 67.0011° E',
  availability: 'Available for select opportunities',

  tagline:
    'I build modern websites and digital experiences that look sharp, perform well, and are built to work in the real world.',
  subline:
    'Custom WordPress systems, modern frontend experiences, and React/Next.js development.',

  // Contact — leave a value empty ('') to show a clearly marked placeholder in the UI.
  email: '', // TODO: add the preferred public email address, e.g. 'name@domain.com'
  linkedin: 'https://www.linkedin.com/in/muhammad-ayyan1/',
  github: '', // TODO: add the GitHub profile URL, e.g. 'https://github.com/username'

  // Drop the PDF into /public and keep this path in sync.
  resume: '/resume.pdf',

  // TODO: set NEXT_PUBLIC_SITE_URL (or edit the fallback) to the real domain before deploying.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',

  seo: {
    title: 'Muhammad Ayan Asif — Full-Stack / Web Developer',
    description:
      'Muhammad Ayan Asif is a web developer building modern websites, custom WordPress experiences, ecommerce platforms, and React/Next.js interfaces.',
  },

  copyrightYear: 2026,
} as const;

export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
] as const;
