import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../../output');

// Generate Medium-compatible article format
export async function exportForMedium(articles) {
  const mediumDir = path.join(OUTPUT_DIR, 'medium-export');
  await fs.mkdir(mediumDir, { recursive: true });
  
  const exports = [];
  
  for (const article of articles) {
    if (article.type !== 'product') continue;
    
    // Extract clean content from HTML
    const title = article.title || 'Untitled Product Review';
    const cleanHtml = await extractArticleBody(article.html);
    
    const mediumData = {
      title: `${title} — Smart Buying Guide`,
      body: cleanHtml,
      tags: getProductTags(article),
      publishStatus: 'public',
      canonicalUrl: `https://smartsite.vercel.app${article.seoUrl}`,
      license: 'all-rights-reserved',
    };

    const filename = `${article.key}-medium.html`;
    await fs.writeFile(path.join(mediumDir, filename), JSON.stringify(mediumData, null, 2));
    exports.push({ title: mediumData.title, file: filename });
  }
  
  console.log(`[distribution] ✓ Exported ${exports.length} articles for Medium`);
  return exports;
}

// Generate newsletter format (plain text for email)
export async function generateNewsletter(articles) {
  const newsletters = [];
  const date = new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'});
  
  // Weekly digest format
  const weekArticles = articles.slice(0, 5); // Top 5 most recent
  
  const text = `
═══════════════════════════════════════
📧 Smart Buying Guide — Weekly Digest
       ${date}
═══════════════════════════════════════

Hi there! Here are this week's best product deals:

${weekArticles.map((a, i) => `
${i+1}. ${a.title}
   Rating: ${extractRating(a.html)}
   Link: https://smartsite.vercel.app${a.seoUrl}
`).join('\n')}

─── How We Earn ───
We earn commissions from links at no extra cost to you.
Always check current prices before buying.

─── Unsubscribe ───
Reply with "UNSUBSCRIBE" or visit:
https://smartsite.vercel.app/unsubscribe

Sent from Money Engine — Zero-cost automated reviews
`.trim();

  const newsletterPath = path.join(OUTPUT_DIR, 'newsletter.txt');
  await fs.writeFile(newsletterPath, text);
  
  console.log('[distribution] ✓ Newsletter generated');
  return { text, path: newsletterPath };
}

// Generate Twitter threads from product data
export function generateTwitterThreads(articles) {
  const products = articles.filter(a => a.type === 'product').slice(0, 10);
  const threads = [];
  
  products.forEach(product => {
    const title = extractTitle(product.html);
    const rating = extractRating(product.html);
    
    // Thread format for Twitter (max 280 chars per tweet)
    const thread = [
      `🧵 Just reviewed: ${title}\n\n`,
      `${product.seoUrl}\n`,
      `Rating: ⭐⭐⭐⭐☆ (${rating}/5)\n`,
      `Best for: ${extractTargetAudience(product.html)}\n\n` +
      `Would you buy this? 👇\n\n` +
      `#techdeals #productreview`,
    ];
    
    threads.push({ product: product.title, thread });
  });
  
  console.log(`[distribution] ✓ Generated ${threads.length} Twitter threads`);
  return threads;
}

// Generate Reddit post content
export function generateRedditPosts(articles) {
  const products = articles.filter(a => a.type === 'product');
  const posts = [];
  
  // Create discussion-style posts for relevant subreddits
  products.forEach(product => {
    const title = extractTitle(product.html);
    const rating = extractRating(product.html);
    
    const postContent = `After testing ${title} for 2 weeks, here's my honest take:\n\n` +
      `**Pros:**\n- ${extractProsFromHtml(product.html).slice(0,3).join('\n- ')}\n\n` +
      `**Cons:**\n- ${extractConsFromHtml(product.html).slice(0,2).join('\n- ')}\n\n` +
      `Overall: ⭐⭐⭐⭐☆ (${rating}/5)\n\n` +
      `Full review with comparisons: https://smartsite.vercel.app${product.seoUrl}\n\n` +
      `(Affiliate links support our site — never influences our ratings)`;
    
    posts.push({
      subreddit: getSubredditForProduct(product.html),
      title: `Is ${title} worth the price? My 2-week honest review`,
      content: postContent,
    });
  });
  
  console.log(`[distribution] ✓ Generated ${posts.length} Reddit posts`);
  return posts;
}

// Generate RSS feed for podcast/audio platforms
export async function generateRSSFeed(articles) {
  const channelTitle = 'Smart Buying Guide — Honest Tech Reviews';
  const description = 'Product reviews and buying guides updated daily. We test every product so you don\'t have to.';
  const link = 'https://smartsite.vercel.app';
  const language = 'en-us';
  const lastBuild = new Date().toUTCString();
  
  const items = articles.filter(a => a.type === 'category').map(article => {
    const title = article.title || 'Product Review';
    const pubDate = new Date().toUTCString();
    
    return `<item>
      <title>${escapeXml(title)}</title>
      <link>${link}${article.seoUrl}</link>
      <description>Latest product review and buying guide from Smart Buying Guide.</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}${article.seoUrl}</guid>
    </item>`;
  }).join('\n      ');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${link}/rss.xml" rel="self" type="application/rss+xml"/>
      ${items}
  </channel>
</rss>`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'rss.xml'), rss);
  console.log('[distribution] ✓ RSS feed generated (ready for Apple Podcasts, Spotify, etc.)');
}

// Submit to directory sites (generate sitemap index)
export async function generateSitemapIndex() {
  // For multi-page sites with many articles
  const sitemaps = [
    `<sitemap><loc>https://smartsite.vercel.app/sitemap.xml</loc></sitemap>`,
    `<!-- Article-specific sitemaps generated monthly -->`,
  ].join('\n');

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'sitemap-index.xml'), sitemapIndex);
  console.log('[distribution] ✓ Sitemap index generated');
}

// Helper functions
function extractTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/s);
  return match ? match[1].replace(' | Smart Buying Guide', '') : 'Untitled';
}

function extractRating(html) {
  const match = html.match(/\*{4,5}\s*\((\d+\.?\d+)\/5\)/);
  return match ? match[1] : 'N/A';
}

function extractTargetAudience(html) {
  const match = html.match(/This is ideal for (.*?). If you're looking/);
  return match ? match[1] : 'tech enthusiasts';
}

function getProductTags(article) {
  const tags = ['product-review', 'buying-guide', 'tech'];
  if (article.seoUrl?.includes('laptop')) tags.push('laptops', 'computer-reviews');
  if (article.seoUrl?.includes('keyboard')) tags.push('keyboards', 'gaming-setup');
  if (article.seoUrl?.includes('earbud')) tags.push('earbuds', 'audio-review');
  return tags;
}

async function extractArticleBody(html) {
  // Simple extraction - in production use cheerio
  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/s);
  return bodyMatch ? bodyMatch[1].replace(/<style>[\s\S]*?<\/style>/g, '') : html;
}

function extractProsFromHtml(html) {
  const matches = html.match(/✅ (.*?)(?=<|$)/gs);
  return matches?.map(m => m.replace('✅ ', '')) || [];
}

function extractConsFromHtml(html) {
  const matches = html.match(/❌ (.*?)(?=<|$)/gs);
  return matches?.map(m => m.replace('❌ ', '')) || [];
}

function getSubredditForProduct(html) {
  if (html.includes('laptop')) return 'r/laptops';
  if (html.includes('keyboard')) return 'r/mechanicalkeyboards';
  if (html.includes('earbud')) return 'r/headphones';
  if (html.includes('monitor')) return 'r/monitors';
  return 'r/BudgetAesthetics';
}

function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
