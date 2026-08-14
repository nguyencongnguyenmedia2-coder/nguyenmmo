import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nguyenmmo.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/admin/', '/checkout', '/order-success', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
