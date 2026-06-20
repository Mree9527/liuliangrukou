#!/bin/bash
set -e
echo "============================================"
echo "  🚀 Money Engine v2.0 — Deploy Script"
echo "============================================"

cd "$(dirname "$0")/.."

# Step 1: Ensure we're on main
git checkout main 2>/dev/null || true
echo "[1/4] ✅ On main branch"

# Step 2: Generate fresh content by running distribute.js (which builds + Reddit + Twitter)
cd money-engine
echo ""
echo "[2/4] Generating fresh content..."
node src/distribute.js 2>&1 | grep -E '✓|OK|\u2705' || true
echo "✅ Content generated"

# Step 3: Switch to gh-pages and deploy
cd ..
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages 2>/dev/null
echo "[3/4] Switching to gh-pages branch..."

# Remove all old files on gh-pages
find . -not -name '.nojekyll' -not -name 'deploy.sh' -not -path './.git/*' -not -path './money-engine/src/*' -exec rm -rf {} + 2>/dev/null || true

# Copy fresh output to root of gh-pages
mkdir -p categories compare reviews 2>/dev/null
cp -r money-engine/output/* ./
rm -f .nojekyll 2>/dev/null || true

echo "✅ Files deployed"

# Step 4: Commit and push
git add -A
git commit -m "deploy: $(date +%Y-%m-%d) - automated content + distribution" --allow-empty 2>/dev/null || true

if git remote get-url origin >/dev/null 2>&1; then
  git push origin gh-pages --force 2>&1
  echo ""
  echo "============================================"
  echo "  ✅ DEPLOYED TO GITHUB PAGES!"
  echo "  URL: https://<username>.github.io/liuliangrukou/"
  echo "============================================"
else
  echo ""
  echo "⚠️ No remote configured."
  echo "To deploy, run:"
  echo "  1. Create GitHub repo: liuliangrukou"
  echo "  2. git remote add origin https://github.com/<user>/liuliangrukou.git"
  echo "  3. git push origin gh-pages --force"
  echo "  4. Go to Settings > Pages > Source: gh-pages branch"
fi

# Return to main
git checkout main 2>/dev/null || true
