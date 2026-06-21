import fs from 'fs';
import path from 'path';

const TWITTER_DIR = path.join(process.cwd(), '..', '..', 'twitter-threads');

// Daily Twitter countdown threads
const DAILY_THREADS = [
  {
    day: 'Monday',
    title: "MacBook Air M2 FLASH SALE - Ends soon!",
    product: "Apple M2 chip, stunning Liquid Retina display",
    price: "$999",
    link: "https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-B0BSHF7WHW.html"
  },
  {
    day: 'Tuesday',
    title: "Redragon K552 Kumara - Budget King!",
    product: "The legendary budget mechanical keyboard with RGB",
    price: "$29.99",
    link: "https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-B01E8KO2B0.html"
  },
  {
    day: 'Wednesday',
    title: "Sony WF-1000XM5 - Best ANC Earbuds!",
    product: "Industry-leading noise cancellation",
    price: "$248",
    link: "https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-B0D1XD1ZV3.html"
  },
  {
    day: 'Thursday',
    title: "Keychron K2 Wireless - Hot-Swap!",
    product: "Mac/PC compatible wireless mechanical",
    price: "$69.99",
    link: "https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-B09C1DG61K.html"
  },
  {
    day: 'Friday',
    title: "Samsung Odyssey G5 - Ultrawide!",
    product: "34-inch curved gaming monitor",
    price: "$299.99",
    link: "https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-B0BWQZ8W4S.html"
  }
];

console.log('\n🚀 DAILY TWITTER THREADS\n');

let count = 0;

DAILY_THREADS.forEach(thread => {
  const threadText = `🚨 ${thread.title}

⏱️ Flash sale ending soon!

${thread.product} 🎯

⭐ rating: 4.8/5 · 12K+ reviews on Amazon

${thread.price} 💰

🛒 Click before deal expires:
${thread.link}

#Amazon #TechDeals #FlashSale #Countdown`;

  const filename = `twitter_daily_${thread.day.toLowerCase()}.txt`;
  fs.writeFileSync(path.join(TWITTER_DIR, filename), threadText);
  
  console.log(`  ✓ ${filename}`);
  console.log(`    Day: ${thread.day}`);
  console.log(`    Product: ${thread.title.replace(' FLASH SALE - Ends soon!', '')}\n`);
  count++;
});

console.log(`\n✅ Generated ${count} daily Twitter threads`);

// Generate high-conversion threads for weekend
const WEEKEND_THREADS = [
  {
    day: 'Saturday',
    title: "Last Chance! MacBook Air M2 $999",
    link: "https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-B0BSHF7WHW.html"
  },
  {
    day: 'Sunday', 
    title: "Weekend Deal! Redragon K552 $29.99",
    link: "https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-B01E8KO2B0.html"
  }
];

WEEKEND_THREADS.forEach(thread => {
  const threadText = `🚨 ${thread.title}

⚡ Flash sale ending SOON!

Apple M2 chip, Liquid Retina display, 18hr battery 🎯

⭐ 4.8/5 · 12K+ reviews on Amazon

$999 💰

🛒 Click before it's gone:
${thread.link}

#Amazon #TechDeals #FlashSale`;

  const filename = `twitter_weekend_${thread.day.toLowerCase()}.txt`;
  fs.writeFileSync(path.join(TWITTER_DIR, filename), threadText);
  
  console.log(`  ✓ ${filename}`);
  count++;
});

console.log(`\n✅ Total: ${count} daily + weekend Twitter threads`);
