import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { siteConfig } from '@/data/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: 'monthly', priority: 1 },
    ...projects.map((p) => ({
      url: `${siteConfig.url}/work/${p.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
