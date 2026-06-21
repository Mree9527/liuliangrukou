import os
from datetime import datetime

today = datetime.now().strftime('%Y-%m-%dT%H:%M:%S+00:00')
html_files = []
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            url_path = os.path.relpath(os.path.join(root, f), '.')
            html_files.append(url_path)

seen = set()
unique = sorted(set(html_files))

base = 'https://mree9527.github.io/liuliangrukou/'
parts = []
for p in unique:
    full = base + p
    pri, freq = '0.7', 'monthly'
    if 'index.html' in p: pri, freq = '1.0', 'daily'
    elif '/categories/' in p or 'money-methods' in p: pri, freq = '0.9', 'weekly'
    elif '/compare/' in p or '/reviews/' in p: pri, freq = '0.8', 'weekly'
    parts.append('  <url>\n    <loc>' + full + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>' + freq + '</changefreq>\n    <priority>' + pri + '</priority>\n  </url>')

with open('sitemap.xml', 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(parts) + '\n</urlset>\n')

print('Generated sitemap with', str(len(unique)), 'URLs')
