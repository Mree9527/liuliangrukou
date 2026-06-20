#!/usr/bin/env node
import { runFullPipeline, getStats } from './scheduler/jobs.js';
import { startAPI } from './api/server.js';
import chalk from 'chalk';

const args = process.argv.slice(2);
const command = args[0];

console.log(chalk.cyan('\n╔══════════════════════════════════════════╗'));
console.log(chalk.cyan('║   🤖 MONEY ENGINE v1.0 - Zero Cost      ║'));
console.log(chalk.cyan('║   Automated Revenue System               ║'));
console.log(chalk.cyan('╚══════════════════════════════════════════╝\n'));

async function main() {
  if (command === 'build') {
    console.log(chalk.yellow('🏗️ Building static site...'));
    const { generateAllArticles } = await import('./content/generator.js');
    const { buildSite } = await import('./site/builder.js');
    const articles = generateAllArticles();
    const outputDir = await buildSite(articles);
    console.log(chalk.green(`\n✅ Site built at: ${outputDir}`));
    
  } else if (command === 'schedule') {
    console.log(chalk.yellow('📅 Starting scheduled runs...'));
    startAPI();
    
    // Run full pipeline immediately
    await runFullPipeline();
    
    // Schedule recurring runs
    const INTERVAL = process.env.SCHEDULE_MINUTES || 60;
    console.log(`\n⏰ Next run in ${INTERVAL} minutes`);
    
    setInterval(async () => {
      console.log(`\n${'='.repeat(50)}`);
      await runFullPipeline();
    }, parseInt(INTERVAL) * 60 * 1000);
    
  } else if (command === 'api') {
    startAPI();
    
  } else if (command === 'stats') {
    const stats = getStats();
    console.log(chalk.blue('\n📊 Money Engine Stats:'));
    console.log(`   Total runs: ${stats.totalRuns}`);
    console.log(`   Articles generated: ${stats.articlesGenerated}`);
    console.log(`   Social posts: ${stats.socialPosts}`);
    console.log(`   Last run: ${stats.lastRun || 'never'}`);
    
  } else if (command === 'serve') {
    // Simple static file server for the output directory
    const http = await import('http');
    const fs = await import('fs/promises');
    const path = await import('path');
    const { URL } = await import('url');
    
    const PORT = 8080;
    const OUTPUT_DIR = '../../output';
    
    console.log(chalk.yellow(`\n🌐 Serving site at http://localhost:${PORT}`));
    
    http.createServer(async (req, res) => {
      let urlPath = req.url === '/' ? '/index.html' : req.url;
      const fullPath = path.default.resolve(OUTPUT_DIR, urlPath);
      
      try {
        const content = await fs.default.readFile(fullPath);
        const ext = path.default.extname(fullPath);
        const types = {
          '.html': 'text/html',
          '.xml': 'application/xml',
          '.css': 'text/css',
          '.js': 'application/javascript',
        };
        
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
        res.end(content);
      } catch (e) {
        res.writeHead(404);
        res.end('Not found');
      }
    }).listen(PORT);

  } else {
    // Default: run full pipeline
    console.log(chalk.yellow('\n🚀 Running full money engine pipeline...\n'));
    
    // Start API server in background
    startAPI();
    
    const result = await runFullPipeline();
    
    if (result.success) {
      console.log(chalk.green('\n✅ Money Engine is running!\n'));
      console.log('What was generated:');
      console.log('  📄 output/             - All static site files');
      console.log('  🗺️ output/sitemap.xml  - For search engines');
      console.log('  📰 output/rss.xml       - RSS feed for syndication');
      console.log('  🏠 output/index.html    - Homepage');
      console.log('  📝 output/articles/     - All review articles');
      console.log('\n📡 API available at http://localhost:3456');
      console.log('💡 Deploy to GitHub Pages: git add output && git checkout -b gh-pages && mv output/* . && git add . && git commit -m "deploy" && git push origin gh-pages && git checkout main');
    } else {
      console.log(chalk.red('\n❌ Pipeline failed'));
    }
  }
}

main().catch(err => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});
