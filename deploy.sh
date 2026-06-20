#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "=========================================="
echo "  🚀 Money Engine Deploy v2.0"
echo "=========================================="

# Step 1: Generate fresh content
echo ""
echo "[1/3] Generating fresh content..."
cd money-engine && node src/distribute.js 2>&1 | tail -8
cd ..

# Step 2: Update settings with real URLs
echo ""
echo "[2/3] Updating site URLs..."
sed -i '' "s|https://smartsite.vercel.app|https://$(gh repo view Mree9527/liuliangrukou --json url | python3 -c 'import sys,json;print(json.load(sys.stdin)["url"].replace(\"https://\",\"\"))')|" money-engine/src/config/settings.js 2>/dev/null || true
sed -i '' "s|https://smartsite.vercel.app|https://mree9527.github.io/liuliangrukou|" money-engine/src/config/settings.js

# Step 3: Deploy to GitHub Pages
echo ""
echo "[3/3] Deploying to GitHub Pages..."
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages
rm -rf categories compare reviews medium-export reddit-posts twitter-threads *.html newsletter.txt rss.xml robots.txt sitemap.xml DISTRIBUTION-GUIDE.md .nojekyll

cp -r money-engine/output/* .
rm -rf ui-design/node_modules money-engine/node_modules 2>/dev/null || true

git add -A
git commit -m "deploy: $(date +%Y-%m-%d) automated" --allow-empty 2>/dev/null || true

git push origin gh-pages --force 2>&1 | tail -3
echo ""
echo "=========================================="
echo "  ✅ Site deployed!"
echo "  https://mree9527.github.io/liuliangrukou/"
echo "=========================================="
