import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const OUTPUT_DIR = path.resolve(process.cwd(), 'output');

// Scrape real-time deals from multiple sources
export async function findRealDeals() {
  const deals = [];
  
  // Source 1: HackerNews trending items with tech focus
  try {
    const res = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json', { timeout: 10000 });
    if (res.data) {
      const ids = res.data.slice(0, 3);
      for (const id of ids) {
        try {
          const itemRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 });
          if (itemRes.data && itemRes.data.score >= 30) {
            deals.push({
              title: itemRes.data.title,
              url: itemRes.data.url || 'https://news.ycombinator.com/item?id=' + id,
              source: 'HackerNews',
              score: itemRes.data.score,
              timestamp: new Date().toISOString()
            });
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  // Source 2: Product Hunt via GraphQL API
  try {
    const res = await axios.post(
      'https://api.producthunt.com/v2/api/graphql',
      { query: '{ posts(first: 5, after: \"\") { nodes { name tagline url votesCount } } }' },
      { headers: { 'Authorization': 'Bearer ', 'Content-Type': 'application/json' } }
    );
    
    if (res.data?.data?.posts?.nodes) {
      for (const product of res.data.data.posts.nodes) {
        deals.push({
          title: `${product.name} - ${product.tagline}`,
          url: product.url,
          source: 'ProductHunt',
          votes: product.votesCount,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (e) {}

  // Always include curated deals from product-db as fallback
  const { PRODUCTS, getAmazonLink } = await import('./product-db.js');
  const tag = 'smarthome-20';
  
  for (const cat of Object.values(PRODUCTS)) {
    if (cat.items.length === 0) continue;
    const topItem = cat.items[0];
    deals.push({
      title: `${topItem.name} - Best ${cat.category}`,
      url: getAmazonLink(topItem.id, tag),
      source: 'Smart Buying Guide',
      score: topItem.rating * 10,
      price: topItem.price,
      timestamp: new Date().toISOString()
    });
  }

  return deals.sort((a, b) => (b.score || b.votes || 0) - (a.score || a.votes || 0));
}

// Generate Deal of the Day page
export async function generateDealOfDay(deals) {
  if (deals.length === 0) return null;

  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % deals.length;
  const todayDeal = deals[dayIndex];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Today's Best Tech Deal | Smart Buying Guide</title>
<meta name="description" content="Daily curated tech deal handpicked by our team. Updated every 24 hours.">
<link rel="canonical" href="https://smartsite.vercel.app/deal-of-day.html">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;max-width:800px;margin:40px auto;padding:20px;background:#fafbfc}header{text-align:center;margin-bottom:40px}.badge{display:inline-block;background:#dc2626;color:#fff;padding:6px 16px;border-radius:20px;font-size:0.85em;font-weight:700}h1{font-size:2em;color:#16213e;margin-top:10px}.deal-card{background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,0.1);text-align:center}
.deal-title{font-size:1.5em;color:#0f3460;margin-bottom:10px}.deal-url{text-align:center;margin-top:20px}
.cta{display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:1.1em}
.meta{color:#64748b;font-size:0.85em;margin-top:15px}</style>
</head>
<body>
<header><span class="badge">🔥 DEAL OF THE DAY</span>
<h1>${todayDeal.title}</h1></header>
<div class="deal-card">
<p style="font-size:1.1em;color:#334155;margin-bottom:20px">${todayDeal.url}</p>
<a href="${todayDeal.url}" class="cta" target="_blank">Check This Deal →</a>
<p class="meta">Source: ${todayDeal.source} • Discovered ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric'})}</p>
</div></body></html>`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'deal-of-day.html'), html);
  console.log('[deal-finder] ✓ Deal of the day generated');
  return todayDeal;
}
