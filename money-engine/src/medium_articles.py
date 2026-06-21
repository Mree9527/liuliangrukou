import os, json
from datetime import datetime

OUTPUT_DIR = '/Users/kevin/Documents/liuliangrukou/money-engine/output/medium-export'
os.makedirs(OUTPUT_DIR, exist_ok=True)

ARTICLES = [
    {
        "title": "7 Best Budget Mechanical Keyboards Under $100 in 2026",
        "tags": ["tech", "keyboards", "gaming", "budget"],
        "body": "<p>If you're looking for a great mechanical keyboard without breaking the bank, 2026 has some incredible options. Here's my honest roundup of the best budget mechanical keyboards that deliver premium feel at mid-range prices.</p>\n\n<h2>1. Redragon K552 Kumara — $29.99</h2>\n<p>The legendary budget king. At just <strong>$30</strong>, you get a full-size mechanical keyboard with Outemu blue switches, RGB backlighting, and a solid brass plate. Perfect for first-time mechanical keyboard buyers.</p>\n<p><strong>Rating: 4.4/5 | 85K+ Amazon reviews</strong></p>\n\n<h2>2. Keychron K2 Wireless — $69.99</h2>\n<p>For those who want wireless freedom, the Keychron K2 offers hot-swappable switches, Bluetooth connectivity, and Mac/PC compatibility at <strong>$70</strong>. This is the best price-to-feature ratio in the budget wireless category.</p>\n\n<h2>The Verdict</h2>\n<p>For absolute beginners: go with the <strong>Redragon K552</strong> at $30. For wireless flexibility: the <strong>Keychron K2</strong> at $70 is unbeatable value.</p>\n\n<p><em>Affiliate disclosure: We earn a small commission if you buy through our links, at no extra cost to you.</em></p>",
        "slug": "best-budget-keyboards-2026"
    },
    {
        "title": "The Ultimate Guide to Setting Up a Standing Desk (For Under $500)",
        "tags": ["home-office", "health", "productivity", "standing-desk"],
        "body": "<p>Standing desks have gone from luxury to must-have. Here's everything you need to know about setting up the perfect standing desk on a budget.</p>\n\n<h2>Why Stand?</h2>\n<p>Studies show standing desks reduce back pain by up to 54% and improve energy levels. The key is choosing the right desk that won't break the bank.</p>\n\n<h2>Budget Options Under $500</h2>\n\n<h3>Fully Jarvis Bamboo Standing Desk — ~$499</h3>\n<p>The Jarvis offers a beautiful bamboo surface, programmable height presets, and whisper-quiet motors. The eco-friendly option that looks great in any workspace.</p>\n\n<h2>The Best Value Pick</h2>\n<p>For most people, the <strong>Fully Jarvis at $499</strong> is the sweet spot between quality and price.</p>\n\n<p><em>Affiliate disclosure: We earn a small commission if you buy through our links.</em></p>",
        "slug": "standing-desk-guide-2026"
    },
    {
        "title": "Best Kitchen Gadgets Under $50 That Actually Make Life Easier",
        "tags": ["kitchen", "gadgets", "budget", "home"],
        "body": "<p>Not all kitchen gadgets are worth buying. Here are the <strong>only ones</strong> under $50 that genuinely save time and reduce mess.</p>\n\n<h2>1. COSORI Pro LE Air Fryer (5QT) — $89.99</h2>\n<p>Crispy chicken wings without oil, roasts vegetables in half the time. Dishwasher-safe basket = easy cleanup.</p>\n\n<h2>2. Instant Pot Duo 7-in-1 — $79.99</h2>\n<p>The kitchen appliance that replaced my slow cooker, rice cooker, and yogurt maker. At $80, best value in any kitchen.</p>\n\n<h2>The Bottom Line</h2>\n<p>Focus on appliances that replace multiple tools or save significant daily time.</p>",
        "slug": "best-kitchen-gadgets-under-50"
    },
]

today = datetime.now().strftime("%Y-%m-%d")

for article in ARTICLES:
    filename = f"{article['slug']}.html"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{article['title']} — Smart Buying Guide</title>
</head>
<body style="max-width:700px;margin:40px auto;padding:20px;font-family:Georgia,serif;line-height:1.8;color:#1a1a2e;">
{article['body']}
<hr style="margin-top:40px;border:none;border-top:1px solid #ddd">
<p style="font-size:0.9em;color:#666">Published on {today} | <a href="https://mree9527.github.io/liuliangrukou/">Smart Buying Guide</a></p>
</body>
</html>"""
    
    with open(filepath, 'w') as f:
        f.write(html)

print(f"Created {len(ARTICLES)} Medium articles")
for a in ARTICLES:
    print(f"  - {a['slug']}.html")
