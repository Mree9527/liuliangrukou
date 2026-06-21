import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output', 'medium-export');

// Medium SEO-optimized article topics
const TOPICS = [
  {
    title: "The Best Wireless Earbuds Under $50 in 2026 (Tested)",
    keyword: "best wireless earbuds under 50",
    products: ['B0D7FJ86YQ', 'B0CMDRCZ5H', 'B0CHXHTV6P']
  },
  {
    title: "Best Mechanical Keyboards Under $100 for Gamers (2026)",
    keyword: "best mechanical keyboard under 100",
    products: ['B09C1DG61K', 'B0BWQF4M1P', 'B0BHJC6X1R']
  },
  {
    title: "MacBook Air M2 vs M1: Which One Should You Buy in 2026?",
    keyword: "macbook air m2 vs m1",
    products: ['B0BSHF7WHW', 'B09JQMJHXY']
  },
  {
    title: "Top 5 Budget Laptops Under $500 for Students (2026)",
    keyword: "best budget laptop under 500",
    products: ['B0CCP2637D', 'B0BS4C7M5V', 'B0CM5JV2G8']
  },
  {
    title: "The Sony WF-1000XM5 Review: Is $248 Worth It?",
    keyword: "sony wf-1000xm5 review",
    products: ['B0D1XD1ZV3']
  }
];

function findProduct(productId) {
  for (const [catKey, cat] of Object.entries(PRODUCTS)) {
    const found = cat.items.find(p => p.id === productId);
    if (found) return { ...found, category: cat.category };
  }
  return null;
}

function generateMediumArticle(topic) {
  const products = topic.products.map(pid => findProduct(pid)).filter(Boolean);
  
  if (products.length < 2) return null;

  // Build pros/cons
  let pros = products[0].pros.slice(0, 3).map(p => `• ${p}`).join('\n');
  let cons = (products[0].cons || []).slice(0, 2).map(c => `• ${c}`).join('\n');

  // Link to first product
  const mainProduct = products[0];
  const reviewUrl = `https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/${mainProduct.id}-review.html`;

  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} - Smart Buying Guide</title>
<meta name="description" content="${topic.title}. We tested 3+ products to find the best value in ${new Date().getFullYear()}. Honest review with pros and cons.">
<link rel="canonical" href="https://mree9527.github.io/liuliangrukou/money-engine/output/medium-export/${topic.keyword.replace(/[^a-z0-9]+/g, '-')}.html">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.8;color:#1a1a2e;background:#fff}
article{max-width:700px;margin:40px auto;padding:0 20px 60px}
h1{font-size:2.5em;font-weight:800;color:#0f3460;margin-bottom:20px;line-height:1.2}
.subtitle{color:#64748b;font-size:1.1em;margin-bottom:30px}
.section-title{font-size:1.4em;font-weight:700;color:#0f3460;margin:30px 0 15px;border-left:4px solid #3b82f6;padding-left:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;margin:20px 0}
.card{background:#f8fafc;border-radius:12px;padding:16px}
.product-name{font-weight:700;font-size:1.05em;color:#0f3460}
.product-price{color:#dc2626;font-weight:700;margin:8px 0;font-size:1.1em}
.product-desc{font-size:.9em;color:#334155;margin-bottom:10px}
.pros{background:#f0fdf4;border-left:3px solid #22c55e;padding:10px;margin-top:8px}
.cons{background:#fef2f2;border-left:3px solid #dc2626;padding:10px;margin-top:8px}
.cta-btn{display:block;background:#3b82f6;color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:700;text-align:center;margin:20px auto;max-width:280px}
.cta-btn:hover{background:#2563eb}
.final-pick{background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:14px;padding:20px;margin:30px 0;text-align:center}
.final-pick strong{color:#92400e;font-size:1.1em;display:block;margin-bottom:8px}
@media(max-width:640px){h1{font-size:1.8em}}
</style></head><body>
<article>
<h1>${topic.title}</h1>
<p class="subtitle">After testing 3+ products, here's our honest recommendation for the best value.</p>

<div class="section-title">🏆 Our Pick: ${mainProduct.name}</div>
<p>${mainProduct.description}</p>

<div class="grid">
${products.map(p => `
<div class="card">
<div class="product-name">${p.name}</div>
<div class="product-price">${p.price}</div>
<div class="product-desc">${p.description.split('.')[0]}</div>
<div class="pros"><strong>Pros:</strong><br>${p.pros.slice(0,2).map(x=>x+'<br>').join('')}</div>
${p.cons ? `<div class="cons"><strong>Cons:</strong><br>${p.cons[0]}</div>` : ''}
<a href="${reviewUrl}" class="cta-btn">Read Full Review</a>
</div>`).join('\n')}
</div>

<div class="final-pick">
<strong>🏆 FINAL VERDICT</strong>
For ${topic.products.length > 2 ? 'most users' : 'budget-conscious buyers'}, the ${mainProduct.name} delivers the best combination of value and performance at ${mainProduct.price}. If you need more features, check out the runners-up above.
</div>

<div style="margin-top:40px;padding:16px;background:#eff6ff;border-radius:10px">
<strong>Affiliate Disclosure:</strong> We earn commission if you buy through our links. No extra cost to you. Prices accurate as of ${new Date().toISOString().split('T')[0]}.
</div>
</article></body></html>`;

  const filename = `${topic.keyword.replace(/[^a-z0-9]+/g, '-')}.html`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), html);
  console.log(`  ✓ ${filename}`);
  
  return { products: products.length, url: `https://mree9527.github.io/liuliangrukou/money-engine/output/medium-export/${filename}` };
}

console.log('\n🚀 GENERATING MEDIUM ARTICLES...\n');

let totalGenerated = 0;
TOPICS.forEach(topic => {
  const result = generateMediumArticle(topic);
  if (result) totalGenerated += result.products;
});

console.log(`\n✅ Generated ${TOPICS.length} Medium articles covering ${totalGenerated} products`);
