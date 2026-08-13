import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/admin/', '/checkout', '/order-success'],
    },
    sitemap: 'https://nguyenmmo.com/sitemap.xml',
  };
}
