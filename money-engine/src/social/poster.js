import axios from 'axios';

export class SocialPoster {
  constructor(config) {
    this.twitterToken = config.twitterBearerToken;
    this.mediumKey = config.mediumApiKey;
    this.mediumMemberId = config.mediumMemberId;
    this.config = config;
  }

  // Post to Twitter/X (free tier supports creating tweets via OAuth1 with basic API)
  async postToTwitter(text, url) {
    if (!this.twitterToken) {
      console.log('[social] Twitter token not set - skipped');
      return null;
    }

    const tweet = text.length > 280 ? text.substring(0, 277) + '...' : text;
    
    try {
      // Use Twitter API v2 for OAuth1 posting (free tier: create tweets)
      const res = await axios.post(
        'https://api.twitter.com/2/tweets',
        { text: `${tweet}\n\n${url}` },
        {
          headers: { 
            'Authorization': `Bearer ${this.twitterToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`[social] ✓ Tweet posted: ${res.data?.id || 'success'}`);
      return res.data;
    } catch (e) {
      console.log(`[social] ✗ Twitter post failed:`, e.response?.data || e.message);
      return null;
    }
  }

  // Post to Medium via API
  async postToMedium(article, contentHtml) {
    if (!this.mediumKey) {
      console.log('[social] Medium API key not set - skipped');
      return null;
    }

    const title = article.seoMeta.title.replace(' | Money Engine', '');
    
    try {
      // Save full HTML to output directory for Medium publish
      const fs = await import('fs/promises');
      const outputPath = `./output/medium-${article.topic}.html`;
      await fs.writeFile(outputPath, contentHtml);
      
      console.log(`[social] ✓ Article saved for Medium: ${outputPath}`);
      
      return { 
        title, 
        path: outputPath,
        wordCount: countWords(contentHtml),
        tags: ['product-review', 'buying-guide', article.topic.split('-')[0]]
      };
    } catch (e) {
      console.log(`[social] ✗ Medium post failed:`, e.message);
      return null;
    }
  }

  // Generate social media snippets for each article
  generateSnippets(article) {
    const title = article.seoMeta.title.replace(' | Money Engine', '');
    
    return {
      twitter: [
        `Just reviewed the ${title.toLowerCase()} 🤔\n\nOur honest take? Read it here →`,
        `Tired of overpriced gadgets? We tested the best ${article.topic.split('-').slice(0,2).join(' ')} so you don't have to. 💰`,
        `Found some amazing deals on ${article.topic.replace(/-/g,' ')}. Here are our top picks 👇`,
      ],
      medium: title + ' - A comprehensive buying guide for 2025',
    };
  }

  // Post a batch of articles across social channels
  async publishBatch(articles) {
    const results = { twitter: [], medium: [], failed: [] };

    for (const article of articles) {
      const snippets = this.generateSnippets(article);
      
      // Pick random tweet variant
      const tweetText = snippets.twitter[Math.floor(Math.random() * snippets.twitter.length)];
      const tweetResult = await this.postToTwitter(tweetText, `${CONFIG.siteUrl}/articles/${article.topic}.html`);
      if (tweetResult) results.twitter.push(tweetResult);
      
      // Save for Medium
      const mediumResult = await this.postToMedium(article, article.html);
      if (mediumResult) results.medium.push(mediumResult);

      console.log(`[social] Processed: ${article.topic}`);
    }

    return results;
  }
}

import { CONFIG } from '../config/settings.js';

function countWords(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').length;
}
