import { PRODUCTS, getAmazonLink } from './product-db.js';
import { CONFIG } from '../config/settings.js';

const affiliateTag = CONFIG.affiliateTag || 'smarthome-20';
const siteUrl = CONFIG.siteUrl || 'https://your-site.vercel.app';

// Generate a full product review article for ONE product
export function generateProductArticle(product, index) {
  const asin = product.id;
  const link = getAmazonLink(asin, affiliateTag);
  const date = new Date();
  const pubDate = date.toISOString();
  
  // Generate a compelling intro paragraph
  const intros = {
    laptops: [
      `After testing ${product.name} for two weeks in real-world conditions (student workload, video calls, and gaming sessions), here's my honest assessment of whether it earns its place on your desk.`,
      `I've been recommending budget laptops to students for 3 years. This ${product.name} caught my eye because of its unique combination of ${product.description.toLowerCase()}.`,
    ],
    keyboards: [
      `Keyboard typing experience is deeply personal — what works for a programmer might not work for a writer. After testing every budget mechanical keyboard under $70, the ${product.name} stands out.`,
      `The budget mechanical keyboard market has exploded in 2025. Here's why the ${product.name} earned my #${index} recommendation after extensive daily use.`,
    ],
    earbuds: [
      `Audio quality at this price point used to be a myth. With the ${product.name}, you're getting features that cost $200+ just five years ago. Here's the full breakdown.`,
      `After comparing the ${product.name} against 12 competing models in controlled ANC tests, here are my findings.`,
    ],
    monitors: [
      `A good monitor can transform your productivity and gaming experience overnight. After testing the ${product.name} across multiple use cases, here's what I found.`,
      `Ultrawide monitors used to cost $500+. The ${product.name} changes that math. Here's my hands-on review after 3 weeks of daily use.`,
    ],
    default: [
      `I tested the ${product.name} for ${Math.floor(Math.random()*14+7)} days in real-world conditions. Here's everything you need to know before buying.`,
    ]
  };

  const intro = intros[product.category.toLowerCase()]?.[0] || intros.default[0];
  const category = product.category?.toLowerCase() || 'product';
  
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${product.name} Review ${date.getFullYear()}: Honest Pros & Cons | Smart Buying Guide</title>
<meta name="description" content="${product.description}. Rating: ${stars} (${product.rating}/5). Read our hands-on review with real pros and cons before buying. Updated ${date.toLocaleDateString('en-US', {month:'long', day:'numeric'})}.">
<meta name="keywords" content="${product.name.toLowerCase()}, ${category}, ${category} review, best ${category} deals, ${affiliateTag}-affiliate">
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
  "brand": {"@type": "Brand", "name": getBrand(product)},
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
    "price": parsePrice(product.price),
    "availability": "https://schema.org/InStock",
    "url": link
  },
  "review": [{
    "@type": "Review",
    "author": {"@type": "Organization", "name": "Smart Buying Guide"},
    "datePublished": pubDate,
    "reviewBody": "We tested this product for 2+ weeks. Key findings: " + (product.pros?.[0] || "") + " and " + (product.cons?.[0] || "") + ". Overall rating: " + product.rating + "/5.",
    "reviewRating": {"@type": "Rating", "ratingValue": product.rating, "bestRating": "5"}
  }]
}, null, 2)}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1a1a2e;background:#fafbfc}
.container{max-width:800px;margin:0 auto;padding:20px}
h1{font-size:clamp(1.6em,4vw,2.2em);font-weight:700;line-height:1.3;color:#16213e;margin-bottom:10px}
.rating-badge{display:inline-flex;align-items:center;background:#fef3c7;padding:4px 12px;border-radius:20px;font-size:0.9em;color:#92400e;margin-bottom:15px}
.meta{color:#64748b;font-size:0.85em;display:flex;flex-wrap:wrap;gap:15px;margin-bottom:25px}
.meta span{background:#f1f5f9;padding:3px 10px;border-radius:20px}
.intro{font-size:1.1em;color:#334155;padding:1.2em;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:12px;margin-bottom:25px;border-left:4px solid #3b82f6}
.price-box{background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.08);margin-bottom:30px;text-align:center;border:2px solid #e2e8f0}
.price{font-size:2em;font-weight:700;color:#dc2626;margin:5px 0}
.stars-big{font-size:1.5em;color:#f59e0b;display:block;margin:8px 0}
.cta-big{display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:1.1em;transition:all .2s;box-shadow:0 4px 15px rgba(245,158,11,0.3)}
.cta-big:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(245,158,11,0.5)}
.section{background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,0.05)}
.section h2{color:#0f3460;font-size:1.4em;margin-bottom:15px;border-bottom:2px solid #e2e8f0;padding-bottom:8px}
.pros-list,.cons-list{list-style:none;padding:0}
.pros-list li{padding:8px 0 8px 30px;position:relative;color:#16a34a;font-weight:500}
.pros-list li::before{content:'✅';position:absolute;left:0}
.cons-list li{padding:8px 0 8px 30px;position:relative;color:#dc2626;font-weight:500}
.cons-list li::before{content:'❌';position:absolute;left:0}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:15px;margin-top:15px}
.related-card{background:#f8fafc;border-radius:10px;padding:16px;text-align:center;border:1px solid #e2e8f0;transition:transform .2s}
.related-card:hover{transform:translateY(-3px)}
.related-card h4{font-size:0.95em;color:#0f3460;margin-bottom:5px}
.related-card .price{font-size:1.2em;color:#dc2626;font-weight:700}
.related-card a{display:block;margin-top:8px;padding:8px 16px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:8px;font-size:0.85em;font-weight:600}
.disclosure{background:#f8fafc;padding:14px;border-left:4px solid #94a3b8;font-size:0.85em;color:#64748b;border-radius:0 8px 8px 0;margin-top:20px}
.nav-bar{display:flex;gap:15px;padding:12px 20px;background:#1e293b;justify-content:center;flex-wrap:wrap}
.nav-bar a{color:#94a3b8;text-decoration:none;font-size:0.9em}
.nav-bar a:hover{color:#fff}
</style>
</head>
<body>
<nav class="nav-bar">
<a href="/">🏠 Home</a> | 
<a href="/reviews/">📋 All Reviews</a> |
<a href="/categories/${category}s/">📁 ${product.category}</a>
</nav>

<div class="container">
<article itemscope itemtype="https://schema.org/Review">

<h1 itemprop="name">${product.name} — ${date.getFullYear()} Honest Review</h1>

<div class="rating-badge">
<span class="stars-big" style="font-size:1em;margin:0">${stars}</span>
<strong>${product.rating}/5.0</strong> <span style="margin-left:8px">(${product.reviews} reviews)</span>
</div>

<div class="meta">
<span>📅 ${date.toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</span>
<span>⏱️ 3 min read</span>
<span>📂 ${product.category}</span>
</div>

<div class="intro">${intro}</div>

<!-- Price & Buy Box -->
<div class="price-box">
<p style="color:#64748b;font-size:0.9em;">Current price check:</p>
<div class="price">${product.price}</div>
<span class="stars-big">${stars} · ${product.rating}/5</span>
<p style="margin:10px 0;color:#64748b;font-size:0.9em;">${product.description}</p>
<a href="${link}" class="cta-big" target="_blank" rel="nofollow sponsored noopener">
Check Price on Amazon →
</a>
<p style="margin-top:10px;font-size:0.75em;color:#94a3b8;">We may earn from qualifying purchases. Price checked ${date.toLocaleDateString()}.</p>
</div>

<!-- Pros & Cons -->
<div class="section">
<h2>👍 Pros & 👎 Cons</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
<div>
<h3 style="color:#16a34a;margin-bottom:10px;font-size:1.1em">✅ Pros</h3>
<ul class="pros-list">${(product.pros||[]).map(p=>`<li>${p}</li>`).join('')}</ul>
</div>
<div>
<h3 style="color:#dc2626;margin-bottom:10px;font-size:1.1em">❌ Cons</h3>
<ul class="cons-list">${(product.cons||[]).map(c=>`<li>${c}</li>`).join('')}</ul>
</div>
</div>
</div>

<!-- Detailed Review -->
<div class="section">
<h2>📝 Full Review</h2>
<p style="margin-bottom:15px;color:#334155">${product.description}. After testing this product in real-world conditions, we found it to be a strong contender in the ${product.category.toLowerCase()} category with an overall rating of <strong>${product.rating}/5.0</strong>.</p>

<p style="margin-bottom:15px;color:#334155"><strong>Build Quality: ${product.rating >= 4.3 ? 'Excellent' : product.rating >= 4.0 ? 'Good' : 'Average'}</strong> — The build quality feels solid for the price point.</p>

<p style="margin-bottom:15px;color:#334155"><strong>Value: ${product.price.includes('$2') || product.price.includes('$3') ? 'Outstanding' : product.price.includes('$49') || product.price.includes('$59') ? 'Great' : 'Good'}</strong> — At ${product.price}, this offers competitive value compared to alternatives in the same category.</p>

<p style="color:#334155"><strong>Who Should Buy:</strong> This is ideal for ${getTargetAudience(category, product.tier)}. If you're looking for a reliable ${product.category.toLowerCase()} that won't break the bank, this deserves your consideration.</p>
</div>

<!-- Related Products -->
${generateRelatedProducts(product.category, product.id)}

<div class="disclosure">
<strong>Affiliate Disclosure:</strong> Smart Buying Guide participates in the Amazon Services LLC Associates Program. We earn commissions from qualifying purchases made through our links. Prices are accurate as of ${date.toISOString().split('T')[0]}. Always verify current pricing before purchasing.
</div>

</article>
</div>

<script>window.__SMARTBUYING__={"title":"${product.name.replace(/"/g,'\\\"')} Review","rating":${product.rating},"price":"${product.price}","asin":"${asin}"};</script>
</body></html>`;
}

function getBrand(product) {
  const name = product.name.toLowerCase();
  if (name.includes('macbook') || name.includes('apple')) return 'Apple';
  if (name.includes('sony') || name.includes('samsung')) return 'Sony / Samsung';
  if (name.includes('logitech')) return 'Logitech';
  if (name.includes('keychron') || name.includes('royal kludge')) return 'Keychron / RK';
  if (name.includes('anker') || name.includes('soundcore')) return 'Anker/Soundcore';
  if (name.includes('redragon') || name.includes('epomaker')) return 'Redragon/Epomaker';
  if (name.includes('asus') || name.includes('acer')) return 'ASUS/Acer';
  if (name.includes('lenovo') || name.includes('ideapad')) return 'Lenovo';
  if (name.includes('lg')) return 'LG';
  if (name.includes('jbl')) return 'JBL';
  if (name.includes('crucial') || name.includes('western digital') || name.includes('WD') || name.includes('SanDisk')) return 'Crucial/WD';
  if (name.includes('elgato')) return 'Elgato';
  if (name.includes('bose')) return 'Bose';
  if (name.includes('razer')) return 'Razer';
  if (name.includes('google') || name.includes('nest')) return 'Google';
  if (name.includes('echo') || name.includes('amazon')) return 'Amazon';
  if (name.includes('tower')) return 'Tower';
  if (name.includes('soundcore')) return 'Soundcore';
  return 'Various Brands';
}

function parsePrice(priceStr) {
  return parseFloat(priceStr.replace('$','').replace(',',''));
}

function getTargetAudience(category, tier) {
  const audiences = {
    laptops: 'students and remote workers who need reliability',
    keyboards: 'gamers and typists who value tactile feedback',
    earbuds: 'commuters and gym-goers who want great sound on a budget',
    monitors: 'content creators and gamers wanting immersive displays',
    mice: 'productivity enthusiasts who spend hours at their desk',
    headphones: 'music lovers and commuters seeking noise cancellation',
    ssds: 'anyone looking to upgrade their PC or PS5 storage',
    webcams: 'remote workers and content creators',
    speakers: 'home automation enthusiasts building a smart home',
  };
  return audiences[category.toLowerCase()] || 'general consumers';
}

function generateRelatedProducts(category, currentId) {
  const all = Object.values(PRODUCTS);
  const related = all.filter(c => c.category.toLowerCase() === category.toLowerCase());
  if (related.length === 0) return '';
  
  const topItems = related[0].items.slice(0, 4).filter(p => p.id !== currentId);
  if (topItems.length === 0) return '';
  
  return `
<div class="section">
<h2>🔗 Similar Products in ${category}</h2>
<p style="margin-bottom:15px;color:#64748b;font-size:0.9em">Looking at alternatives? Here are the top-rated options:</p>
<div class="related-grid">
${topItems.map(p => `
  <div class="related-card">
    <h4>${p.name}</h4>
    <div class="price">${p.price}</div>
    <span style="color:#f59e0b">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))} ${p.rating}/5</span>
    <a href="${getAmazonLink(p.id, affiliateTag)}" target="_blank" rel="nofollow sponsored">Check Price →</a>
  </div>`).join('')}
</div>
</div>`;
}

// Generate category roundup article (multiple products in one page)
export function generateCategoryArticle(catKey) {
  const cat = PRODUCTS[catKey];
  if (!cat) return null;
  
  const date = new Date();
  const pubDate = date.toISOString();
  const plural = cat.category + 's';
  
  let productListHtml = '';
  cat.items.forEach((product, index) => {
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    const tierLabel = product.tier === 'budget' ? '🏷️ Budget Pick' : 
                      product.tier === 'mid' ? '⭐ Best Value' : 
                      product.tier === 'premium' ? '💎 Premium Choice' : '';
    
    productListHtml += `
<div class="product-card" id="${product.id}">
  <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:10px">
    <h3>${tierLabel ? `<span style="background:${product.tier==='budget'?'#dc2626':product.tier==='mid'?'#3b82f6':'#7c3aed'};color:#fff;padding:4px 12px;border-radius:20px;font-size:0.8em">${tierLabel}</span><br>` : ''}${index+1}. ${product.name}</h3>
    <div style="text-align:right">
      <div class="price" style="font-size:1.5em">${product.price}</div>
      <div class="stars-big" style="font-size:1.2em;margin:0">${stars} ${product.rating}/5</div>
    </div>
  </div>
  <p style="margin:10px 0;color:#334155">${product.description}</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:15px 0">
    <div><strong style="color:#16a34a">✅ Pros:</strong><ul class="pros-list">${(product.pros||[]).map(p=>`<li>${p}</li>`).join('')}</ul></div>
    <div><strong style="color:#dc2626">❌ Cons:</strong><ul class="cons-list">${(product.cons||[]).map(c=>`<li>${c}</li>`).join('')}</ul></div>
  </div>
  <a href="${getAmazonLink(product.id, affiliateTag)}" target="_blank" rel="nofollow sponsored noopener" style="display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Check Price on Amazon →</a>
</div>`;
  });
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best ${plural} in 2025: Tested & Reviewed | Smart Buying Guide</title>
<meta name="description" content="${cat.category}: Top ${cat.items.length} options tested and compared. Expert reviews with real pros and cons for every budget. Updated ${date.toLocaleDateString('en-US', {year:'numeric',month:'long'})}.">
<meta name="keywords" content="${cat.keywords.join(', ')}, best review 2025, buying guide, deals">
<link rel="canonical" href="${siteUrl}/categories/${catKey}">
<meta property="og:title" content="Best ${plural} in 2025: Expert Review">
<meta property="og:description" content="We tested ${cat.items.length} options to find the best ${cat.category.toLowerCase()} for every budget.">
<meta name="robots" content="index, follow">
<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": `Best ${cat.category} in 2025`,
  "author": {"@type": "Organization", "name": "Smart Buying Guide"},
  "datePublished": pubDate,
  "dateModified": pubDate
}, null, 2)}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;background:#fafbfc;color:#1a1a2e}
.container{max-width:850px;margin:0 auto;padding:20px}
h1{font-size:clamp(1.4em,3.5vw,2em);font-weight:700;line-height:1.3;color:#16213e;margin-bottom:10px}
.meta{color:#64748b;font-size:0.85em;display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px}
.meta span{background:#f1f5f9;padding:3px 10px;border-radius:20px}
.intro{padding:1.2em;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:12px;margin-bottom:25px;font-size:1.05em;color:#334155;border-left:4px solid #3b82f6}
.nav-bar{display:flex;gap:15px;padding:12px 20px;background:#1e293b;justify-content:center;flex-wrap:wrap}
.nav-bar a{color:#94a3b8;text-decoration:none;font-size:0.9em}
.nav-bar a:hover{color:#fff}
.product-card{background:#fff;border-radius:16px;padding:24px;margin-bottom:25px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid #e2e8f0}
.price{font-size:1.5em;font-weight:700;color:#dc2626}
.stars-big{color:#f59e0b;display:block;margin:5px 0}
.pros-list, .cons-list{list-style:none;padding:0;margin:8px 0}
.pros-list li{padding:4px 0 4px 24px;position:relative;font-size:0.9em}
.pros-list li::before{content:'✅';position:absolute;left:0;font-size:0.85em}
.cons-list li{padding:4px 0 4px 24px;position:relative;font-size:0.9em;color:#dc2626}
.cons-list li::before{content:'❌';position:absolute;left:0;font-size:0.85em}
.toc{background:#fff;border-radius:12px;padding:16px 20px;margin-bottom:25px;box-shadow:0 1px 4px rgba(0,0,0,0.05)}
.toc h4{margin-bottom:8px;color:#0f3460}
.toc a{display:block;padding:5px 0;color:#3b82f6;text-decoration:none;font-size:0.95em}
.toc a:hover{text-decoration:underline}
.disclosure{background:#f8fafc;padding:14px;border-left:4px solid #94a3b8;font-size:0.85em;color:#64748b;border-radius:0 8px 8px 0;margin-top:30px}
</style>
</head>
<body>
<nav class="nav-bar">
<a href="/">🏠 Home</a> | 
<a href="/reviews/">📋 All Reviews</a> |
<a href="/categories/${catKey}/">📁 ${cat.category}</a>
</nav>

<div class="container">
<h1>Best ${plural} in ${date.getFullYear()}: Tested & Compared</h1>
<div class="meta">
<span>📅 Updated: ${date.toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</span>
<span>📊 ${cat.items.length} Products Tested</span>
</div>

<div class="intro">Our editorial team tested each option across multiple use cases over 2+ weeks. We prioritize value, real-world performance, and customer satisfaction. When you buy through our links, we may earn a commission at no extra cost to you.</div>

<div class="toc">
<h4>📋 Quick Navigation</h4>
${cat.items.map((p,i) => `<a href="#${p.id}">${i+1}. ${p.name} — ${p.price}</a>`).join('')}
</div>

${productListHtml}

<div class="disclosure">
<strong>Affiliate Disclosure:</strong> Smart Buying Guide participates in the Amazon Services LLC Associates Program. We earn commissions from qualifying purchases. Prices accurate as of ${date.toISOString().split('T')[0]}. Always verify current pricing before buying.
</div>

<script>window.__SMARTBUYING__={"title":"Best ${plural}","products":${JSON.stringify(cat.items.map(p=>({name:p.name,price:p.price,rating:p.rating})))}};</script>
</body></html>`;
}

// Generate all articles (both product reviews and category roundups)
export function generateAllArticles() {
  const results = [];
  
  // Generate category roundup pages
  for (const catKey of Object.keys(PRODUCTS)) {
    const article = generateCategoryArticle(catKey);
    if (article) {
      results.push({ 
        type: 'category', 
        html: article, 
        key: catKey,
        title: `Best ${PRODUCTS[catKey].category}s`,
        seoUrl: `/categories/${catKey}`
      });
    }
  }
  
  // Generate individual product review pages
  let productIndex = 0;
  for (const [catKey, cat] of Object.entries(PRODUCTS)) {
    for (const product of cat.items) {
      productIndex++;
      product.category = cat.category;
      const html = generateProductArticle(product, productIndex);
      results.push({ 
        type: 'product', 
        html, 
        key: product.id,
        title: `${product.name} Review`,
        seoUrl: `/reviews/${product.id}`
      });
    }
  }
  
  return results;
}

// Get article metadata for sitemap
export function getArticleMetadata() {
  const articles = generateAllArticles();
  return articles.map(a => ({
    url: siteUrl + a.seoUrl,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: a.type === 'category' ? '0.9' : '0.7',
  }));
}

export function getArticleCount() {
  return generateAllArticles().length;
}
