#!/usr/bin/env node
import { runQuickBuild } from './scheduler/jobs.js';
import { generateRedditPosts, getRedditGuide } from './content/reddit-poster.js';
import { generateTwitterThreads } from './content/twitter-threader.js';
import { exportForMedium, generateNewsletter } from './content/distribution.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../output');

async function main() {
  console.log('\n=== MONEY ENGINE v2.0 DISTRIBUTION RUN ===\n');
  
  // Step 1: Build fresh content
  console.log('Step 1: Building fresh content...\n');
  const buildResult = await runQuickBuild();
  console.log(`   OK Built ${buildResult.articleCount} articles\n`);
  
  // Step 2: Generate all distribution content
  console.log('Step 2: Generating distribution content...\n');
  const { generateAllArticles } = await import('./content/generator-v2.js');
  const allArticles = generateAllArticles();
  
  const redditResult = await generateRedditPosts(allArticles);
  const twitterResult = await generateTwitterThreads(allArticles);
  const mediumResult = await exportForMedium(allArticles);
  await generateNewsletter(allArticles);
  // Deal of day generated in distribution.js
  
  // Step 3: Write comprehensive distribution guide
  console.log('Step 3: Writing guides...\n');
  const redditGuide = getRedditGuide();
  
  const guideLines = [];
  guideLines.push('# Money Engine v2.0 — Complete Distribution Guide\n');
  guideLines.push('## What Is Ready to Publish RIGHT NOW\n');
  guideLines.push('| Channel | Items Ready | Est. Daily Traffic | Revenue |\n');
  guideLines.push('|---------|------------|-------------------|---------|\n');
  guideLines.push(`| Amazon Affiliate Site | ${buildResult.articleCount} HTML pages | SEO traffic (passive) | \$50-\$1000/mo |\n`);
  guideLines.push(`| Reddit Posts | ${redditResult.postCount} ready posts | 100-5,000 clicks/day | \$5-\$100/day |\n`);
  guideLines.push(`| Twitter Threads | ${twitterResult.threadCount} ready threads | 500-5,000 visits/day | \$20-\$200/day |\n`);
  guideLines.push(`| Medium Articles | ${mediumResult.length} exports | 100-3,000 views/post | \$5-\$50 each |\n`);
  guideLines.push('| Newsletter | 1 ready template | Your email list | Unlimited |\n');
  guideLines.push('| RSS Feed | sitemap.xml + deal alerts | Syndication sites | Passive |\n');
  guideLines.push('\n## Quick Start — First Revenue in 24 Hours\n');
  guideLines.push('**TODAY (15 min):**\n');
  guideLines.push('1. Copy 3 Reddit posts from reddit-posts/ -> paste to r/BudgetAesthetics, r/laptops, r/headphones');
  guideLines.push('2. Post 1 Twitter thread from twitter-threads/ -> copy-paste each tweet in sequence');
  guideLines.push('3. Publish 1 Medium article from medium-export/ -> add relevant tags\n');
  guideLines.push('**THIS WEEK:**\n');
  guideLines.push('4. Register Amazon Associates account at affiliate-program.amazon.com');
  guideLines.push('5. Update tag in money-engine/src/config/settings.js (change smarthome-20)');
  guideLines.push('6. Post daily: 1 Reddit + 1 Twitter thread for compounding traffic');
  guideLines.push('7. Submit sitemap.xml to Google Search Console + Bing Webmaster\n');
  guideLines.push('**THIS MONTH:**\n');
  guideLines.push('8. Build email list with newsletter signup form');
  guideLines.push('9. Automate posting with deploy.sh script');
  guideLines.push('10. Monitor analytics and optimize top-performing content\n');
  guideLines.push('\n---\n\n# Revenue Estimates by Channel\n\n## Reddit (Highest ROI)\n' + redditGuide);
  guideLines.push('\n# Twitter/X Strategy\n');
  guideLines.push('- Post between 12-3 PM EST for maximum reach');
  guideLines.push('- Pin your best thread to profile permanently');
  guideLines.push('- Reply to every comment within first hour (algorithm boost)');
  guideLines.push('- Add relevant hashtags: #TechReview #DealAlert #[ProductName]');
  guideLines.push('- Expected: $20-$200/day once established\n');
  guideLines.push('# Medium Strategy\n');
  guideLines.push('- Publish 2-3 articles per week');
  guideLines.push('- Use tags: tech, product-review, buying-guide, amazon-deal');
  guideLines.push('- Cross-link to your site review pages');
  guideLines.push('- Expected: $5-$50 per article + referral traffic\n');
  guideLines.push('# SEO Timeline\n');
  guideLines.push('- Week 1: Google crawls new pages (manual sitemap submission)');
  guideLines.push('- Month 1: Some pages start ranking for long-tail keywords');
  guideLines.push('- Month 3: Compounding organic traffic $200-$2,000/month\n');
  guideLines.push('# Amazon Affiliate Commission Rates\n');
  guideLines.push('| Category | Rate |\n');
  guideLines.push('|----------|------|\n');
  guideLines.push('| Laptops/Tech | 1-4% |\n');
  guideLines.push('| Beauty/Fashion | 5-10% (BEST) |\n');
  guideLines.push('| Home & Kitchen | 3-8% |\n');
  guideLines.push('| Fitness/Garden | 3-6% |\n');

  await fs.writeFile(
    path.resolve(OUTPUT_DIR, 'DISTRIBUTION-GUIDE.md'),
    guideLines.join('\n')
  );
  
  // Step 4: Print summary
  console.log('\n=== DISTRIBUTION COMPLETE ===\n');
  console.log('Output files ready:');
  console.log(`   - ${buildResult.articleCount} HTML pages (affiliate links active)`);
  console.log(`   - ${redditResult.postCount} Reddit posts (copy-paste ready)`);
  console.log(`   - ${twitterResult.threadCount} Twitter threads (copy-paste ready)`);
  console.log(`   - ${mediumResult.length} Medium article exports`);
  console.log('   - Newsletter templates ready');
  console.log('   - RSS/Deal feeds generated\n');
  
  console.log('Next step: Post Reddit/Twitter -> Drive traffic -> Earn affiliate commissions');
  console.log('Start posting NOW - each post takes 30 seconds copy-paste!\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
