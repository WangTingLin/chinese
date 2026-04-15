/**
 * 中文研究室 RSS Feed 生成器
 * 執行方式：node scripts/generate-rss.mjs
 * 或在 package.json 加入：
 *   "rss": "node scripts/generate-rss.mjs"
 *   "build": "vite build && node scripts/generate-rss.mjs"
 */

import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: '6c1fauax',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const SITE_URL = 'https://chineselit.club';
const SITE_TITLE = '中文研究室';
const SITE_DESC = '學術活動、文章專欄、研討進度，以文會友，以友輔仁。';

function escapeXml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generate() {
  console.log('📡 從 Sanity 取得文章資料…');
  const articles = await client.fetch(
    `*[_type == "article"] | order(date desc) [0...30] {
      _id, title, author, date, category, summary
    }`
  );

  const now = new Date().toUTCString();

  const items = articles.map(a => {
    const link = `${SITE_URL}/?article=${a._id}`;
    const pubDate = a.date ? new Date(a.date).toUTCString() : now;
    return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${a.author ? `<author>${escapeXml(a.author)}</author>` : ''}
      ${a.category ? `<category>${escapeXml(a.category)}</category>` : ''}
      ${a.summary ? `<description>${escapeXml(a.summary)}</description>` : ''}
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-TW</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  const outPath = resolve(__dirname, '../public/rss.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`✅ rss.xml 已輸出到 ${outPath}（共 ${articles.length} 篇文章）`);
}

generate().catch(err => {
  console.error('❌ RSS 生成失敗：', err.message);
  process.exit(1);
});
