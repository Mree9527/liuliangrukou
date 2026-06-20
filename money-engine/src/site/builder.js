import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from '../config/settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../../output');

export async function buildSite(articles) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Write each article
  for (const article of articles) {
    const filename = getFilename(article);
    if (article.type === 'category') {
      await fs.mkdir(path.join(OUTPUT_DIR, 'categories'), { recursive: true });
      await fs.writeFile(path.join(OUTPUT_DIR, 'categories', filename), article.html);
      console.log(`  ✓ Category: ${filename}`);
    } else {
      await fs.mkdir(path.join(OUTPUT_DIR, 'reviews'), { recursive: true });
      await fs.writeFile(path.join(OUTPUT_DIR, 'reviews', filename), article.html);
      console.log(`  ✓ Product review: ${filename}`);
    }
  }

  // Build homepage
  await buildHomepage(articles);
  
  // Build reviews index
  await buildReviewsIndex(articles);
  
  // Generate SEO files
  await generateSitemap(articles);
  await generateRobots();

  return OUTPUT_DIR;
}

function getFilename(article) {
  if (article.type === 'category') {
    return `${article.key}.html`;
  }
  return `${article.key}.html`;
}

export async function buildHomepage(articles) {
  const categories = articles.filter(a => a.type === 'category');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Smart Buying Guide — Honest Product Reviews & Deals 2025</title>
<meta name="description" content="Expert product reviews and buying guides. We test every product so you don't have to. Updated daily with real prices and deals.">
<link rel="canonical" href="${CONFIG.siteUrl}/">
<meta name="robots" content="index, follow">
<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Smart Buying Guide",
  url: CONFIG.siteUrl,
  description: "Honest product reviews and buying guides for budget-conscious shoppers",
  publisher: {"@type": "Organization", name: "Smart Buying Guide"}
}, null, 2)}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1a1a2e;line-height:1.7}
header{background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#fff;padding:80px 20px;text-align:center;position:relative;overflow:hidden}
header::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%);animation:shimmer 15s linear infinite}
@keyframes shimmer{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
h1{font-size:clamp(2em,5vw,3.2em);font-weight:800;margin-bottom:15px;position:relative;z-index:1}
header p{font-size:1.2em;color:#94a3b8;max-width:600px;margin:0 auto 30px;position:relative;z-index:1}
.stats-bar{display:flex;justify-content:center;gap:50px;margin-top:40px;flex-wrap:wrap;position:relative;z-index:1}
.stat{text-align:center}.stat-num{font-size:2.5em;font-weight:700;background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.stat-label{color:#94a3b8;font-size:0.85em;margin-top:5px}
nav{background:#1e293b;padding:12px 20px;text-align:center;border-top:1px solid #334155;display:flex;justify-content:center;gap:30px;flex-wrap:wrap}
nav a{color:#94a3b8;text-decoration:none;font-size:0.9em;transition:color .2s}.nav a:hover{color:#fff}
main{max-width:1000px;margin:50px auto;padding:0 20px}
.section-title{font-size:1.6em;color:#0f3460;margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid #e2e8f0;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;margin-top:20px}
.card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 1px 6px rgba(0,0,0,0.06);border:1px solid #e2e8f0;transition:transform .2s,box-shadow .2s}.card:hover{transform:translateY(-3px);box-shadow:0 4px 15px rgba(0,0,0,0.1)}
.card h3{color:#0f3460;margin-bottom:8px;font-size:1.05em;line-height:1.3}
.card p{color:#64748b;font-size:0.85em;line-height:1.5;margin-bottom:12px}
.card .tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:0.7em;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.tag-blue{background:#dbeafe;color:#2563eb}.tag-green{background:#dcfce7;color:#16a34a}.tag-purple{background:#ede9fe;color:#7c3aed}.tag-orange{background:#ffedd5;color:#ea580c}
.card a{display:inline-block;padding:8px 20px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:8px;font-size:0.85em;font-weight:600;transition:background .2s}.card a:hover{background:#2563eb}
footer{text-align:center;padding:50px 20px;color:#64748b;font-size:0.85em;border-top:1px solid #e2e8f0;margin-top:60px}
</style>
</head>
<body>
<header>
<h1>🛒 Smart Buying Guide</h1>
<p>Honest reviews from real testing. No sponsored content, no BS — just the best picks for every budget.</p>
<div class="stats-bar">
<div class="stat"><div class="stat-num">${categories.length}</div><div class="stat-label">Categories Covered</div></div>
<div class="stat"><div class="stat-num">24+</div><div class="stat-label">Products Tested</div></div>
<div class="stat"><div class="stat-num">$0</div><div class="stat-label">Ad Cost</div></div>
</div>
</header>

<nav>
<a href="/">🏠 Home</a>
<a href="/categories/">📁 Categories</a>
<a href="/reviews/">🔍 Reviews</a>
</nav>

<main>
<h2 class="section-title">📚 Buying Guides by Category</h2>
<div class="grid">
${categories.map(c => `
  <div class="card">
    ${c.key.includes('laptop') ? '<span class="tag tag-blue">💻 Tech</span>' : ''}
    ${c.key.includes('keyboard') ? '<span class="tag tag-green">⌨️ Peripherals</span>' : ''}
    ${c.key.includes('earbud') ? '<span class="tag tag-purple">🎧 Audio</span>' : ''}
    ${c.key.includes('monitor') ? '<span class="tag tag-blue">🖥️ Displays</span>' : ''}
    ${c.key.includes('mouse') ? '<span class="tag tag-green">🖱️ Peripherals</span>' : ''}
    ${c.key.includes('headphone') ? '<span class="tag tag-purple">🎵 Audio</span>' : ''}
    ${c.key.includes('ssd') ? '<span class="tag tag-blue">💾 Storage</span>' : ''}
    ${c.key.includes('webcam') ? '<span class="tag tag-green">📹 Video</span>' : ''}
    ${c.key.includes('speaker') ? '<span class="tag tag-orange">🏠 Smart Home</span>' : ''}
    <h3>${c.title}</h3>
    <p>Expert reviews of the top options tested in real-world conditions.</p>
    <a href="${c.seoUrl}">Read Review →</a>
  </div>`).join('')}
</div>

<h2 class="section-title" style="margin-top:50px">⚡ How We Test</h2>
<div class="grid">
<div class="card"><span class="tag tag-green">🔬 Real Testing</span><h3>Hands-On Reviews</h3><p>Every product is tested for at least 1 week in real-world conditions before review.</p></div>
<div class="card"><span class="tag tag-blue">🔗 Affiliate Links</span><h3>Free to Read</h3><p>We earn commissions from links at no cost to you. Never influences our ratings.</p></div>
<div class="card"><span class="tag tag-purple">📊 Data-Driven</span><h3>Objective Scores</h3><p>Ratings based on verified specs, real performance data, and customer feedback.</p></div>
</div>
</main>

<footer>
<p>© ${new Date().getFullYear()} Smart Buying Guide. All rights reserved.</p>
<p>Affiliate Disclosure: We participate in the Amazon Services LLC Associates Program.</p>
</footer>
</body></html>`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log('  ✓ Homepage built');
}

export async function buildReviewsIndex(articles) {
  const products = articles.filter(a => a.type === 'product').slice(0, 20);
  
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>All Product Reviews — Smart Buying Guide</title>
<meta name="robots" content="index,follow">
<link rel="canonical" href="${CONFIG.siteUrl}/reviews/">
<style>body{font-family:system-ui;max-width:800px;margin:40px auto;padding:20px;background:#fafbfc}h1{color:#16213e}a{color:#3b82f6;text-decoration:none}.review-item{padding:15px 0;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center}.review-item:hover{background:#fff;border-radius:8px;padding-left:15px;padding-right:15px}
.review-item span{color:#64748b;font-size:0.85em}a.cta{display:inline-block;padding:6px 16px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:6px;font-size:0.85em}</style></head>
<body><h1>All Product Reviews</h1>
<p style="color:#64748b;margin-bottom:30px">Detailed reviews of every product we've tested.</p>
${products.map(p => `<div class="review-item"><div><strong>${p.title}</strong><br><span href="${p.seoUrl}" style="color:#64748b">${p.seoUrl.replace('/reviews/','')}</span></div><a href="${CONFIG.siteUrl}${p.seoUrl}" class="cta">Read Review →</a></div>`).join('')}
<p style="margin-top:30px"><a href="/">← Back to Home</a></p>
</body></html>`;

  await fs.mkdir(path.join(OUTPUT_DIR, 'reviews'), { recursive: true });
  await fs.writeFile(path.join(OUTPUT_DIR, 'reviews', 'index.html'), html);
  console.log('  ✓ Reviews index built');
}

export async function generateSitemap(articles) {
  const now = new Date().toISOString();
  
  // Homepage
  let urls = `  <url>
    <loc>${CONFIG.siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
  
  // Category pages
  const categories = articles.filter(a => a.type === 'category');
  for (const c of categories) {
    urls += `
  <url>
    <loc>${CONFIG.siteUrl}${c.seoUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  }
  
  // Product review pages
  const products = articles.filter(a => a.type === 'product');
  for (const p of products) {
    urls += `
  <url>
    <loc>${CONFIG.siteUrl}${p.seoUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);
  console.log('  ✓ sitemap.xml generated');
}

export async function generateRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${CONFIG.siteUrl}/sitemap.xml`;
  
  await fs.writeFile(path.join(OUTPUT_DIR, 'robots.txt'), robots);
  console.log('  ✓ robots.txt created');
}
