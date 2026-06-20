import axios from 'axios';

// Reddit API now requires specific headers for scraping
export async function scrapeRedditTrending() {
  const subreddits = [
    'r/BudgetAesthetics', 'r/SimpleLiving', 'r/goodfinds',
    'r/AmazonFind', 'r/tipofmytongue', 'r/buyitforlife'
  ];
  
  const trending = [];
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
  
  for (const sub of subreddits) {
    try {
      const res = await axios.get(
        `https://www.reddit.com/r/${sub}/hot.json?limit=10`,
        { 
          headers: { 
            'User-Agent': userAgent,
            'Accept': 'application/json'
          } 
        },
        { timeout: 15000 }
      );
      
      if (res.data?.data?.children) {
        for (const child of res.data.data.children) {
          const post = child.data;
          trending.push({
            title: post.title,
            url: `https://reddit.com${post.permalink}`,
            subreddit: sub,
            score: post.score,
            comments: post.num_comments,
            selfText: post.selftext?.substring(0, 500) || '',
            extractedProducts: extractProductNames(post.title + ' ' + (post.selftext || '')),
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.log(`[trending] Reddit scrape failed for ${sub}:`, e.message);
    }
  }
  
  return trending;
}

// Scrape Twitter/X trending topics via Nitter
export async function scrapeTwitterTrends() {
  try {
    const res = await axios.get(
      'https://nitter.privacydev.net/explore',
      { headers: { 'User-Agent': 'MoneyEngine/1.0' } },
      { timeout: 15000 }
    );
    
    if (res.data) {
      // Extract trending hashtags/topics from Nitter HTML
      const $ = require('cheerio').load(res.data);
      const trends = [];
      $('a[href*="/search?q=%23"]').each((_, el) => {
        trends.push($(el).text().trim());
      });
      return [...new Set(trends)].slice(0, 10);
    }
  } catch (e) {
    // Nitter might be down, that's ok
  }
  
  return [];
}

// Scrape HackerNews for trending tech products
export async function scrapeHackerNews() {
  try {
    const res = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { timeout: 10000 }
    );
    
    const ids = (res.data || []).slice(0, 20);
    const stories = [];
    
    for (const id of ids) {
      try {
        const storyRes = await axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          { timeout: 5000 }
        );
        
        if (storyRes.data?.title && ['text', 'show'].includes(storyRes.data.type)) continue;
        
        stories.push({
          title: storyRes.data?.title || '',
          url: storyRes.data?.url || '',
          score: storyRes.data?.score || 0,
          comments: storyRes.data?.descendants || 0,
          timestamp: new Date().toISOString()
        });
      } catch (e) {}
    }
    
    return stories;
  } catch (e) {
    console.log('[trending] HackerNews failed:', e.message);
    return [];
  }
}

// Extract product names from text
export function extractProductNames(text) {
  const keywords = [
    'laptop', 'keyboard', 'mouse', 'headphones', 'earbuds', 'webcam',
    'monitor', 'hub', 'charger', 'cable', 'stand', 'desk', 'chair',
    'camera', 'microphone', 'speaker', 'tablet', 'phone', 'watch',
    'printer', 'scanner', 'router', 'ssd', 'ram', 'processor',
    'app', 'software', 'tool', 'service', 'platform',
    'Amazon', 'Apple', 'Samsung', 'Sony', 'Bose', 'Anker',
    'Logitech', 'Corsair', 'Razer', 'Keychron', 'Ugreen',
    'iPhone', 'iPad', 'MacBook', 'AirPods', 'Echo', 'Pixel',
    'Tesla', 'Dyson', 'Nintendo', 'PS5', 'Steam Deck'
  ];
  
  const found = [];
  for (const kw of keywords) {
    if (text.toLowerCase().includes(kw.toLowerCase())) {
      found.push(kw);
    }
  }
  return [...new Set(found)];
}

// Discover trending affiliate products via Reddit comments
export async function findAffiliateProducts() {
  try {
    const res = await axios.get(
      'https://www.reddit.com/r/AmazonFind/hot.json?limit=25',
      { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        timeout: 15000 
      }
    );
    
    const products = [];
    
    if (res.data?.data?.children) {
      for (const child of res.data.data.children) {
        const post = child.data;
        const links = extractAmazonLinks(post.title + ' ' + (post.selftext || ''));
        
        if (links.length > 0) {
          products.push({
            name: post.title,
            amazonUrls: links,
            score: post.score,
            subreddit: 'r/AmazonFind',
            url: `https://reddit.com${post.permalink}`,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return products;
  } catch (e) {
    console.log('[trending] Affiliate product search failed:', e.message);
    return [];
  }
}

// Extract Amazon URLs from text
function extractAmazonLinks(text) {
  const urls = [];
  const amazonRegex = /https?:\/\/(www\.)?amazon\.[a-z.]+\/.*(?:dp|gp\/product)\/[A-Z0-9]{10}/g;
  let match;
  while ((match = amazonRegex.exec(text)) !== null) {
    urls.push(match[0]);
  }
  return [...new Set(urls)];
}

export async function discoverTrendingContent() {
  const [reddit, hackernews] = await Promise.all([
    scrapeRedditTrending(),
    scrapeHackerNews(),
  ]);
  
  return { 
    reddit: reddit.slice(0, 15), 
    hackernews: hackernews.filter(s => s.score >= 100).slice(0, 10) 
  };
}
