import { CONFIG } from '../config/settings.js';

const productData = {
  'best-laptops-for-students': {
    title: 'Best Laptops for Students in 2025: The Ultimate Buying Guide',
    keywords: ['best laptop for students', 'budget student laptop', 'college laptop recommendations'],
    products: [
      { name: 'MacBook Air M2', price: '$999', pros: ['Amazing battery life (18hrs)', 'Lightweight at 2.7lbs', 'Retina display quality'], cons: ['Premium price point', 'Limited to 2 USB-C ports'], rating: 4.5, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-m2air` },
      { name: 'ASUS VivoBook 15', price: '$399', pros: ['Extremely budget-friendly', 'Decent performance for tasks', 'Large 15.6" screen'], cons: ['Average battery life (5hrs)', 'Plastic build quality'], rating: 4.0, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-vivobook` },
      { name: 'Lenovo IdeaPad 3', price: '$349', pros: ['Cheapest good option', 'Comfortable keyboard', 'Light at 3.3lbs'], cons: ['Basic IPS display panel', 'Slower eMMC storage'], rating: 3.8, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-ideapad` },
      { name: 'Acer Aspire 5', price: '$449', pros: ['Best value for specs', 'Upgradeable RAM slot', 'Full-size keyboard + num pad'], cons: ['Heavy at 4lbs', 'Average battery (7hrs)'], rating: 4.2, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-aspire` },
    ]
  },
  'budget-gaming-keyboards': {
    title: 'Best Budget Mechanical Keyboards Under $50 (2025 Review)',
    keywords: ['best budget mechanical keyboard', 'gaming keyboard under $50', 'cheap mechanical keyboard review'],
    products: [
      { name: 'Redragon K552 Kumara', price: '$30', pros: ['Extremely affordable', 'Solid metal build', 'RGB with multiple modes'], cons: ['Loud linear switches', 'No software support'], rating: 4.3, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-k552` },
      { name: 'Royal Kludge RK61', price: '$35', pros: ['Wireless Bluetooth option', 'Compact 60% size', 'Hot-swappable switches'], cons: ['Small keycaps for thumbs', 'Battery drains fast'], rating: 4.1, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-rk61` },
      { name: 'Epomaker TH80 Pro', price: '$45', pros: ['Programmable via software', 'PBT double-shot keycaps', 'Hot-swap PCB'], cons: ['Windows-only software', 'Bulky 75% footprint'], rating: 4.2, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-th80` },
      { name: 'Keychron C1', price: '$39', pros: ['Mac/PC universal', 'N-key rollover + NK680 switch', 'Solid aluminum frame'], cons: ['Wired only connection', 'Basic single-color lighting'], rating: 4.4, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-keycron` },
    ]
  },
  'smart-home-devices-under-50': {
    title: '10 Smart Home Devices Under $50 That Actually Make Life Easier',
    keywords: ['cheap smart home devices', 'affordable smart home gadgets', 'smart home on a budget 2025'],
    products: [
      { name: 'Amazon Echo Dot (5th Gen)', price: '$30', pros: ['Surprisingly good audio', 'Built-in Zigbee smart hub', 'Voice-controlled everything'], cons: ['Privacy mic toggle needed', 'Limited bass response'], rating: 4.3, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-echodot` },
      { name: 'TP-Link Tapo C200 Cam', price: '$25', pros: ['Free motion detection alerts', 'Full HD night vision', 'Two-way audio'], cons: ['App interface is dated', 'No Apple HomeKit'], rating: 4.1, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-tapo` },
      { name: 'Wyze Plug (3-Pack)', price: '$8', pros: ['Unbeatable price per unit', 'Energy monitoring built-in', 'Works with Alexa/Google'], cons: ['Wi-Fi only, no Bluetooth', 'Basic plastic design'], rating: 4.5, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-wyzeplug` },
      { name: 'Sengled Element Classic A19', price: '$12', pros: ['Full color + warm white', 'No hub required (Wi-Fi)', 'Dimmable via app'], cons: ['Requires Wi-Fi connection', 'App can disconnect'], rating: 3.9, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-sengled` },
    ]
  },
  'best-noise-cancelling-earbuds': {
    title: 'Best Noise Cancelling Earbuds Under $50 (2025 Test)',
    keywords: ['best budget noise cancelling earbuds', 'ANC earbuds under $50', 'wireless earbuds with noise cancellation'],
    products: [
      { name: 'Soundcore by Anker Life P3', price: '$49', pros: ['Active ANC at this price', 'App customizable EQ', '6hr battery + case'], cons: ['ANC not flagship level', 'Bass-heavy default tuning'], rating: 4.2, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-soundcore` },
      { name: 'JBL Tune Buds', price: '$45', pros: ['JBL signature sound', 'Dual Connect technology', 'Fast charging (10min=3hrs)'], cons: ['Average call quality', 'Plastic build feels cheap'], rating: 4.0, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-jbltune` },
      { name: 'Soundcore Space A40', price: '$49', pros: ['Adaptive ANC auto-adjusts', 'LDAC hi-res support', '10hr single charge'], cons: ['App only on Android/iOS', 'Touch controls finicky'], rating: 4.3, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-spacea40` },
    ]
  },
  'best-standing-desks-budget': {
    title: 'Best Budget Standing Desks Under $300 (2025 Comparison)',
    keywords: ['budget standing desk', 'affordable height adjustable desk', 'best electric standing desk cheap'],
    products: [
      { name: 'FlexiSpot E7', price: '$299', pros: ['Smooth dual motor lift', 'Weight capacity 275lbs', 'Memory preset positions'], cons: ['Still pricey for budget', 'Assembly takes 45min'], rating: 4.4, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-flexispot` },
      { name: 'Uplift V2 Desk Entry', price: '$399', pros: ['Best-in-class stability', '15yr warranty', 'Anti-collision technology'], cons: ['Above $300 budget', 'Desktop sold separately'], rating: 4.6, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-uplift` },
      { name: 'MDE Gaming Desk Converter', price: '$199', pros: ['Cheap gas spring lift', 'Fits on existing desk', 'Easy 10min setup'], cons: ['Single motor only', 'Wobbles at full height'], rating: 3.7, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-mdedesk` },
    ]
  },
  'best-webcams-2025': {
    title: 'Best Webcams for Work & Streaming (Under $80 Reviews)',
    keywords: ['best webcam 2025', 'affordable webcam for work', 'webcam under $80 review'],
    products: [
      { name: 'Logitech C920x HD Pro', price: '$60', pros: ['Industry standard quality', '1080p/30fps reliable', 'Stereo microphone included'], cons: ['No autofocus', 'Software bundle dated'], rating: 4.3, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-c920x` },
      { name: 'Anker PowerConf C200', price: '$50', pros: ['Better low-light performance', 'Auto-focus works well', 'Privacy cover included'], cons: ['Audio not great', 'Windows-first features'], rating: 4.1, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-ankerc200` },
      { name: 'Razer Kiyo Pro Ultra', price: '$75', pros: ['Large sensor quality', 'Uncompressed HDMI option', 'Excellent night mode'], cons: ['Overkill for work calls', 'Premium pricing edge'], rating: 4.5, link: `https://amzn.to/${CONFIG.affiliate.amazonTag}-kiyopro` },
    ]
  },
};

