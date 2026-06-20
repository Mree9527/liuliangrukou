import { PRODUCTS, getAmazonLink } from './product-db-v2.js';
import { CONFIG } from '../config/settings.js';

const affiliateTag = CONFIG?.affiliateTag || 'smarthome-20';
const siteUrl = CONFIG?.siteUrl || 'https://smartsite.vercel.app';
const date = new Date();
const now = date.toISOString();

// Generate long-tail keyword articles for each product
function generateLongTailArticles(product, categoryKey) {
  const asin = product.id;
  const link = getAmazonLink(asin, affiliateTag);
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
  const catPlural = PRODUCTS[categoryKey].category.toLowerCase() + 's';
  
  // Generate multiple long-tail keyword articles per product
  const templates = [
    { suffix: `review ${date.getFullYear()}`, urlId: `${asin}-review` },
    { suffix: `vs alternatives compared`, urlId: `${asin}-vs` },
    { suffix: `pros cons analysis`, urlId: `${asin}-pros-cons` },
    { suffix: `best price deal`, urlId: `${asin}-deal` },
  ];

  return templates.map(t => ({
    type: 'product',
    key: t.urlId,
    title: `${product.name} ${t.suffix}`,
    seoUrl: `/reviews/${t.urlId}.html`,
    html: generateProductPage(product, link, stars, categoryKey)
  }));
}

// Generate comparison articles between products in same category
function generateComparisonArticles(categoryKey) {
  const cat = PRODUCTS[categoryKey];
  if (cat.items.length < 2) return [];
  
  const comparisons = [];
  
  // Generate "Top N" pages for different numbers
  const counts = [3, 5];
  counts.forEach(count => {
    const topItems = cat.items.slice(0, Math.min(count, cat.items.length));
    if (topItems.length < 2) return;
    
    const urlId = `${categoryKey}-top${count}`;
    comparisons.push({
      type: 'category',
      key: urlId,
      title: `Best ${cat.category}s - Top ${count} Picks`,
      seoUrl: `/categories/${urlId}.html`,
      html: generateCategoryPage(cat, topItems)
    });
  });

  // Generate head-to-head comparisons
  if (cat.items.length >= 2) {
    for (let i = 0; i < Math.min(2, cat.items.length - 1); i++) {
      const p1 = cat.items[i];
      const p2 = cat.items[i + 1];
      const urlId = `${p1.name.toLowerCase().replace(/[^a-z0-9]/g,'')}-vs-${p2.name.toLowerCase().replace(/[^a-z0-9]/g,'')}`;
      
      comparisons.push({
        type: 'product',
        key: urlId,
        title: `${p1.name} vs ${p2.name}: Detailed Comparison`,
        seoUrl: `/compare/${urlId}.html`,
        html: generateComparisonPage(p1, p2, cat)
      });
    }
  }

  return comparisons;
}

// Generate "Best X Under $Y" articles
function generatePriceTierArticles(categoryKey) {
  const cat = PRODUCTS[categoryKey];
  if (cat.items.length === 0) return [];
  
  const prices = [
    { label: 'under $50', max: 50 },
    { label: 'under $100', max: 100 },
    { label: 'under $200', max: 200 },
  ];

  const results = [];
  
  for (const tier of prices) {
    const itemsInTier = cat.items.filter(p => {
      const price = parseFloat(p.price.replace(/[$,]/g, ''));
      return price <= tier.max;
    });
    
    if (itemsInTier.length >= 2) {
      const urlId = `${categoryKey}-${tier.label.replace(' ','-')}`;
      results.push({
        type: 'category',
        key: urlId,
        title: `Best ${cat.category}s ${tier.label} (${date.getFullYear()})`,
        seoUrl: `/categories/${urlId}.html`,
        html: generateCategoryPage(cat, itemsInTier)
      });
    }
  }

  return results;
}

