import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './content/product-db-v2.js';

const TWITTER_DIR = path.join(process.cwd(), '..', '..', 'twitter-threads');

function generateTwitterThread(product) {
  const p = product;
  
  const thread = `\ud83e\uddf5 THREAD: Should you buy the ${p.name} in 2026?

After testing dozens of products, here's my honest take on the ${p.name}.

Rating: \u2b50\u2b50\u2b50\u2b50 ${p.rating}/5 \u00b7 ${p.reviews}+ reviews on Amazon

Let me break it down \ud83d\udc47

---

\u2705 PROS:
\u2022 ${p.pros[0]}
\u2022 ${p.pros[1] || 'N/A'}
\u2022 ${p.pros[2] || 'N/A'}

---

\u274c CONS:
\u2022 ${p.cons ? p.cons[0] : 'None major'}
${p.cons && p.cons.length > 1 ? '\u2022 ' + p.cons[1] : ''}

---

\ud83d\udcb0 PRICE: ${p.price}

\ud83d\uded2 Check current price + deal:
https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-${p.id}.html

---

\ud83c\udfc6 VERDICT: 
If you're looking for quality at this price, the ${p.name} delivers. 

Check the deal above before it expires! \ud83d\udc46

#TechDeals #AmazonFinds #ProductReview`;

  const filepath = path.join(TWITTER_DIR, `${p.id}-fresh-thread.txt`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, thread);
    console.log(`  \u2713 Twitter thread for ${p.name}`);
  }
}

const allProducts = [];
Object.entries(PRODUCTS).forEach(([key, cat]) => {
  cat.items.forEach(item => allProducts.push(item));
});

allProducts.filter(p => !fs.existsSync(path.join(TWITTER_DIR, `${p.id}-fresh-thread.txt`))).slice(0, 20).forEach(generateTwitterThread);

console.log('\n\u2705 Generated fresh Twitter threads');
