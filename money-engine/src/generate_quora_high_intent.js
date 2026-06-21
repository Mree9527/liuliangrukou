import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output', 'quora-posts');

// High-intent Quora questions with commercial intent
const QUESTIONS = [
  {
    question: "What's the best budget laptop for students under $500 in 2026?",
    product: "ASUS VivoBook 15 OLED",
    keywords: "budget laptop, student laptop"
  },
  {
    question: "Is the Sony WF-1000XM5 worth it in 2026? Best ANC earbuds?",
    product: "Sony WF-1000XM5",
    keywords: "sony wf-1000xm5, noise cancelling earbuds"
  },
  {
    question: "Best mechanical keyboard under $30 in 2026? Redragon vs Keychron?",
    product: "Redragon K552 Kumara",
    keywords: "budget mechanical keyboard, redragon k552"
  },
  {
    question: "MacBook Air M2 vs M1: Which one should I buy in 2026?",
    product: "MacBook Air M2 13\"",
    keywords: "macbook air m2 vs m1"
  },
  {
    question: "What are the best wireless earbuds under $50 with good sound quality?",
    product: "Soundcore P20i",
    keywords: "wireless earbuds, budget earbuds"
  },
  {
    question: "Is Logitech MX Master 3S worth the price for productivity?",
    product: "Logitech MX Master 3S",
    keywords: "mx master 3s, productivity mouse"
  },
  {
    question: "Best gaming monitor under $300? Samsung Odyssey G5 review?",
    product: "Samsung Odyssey G5 34\"",
    keywords: "gaming monitor, odyssey g5"
  }
];

const PRODUCTS = {
  'ASUS VivoBook 15 OLED': { id: 'B0BS4C7M5V', price: '$429', pros: ['Beautiful OLED screen', 'Ryzen 7 performance', 'Full-size keyboard'], cons: ['Average battery life'] },
  'Sony WF-1000XM5': { id: 'B0D1XD1ZV3', price: '$248', pros: ['Best-in-class ANC', 'LDAC hi-res audio', 'Comfortable fit'], cons: ['Bulky charging case'] },
  'Redragon K552 Kumara': { id: 'B01E8KO2B0', price: '$29.99', pros: ['Unbeatable price', 'Outemu blue switches', 'Brass plate build'], cons: ['No software customization'] },
  'MacBook Air M2 13"': { id: 'B0BSHF7WHW', price: '$999', pros: ['Incredible performance-per-watt', 'Fanless silent design', 'Best-in-class trackpad'], cons: ['Only 2 USB-C ports'] },
  'Soundcore P20i': { id: 'B0D7FJ86YQ', price: '$24.99', pros: ['Unbeatable sub-$25 price', 'App-based sound customization', 'Decent call clarity'], cons: ['Plastic construction feels cheap'] },
  'Logitech MX Master 3S': { id: 'B0B6GXCQXY', price: '$79.99', pros: ['MagSpeed electromagnetic scroll', 'Ergonomic for all-day use', 'Flow multi-computer control'], cons: ['Not ideal for FPS gaming'] },
  'Samsung Odyssey G5 34"': { id: 'B0BWQZ8W4S', price: '$299.99', pros: ['Incredible value for ultrawide size', '144Hz smooth competitive gaming', 'Immersive curved viewing'], cons: ['VA panel black smearing in dark scenes'] }
};

console.log('\n🚀 GENERATING HIGH-INTENT QUORA ANSWERS\n');

let count = 0;
QUESTIONS.forEach(q => {
  const p = PRODUCTS[q.product];
  if (!p) return;

  const pros = (p.pros || []).slice(0, 3).map(pro => `• ${pro}`).join('\n');
  const cons = (p.cons || []).slice(0, 2).map(con => `• ${con}`).join('\n');

  const answerBody = `**After testing dozens of products in this category, I can confidently say:**\n\n

${q.product} is an excellent choice for your needs. Here's why:

## What I Like
${pros}

## Potential Drawbacks
${cons || 'None significant'}

## Verdict
For ${q.keywords.includes('student') ? 'students on a budget' : 'general use'}, this offers the best combination of value and performance at ${p.price}.

**My full review with pros, cons, and real-world testing:**
https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/${p.id}-review.html

*(Disclosure: I earn a small commission if you buy through the link - no extra cost to you)*`;

  const filename = `quora-${q.keywords.replace(/[^a-z0-9]+/g, '-')}.json`;
  
  const quoraData = {
    question: q.question,
    answerBody: answerBody,
    keywords: q.keywords,
    product: q.product,
    amazon_tag: 'smarthome-20',
    category: 'tech'
  };
  
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(quoraData, null, 2));
  console.log(`  ✓ ${filename}`);
  console.log(`    Product: ${q.product} @ ${p.price}\n`);
  count++;
});

console.log(`\n✅ Generated ${count} high-intent Quora answers`);
