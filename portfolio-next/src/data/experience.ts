/**
 * Experience timeline. Add new entries at the top of the array.
 * TODO: replace the placeholder employer and add real dates. Nothing here is invented:
 * the employer is a generic placeholder and no dates are claimed.
 */
export type ExperienceEntry = {
  role: string;
  company: string; // TODO: exact employer name
  location: string;
  period: string; // TODO: e.g. 'Mar 2024 — Present'
  current?: boolean;
  highlights: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: 'CMS Developer',
    company: 'Software House / Startup',
    location: 'Karachi, Pakistan',
    period: 'Present',
    current: true,
    highlights: [
      'Custom WordPress development',
      'Custom theme development',
      'CMS integration',
      'ACF implementation',
      'Responsive frontend development',
      'WooCommerce projects',
      'Forms and integrations',
      'Client and business website development',
      'Frontend libraries and animation',
      'Collaboration across design and development workflows',
    ],
  },
];
