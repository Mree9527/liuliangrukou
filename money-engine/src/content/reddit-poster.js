import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.resolve(__dirname, '../../output');

function extractRating(html) {
  const match = html.match(/\*{4,5}\s*\((\d+\.?\d+)\/5\)/);
  return match ? match[1] : 'N/A';
}

function getSubredditForCategory(seoUrl) {
  if (seoUrl.includes('laptop')) return 'r/laptops';
  if (seoUrl.includes('keyboard')) return 'r/mechanicalkeyboards';
  if (seoUrl.includes('earbud')) return 'r/headphones';
  if (seoUrl.includes('monitor')) return 'r/monitors';
  if (seoUrl.includes('mouse')) return 'r/BudgetA11y';
  if (seoUrl.includes('headphone')) return 'r/headphones';
  if (seoUrl.includes('ssd')) return 'r/datahoarding';
  if (seoUrl.includes('beauty') || seoUrl.includes('cerave') || seoUrl.includes('niacinamide')) return 'r/SkincareAddiction';
  if (seoUrl.includes('coffee')) return 'r/Coffee';
  if (seoUrl.includes('camera')) return 'r/cameras';
  if (seoUrl.includes('speaker')) return 'r/audiophile';
  if (seoUrl.includes('webcam')) return 'r/workfromhome';
  if (seoUrl.includes('fitness') || seoUrl.includes('bowflex')) return 'r/fitness';
  if (seoUrl.includes('garden') || seoUrl.includes('aerogarden')) return 'r/houseplants';
  if (seoUrl.includes('kitchen') || seoUrl.includes('blender')) return 'r/knives';
  if (seoUrl.includes('travel')) return 'r/travel';
  return 'r/BudgetAesthetics';
}

function getPostTitle(title, rating) {
  if (rating !== 'N/A') {
    const starNum = parseFloat(rating);
    if (starNum >= 4) return `After testing ${title} (${rating}/5), here are my honest thoughts`;
    return `${title}: Is it worth the hype? (${rating}/5)`;
  }
  return `${title} — Detailed review & buying guide`;
}

function getPostBody(article, affiliateLink) {
  // Extract pros/cons from HTML by parsing <li> tags in pros-list/cons-list
  const cleaned = article.html.replace(/<style>[\s\S]*?<\/style>/g, '');
  const prosMatch = [];
  const consMatch = [];
  // Match all <li> inside pros-list or cons-list containers
  const ulMatch = cleaned.match(/<ul class="(pros|cons)-list">(.*?)<\/ul>/gs);
  if (ulMatch) {
    for (const ul of ulMatch) {
      const liItems = ul.match(/<li>(.*?)<\/li>/g);
      if (liItems) {
        for (const item of liItems) {
          const text = item.replace(/<[^>]*>/g, '').trim();
          const type = ul.includes('pros') ? 'pro' : 'con';
          if (type === 'pro') prosMatch.push(text);
          else consMatch.push(text);
        }
      }
    }
  }
  
  let body = `**${article.title}**\n\n`;
  
  // Add a brief intro
  if (article.intro) {
    body += article.intro.substring(0, 200).replace(/<[^>]*>/g, '') + '...\n\n';
  }
  
  if (prosMatch?.length > 0) {
    body += `**What I liked:**\n`;
    prosMatch.slice(0, 3).forEach(p => { body += `- ${p}\n`; });
    body += '\n';
  }
  
  if (consMatch?.length > 0) {
    body += `**What could be better:**\n`;
    consMatch.slice(0, 2).forEach(c => { body += `- ${c}\n`; });
    body += '\n';
  }
  
  body += `---\nFull comparison + current deals: ${affiliateLink}\n\n*(I earn a small commission if you buy through the link, at no extra cost to you)*`;
  return body;
}

