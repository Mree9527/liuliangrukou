import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const TWITTER_DIR = path.join(process.cwd(), '..', '..', 'twitter-threads');

function findProductById(productId) {
  for (const [catKey, cat] of Object.entries(PRODUCTS)) {
    const found = cat.items.find(p => p.id === productId);
    if (found) return { ...found, category: cat.category };
  }
  return null;
}

// High-priority products with flash deals
const HIGH_PRIORITY_PRODUCTS = [
  'B0BSHF7WHW', // MacBook Air M2 - $999
  'B01E8KO2B0', // Redragon K552 - $29.99
  'B0D1XD1ZV3', // Sony WF-1000XM5 - $248
  'B09C1DG61K', // Keychron K2 Wireless - $69.99
  'B0BWQF4M1P'  // Keychron Q1 Pro - $139.39 (18% off)
];

function generateCountdownThread(product, discountPct) {
  const countdownMinutes = Math.floor(Math.random() * 24) + 2; // 2-26 hours
  const countdownHours = Math.floor(countdownMinutes / 60);
  const remainingMins = countdownMinutes % 60;
  
  const thread = `🚨 ${product.name} FLASH SALE - Ends soon!

Just found this deal - timer is ticking:
⏱️ ${countdownHours}h ${remainingMins}m remaining

${product.description.split('.')[0]}

⭐ ${product.rating}/5 · ${product.reviews} reviews on Amazon

✅ Pros: ${product.pros[0]}, ${product.pros[1]}
❌ Cons: ${product.cons ? product.cons[0] : 'N/A'}

💰 Price: ${product.price}

🛒 Click to buy before sale ends:
https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-${product.id}.html

#Amazon #TechDeals #FlashSale #Countdown`;

  return thread;
}

console.log('\n🚀 GENERATING COUNTDOWN THREADS...\n');

let count = 0;
HIGH_PRIORITY_PRODUCTS.forEach(productId => {
  const product = findProductById(productId);
  if (product) {
    // Generate 3 variations with different countdown times
    for (let i = 1; i <= 3; i++) {
      const thread = generateCountdownThread(product, 15 + Math.random() * 20);
      const filename = `twitter_countdown_${productId}_${i}.txt`;
      fs.writeFileSync(path.join(TWITTER_DIR, filename), thread);
      console.log(`  ✓ ${filename} - ${product.name}`);
      count++;
    }
  }
});

console.log(`\n✅ Generated ${count} countdown threads`);
