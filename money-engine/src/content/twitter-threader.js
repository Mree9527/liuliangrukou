import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.resolve(__dirname, '../../output');

export async function generateTwitterThreads(articles) {
  const threadDir = path.join(OUTPUT_DIR, 'twitter-threads');
  await fs.mkdir(threadDir, { recursive: true });
  
  // Pick top review articles for threading
  const reviews = articles.filter(a => 
    a.type === 'product' && !a.key.includes('deal') && !a.key.includes('vs')
  ).slice(0, 15);
  
  let totalThreads = 0;
  
  for (const article of reviews) {
    // Create a Twitter thread: product name is the hook
    const productName = article.title.split(' ').slice(0, 4).join(' ');
    
    // Extract key points from HTML
    // Strip style to avoid CSS matches, parse <li> tags directly
    const cleaned = article.html.replace(/<style>[\s\S]*?<\/style>/g, '');
    const prosMatch = [];
    const consMatch = [];
    const ulM = cleaned.match(/<ul class="(pros|cons)-list">(.*?)<\/ul>/gs);
    if (ulM) {
      for (const ul of ulM) {
        const items = ul.match(/<li>(.*?)<\/li>/g);
        if (items) {
          for (const item of items) {
            const text = item.replace(/<[^>]*>/g, '').trim();
            if (ul.includes('pros')) prosMatch.push(text);
            else consMatch.push(text);
          }
        }
      }
    }
    
    const url = `https://smartsite.vercel.app${article.seoUrl}`;
    const threadFilename = `${article.key}-thread.txt`;
    
    // Thread structure: 5-8 tweets
    let thread = `TWEET 1 (HOOK):\n🚨 Just finished testing ${productName}...\n\nThe results surprised me.\n\nHere's my honest breakdown ↓\n\n${url}\n\n---\n\n`;
    
    thread += `TWEET 2 (INTRO):\n${productName}\n\nRating: ${article.html.match(/\*{4,5}\s*\((\d+\.?\d+)\/5\)/)?.[1] || 'N/A'}/5\n\nLet's break it down:\n\n`;
    
    thread += `TWEET 3 (PROS):\n✅ PROS:\n`;
    if (prosMatch) {
      prosMatch.slice(0, 2).forEach(p => {
        thread += `• ${p}\n`;
      });
    }
    
    thread += `\nTWEET 4 (CONS):\n❌ CONS:\n`;
    if (consMatch) {
      consMatch.slice(0, 2).forEach(c => {
        thread += `• ${c}\n`;
      });
    }
    
    thread += `\nTWEET 5 (VERDICT):\n${productName} is worth it IF:\n\n✅ You want [key benefit]\n✅ Your budget allows it\n\nSkip if you need [alternative use case].\n\nFull review + deals: ${url}\n`;
    
    thread += `\nTWEET 6 (CALL TO ACTION):\n📊 Got the full breakdown + current deals on my site!\n\nLink in bio 🔗\n\nFollow for more honest tech reviews every week 🙌`;
    
    await fs.writeFile(path.join(threadDir, threadFilename), thread);
    totalThreads++;
  }
  
  // Also generate deal alert threads (these get high engagement)
  const deals = articles.filter(a => a.key.includes('-deal') && a.type === 'product');
  for (const deal of deals.slice(0, 5)) {
    const threadFile = `${deal.key}-deal-thread.txt`;
    
    let thread = `TWEET 1 (DEAL ALERT):\n🔥 DEAL ALERT\n\n${deal.title}\n\nWas: $XXX → Now: $XX\n\nThis is the lowest price I've seen in months 👇\n\n---\n\n`;
    
    thread += `TWEET 2 (WHAT YOU GET):\nWhat you get for $XX:\n\n• [Key feature 1]\n• [Key feature 2]\n• [Key feature 3]\n\nNormally sells for $XXX+ 🤯\n\n`;
    
    thread += `TWEET 3 (LINK + COUNTDOWN):\n⏰ Deal won't last long!\n\nGrab it before it's gone:\n${deal.seoUrl}\n\n📌 RT to save! ♻️`;
    
    await fs.writeFile(path.join(threadDir, threadFile), thread);
    totalThreads++;
  }
  
  console.log(`[twitter] ✓ Generated ${totalThreads} Twitter threads`);
  return { threadCount: totalThreads };
}

export function getTwitterGuide() {
  return `
# Twitter/X Thread Strategy Guide

## How to Use These Threads

Each file in twitter-threads/ contains a ready-to-post thread (5-8 tweets).

### Posting Tips
1. Post between 12-3 PM EST for maximum reach
2. Add relevant hashtags: #tech #review #deal
3. Pin your best threads to your profile
4. Reply to every comment within the first hour (boosts algorithm)
5. Use thread analytics to track CTR

### Account Strategy
- Create a dedicated "Tech Reviews" account (not personal)
- Bio: "Honest tech reviews | No BS | Links → site.com"
- Pin tweet: Your best review thread with affiliate link
- Post 1-2 threads per day max
- Engage in #TechTwitter conversations for organic reach

### Expected Traffic
- Thread with 100+ likes: 500-5,000 profile visits
- Link in bio clicks: 50-500/day
- Affiliate conversion from Twitter: ~3% of link clicks

### Hashtag Strategy
#TechReview (broad) + #ProductivityTips (niche) + #[ProductName] (specific)

Total threads generated: check twitter-threads/ directory
`;
}
