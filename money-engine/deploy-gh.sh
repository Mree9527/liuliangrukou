#!/bin/bash
set -e
echo "🚀 Deploying to GitHub Pages..."
git checkout main 2>/dev/null || true
node src/index.js build > /dev/null 2>&1
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages
git rm -rf . 2>/dev/null || true
cp -r output/* ./
echo "" > .nojekyll
git add -A
git commit -m "auto: deploy $(date +%Y-%m-%d)" --allow-empty 2>/dev/null || true
if git remote get-url origin >/dev/null 2>&1; then
  git push origin gh-pages --force
  echo "✅ Deployed to GitHub Pages!"
else
  echo "⚠️ No remote. Set up:"
  echo "  1. Create GitHub repo: liuliangrukou"
  echo "  2. git remote add origin https://github.com/<user>/liuliangrukou.git"
  echo "  3. git push origin gh-pages --force"
  echo "  4. Enable Pages in Settings > Pages > Source: gh-pages"
fi
git checkout main 2>/dev/null || true
