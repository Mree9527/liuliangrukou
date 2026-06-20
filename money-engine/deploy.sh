#!/bin/bash
# Automated deployment script for Money Engine
# Deploy to GitHub Pages (free hosting)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Money Engine - Deploy to GitHub Pages${NC}\n"

# Check if output directory exists
if [ ! -d "output" ]; then
    echo -e "${RED}❌ No output directory found. Run 'npm start' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Building site...${NC}"
node src/index.js build

# Check if on correct branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Current branch: $CURRENT_BRANCH. Deploying from here.${NC}"
fi

# Backup current gh-pages content if exists
if git show gh-pages:output/index.html >/dev/null 2>&1; then
    echo -e "${GREEN}📦 Backing up existing gh-pages output...${NC}"
    git archive gh-pages -- output/ | tar xf - -C ../money-engine-backup 2>/dev/null || true
fi

# Create or switch to gh-pages branch
if ! git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo -e "${YELLOW}📝 Creating gh-pages branch...${NC}"
    git checkout --orphan gh-pages
else
    git checkout gh-pages
fi

# Clean and deploy output files
echo -e "${GREEN}📤 Deploying site files...${NC}"
git rm -r --cached . >/dev/null 2>&1 || true
rm -rf * .*
cp -r ../money-engine/output/* ./
touch .nojekyll  # Disable Jekyll processing

# Commit and push
git add -A
git commit -m "🚀 Deploy Money Engine v$(date +%Y%m%d%H%M) [auto]" || echo "No changes to commit"
git push origin gh-pages --force

echo ""
echo -e "${GREEN}✅ Site deployed!${NC}"
echo -e "   URL: https://$(git remote get-url origin | grep -oP '(?<=github.com[:/])[^\.]+' )\.github.io/money-engine/"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update CONFIG.siteUrl in src/config/settings.js"
echo "2. Set TWITTER_BEARER_TOKEN for auto-posting"
echo "3. Submit sitemap.xml to Google Search Console"
echo "4. Run 'npm start' to generate more content regularly"
