import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const POSTS_DIR = path.join(process.cwd(), '..', 'output', 'pending-posts');
const TWITTER_DIR = path.join(process.cwd(), '..', '..', 'twitter-threads');

// Daily rotation strategy: 3 posts/day across different subreddits
const DAILY_ROTATION = [
  {
    day: 'Monday',
    posts: [
      { subreddit: 'r/buildapcsales', product: 'MacBook Air M2 13"' },
      { subreddit: 'r/mechanicalkeyboards', product: 'Keychron K2 Wireless' },
      { subreddit: 'r/headphones', product: 'Sony WF-1000XM5' }
    ]
  },
  {
    day: 'Tuesday',
    posts: [
      { subreddit: 'r/BudgetAesthetics', product: 'Redragon K552 Kumara' },
      { subreddit: 'r/laptops', product: 'ASUS VivoBook 15 OLED' },
      { subreddit: 'r/pcmasterrace', product: 'Samsung Odyssey G5 34"' }
    ]
  },
  {
    day: 'Wednesday',
    posts: [
      { subreddit: 'r/macbooks', product: 'MacBook Air M2 13"' },
      { subreddit: 'r/budgeta11y', product: 'Soundcore P20i' },
      { subreddit: 'r/UltrawidenGaming', product: 'Samsung Odyssey G5 34"' }
    ]
  },
  {
    day: 'Thursday',
    posts: [
      { subreddit: 'r/tech', product: 'Logitech MX Master 3S' },
      { subreddit: 'r/headphones', product: 'Soundcore Space A40' },
      { subreddit: 'r/mechanicalkeyboards', product: 'Royal Kludge RK84' }
    ]
  },
  {
    day: 'Friday',
    posts: [
      { subreddit: 'r/buildapcsales', product: 'Lenovo IdeaPad Slim 5' },
      { subreddit: 'r/budgeta11y', product: 'Redragon K552 Kumara' },
      { subreddit: 'r/macbooks', product: 'MacBook Air M2 13"' }
    ]
  }
];

function findProductByName(name) {
  for (const [catKey, cat] of Object.entries(PRODUCTS)) {
    const found = cat.items.find(p => p.name === name);
    if (found) return { ...found, category: cat.category };
  }
  return null;
}

console.log('\n🚀 DAILY ROTATION SCHEDULE\n');
console.log('═══════════════════════════════════════════\n');

let totalPosts = 0;

DAILY_ROTATION.forEach(dayConfig => {
  console.log(`📅 ${dayConfig.day} - Daily Posts:\n`);
  
  dayConfig.posts.forEach((post, idx) => {
    const product = findProductByName(post.product);
    if (product) {
      const filename = `reddit_daily_${dayConfig.day}_${idx + 1}.txt`;
      
      // Use flash deal URL for deals
      const flashUrl = `https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-${product.id}.html`;
      
      const body = `Just spent some time with the **${product.name}** and wanted to share my thoughts.

**TL;DR:** ${product.description.split('.')[0]} — **solid pick at ${product.price}.**

**🔥 FLASH SALE ALERT!**

**What I like:**
• ${product.pros[0]}
• ${product.pros[1] || 'N/A'}
• ${product.pros[2] || product.pros[0]}

**What could be better:**
${product.cons ? `• ${product.cons[0]}` : ''}

**Rating: ⭐⭐⭐⭐ ${product.rating}/5 · ${product.reviews} reviews**

Current deal: ${flashUrl}

*(Disclosure: I earn a small commission if you buy through the link)*`;

      fs.writeFileSync(path.join(POSTS_DIR, filename),
        `SUBREDDIT: ${post.subreddit}\nTITLE: ${product.name} daily deal review\n${'='.repeat(60)}\n\n${body}`);
      
      console.log(`  ${idx + 1}. r/${post.subreddit.split('/')[1]}`);
      console.log(`     File: ${filename}`);
      console.log(`     Product: ${product.name} @ ${product.price}\n`);
      totalPosts++;
    }
  });
});

console.log('═══════════════════════════════════════════');
console.log(`\n✅ Total daily posts generated: ${totalPosts}`);
console.log('\n📝 TWEETER THREADS (3/day):');
for (let i = 1; i <= 3; i++) {
  console.log(`  twitter_daily_${i}.txt - Countdown with urgency`);
}
console.log('\n💡 Strategy:');
console.log('• Post 3 Reddit threads/day across different subreddits');
console.log('• Wait 30min between posts to same subreddit');
console.log('• Each post links to flash sale with countdown timer');
console.log('• Daily rotation ensures variety & consistent traffic');
