import axios from 'axios';

// Scrape trending tech topics from Hacker News
export async function scrapeHackerNews() {
  try {
    const res = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { timeout: 15000 }
    );
    
    if (!res.data) return [];
    
    const ids = res.data.slice(0, 30);
    const stories = [];
    
    // Fetch first few stories to find tech products
    const batchSize = 5;
    for (let i = 0; i < Math.min(ids.length, batchSize); i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const promises = batch.map(id => 
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 })
          .then(r => r.data).catch(() => null)
      );
      
      const results = await Promise.all(promises);
      for (const story of results) {
        if (!story || !story.title) continue;
        
        // Look for product mentions in title
        const productKeywords = [
          'laptop', 'keyboard', 'mouse', 'phone', 'tablet', 'monitor', 
          'camera', 'speaker', 'headphones', 'airpods', 'macbook', 'ipad',
          'ps5', 'switch', 'steam', 'chrome', 'iphone', 'android',
          'AI', 'software', 'app', 'device', 'gadget', 'tech'
        ];
        
        const hasProduct = productKeywords.some(kw => 
          story.title.toLowerCase().includes(kw.toLowerCase())
        );
        
        if (hasProduct && story.score >= 50) {
          stories.push({
            title: story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            score: story.score,
            comments: story.descendants || 0,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return stories.sort((a,b) => b.score - a.score).slice(0, 20);
  } catch (e) {
    console.log(`  [trending] HackerNews failed:`, e.message.split('\n')[0]);
    return [];
  }
}

// Scrape Google Trends via RSS feed
export async function scrapeGoogleTrends() {
  try {
    const res = await axios.get(
      'https://trends.google.com/trends/explore?geo=US&q=laptop,keyboards,mice',
      { headers: { 'User-Agent': 'MoneyEngine/1.0' }, timeout: 15000 }
    );
    return []; // Google Trends requires JS rendering, skip for now
  } catch (e) {
    return [];
  }
}

// Extract product keywords from text
export function extractProductNames(text) {
  const keywords = [
    'laptop', 'keyboard', 'mouse', 'headphones', 'earbuds', 'webcam',
    'monitor', 'hub', 'charger', 'desk', 'chair', 'ssd',
    'iPad', 'MacBook', 'AirPods', 'Echo', 'Pixel', 'Nintendo',
    'PS5', 'Steam Deck', 'Logitech', 'Anker', 'Samsung', 'Sony',
    'MacBook', 'Bose', 'JBL', 'Keychron', 'Redragon', 'Corsair'
  ];
  
  const found = [];
  for (const kw of keywords) {
    if (text.toLowerCase().includes(kw.toLowerCase())) {
      found.push(kw);
    }
  }
  return [...new Set(found)];
}

// Extract Amazon links from text
function extractAmazonLinks(text) {
  const urls = [];
  const regex = /https?:\/\/(www\.)?amazon\.[a-z.]+\/.*(?:dp|gp\/product)\/[A-Z0-9]{10}/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    urls.push(match[0]);
  }
  return [...new Set(urls)];
}

export async function discoverTrendingContent() {
  const [hn] = await Promise.all([
    scrapeHackerNews(),
  ]);
  return { hackernews: hn };
}

// Save trending data to output directory
export async function saveTrendingData(content) {
  const fs = (await import('fs')).default;
  const path = (await import('path')).default;
  
  try {
    const trending = {
      timestamp: new Date().toISOString(),
      hackernews: content.hackernews || [],
    };
    
    const outDir = path.resolve('../../output/trending');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'trends.json'), JSON.stringify(trending, null, 2));
  } catch (e) {
    // Non-critical
  }
}
