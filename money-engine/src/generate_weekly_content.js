import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output');

// Weekly content calendar
const WEEKLY_CONTENT = {
  week: new Date().toISOString().split('T')[0],
  posts: [
    {
      day: 'Monday',
      type: 'blog_post',
      title: "Best Wireless Earbuds Under $50 in 2026 (Tested)",
      keywords: ["best wireless earbuds under 50", "budget earbuds 2026"],
      url: "/money-engine/output/medium-export/best-wireless-earbuds-under-50.html"
    },
    {
      day: 'Tuesday',
      type: 'comparison',
      title: "MacBook Air M2 vs M1: Which Should You Buy?",
      keywords: ["macbook air m2 vs m1", "which macbook to buy"],
      url: "/money-engine/output/medium-export/macbook-air-m2-vs-m1.html"
    },
    {
      day: 'Wednesday',
      type: 'deal_alert',
      title: "Redragon K552 Kumara - Best Budget Mechanical Keyboard",
      keywords: ["best mechanical keyboard under 30", "budget gaming keyboard"],
      url: "/money-engine/output/deals/electronics/deal-alert-B01E8KO2B0.html"
    },
    {
      day: 'Thursday',
      type: 'twitter_thread',
      title: "Sony WF-1000XM5 - Best ANC Earbuds (Thread)",
      keywords: ["sony wf-1000xm5 review", "best noise cancelling earbuds"],
      url: "/money-engine/output/reviews/B0D1XD1ZV3-review.html"
    },
    {
      day: 'Friday',
      type: 'newsletter',
      title: "Weekly Tech Deals Newsletter",
      keywords: ["tech deals this week", "amazon discounts"],
      url: "/money-engine/output/newsletter.html"
    }
  ]
};

// Save weekly calendar
fs.writeFileSync(path.join(OUTPUT_DIR, 'weekly-content-calendar.json'), JSON.stringify(WEEKLY_CONTENT, null, 2));
console.log('✓ Weekly content calendar saved');

// Generate Pinterest pin descriptions for SEO traffic
const PINTEREST_PINS = [
  {
    title: "MacBook Air M2 Review - Best Ultrabook in 2026",
    description: "Apple M2 chip, Liquid Retina display, 18hr battery life. Full review + current price $999.",
    keywords: ["macbook air m2", "apple laptop 2026", "best ultrabook"],
    image_type: "product_image"
  },
  {
    title: "Redragon K552 Kumara - Budget Mechanical Keyboard",
    description: "RGB mechanical keyboard at $29.99 with brass plate and blue switches.",
    keywords: ["budget mechanical keyboard", "redragon k552", "gaming keyboard under 30"],
    image_type: "keyboard_image"
  },
  {
    title: "Sony WF-1000XM5 - Best ANC Earbuds",
    description: "Industry-leading noise cancellation with LDAC hi-res audio. $248 review.",
    keywords: ["sony wf-1000xm5", "best earbuds 2026", "noise cancelling earbuds"],
    image_type: "earbuds_image"
  }
];

// Save Pinterest content
fs.writeFileSync(path.join(OUTPUT_DIR, 'pinterest-content.json'), JSON.stringify(PINTEREST_PINS, null, 2));
console.log('✓ Pinterest content saved');

console.log('\n📊 WEEKLY CONTENT PLAN');
console.log('═══════════════════════\n');

WEEKLY_CONTENT.posts.forEach(post => {
  console.log(`${post.day} - ${post.type.toUpperCase()}`);
  console.log(`  Title: ${post.title}`);
  console.log(`  Keywords: ${post.keywords.join(', ')}`);
  console.log(`  URL: https://mree9527.github.io/liuliangrukou${post.url}\n`);
});

console.log('═══════════════════════');
console.log('\n💡 Pinterest optimization for SEO traffic:');
PINTEREST_PINS.forEach(pin => {
  console.log(`- ${pin.title}`);
  console.log(`  Keywords: ${pin.keywords.join(', ')}\n`);
});
