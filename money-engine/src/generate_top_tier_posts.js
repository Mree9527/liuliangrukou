import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output', 'pending-posts');

// Top-tier high-conversion subreddits with urgent deal angles
const HIGH_PRIORITY_POSTS = [
  {
    subreddit: 'r/buildapcsales',
    title: 'MacBook Air M2 13" on sale! $999 with 18hr battery - detailed review',
    product: 'MacBook Air M2 13"',
    angle: 'deal'
  },
  {
    subreddit: 'r/macbooks',
    title: 'Is the MacBook Air M2 worth it vs M1? Here is my honest comparison',
    product: 'MacBook Air M2 13"',
    angle: 'comparison'
  },
  {
    subreddit: 'r/pcmasterrace',
    title: 'Redragon K552 Kumara best mechanical keyboard under $30 - detailed review',
    product: 'Redragon K552 Kumara',
    angle: 'deal'
  },
  {
    subreddit: 'r/BudgetAesthetics',
    title: 'Redragon K552 Kumara at $29.99 - the best budget mechanical keyboard 2026',
    product: 'Redragon K552 Kumara',
    angle: 'deal'
  },
  {
    subreddit: 'r/UltrawidenGaming',
    title: 'Samsung Odyssey G5 34" at $299.99 - worth the ultrawide?',
    product: 'Samsung Odyssey G5 34"',
    angle: 'deal'
  },
  {
    subreddit: 'r/headphones',
    title: 'Sony WF-1000XM5 best ANC earbuds review - is $248 worth it?',
    product: 'Sony WF-1000XM5',
    angle: 'review'
  },
  {
    subreddit: 'r/mechanicalkeyboards',
    title: 'Keychron K2 Wireless - hot-swappable wireless keyboard at $69.99',
    product: 'Keychron K2 Wireless',
    angle: 'deal'
  },
  {
    subreddit: 'r/buildapcsales',
    title: 'ASUS VivoBook 15 OLED at $429 - best budget laptop 2026',
    product: 'ASUS VivoBook 15 OLED',
    angle: 'deal'
  }
];

function findProductByName(name) {
  for (const [catKey, cat] of Object.entries(PRODUCTS)) {
    const found = cat.items.find(p => p.name === name);
    if (found) return { ...found, category: cat.category };
  }
  return null;
}

function generatePost(postConfig) {
  const product = findProductByName(postConfig.product);
  if (!product) return null;

  // Flash sale URL
  const flashUrl = `https://mree9527.github.io/liuliangrukou/money-engine/output/deals/${postConfig.subreddit.replace('r/', '')}/deal-alert-${product.id}.html`;
  
  // Review URL (fallback)
  const reviewUrl = `https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/${product.id}-review.html`;

  const urlToUse = postConfig.angle === 'deal' ? flashUrl : reviewUrl;

  const pros = product.pros.slice(0, 3).map(p => `• ${p}`).join('\n');
  const cons = (product.cons || []).slice(0, 2).map(c => `• ${c}`).join('\n');

  let body = `Just spent some time with the **${product.name}** and wanted to share my thoughts.

**TL;DR:** ${product.description.split('.')[0]} — **solid pick at ${product.price}.**

`;
  
  if (postConfig.angle === 'deal') {
    body += '**🔥 FLASH SALE ALERT!**\n';
  } else if (postConfig.angle === 'comparison') {
    body += '**MACBOOK AIR M2 vs M1 COMPARISON**\n';
  }

  body += `
**What I like:**
${pros}

**What could be better:**
${cons || 'None major'}

**Rating: ⭐⭐⭐⭐ ${product.rating}/5 · ${product.reviews} reviews**

Current deal: ${urlToUse}

*(Disclosure: I earn a small commission if you buy through the link)*`;

  return {
    subreddit: postConfig.subreddit,
    title: postConfig.title,
    body
  };
}

console.log('\n🚀 GENERATING TOP-TIER POSTS...\n');

let count = 0;
HIGH_PRIORITY_POSTS.forEach(post => {
  const result = generatePost(post);
  if (result) {
    const safeName = postConfigToFilename(post);
    const filename = `reddit_top_tier_${safeName}.txt`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename),
      `SUBREDDIT: ${result.subreddit}\nTITLE: ${result.title}\n${'='.repeat(60)}\n\n${result.body}`);
    console.log(`  ✓ ${filename}`);
    count++;
  }
});

function postConfigToFilename(post) {
  return post.subreddit.replace('r/', '') + '_' + 
         post.product.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
}

console.log(`\n✅ Generated ${count} top-tier posts`);
