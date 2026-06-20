import axios from 'axios';

export class TwitterPoster {
  constructor(config = {}) {
    this.bearerToken = config.twitterBearerToken || process.env.TWITTER_BEARER_TOKEN || '';
    this.baseURL = 'https://api.twitter.com';
  }

  async postWithBearer(title, url) {
    if (!this.bearerToken) {
      console.log('[twitter] No bearer token - saving to queue');
      return null;
    }
    try {
      const response = await axios.post(
        `${this.baseURL}/2/tweets`,
        { text: `${title}\n${url}` },
        { headers: { 'Authorization': `Bearer ${this.bearerToken}`, 'Content-Type': 'application/json' } }
      );
      console.log(`[twitter] ✓ Tweet posted (ID: ${response.data.id})`);
      return response.data;
    } catch (e) {
      console.log('[twitter] ✗ API post failed:', e.response?.data || e.message.split('\n')[0]);
      return null;
    }
  }

  async saveForManualPosting(title, url, category) {
    const fs = await import('fs/promises');
    const pathModule = await import('path').then(m => m.default || m);
    const tweetQueueDir = pathModule.default.join(pathModule.default.dirname(pathModule.default.fileURLToPath(import.meta.url)), '..', 'output', 'tweet-queue');

    const tweet = JSON.stringify({ title, url, category, posted: false, createdAt: new Date().toISOString() });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const filename = `${Date.now()}-${category}.json`;
    await fs.writeFile(pathModule.default.join(tweetQueueDir, filename), tweet);

    console.log(`[twitter] ✓ Queued for posting: ${filename}`);
    return { queued: true, file: filename };
  }

  async postBatch(articles) {
    const results = { posted: [], queued: [], failed: [] };

    for (const article of articles.filter(a => a.type === 'product').slice(0, 5)) {
      try {
        const title = `Just reviewed: ${article.title}`;
        const result = this.bearerToken ? 
          await this.postWithBearer(title, `https://smartsite.vercel.app${article.seoUrl}`) :
          await this.saveForManualPosting(title, `https://smartsite.vercel.app${article.seoUrl}`, article.title);

        if (result && result.id) results.posted.push({ title: article.title });
        else if (result?.queued) results.queued.push({ title: article.title });
      } catch (e) {
        results.failed.push({ title: article.title, error: e.message.split('\n')[0] });
      }
    }

    console.log(`[twitter] Results: ${results.posted.length} posted | ${results.queued.length} queued | ${results.failed.length} failed`);
    return results;
  }
}
