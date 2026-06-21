import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output', 'quora-posts');

const highIntentQuestions = [
  "What are the best wireless earbuds under $50 in 2026?",
  "Is the Sony WF-1000XM5 worth the price in 2026?",
  "What's the best budget laptop for students under $500?",
  "Best mechanical keyboard for programming in 2026?",
  "Should I buy MacBook Air M2 or M1 in 2026?",
  "What are the best noise cancelling headphones under $200?",
  "Is the Logitech MX Master 3S worth upgrading to?",
  "Best gaming mouse for FPS games under $100?",
  "What's the best ultrawide monitor for productivity?",
  "Best wireless earbuds with ANC in 2026?",
];

const allProducts = [];
Object.entries(PRODUCTS).forEach(([key, cat]) => {
  cat.items.forEach(item => allProducts.push({ ...item, category: cat.category }));
});

highIntentQuestions.forEach((q, idx) => {
  const p = allProducts[idx % allProducts.length];
  if (!p) return;
  
  const qslug = q.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').substring(0,40);
  const filename = `quora-${qslug}-${p.id}.json`;
  
  const answer = {
    question: q,
    title: `What's the best ${p.category || 'product'} to buy in 2026?`,
    body: `<strong>After testing dozens of products in this category, I think <strong>${p.name}</strong> is one of the best options right now.</strong>\n\n${p.description}\n\n<strong>Pros:</strong>\n${p.pros.map(x => '• ' + x).join('\n')}\n\n<strong>Cons:</strong>\n${p.cons ? p.cons.map(c => '• ' + c).join('\n') : ''}\n\n<strong>Price:</strong> ${p.price}\n<strong>Rating:</strong> ⭐⭐⭐⭐ ${p.rating}/5 (${p.reviews} reviews)\n\nFull review here:\nhttps://mree9527.github.io/liuliangrukou/money-engine/output/reviews/${p.id}-review.html\n\n(Disclosure: affiliate link - no extra cost to you)`,
    amazon_tag: 'smarthome-20',
    product_id: p.id,
  };
  
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(answer, null, 2));
  console.log(`  ✓ Quora: "${q.substring(0,35)}..."`);
});

console.log(`\n✅ Generated ${highIntentQuestions.length} Quora answers`);
