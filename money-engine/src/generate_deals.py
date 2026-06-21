import json, os, re, random, math
from datetime import datetime

OUTPUT_DIR = '/Users/kevin/Documents/liuliangrukou/money-engine/output/deals'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load product database to get all ASINs
with open('content/product-db-v2.js', 'r') as f:
    content = f.read()

# Extract all products with categories
products = []
current_category = None

for line in content.split('\n'):
    cat_match = re.match(r'\s+(\w+):\s*\{', line)
    if cat_match:
        current_category = cat_match.group(1)
    
    item_match = re.search(r"id:'(B[\w]+)',\s*name:'([^']+)',\s*price:'(\$[\d,.\']+)'\s*rating:([\d.]+),\s*reviews:'([^']+)'", line)
    if item_match:
        pid, pname, pprice, prating, previews = item_match.groups()
        products.append({
            'id': pid, 'name': pname, 'price': pprice,
            'rating': prating, 'reviews': previews,
            'category': current_category or 'general'
        })

print(f"Found {len(products)} products in database")

# Remove duplicates by ASIN
seen = set()
unique_products = []
for p in products:
    if p['id'] not in seen:
        seen.add(p['id'])
        unique_products.append(p)

products = unique_products
print(f"Unique products to create deals for: {len(products)}")

today = datetime.now().strftime('%Y-%m-%d')

