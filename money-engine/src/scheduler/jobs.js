import { generateAllArticles, getArticleMetadata } from '../content/generator.js';
import { buildSite } from '../site/builder.js';
import { discoverTrendingContent, saveTrendingData } from '../scraper/trending.js';

let stats = { totalRuns: 0, articlesGenerated: 0, socialPosts: 0, contentDiscoveries: 0, lastRun: null };

export async function runFullPipeline() {
  console.log('\n🚀 === Money Engine Full Pipeline ===\n');
  
  try {
    // Step 1: Discover trending topics from Hacker News
    console.log('[1/4] 🔍 Scraping HackerNews for trending products...');
    const content = await discoverTrendingContent();
    
    stats.contentDiscoveries += (content.hackernews || []).length;
    console.log(`  ✓ Found ${(content.hackernews || []).length} trending topics`);

    // Step 2: Generate all articles (evergreen content)
    console.log('[2/4] ✍️ Generating content...');
    const articles = generateAllArticles();
    
    if (articles.length === 0) {
      throw new Error('No articles generated');
    }
    
    stats.articlesGenerated += articles.length;
    const catCount = articles.filter(a => a.type === 'category').length;
    const prodCount = articles.filter(a => a.type === 'product').length;
    console.log(`  ✓ Generated ${articles.length} articles (${catCount} guides + ${prodCount} reviews)`);

    // Step 3: Build site
    console.log('[3/4] 🏗️ Building website...');
    const outputDir = await buildSite(articles);
    console.log(`  ✓ Site built at ${outputDir}`);

    // Step 4: Save trending data
    await saveTrendingData(content);

    stats.totalRuns++;
    stats.lastRun = new Date().toISOString();

    console.log(`\n✅ Pipeline complete! Run #${stats.totalRuns}`);
    console.log(`   Articles: ${articles.length} | Trending topics: ${(content.hackernews || []).length}`);
    
    return { success: true, articleCount: articles.length, stats };
  } catch (error) {
    console.log(`\n❌ Pipeline error:`, error.message);
    return { success: false, error: error.message };
  }
}

export function getStats() {
  return { ...stats };
}

export function getMetadata() {
  return getArticleMetadata();
}

globalThis.MONEY_ENGINE_STATS = stats;
