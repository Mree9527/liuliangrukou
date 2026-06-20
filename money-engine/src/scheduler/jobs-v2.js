import { generateAllArticles, getArticleMetadata } from '../content/generator-v2.js';
import { buildSite } from '../site/builder.js';
import { findRealDeals, generateDealOfDay } from '../content/deal-finder.js';
import * as distribution from '../content/distribution.js';
import { TwitterPoster } from '../automation/twitter-poster.js';

let stats = { 
  totalRuns: 0, articlesGenerated: 0, socialPosts: 0, newsletterSent: 0,
  redditPosts: 0, mediumExports: 0, contentDiscoveries: 0, dealsFound: 0,
  lastRun: null 
};

export async function runFullPipeline() {
  console.log('\n🚀 === Money Engine v2.0 - FULL PIPELINE ===\n');
  
  try {
    // Phase 1: Discovery
    console.log('[Phase 1/7] 🔍 Discovery...');
    const content = await import('../scraper/trending.js').then(m => m.discoverTrendingContent());
    stats.contentDiscoveries += (content.hackernews || []).length;
    console.log(`   Found ${(content.hackernews || []).length} trending topics`);

    // Phase 2: Find deals
    console.log('[Phase 2/7] 💰 Live Deals...');
    const deals = await findRealDeals();
    stats.dealsFound += deals.length;
    if (deals.length > 0) {
      await generateDealOfDay(deals);
      console.log(`   ✓ Found ${deals.length} deals`);
    }

    // Phase 3: Generate ALL articles (v2 generates 100+ pages per run)
    console.log('[Phase 3/7] ✍️ Content Generation (v2)...');
    const articles = generateAllArticles();
    
    if (articles.length === 0) throw new Error('No articles generated');
    
    stats.articlesGenerated += articles.length;
    const catCount = articles.filter(a => a.type === 'category').length;
    const prodCount = articles.filter(a => a.type === 'product').length;
    console.log(`   ✓ Generated ${articles.length} PAGES! (${catCount} guides + ${prodCount} reviews/compare)`);

    // Phase 4: Build site
    console.log('[Phase 4/7] 🏗️ Site Build...');
    const outputDir = await buildSite(articles);
    console.log(`   ✓ Built to ${outputDir}`);

    // Phase 5: Distribution
    console.log('[Phase 5/7] 📤 Distribution...');
    
    const mediumExports = await distribution.exportForMedium(articles.filter(a => a.type === 'product').slice(0, 34));
    stats.mediumExports += mediumExports.length;
    await distribution.generateNewsletter(articles);
    stats.newsletterSent++;
    const twitterThreads = distribution.generateTwitterThreads(articles.filter(a => a.type === 'product').slice(0, 10));
    distribution.generateRedditPosts(articles.filter(a => a.type === 'product').slice(0, 34));
    await distribution.generateRSSFeed(articles);

    // Phase 6: Social posting
    console.log('[Phase 6/7] 🐦 Social Media...');
    const twitterPoster = new TwitterPoster();
    const socialResults = await twitterPoster.postBatch(articles.filter(a => a.type === 'product').slice(0, 5));
    stats.socialPosts += (socialResults.posted || []).length;

    // Phase 7: Save trends
    console.log('[Phase 7/7] 💾 Done...');

    stats.totalRuns++;
    stats.lastRun = new Date().toISOString();

    console.log(`\n✅ Pipeline complete! Run #${stats.totalRuns}`);
    console.log(`   Total pages: ${articles.length} | Medium exports: ${mediumExports.length}`);
    
    return { success: true, articleCount: articles.length, dealsFound: deals.length, stats };

  } catch (error) {
    console.log(`\n❌ Pipeline error: ${error.message.split('\n')[0]}`);
    return { success: false, error: error.message.split('\n')[0] };
  }
}

export function getStats() { return { ...stats }; }

globalThis.MONEY_ENGINE_STATS = stats;