# Create deal folders per category
categories_seen = set()
for product in products:
    cat_dir = os.path.join(OUTPUT_DIR, product['category'])
    os.makedirs(cat_dir, exist_ok=True)
    
    pid = product['id']
    pname = product['name']
    pprice = product['price'].replace('$', '').replace(',', '')
    base_price = float(pprice)
    
    discount_pct = random.randint(15, 30)
    sale_price = round(base_price * (1 - discount_pct/100), 2)
    savings = round(base_price - sale_price, 2)
    
    filename = f"flash-sale-{pid}.html"
    filepath = os.path.join(cat_dir, filename)
    
    # Build HTML with inline countdown timer for urgency
    html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
    html += '<meta charset="UTF-8">\n'
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    html += '<title>' + pname + ' - FLASH SALE ' + str(discount_pct) + '% OFF | Smart Buying Guide</title>\n'
    html += '<meta name="description" content="' + pname + ' on flash sale! Save $' + str(savings) + '. Limited-time deal.">\n'
    html += '<link rel="canonical" href="https://mree9527.github.io/liuliangrukou/money-engine/output/deals/' + product['category'] + '/' + filename + '">\n'
    html += '<meta name="robots" content="index, follow">\n'
    
    # JSON-LD structured data for Google
    ld_json = '{{\n  "@context": "https://schema.org",\n'
    ld_json += '  "@type": "Product",\n  "name": "' + pname + '",\n'
    ld_json += '  "offers": {\n'
    ld_json += '    "@type": "Offer",\n'
    ld_json += '    "price": "' + str(sale_price) + '",\n'
    ld_json += '    "priceCurrency": "USD",\n'
    ld_json += '    "availability": "https://schema.org/InStock"\n  }}\n}}'
    html += '<script type="application/ld+json">' + ld_json + '</script>\n'
    
    # Styles
    html += '<style>\n'
    html += '* {margin:0;padding:0;box-sizing:border-box}\n'
    html += 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.7;color:#1a1a2e;background:linear-gradient(135deg,#fff5f5,#fff7ed);min-height:100vh;display:flex;align-items:center;justify-content:center}\n'
    html += '.container{max-width:700px;margin:20px;padding:32px;background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,0.12)}\n'
    html += '.badge{display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;padding:6px 16px;border-radius:20px;font-size:.8em;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}\n'
    html += 'h1{font-size:clamp(1.5em,4vw,2em);font-weight:800;color:#0f3460;margin-bottom:8px;line-height:1.2}\n'
    html += '.meta{color:#64748b;font-size:.9em;margin-bottom:20px}\n'
    html += '.price-box{background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:16px;padding:24px;text-align:center;margin-bottom:24px}\n'
    html += '.old-price{text-decoration:line-through;color:#9ca3bf;font-size:1.3em}\n'
    html += '.new-price{font-size:2.5em;font-weight:800;color:#dc2626;margin:4px 0}\n'
    html += '.savings{background:#dcfce7;color:#16a34a;display:inline-block;padding:4px 12px;border-radius:12px;font-weight:600;font-size:.9em;margin-bottom:8px}\n'
    html += '.cta-btn{display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:1.15em;box-shadow:0 4px 15px rgba(220,38,38,0.3);transition:transform .2s}\n'
    html += '.cta-btn:hover{transform:scale(1.03)}\n'
    html += '.countdown{text-align:center;margin:20px 0;padding:20px;background:#fef2f2;border-radius:16px}\n'
    html += '.countdown-title{font-weight:700;color:#dc2626;font-size:.85em;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}\n'
    html += '.countdown-boxes{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}\n'
    html += '.cd-box{background:#fff;border:2px solid #fecaca;border-radius:12px;padding:12px 16px;text-align:center;min-width:80px}\n'
    html += '.cd-num{font-size:2em;font-weight:800;color:#dc2626;display:block}\n'
    html += '.cd-label{font-size:.75em;color:#9ca3bf;text-transform:uppercase;letter-spacing:1px;margin-top:4px}\n'
    html += '.disclosure{font-size:.8em;color:#9ca3bf;margin-top:20px;padding:12px;background:#f9fafc;border-radius:8px}\n'
    html += '</style>\n</head>\n<body>\n<div class="container">\n'
    
    # Content body
    html += '<span class="badge">Flash Sale - Limited Stock</span>\n'
    html += '<h1>' + pname + '</h1>\n'
    html += '<div class="meta">Flash sale ends soon! Don\'t miss this deal.</div>\n\n'
    
    html += '<div class="price-box">\n'
    html += '<div class="savings">Save $' + str(savings) + ' (' + str(discount_pct) + '% OFF)</div><br>\n'
    html += '<span class="old-price">$' + str(base_price) + '</span><br>\n'
    html += '<span class="new-price">$' + str(sale_price) + '</span><br>\n'
    html += '<span style="font-size:.9em;color:#64748b">Amazon Affiliate Deal</span>\n'
    html += '</div>\n\n'
    
    # Countdown timer
    html += '<div class="countdown">\n'
    html += '<div class="countdown-title">Flash Sale Ends In</div>\n'
    html += '<div class="countdown-boxes">\n'
    html += '<div class="cd-box"><span class="cd-num" id="d">00</span><span class="cd-label">Days</span></div>\n'
    html += '<div class="cd-box"><span class="cd-num" id="h">23</span><span class="cd-label">Hours</span></div>\n'
    html += '<div class="cd-box"><span class="cd-num" id="m">59</span><span class="cd-label">Minutes</span></div>\n'
    html += '<div class="cd-box"><span class="cd-num" id="s">59</span><span class="cd-label">Seconds</span></div>\n'
    html += '</div>\n</div>\n\n'
    
    # CTA
    amazon_url = 'https://www.amazon.com/dp/' + pid + '?tag=smarthome-20&linkCode=ogi&th=1'
    site_url = 'https://mree9527.github.io/liuliangrukou/money-engine/output/deals/' + product['category'] + '/' + filename
    html += '<div style="text-align:center;margin:24px 0">\n'
    html += '<a href="' + amazon_url + '" class="cta-btn" target="_blank" rel="nofollow sponsored noopener">Check Price on Amazon &rarr;</a>\n'
    html += '</div>\n\n'
    
    # Disclosure
    html += '<div class="disclosure"><strong>Affiliate Disclosure:</strong> Smart Buying Guide participates in Amazon Services LLC Associates Program. We may earn a commission when you buy through our links, at no extra cost to you. Prices accurate as of ' + today + '.</div>\n'
    html += '</div>\n\n'
    
    # Countdown JavaScript
    countdown_js = '''<script>
(function(){
  var saleEnd = new Date();
  saleEnd.setDate(saleEnd.getDate() + 1);
  function update(){
    var now = new Date();
    var diff = saleEnd - now;
    if(diff <= 0){ document.getElementById('d').textContent='00'; return; }
    var d=Math.floor(diff/(1000*60*60*24));
    var h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
    var m=Math.floor((diff%(1000*60*60))/(1000*60));
    var s=Math.floor((diff%(1000*60))/1000);
    document.getElementById('d').textContent=String(d).padStart(2,'0');
    document.getElementById('h').textContent=String(h).padStart(2,'0');
    document.getElementById('m').textContent=String(m).padStart(2,'0');
    document.getElementById('s').textContent=String(s).padStart(2,'0');
  }
  setInterval(update,1000);update();
})();
</script>
'''
    html += countdown_js
    html += '</body></html>'
    
    with open(filepath, 'w') as f:
        f.write(html)
    
    print('  Generated deal page for:', pid, pname, '@ $' + str(sale_price))

print(f'\nTotal flash deals generated: {len(products)}')

# Save deals index as JSON
deals_list = []
for product in products:
    pid = product['id']
    pprice = float(product['price'].replace('$', '').replace(',', ''))
    discount_pct = random.randint(15, 30)
    sale_price = round(pprice * (1 - discount_pct/100), 2)
    deals_list.append({
        'asin': pid,
        'name': product['name'],
        'original_price': product['price'],
        'sale_price': str(sale_price),
        'discount_pct': discount_pct,
        'amazon_url': 'https://www.amazon.com/dp/' + pid + '?tag=smarthome-20',
    })

with open(os.path.join(OUTPUT_DIR, 'flash_deals_index.json'), 'w') as f:
    json.dump(deals_list, f, indent=2)

print('Deals index saved to flash_deals_index.json')
