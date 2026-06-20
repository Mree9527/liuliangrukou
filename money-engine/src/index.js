#!/usr/bin/env node
import { runFullPipeline } from './scheduler/jobs.js';
import { startAPI } from './api/server.js';

const args = process.argv.slice(2);
const command = args[0];

console.log('\n╔══════════════════════════════════════╗');
console.log('║  🤖 Money Engine v2.0               ║');
console.log('║  Automated Zero-Cost Revenue System  ║');
console.log('╚══════════════════════════════════════╝\n');

async function main() {
  if (command === 'build') {
    const { generateAllArticles } = await import('./content/generator.js');
    const { buildSite } = await import('./site/builder.js');
    const articles = generateAllArticles();
    const dir = await buildSite(articles);
    console.log(`\n✅ Site built at: ${dir}`);
    process.exit(0);
  } else if (command === 'stats') {
    const { getStats } = await import('./scheduler/jobs.js');
    const stats = getStats();
    console.log('\n📊 Stats:', JSON.stringify(stats, null, 2));
    process.exit(0);
  }

  // Default: full pipeline + serve
  try {
    const result = await runFullPipeline();
    
    if (result.success) {
      console.log('\n✅ Money Engine is running!\n');
      console.log('Generated content:');
      console.log('  🏠 output/index.html              - Homepage');
      console.log('  📁 output/categories/*.html       - Category guides');
      console.log('  🔍 output/reviews/*.html          - Product reviews');
      console.log('  🗺️ output/sitemap.xml             - SEO sitemap');
      console.log('  📰 output/robots.txt              - Search engine robots');
      
      // Start API server for dynamic content generation
      startAPI();
    } else {
      console.log('\n❌ Pipeline failed:', result.error);
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
}

main();
