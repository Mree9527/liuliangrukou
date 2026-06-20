import { generateAllArticles } from '../content/generator.js';
import { buildSite } from '../site/builder.js';
import { discoverTrendingContent, saveTrendingData } from '../scraper/trending.js';
import * as distribution from '../content/distribution.js';
import { TwitterPoster } from '../automation/twitter-poster.js';
import { findRealDeals, generateDealOfDay } from '../content/deal-finder.js';

let stats = { 
  totalRuns: 0, articlesGenerated: 0, socialPosts: 0, newsletterSent: 0,
  redditPosts: 0, mediumExports: 0, contentDiscoveries: 0, dealsFound: 0,
  lastRun: null 
};

export async function runFullPipeline() {
  console.log('\n🚀 === Money Engine v2.0 - Full Pipeline ===\n');
  
  try {
    // Phase 1: Discovery
    console.log('[Phase 1/7] 🔍 Discovering trending products...');
    const content = await discoverTrendingContent();
    stats.contentDiscoveries += (content.hackernews || []).length;
    
    if ((content.hackernews || []).length > 0) {
      console.log(`   Found ${(content.hackernews).length} trending topics`);
    } else {
      console.log('   Using evergreen content strategy');
    }

    // Phase 2: Find real-time deals
    console.log('[Phase 2/7] 💰 Scanning for live deals...');
    const deals = await findRealDeals();
    stats.dealsFound += deals.length;
    if (deals.length > 0) {
      await generateDealOfDay(deals);
      console.log(`   ✓ Found ${deals.length} deals, deal-of-day generated`);
    } else {
      console.log('   Using curated product database for daily deals');
    }

    // Phase 3: Generate articles
    console.log('[Phase 3/7] ✍️ Generating content...');
    const articles = generateAllArticles();
    
    if (articles.length === 0) throw new Error('No articles generated');
    
    stats.articlesGenerated += articles.length;
    const catCount = articles.filter(a => a.type === 'category').length;
    const prodCount = articles.filter(a => a.type === 'product').length;
    console.log(`   ✓ Generated ${articles.length} articles (${catCount} guides + ${prodCount} reviews)`);

    // Phase 4: Build site
    console.log('[Phase 4/7] 🏗️ Building website...');
    const outputDir = await buildSite(articles);
    console.log(`   ✓ Static site at ${outputDir}`);

    // Phase 5: Multi-platform distribution
    console.log('[Phase 5/7] 📤 Distribution...');
    
    const mediumExports = await distribution.exportForMedium(articles);
    stats.mediumExports += mediumExports.length;
    
    await distribution.generateNewsletter(articles);
    stats.newsletterSent++;
    
    const twitterThreads = distribution.generateTwitterThreads(articles);
    
    const redditPosts = distribution.generateRedditPosts(articles);
    stats.redditPosts += redditPosts.length;
    
    await distribution.generateRSSFeed(articles);

    // Phase 6: Social media posting
    console.log('[Phase 6/7] 🐦 Auto-posting to social media...');
    const twitterPoster = new TwitterPoster();
    const socialResults = await twitterPoster.postBatch(articles);
    stats.socialPosts += (socialResults.posted || []).length;

    // Phase 7: Save trending data
    console.log('[Phase 7/7] 💾 Saving trends...');
    await saveTrendingData(content);

    stats.totalRuns++;
    stats.lastRun = new Date().toISOString();

    console.log(`\n✅ Pipeline complete! Run #${stats.totalRuns}\n`);
    console.log('Revenue streams active:');
    console.log(`   💰 Amazon Affiliate → ${prodCount} product pages with affiliate links`);
    console.log(`   🔍 SEO Pages → ${catCount} guides + ${prodCount} reviews for Google`);
    console.log(`   📧 Newsletter → ready to send via email platform`);
    console.log(`   🐦 Twitter/X → ${socialResults.posted?.length || 0} auto-posted, ${socialResults.queued?.length || 0} queued`);
    console.log(`   🤖 Reddit → ${redditPosts.length} discussion posts ready`);
    console.log(`   🎙️ RSS Feed → ready for Apple Podcasts/Spotify submission`);
    
    return { success: true, articleCount: articles.length, dealsFound: deals.length, stats };

  } catch (error) {
    console.log(`\n❌ Pipeline error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

export async function runQuickBuild() {
  const articles = generateAllArticles();
  const outputDir = await buildSite(articles);
  console.log(`[quick-build] ✓ Built ${articles.length} pages`);
  return { articleCount: articles.length, outputDir };
}

export function getStats() {
  return { ...stats };
}

globalThis.MONEY_ENGINE_STATS = stats;
