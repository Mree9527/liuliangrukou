import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output', 'pending-posts');
const TWITTER_DIR = path.join(process.cwd(), '..', 'twitter-threads');

function generateRedditPost(catKey, catData, product, subreddit) {
  const p = product;
  const reviewUrl = `https://mree9527.github.io/liuliangrukou/reviews/${p.id}-review.html`;
  const dealUrl = `https://mree9527.github.io/liuliangrukou/deals/${catKey.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/deal-alert-${p.id}.html`;
  
  const content = `SUBREDDIT: r/${subreddit}
TITLE: I tested ${p.name} — here's what you should know (${p.rating}/5 stars)
============================================================

Just spent some time with the **${p.name}** (ASIN: ${p.id}) and wanted to share my honest take.

**TL;DR:** ${p.description.split('.')[0]} — solid pick at ${p.price}.

**My experience:**
- ${p.pros[0]}
- ${p.pros[1] || p.pros[0]}
- ${p.con ? p.cons[0] : 'N/A'}

**Rating: ⭐⭐⭐⭐ 4.${Math.round(p.rating*2)/2}/5 · ${p.reviews} reviews**

**Current deal:** ${dealUrl}

*(Disclosure: affiliate links help keep this site running. No extra cost to you!)*
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, `reddit_${p.id}_${subreddit}.txt`), content);
  console.log(`  ✓ Reddit post for ${p.name} → r/${subreddit}`);
}

function generateTwitterThread(product) {
  const p = product;
  
  const thread = `🧵 THREAD: Should you buy the ${p.name} in 2026?

After testing dozens of products, here's my honest take on the ${p.name}.

Rating: ⭐⭐⭐⭐ 4.${Math.round(p.rating*2)/2}/5 · ${p.reviews}+ reviews

Let me break it down 👇

---

✅ PROS:
• ${p.pros[0]}
• ${p.pros[1] || 'N/A'}
• ${p.pros[2] || 'N/A'}

---

❌ CONS:
• ${p.cons ? p.cons[0] : 'None major'}
• ${p.cons ? p.cons[1] : ''}

---

💰 PRICE: ${p.price}

I found it on sale here:
${`https://mree9527.github.io/liuliangrukou/deals/${'electronics'}/deal-alert-${p.id}.html`}

---

🏆 VERDICT: 
If you're looking for [key benefit], this is a solid pick. 

Check the deal above before it expires! 👆

#${p.name.replace(/[^a-zA-Z0-9]/g, '').substring(0,15)} #TechDeals #ProductReview`;

  fs.writeFileSync(path.join(TWITTER_DIR, `${p.id}-fresh-thread.txt`), thread);
  console.log(`  ✓ Twitter thread for ${p.name}`);
}

// Generate posts for high-value products (premium/mid tier)
const highValueProducts = [];
Object.entries(PRODUCTS).forEach(([key, cat]) => {
  cat.items.forEach(item => {
    if (item.tier === 'premium' || item.tier === 'mid') {
      highValueProducts.push({ ...item, categoryKey: key });
    }
  });
});

// Reddit subreddit mapping
const subreddits = [
  'tech', 'electronics', 'deals', 'budgeta11y', 'buildapc', 
  'pcmasterrace', 'laptops', 'keychron', 'sony', 'macbooks',
  'audiophile', 'GamingOnMobile', 'pcgaming'
];

highValueProducts.forEach((p, idx) => {
  const sub = subreddits[idx % subreddits.length];
  generateRedditPost(p.categoryKey, null, p, sub);
});

// Twitter threads for all products (prioritize premium)
const priorityProducts = [...highValueProducts].sort((a,b) => b.rating - a.rating);
priorityProducts.forEach(p => {
  if (!fs.existsSync(path.join(TWITTER_DIR, `${p.id}-fresh-thread.txt`))) {
    generateTwitterThread(p);
  }
});

console.log(`\n✅ Generated fresh Reddit posts and Twitter threads for ${highValueProducts.length} products`);
