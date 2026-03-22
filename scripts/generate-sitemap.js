import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';

const client = createClient({
  projectId: '6c1fauax',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const SITE_URL = 'https://chineselit.club';

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/activities', priority: '0.9', changefreq: 'daily' },
  { url: '/articles', priority: '0.9', changefreq: 'weekly' },
  { url: '/events', priority: '0.8', changefreq: 'weekly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/books', priority: '0.7', changefreq: 'monthly' },
];

async function generate() {
  const [articles, activities] = await Promise.all([
    client.fetch(`*[_type == "article"] | order(date desc) { _id, date, _updatedAt }`),
    client.fetch(`*[_type == "promoEvent"] | order(_createdAt desc) { _id, _createdAt, _updatedAt }`),
  ]);

  const today = new Date().toISOString().split('T')[0];

  const urls = [
    ...staticPages.map(p => `
  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

  writeFileSync('./public/sitemap.xml', xml);
  console.log(`✓ sitemap.xml generated with ${urls.length} URLs`);
}

generate().catch(console.error);
