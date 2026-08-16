import { MetadataRoute } from 'next';
import { MOCK_SERVICES } from '@/data/mockServices';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { MOCK_BLOGS } from '@/data/mockBlog';

import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nguyenmmo.vercel.app';

  let blogsList = MOCK_BLOGS;
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'blogs.json');
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        blogsList = parsed;
      }
    }
  } catch (e) {}

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/services/web-app-design`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = MOCK_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/services/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Service detail routes
  const serviceRoutes: MetadataRoute.Sitemap = MOCK_SERVICES.map((srv) => ({
    url: `${baseUrl}/service/${srv.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Blog detail routes
  const blogRoutes: MetadataRoute.Sitemap = blogsList.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...blogRoutes];
}
