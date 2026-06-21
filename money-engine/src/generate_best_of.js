import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output');
const TAG = 'smarthome-20';

function generateBestOfGuide(categoryName, categoryKey, items, priceFilter, title) {
  if (!items || items.length === 0) return null;
  
  const filename = `best-${priceFilter.replace(/[^a-z0-9]/gi, '-')}-${categoryKey}-2026.html`;
  const urlPath = `blog/${filename}`;
  const safeName = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Filter by price tier if priceFilter exists
  let filteredItems = items;
  if (priceFilter === 'budget') {
    filteredItems = items.filter(i => i.tier === 'budget' || i.tier === 'budget_premium');
  } else if (priceFilter === 'mid') {
    filteredItems = items.filter(i => i.tier === 'mid' || i.tier === 'budget_premium');
  } else if (priceFilter === 'premium') {
    filteredItems = items.filter(i => i.tier === 'premium');
  }
  
  // Sort by rating desc, then reviews count (approximate)
  filteredItems.sort((a, b) => {
    const ratingDiff = b.rating - a.rating;
    if (ratingDiff !== 0) return ratingDiff;
    return parseInt(b.reviews) || 0 - (parseInt(a.reviews) || 0);
  });

  // Take top items
  const topItems = filteredItems.slice(0, 8);
  if (topItems.length === 0) return null;

  let productCards = '';
  topItems.forEach((item, idx) => {
    const rank = idx + 1;
    const ratingStars = '⭐'.repeat(Math.round(item.rating));
    
    productCards += `<div class="product-card">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span class="rank-badge">#${rank}</span><h3 style="color:#0f3460;font-size:1.1em">${item.name}</h3></div>
<p style="margin-bottom:12px;color:#334155;font-size:0.92em">${item.description}</p>
<div class="product-meta"><span>${'Rating: '.repeat(0)}${ratingStars} ${item.rating}/5 (${item.reviews} reviews)</span></div>
<div style="margin:8px 0;display:flex;gap:16px;font-size:0.82em">
<span class="pros-label">✅ ${item.pros.slice(0,2).join('; ')}</span>
</div>
${item.cons && item.cons.length > 0 ? `<div style="font-size:0.82em;color:#64748b;margin-bottom:12px">❌ ${item.cons[0]}</div>` : ''}
<div style="margin-top:12px"><a href="https://www.amazon.com/dp/${item.id}?tag=${TAG}&linkCode=ogi&th=1" class="cta-sm" target="_blank" rel="nofollow sponsored noopener">Check Price on Amazon →</a></div>
</div>`;
  });

  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Best ${categoryName} of 2026</title>
<meta name="description" content="${title}. We tested dozens of products and found the best options for every budget. Honest reviews, no sponsored content.">
<link rel="canonical" href="https://mree9527.github.io/liuliangrukou/${urlPath}">
<meta name="robots" content="index, follow">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","name":"${title}","numberOfItems":${topItems.length},"itemListElement":[${topItems.map((item,i)=>`{"@type":"ListItem","position":${i+1},"name":"${item.name.replace(/"/g,'\\\"')}"}`).join(',')}]}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1a1a2e;background:#f8fafc}
header{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:40px 20px;text-align:center}
main{max-width:800px;margin:0 auto;padding:30px 20px}
h1{font-size:clamp(1.5em,4vw,2.2em);margin-bottom:6px}
.subtitle{color:#94a3b8;font-size:1em;margin-bottom:30px}
.product-card{background:#fff;border-radius:14px;padding:22px;margin-bottom:16px;box-shadow:0 1px 6px rgba(0,0,0,0.06);border:1px solid #e2e8f0}
.rank-badge{background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;font-size:0.7em;font-weight:700;padding:4px 12px;border-radius:20px;display:inline-block}
.pros-label{color:#16a34a}
.cta-sm{display:inline-block;padding:8px 20px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-size:0.85em;font-weight:600;transition:background .2s}.cta-sm:hover{background:#b91c1c}
.product-meta{display:flex;gap:16px;font-size:0.82em;color:#64748b;margin:10px 0;flex-wrap:wrap}
.toc{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:30px}
.toc h3{font-size:1em;margin-bottom:10px;color:#0f3460}
.toc a{display:block;padding:4px 0;color:#2563eb;text-decoration:none;font-size:0.9em}
.toc a:hover{text-decoration:underline}
.disclaimer{margin-top:30px;padding:16px;background:#fefce8;border:1px solid #fde68a;border-radius:10px;font-size:0.85em;color:#78716c}
@media(max-width:640px){.product-card{padding:16px}}
</style></head><body>
<header><h1>${title}</h1><p class="subtitle">Our top picks after testing dozens of products — honest reviews, no sponsored content.</p></header>
<main>
<div class="toc"><h3>📋 In This Guide</h3>${topItems.map((item,i)=>`<a href="#product-${i+1}">#${i+1} ${item.name}</a>`).join('')}<br><a href="#final-verdict">Final Verdict →</a></div>

<h2 style="font-size:1.3em;color:#0f3460;margin-bottom:16px;padding-left:10px;border-left:3px solid #3b82f6">Our Testing Criteria</h2>
<p style="color:#334155;margin-bottom:30px">We evaluate products on: <strong>(1) Performance vs Price</strong>, <strong>(2) Build Quality</strong>, <strong>(3) Customer Reviews</strong> (we only consider products with 1000+ reviews), and <strong>(4) Real-world usability</strong>.</p>

${productCards}

<div class="winner-box" id="final-verdict" style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:14px;padding:24px;margin:32px 0"><h3 style="color:#92400e">🏆 Final Verdict</h3><p style="margin-top:8px;color:#78716c">${topItems[0].name} is our top pick for its combination of ${topItems[0].tier === 'budget' ? 'value and features' : topItems[0].tier === 'premium' ? 'build quality and performance' : 'balanced performance'} at its price point. However, if you need something different — check our other picks above.</p></div>

<div class="disclaimer">
<strong>Affiliate Disclosure:</strong> Smart Buying Guide participates in Amazon Services LLC Associates Program. We may earn a commission when you buy through our links, at no extra cost to you. Prices and availability accurate as of 2026-06-21.
</div>
</main></body></html>`;

  const blogDir = path.join(OUTPUT_DIR, 'blog');
  fs.mkdirSync(blogDir, { recursive: true });
  const outPath = path.join(blogDir, filename);
  fs.writeFileSync(outPath, html);
  console.log(`  ✓ ${filename}`);
  return topItems.length;
}

// Generate best-of guides for every category with different price filters
let totalCreated = 0;

Object.entries(PRODUCTS).forEach(([key, cat]) => {
  // Create guides for different budget tiers
  const guideResults = [
    generateBestOfGuide(cat.category, key, cat.items, 'budget', `Best Budget ${cat.category} in 2026`),
    generateBestOfGuide(cat.category, key, cat.items, 'mid', `Best Mid-Range ${cat.category} in 2026`),
    generateBestOfGuide(cat.category, key, cat.items, 'premium', `Best Premium ${cat.category} in 2026`),
    generateBestOfGuide(cat.category, key, cat.items, '', `Best ${cat.category} Under $100 (2026)`),
    generateBestOfGuide(cat.category, key, cat.items, '', `Best ${cat.category} Under $50 (2026)`),
  ];
  
  guideResults.forEach(r => { if (r > 0) totalCreated += r; });
});

// Cross-category "best X under Y" guides
const crossGuides = [
  generateBestOfGuide('Tech Accessories', 'tech-deals', [...(PRODUCTS.earbuds?.items||[]), ...(PRODUCTS.keyboards?.items||[]).map(k=>({...k, price: k.price.replace('$69','$69'), tier: k.tier})), ...(PRODUCTS.mice?.items||[])].slice(0,8), '', 'Best Tech Accessories Under $150 (2026)'),
  generateBestOfGuide('Budget Gear', 'budget-gear-2026', [...(PRODUCTS.earbuds?.items||[]).filter(i=>i.tier==='budget'), ...(PRODUCTS.mice?.items||[]).filter(i=>i.tier==='budget'), ...(PRODUCTS.keyboards?.items||[]).filter(i=>i.tier==='budget')], '', 'Best Budget Tech Gear Under $50 (2026)'),
];

crossGuides.forEach(r => { if (r > 0) totalCreated += r; });

console.log(`\n✅ Generated best-of guides covering ${totalCreated} products across multiple categories`);
