import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from '../config/settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, CONFIG.outputDir);

export async function buildSite(articles) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Build homepage
  await buildHomepage(articles);
  
  // Build each article page
  for (const article of articles) {
    const topic = article.topic;
    const filename = `${topic}.html`;
    
    await fs.mkdir(path.join(OUTPUT_DIR, 'articles'), { recursive: true });
    await fs.writeFile(path.join(OUTPUT_DIR, 'articles', filename), article.html);
    console.log(`  ✓ Built: ${filename}`);
  }
  
  // Build sitemap.xml
  buildSitemap(articles);
  
  // Build robots.txt
  buildRobots();
  
  // Build index (homepage) for navigation
  buildIndexPage(articles);
  
  return OUTPUT_DIR;
}

async function buildHomepage(articles) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Money Engine - Best Product Reviews & Deals 2025</title>
<meta name="description" content="Honest product reviews and buying guides. We help you find the best deals on laptops, keyboards, smart home devices and more.">
<link rel="canonical" href="${CONFIG.siteUrl}/">
<meta name="robots" content="index, follow">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Money Engine',
  url: CONFIG.siteUrl,
  description: 'Product reviews and buying guides'
}, null, 2)}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1a1a2e}
header{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:60px 20px;text-align:center}
header h1{font-size:2.5em;margin-bottom:10px}
header p{font-size:1.2em;color:#94a3b8;max-width:600px;margin:0 auto}
nav{background:#1e293b;padding:15px 20px;text-align:center;border-top:1px solid #334155}
nav a{color:#94a3b8;text-decoration:none;margin:0 20px;font-size:0.95em;transition:color .2s}
nav a:hover{color:#fff}
main{max-width:900px;margin:40px auto;padding:0 20px}
.section-title{font-size:1.8em;color:#0f3460;margin-bottom:20px;border-bottom:2px solid #e2e8f0;padding-bottom:10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;margin-top:20px}
.card{background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 6px rgba(0,0,0,0.08);border:1px solid #e2e8f0;transition:transform .2s,box-shadow .2s}
.card:hover{transform:translateY(-4px);box-shadow:0 4px 15px rgba(0,0,0,0.12)}
.card h3{color:#0f3460;margin-bottom:8px;font-size:1.1em}
.card p{color:#64748b;font-size:0.9em;line-height:1.5}
.card .tag{display:inline-block;background:#eff6ff;color:#3b82f6;padding:3px 10px;border-radius:20px;font-size:0.75em;margin-bottom:10px}
.stats-bar{display:flex;justify-content:center;gap:40px;margin-top:30px}
.stat{text-align:center}.stat-num{font-size:2em;font-weight:700;color:#3b82f6}.stat-label{color:#94a3b8;font-size:0.85em}
footer{text-align:center;padding:40px 20px;color:#64748b;font-size:0.85em;border-top:1px solid #e2e8f0;margin-top:60px}
</style>
</head>
<body>
<header>
<h1>🛒 Smart Buying Guide</h1>
<p>Honest reviews and the best deals on products that actually matter. No fluff, just value.</p>
<div class="stats-bar">
<div class="stat"><div class="stat-num">50+</div><div class="stat-label">Products Reviewed</div></div>
<div class="stat"><div class="stat-num">100%</div><div class="stat-label">Free to Read</div></div>
<div class="stat"><div class="stat-num">$0</div><div class="stat-label">Ad Cost</div></div>
</div>
</header>
<nav><a href="/">Home</a><a href="#reviews">Reviews</a><a href="#categories">Categories</a></nav>
<main>
<h2 class="section-title" id="reviews">Latest Reviews & Buying Guides</h2>
<div class="grid">
${articles.map(a => `<div class="card"><span class="tag">${a.topic.split('-').join(' ').toUpperCase()}</span><h3>${a.seoMeta.title}</h3><p>${a.seoMeta.description.substring(0, 120)}...</p><br><a href="/articles/${a.topic}.html" style="color:#3b82f6;text-decoration:none;font-weight:600">Read Review →</a></div>`).join('')}
</div>

<h2 class="section-title" id="categories" style="margin-top:50px">Categories We Cover</h2>
<div class="grid">
<div class="card"><span class="tag">💻 Tech</span><h3>Laptops & Accessories</h3><p>Best laptops, keyboards, mice for every budget and use case.</p></div>
<div class="card"><span class="tag">🏠 Smart Home</span><h3>Budget Smart Devices</h3><p>Affordable smart home gadgets that genuinely improve your life.</p></div>
<div class="card"><span class="tag">🎮 Gaming</span><h3>Gear Under $50</h3><p>Pro-level gaming accessories without the pro price tag.</p></div>
<div class="card"><span class="tag">⚡ Products</span><h3>Budget Finds</h3><p>Hidden gems and value picks across all categories.</p></div>
</div>
</main>
<footer>
<p>© 2025 Smart Buying Guide. All rights reserved.</p>
<p>Affiliate Disclosure: We earn commissions from qualifying purchases at no extra cost to you.</p>
</footer>
</body></html>`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log('  ✓ Built: index.html (homepage)');
}

async function buildIndexPage(articles) {
  let content = `<h2>All Articles</h2>\n<ul>\n`;
  for (const a of articles) {
    content += `  <li><a href="/articles/${a.topic}.html">${a.seoMeta.title}</a></li>\n`;
  }
  content += '</ul>';
  
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>All Articles - Money Engine</title></head>
<body style="font-family:system-ui;max-width:700px;margin:40px auto;padding:20px">
<h1>All Articles</h1>${content}
<p><a href="/">← Back to Home</a></p>
</body></html>`;
  
  await fs.mkdir(path.join(OUTPUT_DIR, 'articles'), { recursive: true });
  await fs.writeFile(path.join(OUTPUT_DIR, 'articles', 'index.html'), html);
  console.log('  ✓ Built: articles/index.html');
}

function buildSitemap(articles) {
  const now = new Date().toISOString();
  const locs = articles.map(a => 
    `  <url>\n    <loc>${CONFIG.siteUrl}/articles/${a.topic}.html</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  ).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${CONFIG.siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${locs}
</urlset>`;

  fs.writeFile(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);
  console.log('  ✓ Built: sitemap.xml');
}

function buildRobots() {
  const robots = `User-agent: *
Allow: /
Sitemap: ${CONFIG.siteUrl}/sitemap.xml`;
  
  fs.writeFile(path.join(OUTPUT_DIR, 'robots.txt'), robots);
  console.log('  ✓ Built: robots.txt');
}