export async function generateRedditPosts(articles) {
  const redditDir = path.join(OUTPUT_DIR, 'reddit-posts');
  await fs.mkdir(redditDir, { recursive: true });
  
  let count = 0;
  const posts = [];
  
  // Filter for product and comparison articles only
  const targetArticles = articles.filter(a => 
    (a.type === 'product' || a.type === 'comparison') && 
    !a.key.includes('pros-cons') &&  // Skip pros-cons, post review or vs instead
    !a.key.includes('-vs-')  // Skip head-to-head comparisons for main posts
  );
  
  // Sort by rating (higher first)
  const sorted = targetArticles.slice(0, 20).sort((a, b) => {
    const ra = parseFloat(extractRating(a.html)) || 0;
    const rb = parseFloat(extractRating(b.html)) || 0;
    return rb - ra;
  });
  
  for (const article of sorted) {
    const rating = extractRating(article.html);
    const subreddit = getSubredditForCategory(article.seoUrl);
    const title = getPostTitle(article.title, rating);
    
    // Build affiliate link - use the full smartsite URL
    const affiliateLink = `https://smartsite.vercel.app${article.seoUrl}`;
    const body = getPostBody(article, affiliateLink);
    
    const postData = {
      subreddit,
      title,
      body,
      url: affiliateLink,
      articleKey: article.key,
      seoUrl: article.seoUrl,
      tags: [`${article.type}-review`, 'affiliate'],
      readyToPost: true,
    };
    
    const filename = `${article.key}-reddit.json`;
    await fs.writeFile(path.join(redditDir, filename), JSON.stringify(postData, null, 2));
    posts.push({ ...postData, file: filename });
    count++;
  }
  
  // Also generate "Top 5" list posts (these perform well on Reddit)
  const categories = ['laptops', 'keyboards', 'earbuds', 'monitors', 'mice', 
                       'headphones', 'webcams', 'speakers', 'ssds', 'coffee'];
  
  for (const cat of categories.slice(0, 5)) {
    const catArticles = articles.filter(a => 
      a.type === 'comparison' && article.seoUrl?.includes(cat)
    );
    
    if (catArticles.length > 0) {
      const title = `I compared ${catArticles.length} ${cat} — here's what actually matters`;
      const subreddit = getSubredditForCategory(`/${cat}`);
      
      let body = `I went through ${catArticles.length} detailed comparisons and found some surprising patterns:\n\n`;
      
      catArticles.slice(0, 5).forEach((a, i) => {
        const rating = extractRating(a.html);
        body += `${i+1}. **${a.title.replace(' comparison', '').replace(' Review', '')}** (${rating}/5)\n`;
      });
      
      body += `\n---\nFull breakdown on my site:\nhttps://smartsite.vercel.app/categories/${cat}.html\n\n*(Links are affiliate links)*`;
      
      const postData = {
        subreddit,
        title,
        body,
        url: `https://smartsite.vercel.app/categories/${cat}.html`,
        seoUrl: `/categories/${cat}.html`,
        tags: ['list-post', `${cat}`, 'affiliate'],
        readyToPost: true,
      };
      
      const filename = `${cat}-reddit-thread.json`;
      await fs.writeFile(path.join(redditDir, filename), JSON.stringify(postData, null, 2));
      posts.push({ ...postData, file: filename });
      count++;
    }
  }
  
  console.log(`[reddit] ✓ Generated ${count} Reddit posts (${sorted.length} product reviews + ${Math.min(5,categories.length)} list threads)`);
  return { postCount: count, posts };
}

export function getRedditGuide() {
  return `
# Reddit Posting Strategy Guide

## Best Practices for Affiliate Posts on Reddit

### Timing
- Post between 6-9 AM EST (when US audience is waking up)
- Avoid posting on weekends for tech subreddits
- Fresh accounts: post 2-3x/day, established: 1-2x/day

### Subreddit Rules Checklist
| Subreddit | Affiliate Link Rule | Best Content Type |
|-----------|-------------------|-------------------|
| r/laptops | Must disclose in post | Comparison threads |
| r/mechanicalkeyboards | No affiliate links in title | "My experience" posts |
| r/headphones | Must use spoiler tags for deals | Review breakdowns |
| r/SkincareAddiction | Be personal, not salesy | Ingredient analysis |
| r/BudgetA11y | Price must be in title | Deal alerts |

### Avoid Getting Banned
1. Never post the same article twice
2. Use Reddit's built-in spoiler tag: >!deal alert<$ /$! for price mentions
3. Always include "affiliate link" disclosure
4. Engage with comments (reply within 2 hours)
5. Mix promotional posts with genuine discussion posts

### Expected Traffic
- Good post on active subreddit: 100-1,000 upvotes → 50-500 site clicks
- Viral post (1k+): 500-3,000 site clicks
- Typical affiliate conversion rate: 2-5% of clicks

## Posting Schedule (Recommended)
Day 1: Post 2 product reviews to tech subreddits
Day 2: Post comparison thread + deal alert
Day 3: Post skincare/garden post (non-tech categories)
Day 4: Reply to comments on previous posts + post new review
Day 5: Post "top deals this week" list article
Day 6-7: Rest / engage with community

Check reddit-posts/ directory for all generated posts - each is copy-paste ready!
`;
}
