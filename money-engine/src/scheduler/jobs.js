import { discoverTrendingContent } from '../scraper/trending.js';
import { generateAllArticles, generateArticle } from '../content/generator.js';
import { buildSite } from '../site/builder.js';
import { SocialPoster } from '../social/poster.js';
import * as seo from '../seo/sitemap.js';
import { CONFIG } from '../config/settings.js';

let stats = {
  totalRuns: 0,
  articlesGenerated: 0,
  socialPosts: 0,
  lastRun: null,
  errors: [],
};

export async function runFullPipeline() {
  console.log('\n🚀 === Starting Full Money Engine Pipeline ===\n');
  
  try {
    // Step 1: Discover trending topics (from external data)
    console.log('[1/5] 🔍 Discovering trending topics...');
    const trends = await discoverTrendingContent();
    console.log(`  Found ${trends.reddit.length} Reddit + ${trends.hackernews.length} HN trends`);

    // Step 2: Generate articles (using curated product database)
    console.log('[2/5] ✍️ Generating content...');
    const articles = generateAllArticles();
    
    if (articles.length === 0) {
      throw new Error('No articles generated');
    }
    
    stats.articlesGenerated += articles.length;
    console.log(`  ✓ Generated ${articles.length} articles`);

    // Step 3: Build site
    console.log('[3/5] 🏗️ Building website...');
    const outputDir = await buildSite(articles);
    console.log(`  ✓ Site built at ${outputDir}`);

    // Step 4: Run SEO generation
    console.log('[4/5] 📈 Generating SEO assets...');
    await seo.generateSitemap(articles);
    await seo.generateRSSFeed(articles);
    const ogImages = await seo.generateOpenGraphImages(articles);
    console.log('  ✓ Sitemap, RSS feed, and OG images generated');

    // Step 5: Social media posting
    console.log('[5/5] 📱 Posting to social media...');
    const poster = new SocialPoster(CONFIG.social);
    const socialResults = await poster.publishBatch(articles);
    
    stats.socialPosts += socialResults.twitter.length + socialResults.medium.length;

    stats.totalRuns++;
    stats.lastRun = new Date().toISOString();

    console.log(`\n✅ Pipeline complete! Run #${stats.totalRuns}`);
    console.log(`   Articles: ${stats.articlesGenerated} | Social posts: ${stats.socialPosts}`);
    
    return { success: true, stats };

  } catch (error) {
    stats.errors.push({ time: new Date().toISOString(), error: error.message });
    console.log(`\n❌ Pipeline error:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function runIncrementalUpdate() {
  // Generates just one new article from a random category
  const topics = Object.keys({
    'best-laptops-for-students': true,
    'budget-gaming-keyboards': true,
    'smart-home-devices-under-50': true,
  });
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  console.log(`[incremental] Generating article for: ${randomTopic}`);
  
  const article = generateArticle(randomTopic);
  if (!article) return;

  const { buildSite } = await import('../site/builder.js');
  await buildSite([article]);
  
  stats.articlesGenerated++;
  stats.lastRun = new Date().toISOString();
  
  console.log(`[incremental] ✓ Generated ${randomTopic}`);
}

export function getStats() {
  return { ...stats, articles: generateAllArticles().length };
}

// Export for use in other modules
globalThis.MONEY_ENGINE_STATS = stats;