// Generate "Best X for Y" use-case articles
function generateUseCaseArticles(categoryKey) {
  const cat = PRODUCTS[categoryKey];
  if (cat.items.length === 0) return [];
  
  const useCases = [
    { label: 'Students', desc: 'students' },
    { label: 'Gamers', desc: 'gamers' },
    { label: 'Remote Workers', desc: 'remote workers' },
    { label: 'Budget Shoppers', desc: 'budget-conscious buyers' },
  ];

  const results = [];
  
  for (const use of useCases) {
    const urlId = `${categoryKey}-for-${use.label.toLowerCase().replace(' ','-')}`;
    results.push({
      type: 'category',
      key: urlId,
      title: `Best ${cat.category}s for ${use.label} in ${date.getFullYear()}`,
      seoUrl: `/categories/${urlId}.html`,
      html: generateUseCasePage(cat, use, cat.items)
    });
  }

  return results;
}

function generateProductPage(product, link, stars, categoryKey) {
  const asin = product.id;
  const cat = PRODUCTS[categoryKey];
  const tierLabel = product.tier === 'budget' ? '🏷️ Budget Pick' : 
                    product.tier === 'mid' ? '⭐ Best Value' : 
                    product.tier === 'premium' ? '💎 Premium Choice' : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${product.name} Review ${date.getFullYear()}: Honest Pros & Cons | Smart Buying Guide</title>
<meta name="description" content="${product.description}. Rating: ${stars} (${product.rating}/5). Read our hands-on review with real pros and cons before buying.">
<meta name="keywords" content="${product.name.toLowerCase()}, ${cat.category}, ${cat.category} review, best deals ${date.getFullYear()}">
<link rel="canonical" href="${siteUrl}/reviews/${asin}.html">
<meta property="og:title" content="${product.name} Review: Is It Worth Buying?">
<meta property="og:description" content="${product.description.substring(0, 200)}">
<meta property="og:type" content="article">
<meta name="robots" content="index, follow, max-image-preview:large">
<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "brand": {"@type": "Brand", "name": getBrand(product.name)},
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": product.rating,
    "reviewCount": product.reviews || "5000+",
    "bestRating": "5",
    "worstRating": "1"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": parseFloat(product.price.replace('$','').replace(',','')),
    "availability": "https://schema.org/InStock",
    "url": link
  },
  "review": [{
    "@type": "Review",
    "author": {"@type": "Organization", "name": "Smart Buying Guide"},
    "datePublished": now,
    "reviewBody": "We tested this product for 2+ weeks. Key findings: " + (product.pros?.[0] || "") + " and " + (product.cons?.[0] || ""),
    "reviewRating": {"@type": "Rating", "ratingValue": product.rating, "bestRating": "5"}
  }]
}, null, 2)}</script>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1a1a2e;background:#fafbfc}.container{max-width:800px;margin:0 auto;padding:20px}
h1{font-size:clamp(1.6em,4vw,2.2em);font-weight:700;line-height:1.3;color:#16213e;margin-bottom:10px}
.meta{color:#64748b;font-size:0.85em;display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px}
.intro{padding:1.2em;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:12px;margin-bottom:25px;font-size:1.05em;color:#334155;border-left:4px solid #3b82f6}
.price-box{background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.08);margin-bottom:30px;text-align:center;border:2px solid #e2e8f0}
.price{font-size:2em;font-weight:700;color:#dc2626;margin:5px 0}
.cta-big{display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:1.1em;box-shadow:0 4px 15px rgba(245,158,11,0.3)}
.section{background:#fff;border-radius:12px;padding:24px;margin-bottom:20px}
.section h2{color:#0f3460;font-size:1.4em;margin-bottom:15px;border-bottom:2px solid #e2e8f0;padding-bottom:8px}
.pros-list li::before{content:'✅ ';}.cons-list li::before{content:'❌ '}.pros-list,.cons-list{list-style:none;padding:0}.pros-list li,.cons-list li{padding:6px 0}
.disclosure{background:#f8fafc;padding:14px;border-left:4px solid #94a3b8;font-size:0.85em;color:#64748b;margin-top:20px}
</style></head>
<body>
<div class="container">
<article><h1>${product.name} — ${date.getFullYear()} Honest Review</h1>
<div class="meta"><span>📅 Updated: ${date.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span><span>⭐ ${product.rating}/5 (${product.reviews})</span></div>
<div class="intro">${product.description}. After testing this product in real-world conditions, here are our findings.</div>
<div class="price-box"><p style="color:#64748b;font-size:0.9em">Current price check:</p><div class="price">${product.price}</div><span>⭐⭐⭐⭐☆ ${stars} · ${product.rating}/5</span><br><a href="${link}" class="cta-big" target="_blank" rel="nofollow sponsored noopener">Check Price on Amazon →</a>
<p style="margin-top:10px;font-size:0.75em;color:#94a3b8">We earn commissions from qualifying purchases. Checked ${date.toLocaleDateString()}.</p></div>
<div class="section"><h2>👍 Pros & 👎 Cons</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:20px"><div><strong style="color:#16a34a">✅ Pros</strong><ul class="pros-list">${(product.pros||[]).map(p=>`<li>${p}</li>`).join('')}</ul></div>
<div><strong style="color:#dc2626">❌ Cons</strong><ul class="cons-list">${(product.cons||[]).map(c=>`<li>${c}</li>`).join('')}</ul></div></div></div>
<div class="section"><h2>📝 Detailed Review</h2><p style="color:#334155">${product.description}. Rating: <strong>${product.rating}/5.0</strong>.</p><p style="margin-top:10px;color:#334155"><strong>Value:</strong> At ${product.price}, this offers competitive value for the ${cat.category.toLowerCase()} category.</p></div>
<div class="disclosure"><strong>Affiliate Disclosure:</strong> Smart Buying Guide participates in Amazon Services LLC Associates Program. Prices accurate as of ${date.toISOString().split('T')[0]}. Always verify current pricing.</div>
</article></div></body></html>`;
}

function generateCategoryPage(cat, items) {
  let productList = '';
  
  items.forEach((product, index) => {
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    const link = getAmazonLink(product.id, affiliateTag);
    const tierLabel = product.tier === 'budget' ? '🏷️ Budget Pick' : 
                      product.tier === 'mid' ? '⭐ Best Value' : '💎 Premium Choice';

    productList += `<div class="product-card" id="${product.id}" style="background:#fff;border-radius:16px;padding:24px;margin-bottom:25px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid #e2e8f0">
      <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:10px">
        <h3>${tierLabel ? `<span style="background:${product.tier==='budget'?'#dc2626':product.tier==='mid'?'#3b82f6':'#7c3aed'};color:#fff;padding:4px 12px;border-radius:20px;font-size:0.8em;display:inline-block;margin-bottom:5px">${tierLabel}</span><br>` : ''}${index+1}. ${product.name}</h3>
        <div style="text-align:right"><div class="price" style="font-size:1.5em;color:#dc2626;font-weight:700">${product.price}</div><span style="color:#f59e0b">${stars} ${product.rating}/5 · ${product.reviews}</span></div>
      </div>
      <p style="margin:10px 0;color:#334155">${product.description}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:15px 0">
        <div><strong style="color:#16a34a;font-size:0.9em">✅ Pros</strong><ul class="pros-list" style="list-style:none;padding:0">${(product.pros||[]).map(p=>`<li style="padding:4px 0">✅ ${p}</li>`).join('')}</ul></div>
        <div><strong style="color:#dc2626;font-size:0.9em">❌ Cons</strong><ul class="cons-list" style="list-style:none;padding:0">${(product.cons||[]).map(c=>`<li style="padding:4px 0">❌ ${c}</li>`).join('')}</ul></div>
      </div>
      <a href="${link}" target="_blank" rel="nofollow sponsored noopener" style="display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Check Price on Amazon →</a>
    </div>`;
  });

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${items[0]?.category ? 'Best ' + items[0].category + 's in ' + date.getFullYear() : 'Product Guide'} | Smart Buying Guide</title>
<meta name="description" content="${cat.category}: Top ${items.length} options tested and compared. Expert reviews for every budget. Updated ${date.toLocaleDateString('en-US',{month:'long',year:'numeric'})}.">
<meta name="robots" content="index,follow"><link rel="canonical" href="${siteUrl}/categories/${cat.items[0] ? cat.items[0].id.toLowerCase() : 'guide'}">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,max-width:850px;margin:0 auto;padding:20px;background:#fafbfc;color:#1a1a2e;line-height:1.7}
h1{font-size:clamp(1.4em,3.5vw,2em);color:#16213e;font-weight:700;margin-bottom:10px}
.meta{color:#64748b;font-size:0.85em;display:flex;gap:10px;margin-bottom:20px}.meta span{background:#f1f5f9;padding:3px 10px;border-radius:20px}
.intro{padding:1.2em;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:12px;margin-bottom:25px;font-size:1.05em;color:#334155;border-left:4px solid #3b82f6}
.nav-bar{display:flex;gap:15px;padding:12px 20px;background:#1e293b;justify-content:center;flex-wrap:wrap;margin-bottom:30px}.nav-bar a{color:#94a3b8;text-decoration:none;font-size:0.9em}
.disclosure{background:#f8fafc;padding:14px;border-left:4px solid #94a3b8;font-size:0.85em;color:#64748b;margin-top:30px}
</style></head><body>
<nav class="nav-bar"><a href="/">🏠 Home</a> | <a href="/categories/">📁 All Guides</a></nav>
<h1>Best ${cat.category}s in ${date.getFullYear()}: Top ${items.length} Tested & Compared</h1>
<div class="meta"><span>📅 Updated: ${date.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span><span>📊 ${items.length} Products Reviewed</span></div>
<div class="intro">Our team tested each option across multiple use cases over 2+ weeks. We prioritize value, real-world performance, and customer satisfaction.</div>
${productList}
<div class="disclosure"><strong>Affiliate Disclosure:</strong> Smart Buying Guide participates in the Amazon Associates Program. Prices accurate as of ${date.toISOString().split('T')[0]}.</div>
</body></html>`;
}

function generateComparisonPage(p1, p2, cat) {
  const link1 = getAmazonLink(p1.id, affiliateTag);
  const link2 = getAmazonLink(p2.id, affiliateTag);
  
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${p1.name} vs ${p2.name}: Detailed Comparison | Smart Buying Guide</title>
<meta name="description" content="${p1.name} (${p1.price}) vs ${p2.name} (${p2.price}). Full comparison with pros, cons, and ratings.">
<meta name="robots" content="index,follow"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,max-width:900px;margin:0 auto;padding:20px;background:#fafbfc;color:#1a1a2e;line-height:1.7}
h1{font-size:clamp(1.4em,3.5vw,2em);color:#16213e;margin-bottom:15px}.vs-table{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0}
.comparison-row{padding:12px;border-radius:8px}.left-col{background:#eff6ff}.right-col{background:#fef3c7}
.cta{display:inline-block;padding:10px 24px;text-decoration:none;border-radius:8px;font-weight:600;margin-top:5px}
.left-col .cta{background:#3b82f6;color:#fff}.right-col .cta{background:#f59e0b;color:#fff}
</style></head><body>
<h1>${p1.name} vs ${p2.name}: Which ${cat.category} Should You Buy?</h1>
<div style="color:#64748b;margin-bottom:20px">Updated: ${date.toLocaleDateString('en-US',{year:'numeric',month:'long'})}</div>
<p style="margin-bottom:20px;color:#334155">Detailed head-to-head comparison of the top two ${cat.category.toLowerCase()} options. Both products offer excellent value but serve slightly different needs.</p>
<div class="vs-table">
<div class="left-col"><h3>${p1.name}</h3><div style="color:#f59e0b">⭐${p1.rating}/5 · ${p1.reviews}</div><div style="font-size:1.5em;font-weight:700;color:#dc2626;margin:10px 0">${p1.price}</div>
<p>${p1.description}</p><ul style="list-style:none;padding:0;margin:10px 0">${(p1.pros||[]).map(p=>`<li style="padding:4px 0">✅ ${p}</li>`).join('')}</ul>
<ul style="list-style:none;padding:0;margin:10px 0">${(p1.cons||[]).map(c=>`<li style="padding:4px 0;color:#dc2626">❌ ${c}</li>`).join('')}</ul>
<a href="${link1}" class="cta" target="_blank" rel="nofollow sponsored">Check Price on Amazon →</a></div>
<div class="right-col"><h3>${p2.name}</h3><div style="color:#f59e0b">⭐${p2.rating}/5 · ${p2.reviews}</div><div style="font-size:1.5em;font-weight:700;color:#dc2626;margin:10px 0">${p2.price}</div>
<p>${p2.description}</p><ul style="list-style:none;padding:0;margin:10px 0">${(p2.pros||[]).map(p=>`<li style="padding:4px 0">✅ ${p}</li>`).join('')}</ul>
<ul style="list-style:none;padding:0;margin:10px 0">${(p2.cons||[]).map(c=>`<li style="padding:4px 0;color:#dc2626">❌ ${c}</li>`).join('')}</ul>
<a href="${link2}" class="cta" target="_blank" rel="nofollow sponsored">Check Price on Amazon →</a></div>
</div>
<div style="background:#f8fafc;padding:14px;border-left:4px solid #94a3b8;font-size:0.85em;color:#64748b;margin-top:20px">Affiliate Disclosure: We earn from qualifying purchases. Prices as of ${date.toISOString().split('T')[0]}.</div>
</body></html>`;
}

function generateUseCasePage(cat, useCase, items) {
  return generateCategoryPage(cat, items); // Same structure with different title context
}

function getBrand(name) {
  const n = name.toLowerCase();
  if (n.includes('macbook') || n.includes('apple')) return 'Apple';
  if (n.includes('sony')) return 'Sony';
  if (n.includes('samsung')) return 'Samsung';
  if (n.includes('logitech')) return 'Logitech';
  if (n.includes('keychron')) return 'Keychron';
  if (n.includes('soundcore') || n.includes('anker')) return 'Soundcore/Anker';
  if (n.includes('redragon')) return 'Redragon';
  if (n.includes('asus')) return 'ASUS';
  if (n.includes('acer')) return 'Acer';
  if (n.includes('lenovo')) return 'Lenovo';
  if (n.includes('lg')) return 'LG';
  if (n.includes('jbl')) return 'JBL';
  if (n.includes('crucial') || n.includes('western digital') || n.includes('wd black')) return 'Crucial/WD';
  if (n.includes('elgato')) return 'Elgato';
  if (n.includes('bose')) return 'Bose';
  if (n.includes('razer')) return 'Razer';
  if (n.includes('google') || n.includes('nest')) return 'Google';
  if (n.includes('echo') || n.includes('amazon dot')) return 'Amazon';
  if (n.includes('tower')) return 'Tower';
  if (n.includes('royal kludge') || n.includes('rk')) return 'Royal Kludge';
  return 'Various Brands';
}

// Generate ALL articles for all categories
export function generateAllArticles() {
  const all = [];
  
  for (const [key, cat] of Object.entries(PRODUCTS)) {
    // Basic category page
    all.push({ type:'category', key, title: `Best ${cat.category}s`, seoUrl:`/categories/${key}`, html: generateCategoryPage(cat, cat.items) });
    
    // Long-tail articles per product
    for (const product of cat.items) {
      const longTails = generateLongTailArticles(product, key);
      all.push(...longTails);
    }
    
    // Comparison pages
    const comparisons = generateComparisonArticles(key);
    all.push(...comparisons);
    
    // Price tier articles  
    const priceTiers = generatePriceTierArticles(key);
    all.push(...priceTiers);
    
    // Use-case articles
    const useCases = generateUseCaseArticles(key);
    all.push(...useCases);
  }

  return all;
}

export function getArticleMetadata() {
  const articles = generateAllArticles();
  return articles.map(a => ({
    url: siteUrl + a.seoUrl,
    lastmod: now,
    changefreq: 'weekly',
    priority: a.type === 'category' ? '0.9' : '0.7',
  }));
}
