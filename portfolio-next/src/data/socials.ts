import { siteConfig } from './siteConfig';
import type { AnalyticsEvent } from '@/lib/analytics';

export type Social = {
  label: string;
  /** Empty string = not supplied yet; the UI renders a marked placeholder. */
  href: string;
  display: string;
  placeholder: string;
  track: AnalyticsEvent;
  external: boolean;
};

export const socials: Social[] = [
  {
    label: 'Email',
    href: siteConfig.email ? `mailto:${siteConfig.email}` : '',
    display: siteConfig.email,
    placeholder: 'Add email in src/data/siteConfig.ts',
    track: 'contact_click',
    external: false,
  },
  {
    label: 'LinkedIn',
    href: siteConfig.linkedin,
    display: 'linkedin.com/in/muhammad-ayyan1',
    placeholder: 'Add LinkedIn in src/data/siteConfig.ts',
    track: 'linkedin_click',
    external: true,
  },
  {
    label: 'GitHub',
    href: siteConfig.github,
    display: siteConfig.github.replace(/^https?:\/\//, ''),
    placeholder: 'Add GitHub in src/data/siteConfig.ts',
    track: 'github_click',
    external: true,
  },
];

export const getSocial = (label: Social['label']) => socials.find((s) => s.label === label)!;
