import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output', 'compare');
const TAG = 'smarthome-20';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Build all category pairs for comparison
function getCategories() {
  return Object.entries(PRODUCTS).filter(([k,v]) => v.items.length >= 2);
}

function generateComparison(catKey, catData, productA, productB) {
  const a = productA;
  const b = productB;
  
  const slugA = a.id.toLowerCase();
  const slugB = b.id.toLowerCase();
  const filename = `compare-${slugA}-vs-${slugB}.html`;
  const urlPath = `compare/${filename}`;
  
  // Generate comparison table rows
  let tableRows = '';
  
  // Rating comparison
  tableRows += `<tr><td style="padding:12px;font-weight:600;background:#f8fafc">Rating</td>`;
  tableRows += `<td style="padding:12px;text-align:center">${'⭐'.repeat(Math.round(a.rating))} ${a.rating}/5</td>`;
  tableRows += `<td style="padding:12px;text-align:center">${'⭐'.repeat(Math.round(b.rating))} ${b.rating}/5</td></tr>\n`;
  
  // Review count
  tableRows += `<tr><td style="padding:12px;font-weight:600;background:#f8fafc">Reviews</td>`;
  tableRows += `<td style="padding:12px;text-align:center">${a.reviews}</td>`;
  tableRows += `<td style="padding:12px;text-align:center">${b.reviews}</td></tr>\n`;
  
  // Price
  tableRows += `<tr><td style="padding:12px;font-weight:600;background:#f8fafc">Price</td>`;
  tableRows += `<td style="padding:12px;text-align:center;color:${parseFloat(a.price.replace('$',''))<parseFloat(b.price.replace('$',''))?'#16a34a':'inherit'}">${a.price}</td>`;
  tableRows += `<td style="padding:12px;text-align:center;color:${parseFloat(b.price.replace('$',''))<parseFloat(a.price.replace('$',''))?'#16a34a':'inherit'}">${b.price}</td></tr>\n`;
  
  // Tier
  tableRows += `<tr><td style="padding:12px;font-weight:600;background:#f8fafc">Best For</td>`;
  tableRows += `<td style="padding:12px;text-align:center">${a.tier}</td>`;
  tableRows += `<td style="padding:12px;text-align:center">${b.tier}</td></tr>\n`;
  
  // Pros
  const prosA = a.pros.slice(0,3).map(p => `• ${p}`).join('<br>');
  const prosB = b.pros.slice(0,3).map(p => `• ${p}`).join('<br>');
  tableRows += `<tr><td style="padding:12px;font-weight:600;background:#f8fafc">Pros</td>`;
  tableRows += `<td style="padding:12px">${prosA}</td>`;
  tableRows += `<td style="padding:12px">${prosB}</td></tr>\n`;
  
  // Cons
  const consA = a.cons.slice(0,3).map(c => `• ${c}`).join('<br>');
  const consB = b.cons.slice(0,3).map(c => `• ${c}`).join('<br>');
  tableRows += `<tr><td style="padding:12px;font-weight:600;background:#f8fafc">Cons</td>`;
  tableRows += `<td style="padding:12px">${consA}</td>`;
  tableRows += `<td style="padding:12px">${consB}</td></tr>\n`;

  // Winner determination
  let winnerText = '';
  if (a.rating > b.rating) winnerText = `${a.name} wins on rating (${a.rating} vs ${b.rating}).`;
  else if (b.rating > a.rating) winnerText = `${b.name} wins on rating (${b.rating} vs ${a.rating}).`;
  
  const priceDiff = Math.abs(parseFloat(a.price.replace('$','')) - parseFloat(b.price.replace('$','')));
  if (priceDiff < 20 && a.rating >= b.rating) {
    winnerText += `\n\n🏆 **Winner: ${a.name}** — Same price range, higher rating.`;
  } else if (a.tier === 'budget' && b.tier === 'premium') {
    winnerText += `\n\n💰 **Budget pick: ${a.name}** — If you want to save money.\n🏆 **Premium pick: ${b.name}** — If you want the best.`;
  }

  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${a.name} vs ${b.name}: Honest Comparison 2026</title>
<meta name="description" content="${a.name} vs ${b.name} — Side by side comparison. Which one should you buy in 2026? Honest reviews, pros/cons, winner pick.">
<link rel="canonical" href="https://mree9527.github.io/liuliangrukou/${urlPath}">
<meta name="robots" content="index, follow">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1a1a2e;background:#f8fafc}
header{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:40px 20px;text-align:center}
main{max-width:900px;margin:0 auto;padding:40px 20px}
h1{font-size:clamp(1.5em,4vw,2.2em);margin-bottom:8px}
.subtitle{color:#94a3b8;margin-bottom:30px;font-size:1.05em}
.compare-table{width:100%;border-collapse:collapse;margin:24px 0;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.compare-table th{background:#f1f5f9;padding:14px;font-size:0.8em;text-transform:uppercase;letter-spacing:0.5px;color:#334155}
.section-title{font-size:1.4em;font-weight:700;color:#0f3460;margin:32px 0 12px;padding-left:10px;border-left:3px solid #3b82f6}
.pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:16px 0}
.pc-card{padding:20px;border-radius:12px}
.pc-card.pros{background:#f0fdf4;border:1px solid #dcfce7}
.pc-card.cons{background:#fef2f2;border:1px solid #fee2e2}
.pc-card h3{margin-bottom:8px;font-size:1em}
.cta-section{text-align:center;margin:32px 0;padding:24px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:16px}
.cta-btn{display:inline-block;padding:14px 40px;background:#dc2626;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:1.1em;margin:8px}
.winner-box{background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:14px;padding:24px;margin:24px 0;font-weight:600;line-height:1.8}
.summary{font-size:0.9em;color:#334155;margin-top:12px}
@media(max-width:768px){.pros-cons{grid-template-columns:1fr}}
</style>
</head><body>
<header><h1>${a.name} vs ${b.name}</h1>
<p class="subtitle">Full comparison with winner pick for 2026 — honest reviews, no BS.</p></header>
<main>
<h2 class="section-title">Side-by-Side Comparison</h2>
<table class="compare-table">
<thead><tr><th style="width:35%">Feature</th><th style="text-align:center;width:32%">${a.name}</th><th style="text-align:center;width:33%">${b.name}</th></tr></thead>
<tbody>${tableRows}</tbody>
</table>

<h2 class="section-title">${a.name} — Details</h2>
<p>${a.description}</p>
<div class="pros-cons">
<div class="pc-card pros"><h3 style="color:#16a34a">✅ Pros</h3>${a.pros.map(p=>'<div style="margin:4px 0">'+p+'</div>').join('')}</div>
<div class="pc-card cons"><h3 style="color:#dc2626">❌ Cons</h3>${a.cons.map(c=>'<div style="margin:4px 0">'+c+'</div>').join('')}</div>
</div>

<h2 class="section-title">${b.name} — Details</h2>
<p>${b.description}</p>
<div class="pros-cons">
<div class="pc-card pros"><h3 style="color:#16a34a">✅ Pros</h3>${b.pros.map(p=>'<div style="margin:4px 0">'+p+'</div>').join('')}</div>
<div class="pc-card cons"><h3 style="color:#dc2626">❌ Cons</h3>${b.cons.map(c=>'<div style="margin:4px 0">'+c+'</div>').join('')}</div>
</div>

${winnerText ? '<div class="winner-box">🏆 <strong>Our Verdict:</strong><br>' + winnerText.replace(/\n/g, '<br>') + '</div>' : ''}

<div class="cta-section">
<p style="margin-bottom:12px;font-weight:700;color:#0f3460">Check Current Prices on Amazon</p>
<a href="https://www.amazon.com/dp/${a.id}?tag=${TAG}&linkCode=ogi&th=1" class="cta-btn" target="_blank" rel="nofollow sponsored noopener">${a.name} → Check Price</a>
<a href="https://www.amazon.com/dp/${b.id}?tag=${TAG}&linkCode=ogi&th=1" class="cta-btn" target="_blank" rel="nofollow sponsored noopener">${b.name} → Check Price</a>
<p class="summary">Disclosure: We earn commission at no extra cost to you. Prices accurate as of 2026-06-21.</p>
</div>
</main></body></html>`;

  const outPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outPath, html);
  console.log(`  ✓ ${filename}`);
}

// Run: create comparisons between same-category products
const cats = getCategories();
let total = 0;

cats.forEach(([catKey, catData]) => {
  const items = catData.items;
  // Compare each pair once (i < j)
  for (let i = 0; i < Math.min(items.length, 4); i++) {
    for (let j = i + 1; j < Math.min(items.length, 4); j++) {
      ensureDir(path.join(OUTPUT_DIR));
      generateComparison(catKey, catData, items[i], items[j]);
      total++;
    }
  }
});

// Also cross-category comparisons for high-value categories
const laptopItems = PRODUCTS.laptops?.items || [];
const keyboardItems = PRODUCTS.keyboards?.items || [];
const earbudItems = PRODUCTS.earbuds?.items || [];

if (laptopItems.length >= 2 && keyboardItems.length >= 2) {
  generateComparison('cross', null, 
    {...laptopItems[0], price: 'Starting at ' + laptopItems[0].price, pros: ['Laptops are versatile','Long battery life'], cons: ['Heavier to carry','Limited by screen size']},
    {...keyboardItems[0], price: keyboardItems[0].price, pros: ['Excellent typing experience','Portable','Customizable switches'], cons: ['Not a complete computer','Need separate device']}
  );
  total++;
}

console.log(`\n✅ Generated ${total} comparison articles`);
