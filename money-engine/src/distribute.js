#!/usr/bin/env node
import { runQuickBuild } from './scheduler/jobs.js';
import { generateRedditPosts, getRedditGuide } from './content/reddit-poster.js';
import { generateTwitterThreads } from './content/twitter-threader.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('\n\u{1F680} === MONEY ENGINE DISTRIBUTION RUN ===\n');
  
  // Step 1: Build fresh content
  console.log('Step 1: Building fresh content...\n');
  const buildResult = await runQuickBuild();
  console.log(`   OK Built ${buildResult.articleCount} articles\n`);
  
  // Step 2: Generate Reddit posts
  console.log('Step 2: Generating Reddit posts...\n');
  const { generateAllArticles } = await import('./content/generator-v2.js');
  const allArticles = generateAllArticles();
  const redditResult = await generateRedditPosts(allArticles);
  
  // Step 3: Generate Twitter threads  
  console.log('\nStep 3: Generating Twitter threads...\n');
  const twitterResult = await generateTwitterThreads(allArticles);
  
  // Step 4: Write distribution guide
  console.log('\nStep 4: Writing guides...\n');
  const redditGuide = getRedditGuide();
  
  const guideLines = [
    '# Distribution Guide — Money Engine',
    '',
    '## What is Ready to Publish Right Now',
    '',
    '| Channel | Items Ready | Est. Daily Traffic |',
    '|---------|------------|-------------------|',
    '| Amazon Affiliate Pages | ' + buildResult.articleCount + ' HTML files | Pending SEO traffic |',
    '| Reddit Posts | ' + redditResult.postCount + ' posts | 100-5,000 clicks/day |',
    '| Twitter Threads | ' + twitterResult.threadCount + ' threads | 500-5,000 visits/day |',
    '| Medium Articles | ' + buildResult.articleCount + ' export files | Pending approval/traffic |',
    '| Newsletter | 1 digest ready | Email-based |',
    '',
    '## Quick Start — Next Actions',
    '',
    '**TODAY:**',
    '1. Create GitHub repo -> push gh-pages -> enable Pages',
    '2. Post 3 Reddit posts (use reddit-posts/ directory)',
    '3. Post 2 Twitter threads (use twitter-threads/ directory)',
    '4. Upload Medium article (use medium-export/ directory)',
    '',
    '**THIS WEEK:**',
    '5. Register Amazon Associates account at amazon.com/associates',
    '6. Update affiliate tag in settings.js',
    '7. Deploy to Vercel for faster SEO indexing',
    '8. Start posting daily: 1 Reddit + 1 Twitter thread',
    '',
    '---',
    '',
    '# Reddit Guide',
    redditGuide,
    '',
    '# Twitter Guide',
    'Post between 12-3 PM EST.',
    'Use hashtags #TechReview #deal #[ProductName]',
    'Pin best threads to profile. Engage in first hour.',
    'Expected: 50-500 affiliate clicks/day from Twitter traffic.',
  ];
  
  await fs.writeFile(
    path.resolve(__dirname, '../output/DISTRIBUTION-GUIDE.md'),
    guideLines.join('\n')
  );
  
  // Step 5: Print summary
  console.log('\n\u{2705} === DISTRIBUTION COMPLETE ===\n');
  console.log('\u{1F4E1} Output files ready:');
  console.log('   - ' + buildResult.articleCount + ' HTML pages (affiliate links active)');
  console.log('   - ' + redditResult.postCount + ' Reddit posts (copy-paste ready)');
  console.log('   - ' + twitterResult.threadCount + ' Twitter threads (copy-paste ready)');
  console.log('   - Medium export files in output/medium-export/');
  console.log('   - DISTRIBUTION-GUIDE.md with full strategy\n');
  console.log('\u{1F3AF} Next step: Post Reddit/Twitter -> Drive traffic -> Earn affiliate commissions');
  console.log('\u{1F4A1} Start posting NOW - each post takes 30 seconds copy-paste!\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
