import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), '..', 'output', 'pending-posts');
const TWITTER_DIR = path.join(process.cwd(), '..', '..', 'twitter-threads');

// High-priority subreddits sorted by engagement potential
const SUBREDDIT_PRIORITY = [
  { name: 'budgeta11y', filePattern: 'reddit_daily_budgeta11y' },
  { name: 'mechanicalkeyboards', filePattern: 'reddit_daily_mechanicalkeyboards' },
  { name: 'laptops', filePattern: 'reddit_daily_laptops' },
  { name: 'headphones', filePattern: 'reddit_daily_headphones' },
  { name: 'tech', filePattern: 'reddit_daily_tech' }
];

function parseRedditFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  
  let subreddit = '', title = '', body = '';
  let inBody = false;
  
  for (const line of lines) {
    if (line.startsWith('SUBREDDIT:')) subreddit = line.substring(10).trim();
    else if (line.startsWith('TITLE:')) title = line.substring(6).trim();
    else if (inBody) body += line + '\n';
    else if (line.trim() === '') inBody = true;
  }
  
  return { subreddit, title, body };
}

function generateTwitterThread(productId, product) {
  const thread = `🧵 THREAD: ${product.name} - Best value in 2026?

After testing dozens of products, here's my honest take.

⭐ Rating: ${product.rating}/5 · ${product.reviews} reviews

✅ PROS:
${product.pros.slice(0,3).map(p => '• ' + p).join('\n')}

❌ CONS:
${(product.cons || []).slice(0,2).map(c => '• ' + c).join('\n')}

💰 PRICE: ${product.price}

🛒 Check current deal with countdown timer:
https://mree9527.github.io/liuliangrukou/money-engine/output/deals/electronics/deal-alert-${productId}.html

#TechDeals #AmazonFinds #ProductReview`;
  return thread;
}

console.log('\n🚀 AUTO POSTER - Starting up...\n');

// Count files ready to post
const redditFiles = fs.readdirSync(POSTS_DIR).filter(f => f.startsWith('reddit_') && f.endsWith('.txt'));
const twitterFiles = fs.readdirSync(TWITTER_DIR).filter(f => f.endsWith('.txt'));

console.log(`📁 Reddit posts ready: ${redditFiles.length}`);
console.log(`🐦 Twitter threads ready: ${twitterFiles.length}\n`);

// Generate post summary
console.log('🔥 TOP POSTS TO PUBLISH TODAY:\n');

SUBREDDIT_PRIORITY.forEach(sp => {
  const file = redditFiles.find(f => f.includes(sp.filePattern) && f.includes('_deal.txt'));
  if (file) {
    const data = parseRedditFile(path.join(POSTS_DIR, file));
    console.log(`📊 r/${sp.name}`);
    console.log(`   ${data.title.substring(0,60)}...`);
    console.log(`   Link: https://mree9527.github.io/liuliangrukou/...\n`);
  }
});

// Sample Twitter posts
console.log('🐦 TWITTER THREADS:');
twitterFiles.slice(0, 3).forEach(f => {
  const thread = fs.readFileSync(path.join(TWITTER_DIR, f), 'utf8');
  console.log(`   ${f} - Check product review`);
});
console.log('');

console.log('💡 INSTRUCTIONS:');
console.log('1. Open each .txt file in pending-posts/');
console.log('2. Copy the title + body');
console.log('3. Paste to Reddit (wait 30min between posts)');
console.log('4. Do same for twitter-threads/*.txt\n');

// Total potential value
const estimatedValue = redditFiles.length * 5 + twitterFiles.length * 10; // $5 per Reddit post, $10 per Twitter thread
console.log(`💰 POTENTIAL DAILY VALUE: ~$${estimatedValue}`);

