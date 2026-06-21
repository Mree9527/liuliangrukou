import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output', 'pending-posts');

// High-traffic subreddits for product reviews
const SUBREDDITS = {
  'mechanicalkeyboards': ['Keychron K2 Wireless', 'Redragon K552 Kumara', 'Royal Kludge RK84'],
  'laptops': ['MacBook Air M2 13"', 'ASUS VivoBook 15 OLED', 'Lenovo IdeaPad Slim 5'],
  'headphones': ['Sony WF-1000XM5', 'Soundcore Space A40', 'Samsung Galaxy Buds FE'],
  'tech': ['MacBook Air M2 13"', 'Logitech MX Master 3S', 'Samsung Odyssey G5 34"'],
  'budgeta11y': ['Redragon K552 Kumara', 'Soundcore P20i', 'Acer Aspire 3 A315']
};

function findProductByName(name) {
  for (const [catKey, cat] of Object.entries(PRODUCTS)) {
    const found = cat.items.find(p => p.name === name);
    if (found) return { ...found, category: cat.category };
  }
  return null;
}

function generateRedditPost(subreddit, productName, isDeal = false) {
  const product = findProductByName(productName);
  if (!product) return null;

  // Build review body
  const pros = product.pros.slice(0, 3).map(p => `• ${p}`).join('\n');
  const cons = (product.cons || []).slice(0, 2).map(c => `• ${c}`).join('\n');

  const dealUrl = isDeal 
    ? `https://mree9527.github.io/liuliangrukou/money-engine/output/deals/${subreddit}/deal-alert-${product.id}.html`
    : `https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/${product.id}-review.html`;

  const title = isDeal 
    ? `${productName} on sale! Detailed review + current price`
    : `Is the ${productName} worth it in 2026? Here's my honest take.`;

  const body = `Just spent some time with the **${productName}** (ASIN: ${product.id}) and wanted to share my thoughts.

**TL;DR:** ${product.description.split('.')[0]} — solid pick at ${product.price}.
${isDeal ? '**Special deal price!' : ''}

**What I like:**
${pros}

**What could be better:**
${cons || 'None major'}

**Rating: ⭐⭐⭐⭐ ${product.rating}/5 · ${product.reviews} reviews**

Current deal: ${dealUrl}

*(Disclosure: I earn a small commission if you buy through the link, at no extra cost to you)*`;

  return {
    subreddit: `r/${subreddit}`,
    title,
    body
  };
}

// Generate fresh daily posts for each subreddit
const posted = new Set();
let count = 0;

for (const [subreddit, products] of Object.entries(SUBREDDITS)) {
  // Deal post first (high conversion)
  const deal = generateRedditPost(subreddit, products[0], true);
  if (deal && !posted.has(deal.title)) {
    const filename = `reddit_daily_${subreddit}_deal.txt`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), 
      `SUBREDDIT: ${deal.subreddit}\nTITLE: ${deal.title}\n${'='.repeat(60)}\n\n${deal.body}`);
    posted.add(deal.title);
    console.log(`  ✓ ${filename} - ${products[0]} (DEAL)`);
    count++;
  }

  // Review post second
  const review = generateRedditPost(subreddit, products[1], false);
  if (review && !posted.has(review.title)) {
    const filename = `reddit_daily_${subreddit}_review.txt`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename),
      `SUBREDDIT: ${review.subreddit}\nTITLE: ${review.title}\n${'='.repeat(60)}\n\n${review.body}`);
    posted.add(review.title);
    console.log(`  ✓ ${filename} - ${products[1]} (REVIEW)`);
    count++;
  }

  // Third option if different
  if (products[2] && products[2] !== products[1]) {
    const review2 = generateRedditPost(subreddit, products[2], false);
    if (review2 && !posted.has(review2.title)) {
      const filename = `reddit_daily_${subreddit}_review2.txt`;
      fs.writeFileSync(path.join(OUTPUT_DIR, filename),
        `SUBREDDIT: ${review2.subreddit}\nTITLE: ${review2.title}\n${'='.repeat(60)}\n\n${review2.body}`);
      posted.add(review2.title);
      console.log(`  ✓ ${filename} - ${products[2]} (REVIEW)`);
      count++;
    }
  }
}

console.log(`\n✅ Generated ${count} fresh daily Reddit posts`);
