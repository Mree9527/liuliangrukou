import fs from 'fs/promises';
import { CONFIG } from '../config/settings.js';

export async function generateSitemap(articles) {
  const now = new Date().toISOString();
  
  const urls = [
    `<url><loc>${CONFIG.siteUrl}/</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`
  ];

  for (const article of articles) {
    urls.push(
      `<url><loc>${CONFIG.siteUrl}/articles/${article.topic}.html</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    );
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  await fs.writeFile('sitemap.xml', sitemap);
  console.log('[seo] ✓ sitemap.xml generated');
}

export async function generateRSSFeed(articles) {
  const items = articles.map(a => 
    `<item>
      <title>${a.seoMeta.title}</title>
      <link>${CONFIG.siteUrl}/articles/${a.topic}.html</link>
      <description>${a.seoMeta.description}</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`
  ).join('\n      ');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Money Engine - Product Reviews</title>
    <link>${CONFIG.siteUrl}</link>
    <description>Honest product reviews and buying guides</description>
    <language>en-us</language>
    <atom:link href="${CONFIG.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
      ${items}
  </channel>
</rss>`;

  await fs.writeFile('rss.xml', rss);
  console.log('[seo] ✓ rss.xml generated');
}

export async function generateOpenGraphImages(articles) {
  // Generate simple SVG "cover images" for OG tags
  const results = {};
  
  for (const article of articles) {
    const colors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color}"/>
        <stop offset="100%" style="stop-color:#0f172a"/>
      </linearGradient></defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="350" font-family="Arial,sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">
        ${article.seoMeta.title.substring(0, 60)}
      </text>
    </svg>`;

    results[article.topic] = svg;
  }

  return results;
}
