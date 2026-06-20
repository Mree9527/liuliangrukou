import { generateAllArticles } from '../content/generator.js';
import { buildSite } from '../site/builder.js';
import { discoverTrendingContent, saveTrendingData } from '../scraper/trending.js';
import * as distribution from '../content/distribution.js';

let stats = { 
  totalRuns: 0, 
  articlesGenerated: 0, 
  socialPosts: 0, 
  newsletterSent: 0,
  redditPosts: 0,
  mediumExports: 0,
  contentDiscoveries: 0, 
  lastRun: null 
};

export async function runFullPipeline() {
  console.log('\n🚀 === Money Engine v2.0 - Full Pipeline ===\n');
  
  try {
    // Phase 1: Discover trending content
    console.log('[Phase 1/5] 🔍 Discovery...');
    const content = await discoverTrendingContent();
    stats.contentDiscoveries += (content.hackernews || []).length;
    
    if ((content.hackernews || []).length > 0) {
      console.log(`   Found ${(content.hackernews).length} trending tech topics`);
    } else {
      console.log('   Using evergreen content strategy');
    }

    // Phase 2: Generate all articles
    console.log('[Phase 2/5] ✍️ Content Generation...');
    const articles = generateAllArticles();
    
    if (articles.length === 0) throw new Error('No articles generated');
    
    stats.articlesGenerated += articles.length;
    const catCount = articles.filter(a => a.type === 'category').length;
    const prodCount = articles.filter(a => a.type === 'product').length;
    console.log(`   ✓ Generated ${articles.length} articles (${catCount} guides + ${prodCount} reviews)`);

    // Phase 3: Build static site
    console.log('[Phase 3/5] 🏗️ Site Build...');
    const outputDir = await buildSite(articles);
    console.log(`   ✓ Static site at ${outputDir}`);

    // Phase 4: Content distribution
    console.log('[Phase 4/5] 📤 Distribution...');
    
    // Export for Medium
    const mediumExports = await distribution.exportForMedium(articles);
    stats.mediumExports += mediumExports.length;
    console.log(`   ✓ ${mediumExports.length} articles exported for Medium`);
    
    // Generate newsletter
    await distribution.generateNewsletter(articles);
    stats.newsletterSent++;
    console.log('   ✓ Newsletter generated');
    
    // Generate Twitter threads
    const twitterThreads = distribution.generateTwitterThreads(articles);
    stats.socialPosts += twitterThreads.length;
    console.log(`   ✓ ${twitterThreads.length} Twitter/X threads created`);
    
    // Generate Reddit posts
    const redditPosts = distribution.generateRedditPosts(articles);
    stats.redditPosts += redditPosts.length;
    console.log(`   ✓ ${redditPosts.length} Reddit discussion posts ready`);
    
    // RSS feed
    await distribution.generateRSSFeed(articles);
    console.log('   ✓ RSS feed ready for Apple Podcasts/Spotify');

    // Phase 5: Save trending data
    console.log('[Phase 5/5] 💾 Saving trends...');
    await saveTrendingData(content);

    stats.totalRuns++;
    stats.lastRun = new Date().toISOString();

    console.log(`\n✅ Pipeline complete! Run #${stats.totalRuns}\n`);
    console.log('Revenue streams active:');
    console.log(`   📊 Amazon Affiliate Links → ${prodCount} product pages ready for clicks`);
    console.log(`   🔍 SEO Pages → ${catCount} category guides + ${prodCount} reviews indexed by Google`);
    console.log(`   📧 Newsletter → 1 digest ready (email marketing)`);
    console.log(`   🐦 Social Media → ${twitterThreads.length} Twitter threads for auto-posting`);
    console.log(`   🤖 Reddit → ${redditPosts.length} discussion posts for traffic`);
    console.log(`   🎙️ Podcast/RSS → RSS feed ready for submission`);
    
    return { 
      success: true, 
      articleCount: articles.length, 
      stats 
    };

  } catch (error) {
    console.log(`\n❌ Pipeline error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Quick build without full pipeline
export async function runQuickBuild() {
  const articles = generateAllArticles();
  const outputDir = await buildSite(articles);
  console.log(`[quick-build] ✓ Built ${articles.length} pages to ${outputDir}`);
  return { articleCount: articles.length, outputDir };
}

export function getStats() {
  return { ...stats };
}

export function getMetadata() {
  // Use generator metadata but with proper structure
  const all = generateAllArticles();
  return all.map(a => ({
    url: `https://smartsite.vercel.app${a.seoUrl}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: a.type === 'category' ? '0.9' : '0.7',
  }));
}

globalThis.MONEY_ENGINE_STATS = stats;
