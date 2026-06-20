# 🤖 Money Engine - Zero Cost Automated Revenue System

An automated system that generates SEO-optimized product review articles with affiliate links, builds a complete static website, and can auto-post to social media. **Total cost: $0** (uses free tiers of all services).

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ Trend Data  │────▶│ Content Gen  │────▶│ Site Builder │
│ Reddit/HN   │     │ Product Revs │     │ Static HTML  │
└─────────────┘     └──────────────┘     └──────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
              ┌──────────┐      ┌─────────────┐    ┌──────────────┐
              │  SEO     │      │ Social Post │    │   Deploy     │
              │ Sitemap  │      │ Twitter/Med │    │ GitHub Pages │
              └──────────┘      └─────────────┘    └──────────────┘
```

## Revenue Streams Built In

| Stream | Method | Est. Monthly |
|--------|--------|-------------|
| Amazon Affiliate | Product review links | $100-$2,000 |
| SEO Traffic | Organic search via sitemap | $50-$1,000 |
| RSS Syndication | Distribute content to readers | Passive |
| Social Media | Twitter/Medium auto-posts | Drives traffic |

## Quick Start

```bash
# Install dependencies
npm install

# Generate all articles and build the site
npm start

# Build only (no API server)
npm run build

# Run with scheduled content generation
npm run schedule

# Deploy to GitHub Pages
./deploy.sh
```

## Environment Variables

```bash
export TWITTER_BEARER_TOKEN="your_twitter_token"
export MEDIUM_API_KEY="your_medium_key"
export MEDIUM_MEMBER_ID="your_member_id"
```

## Configuration

Edit `src/config/settings.js` to customize:
- `siteUrl` - Your deployed site URL
- `affiliate.amazonTag` - Your Amazon Associates tag
- `schedule.contentGeneration` - How often to regenerate (minutes)

## Architecture

```
money-engine/
├── src/
│   ├── config/settings.js       # All configuration
│   ├── scraper/trending.js      # Reddit/HN trend discovery
│   ├── content/generator.js     # Article + product data engine
│   ├── site/builder.js          # Static site generator
│   ├── seo/sitemap.js           # Sitemap + RSS + OG images
│   ├── social/poster.js         # Twitter/Medium auto-poster
│   ├── scheduler/jobs.js        # Pipeline orchestration
│   └── api/server.js            # REST API server
├── output/                      # Generated site files
├── deploy.sh                    # GitHub Pages deploy script
└── package.json
```

## Revenue Potential Timeline

| Month | Articles | Est. Traffic | Est. Revenue |
|-------|----------|-------------|--------------|
| 1     | 3        | 100-500     | $5-$20       |
| 3     | 9+       | 1,000-5K    | $50-$200     |
| 6     | 30+      | 10K-50K     | $200-$1,000  |
| 12    | 100+     | 50K-200K    | $1,000-$5K   |

## Tips for Maximizing Revenue

1. **Expand product data** - Add more categories in `generator.js`
2. **Add real affiliate links** - Replace placeholder Amazon tags
3. **Deploy to GitHub Pages** - Free hosting with custom domain support
4. **Submit to Search Console** - Ping Google/Bing for indexing
5. **Schedule daily runs** - Fresh content = better rankings
6. **Cross-post to Medium** - Leverage Medium's built-in audience
7. **Build email list** - Add newsletter signup to the site

## License: MIT (Free to use forever)
