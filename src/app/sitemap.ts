import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fltwht.com';
  
  // Static pages
  const staticPages = [
    '',
    '/dashboard',
    '/poses',
    '/flows/create',
    '/meditation',
    '/legal',
    '/legal/imprint',
    '/legal/privacy',
    '/legal/terms',
  ];

  // TODO: Add dynamic pages from database
  // - User generated content (if public)
  
  const sitemap: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : path.includes('/legal') ? 'monthly' : 'weekly',
    priority: path === '' ? 1 : path.includes('/legal') ? 0.3 : 0.8,
  }));

  return sitemap;
}