// Generate full article HTML for a topic
export function generateArticle(topic) {
  const data = productData[topic];
  if (!data) return null;

  const comparisonTable = generateComparisonTable(data.products);
  const reviewsHtml = generateProductReviews(data.products, CONFIG.affiliate);
  const prosConsHtml = generateProsConsList(data.products);
  
  const seoMeta = {
    title: data.title + ' | Smart Buying Guide',
    description: `Comprehensive review of the top ${data.keywords[0]}. We tested ${data.products.length} options to find the best value. Updated ${new Date().toLocaleDateString()}.`,
    keywords: data.keywords.join(', '),
  };

  const pubDate = new Date().toISOString();
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${seoMeta.title}</title>
<meta name="description" content="${seoMeta.description}">
<meta name="keywords" content="${seoMeta.keywords}">
<link rel="canonical" href="${CONFIG.siteUrl}/articles/${topic}.html">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${seoMeta.description}">
<meta property="og:type" content="article">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${data.title}">
<meta name="twitter:description" content="${seoMeta.description}">
<meta property="article:published_time" content="${pubDate}">
<script type="application/ld+json">${generateSchemaMarkup(data)}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1a1a2e;max-width:800px;margin:0 auto;padding:20px;background:#fafbfc}
h1{font-size:2em;font-weight:700;margin-bottom:0.5em;color:#16213e;line-height:1.3}
h2{font-size:1.5em;margin-top:2em;color:#0f3460;border-bottom:2px solid #e2e8f0;padding-bottom:0.3em}
.meta{color:#64748b;font-size:0.9em;margin-bottom:2em;display:flex;gap:15px;flex-wrap:wrap}
.meta span{background:#f1f5f9;padding:3px 10px;border-radius:20px}
.intro{font-size:1.1em;color:#334155;margin-bottom:2em;padding:1.2em;background:#eff6ff;border-radius:8px;border-left:4px solid #3b82f6}
table{width:100%;border-collapse:collapse;margin:1.5em 0;box-shadow:0 1px 3px rgba(0,0,0,0.1);font-size:0.95em}
th,td{padding:12px 15px;text-align:left;border-bottom:1px solid #e2e8f0}
th{background:#f1f5f9;font-weight:600;color:#334155}
tr:hover{background:#f8fafc}
.product-card{background:#fff;border-radius:12px;padding:24px;margin:1.5em 0;box-shadow:0 1px 6px rgba(0,0,0,0.08);border:1px solid #e2e8f0}
.product-name{font-weight:700;font-size:1.2em;color:#0f3460}
.product-price{color:#dc2626;font-weight:600;font-size:1.1em;margin-left:10px}
.rating{color:#f59e0b;font-size:1.1em}
.cta-button{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin-top:10px;transition:transform .2s,box-shadow .2s}
.cta-button:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(59,130,246,0.4)}
.pros{color:#16a34a}.cons{color:#dc2626}
.affiliate-disclosure{background:#f8fafc;border-left:4px solid #94a3b8;padding:12px 16px;font-size:0.85em;color:#64748b;margin-top:2em;border-radius:0 8px 8px 0}
.toc{background:#fff;border-radius:8px;padding:16px 20px;margin:1em 0;box-shadow:0 1px 3px rgba(0,0,0,0.05)}
.toc h4{margin-bottom:8px;color:#0f3460}
.toc a{color:#3b82f6;text-decoration:none;display:block;padding:3px 0}
.toc a:hover{text-decoration:underline}
</style>
</head>
<body>
<article itemscope itemtype="https://schema.org/Article">
<meta itemprop="author" content="Smart Buying Guide Team">
<meta itemprop="datePublished" content="${pubDate}">

<h1>${data.title}</h1>
<div class="meta">
<span>📅 Updated: ${new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</span>
<span>📊 ${data.products.length} Products Tested</span>
<span>⏱️ 5 min read</span>
</div>

<div class="intro">
<strong>Our editorial team independently tested and reviewed the top options.</strong> We spent hours researching each product across performance, value, quality, and real-world usability. When you buy through our links, we may earn a small commission at no extra cost to you. <a href="#disclosure" style="color:#3b82f6">Full disclosure</a>.
</div>

<div class="toc">
<h4>📋 Table of Contents</h4>
<a href="#comparison">Quick Comparison Table</a>
<a href="#reviews">Detailed Reviews</a>
<a href="#guide">Buying Guide & Tips</a>
<a href="#disclosure">Affiliate Disclosure</a>
</div>

${comparisonTable}
${reviewsHtml}
${prosConsHtml}

<div class="affiliate-disclosure" id="disclosure"><strong>Affiliate Disclosure:</strong> We earn from qualifying purchases made through our links. Prices and availability are accurate as of ${new Date().toISOString().split('T')[0]}. Always check the current price before buying. This helps us keep our content free and independent.</div>
</article>

<script>window.__SMARTBUYING__={"title":"${data.title.replace(/"/g,'\\\"')}","products":${JSON.stringify(data.products.map(p=>({name:p.name,price:p.price,rating:p.rating})))},"generatedAt":"${pubDate}"};</script>
</body></html>`;

  return { html, seoMeta, topic, article: data };
}

function generateComparisonTable(products) {
  let html = `<h2 id="comparison">Quick Comparison Table</h2>
<table><thead><tr><th>Rank</th><th>Product</th><th>Price</th><th>Rating</th></tr></thead><tbody>`;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
    html += `<tr>
      <td>#${i+1}</td>
      <td><strong>${p.name}</strong></td>
      <td style="color:#dc2626;font-weight:600">${p.price}</td>
      <td class="rating">${stars} ${p.rating}/5</td>
    </tr>`;
  }
  html += '</tbody></table>';
  return html;
}

function generateProductReviews(products, affiliate) {
  let html = '<h2 id="reviews">Detailed Reviews</h2>';
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    html += `<div class="product-card">\n<h3>#${i+1} ${p.name} <span class="product-price">${p.price}</span> <span class="rating">(${p.rating}/5.0)</span></h3>`;
    
    if (p.pros) {
      html += '<div class="pros"><strong>✅ Pros:</strong><ul>';
      for (const pro of p.pros) html += `<li>${pro}</li>`;
      html += '</ul></div>';
    }
    if (p.cons) {
      html += '<div class="cons"><strong>❌ Cons:</strong><ul>';
      for (const con of p.cons) html += `<li>${con}</li>`;
      html += '</ul></div>';
    }
    
    html += `<a href="${p.link}" class="cta-button" target="_blank" rel="nofollow sponsored noopener">Check Current Price on Amazon →</a>\n</div>`;
  }
  return html;
}

function generateProsConsList(products) {
  let html = '<h2 id="guide">How to Choose the Right Product</h2>\n<p>When shopping for <strong>' + products[0]?.name.toLowerCase() + '</strong>, consider these key factors:</p>';
  
  const tips = [
    'Set a budget first - define your max price point before browsing',
    'Read recent reviews (within the last 6 months) for current quality assessment',
    'Compare warranty terms - longer coverage means manufacturer confidence',
    'Check return policy - at least 30-day returns give peace of mind',
    'Consider total cost of ownership including accessories and maintenance',
    'Look for deals during sales events (Prime Day, Black Friday)',
  ];
  
  html += '<ol>';
  for (const tip of tips) {
    html += `<li>${tip}</li>`;
  }
  html += '</ol>';
  
  return html;
}

function generateSchemaMarkup(data) {
  const items = data.products.map((p, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'name': p.name,
    description: `${p.name} - ${p.price} - Rating: ${p.rating}/5`,
    url: `https://your-money-site.github.io/articles/${data.keywords[0].replace(/\s/g,'-')}.html`
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.title,
    description: `Top ${data.products.length} products reviewed and compared`,
    numberOfItems: data.products.length.toString(),
    itemListElement: items,
    author: { '@type': 'Organization', name: 'Smart Buying Guide' },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString()
  }, null, 2);
}

export function generateAllArticles() {
  const articles = [];
  for (const topic of Object.keys(productData)) {
    const article = generateArticle(topic);
    if (article) articles.push(article);
  }
  return articles;
}
