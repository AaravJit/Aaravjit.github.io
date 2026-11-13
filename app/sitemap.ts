import type { MetadataRoute } from 'next';
import { profile } from '../data/profile';
import { pages } from '../data/routes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({ url: `${profile.url}${page.href}`, changeFrequency: 'monthly', priority: page.href === '/' ? 1 : 0.7 }));
}
