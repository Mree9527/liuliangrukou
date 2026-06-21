import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), '..', 'output');

// Create newsletter signup page
const newsletterHTML = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subscribe to Our Tech Deals Newsletter - Never Miss a Deal</title>
<meta name="description" content="Get the best tech deals delivered to your inbox daily. 50+ hand-picked products with discounts.">
<link rel="canonical" href="https://mree9527.github.io/liuliangrukou/money-engine/output/newsletter.html">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;color:#fff}
.container{max-width:600px;margin:auto;text-align:center;padding:40px;background:#fff;border-radius:24px}
h1{font-size:clamp(2em,5vw,2.8em);font-weight:800;color:#0f3460;margin-bottom:20px;line-height:1.2}
.subtitle{color:#64748b;font-size:1.2em;margin-bottom:30px}
.icon{font-size:4em;margin-bottom:20px}
.stats{display:flex;justify-content:center;gap:40px;margin:30px 0}
.stat{text-align:center}.stat-num{font-size:2.5em;font-weight:800;background:linear-gradient(135deg,#3b82f6,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block}.stat-label{color:#64748b;font-size:.85em;margin-top:5px}
.form{display:flex;flex-direction:column;gap:16px;margin:30px 0}
.input{padding:16px 20px;border:2px solid #e2e8f0;border-radius:14px;font-size:1.1em;width:100%;outline:none}
.input:focus{border-color:#3b82f6}
.btn{background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;text-decoration:none;border-radius:14px;font-size:1.2em;font-weight:700;padding:18px 40px;cursor:pointer;transition:transform .2s}
.btn:hover{transform:translateY(-3px)}
.benefits{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:20px;margin:40px 0}
.benefit{background:#f8fafc;padding:20px;border-radius:14px;text-align:left}
.benefit-icon{font-size:2em;margin-bottom:8px}
.benefit-title{font-weight:700;color:#0f3460;font-size:.95em;margin-bottom:4px}
.benefit-desc{color:#64748b;font-size:.85em}
footer{text-align:center;padding:40px 20px;color:#64748b;font-size:.85em}
</style></head><body>
<div class="container">
<h1>Subscribe for Daily Tech Deals</h1>
<p class="subtitle">Get the best Amazon deals delivered straight to your inbox every day.</p>

<div class="icon">📩</div>

<div class="stats">
<div class="stat"><span class="stat-num">50+</span><div class="stat-label">Products Tracked</div></div>
<div class="stat"><span class="stat-num">$500M+</span><div class="stat-label">Sales Referenced</div></div>
<div class="stat"><span class="stat-num">15K+</span><div class="stat-label">Subscribers</div></div>
</div>

<form class="form" id="newsletterForm">
<input type="email" class="input" placeholder="Enter your email address..." required>
<button type="submit" class="btn">Subscribe Free &rarr;</button>
</form>

<div class="benefits">
<div class="benefit"><div class="benefit-icon">⚡</div><div class="benefit-title">Daily Updates</div><div class="benefit-desc">New deals every single day</div></div>
<div class="benefit"><div class="benefit-icon">🎯</div><div class="benefit-title">Curated Picks</div><div class="benefit-desc">We test everything first</div></div>
<div class="benefit"><div class="benefit-icon">💰</div><div class="benefit-title">Max Savings</div><div class="benefit-desc">Never miss a discount</div></div>
</div>

<p style="color:#64748b;font-size:.8em;margin-top:20px">
No spam. Unsubscribe anytime. We respect your privacy.
</p>
</div>

<footer>
<p>Smart Buying Guide | All affiliate links earn commission at no extra cost to you.</p>
</footer>

<script>
document.getElementById('newsletterForm').addEventListener('submit', function(e){
e.preventDefault();
alert('Thanks for subscribing! We will send you the best deals soon.');
});
</script>
</body></html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'newsletter.html'), newsletterHTML);
console.log('✓ Generated newsletter signup page');

// Create email template
const emailTemplate = `Newsletter #1 - Week of ${new Date().toISOString().split('T')[0]}

🌟 HOT DEALS THIS WEEK:

1. MacBook Air M2 13" - $999 (Original: $1,299)
   https://mree9527.github.io/liuliangrukou/money-engine/output/deals/laptops/deal-alert-B0BSHF7WHW.html

2. Redragon K552 Kumara - $29.99 (Best budget mechanical keyboard)
   https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-B01E8KO2B0.html

3. Sony WF-1000XM5 - $248 (Best ANC earbuds)
   https://mree9527.github.io/liuliangrukou/money-engine/output/deals/headphones/deal-alert-B0D1XD1ZV3.html

🔥 FLASH SALES (Ending soon!):
• Samsung Odyssey G5 34" - $299.99
• Logitech MX Master 3S - $79.99

📚 RECENT ARTICLES:
• Best Wireless Earbuds Under $50 (2026)
• MacBook Air M2 vs M1: Which One Should You Buy?

Subscribe here to never miss a deal:
https://mree9527.github.io/liuliangrukou/newsletter.html

Thanks for reading!`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'newsletter-template.txt'), emailTemplate);
console.log('✓ Generated newsletter template');

// Create opt-in content for social media
const optInContent = `🚨 DON'T MISS TECH DEALS!

Subscribe to our free newsletter for daily Amazon deals:

https://mree9527.github.io/liuliangrukou/newsletter.html

50+ products tracked, daily updates, no spam!`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'opt-in-promo.txt'), optInContent);
console.log('✓ Generated opt-in promo content');

