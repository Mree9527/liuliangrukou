const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load env vars
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valParts] = line.split('=');
      process.env[key.trim()] = valParts.join('=').trim();
    }
  });
}

// Reddit API credentials
const CLIENT_ID = 'test_client_id_xxxxxx';
const CLIENT_SECRET = 'test_secret_yyyyyy';

function redditGet(urlPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'oauth.reddit.com',
      path: urlPath,
      method: 'GET',
      headers: {
        'User-Agent': 'MoneyEngine/1.0',
        'Authorization': `Bearer ${process.env.REDDIT_TOKEN || ''}`,
        ...headers
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve({ raw: data.substring(0, 200) }); }
      });
    }).on('error', reject);
  });
}

function redditPost(urlPath, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'oauth.reddit.com',
      path: urlPath,
      method: 'POST',
      headers: {
        'User-Agent': 'MoneyEngine/1.0',
        'Authorization': `Bearer ${process.env.REDDIT_TOKEN || ''}`,
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 30000
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve({ raw: data.substring(0, 200), status: res.statusCode }); }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('🚀 Reddit Auto-Poster');
  
  // Load all reddit post files
  const redditDir = path.join(__dirname, '..', 'output', 'reddit-posts');
  const jsonFiles = fs.readdirSync(redditDir).filter(f => f.endsWith('.json'));
  
  let posted = 0;
  let failed = 0;
  
  for (const file of jsonFiles) {
    const filePath = path.join(redditDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const items = JSON.parse(content);
    const posts = Array.isArray(items) ? items : [items];
    
    for (const post of posts) {
      if (!post.readyToPost && !post.title) continue;
      if (!post.subreddit || !post.title || !post.body) continue;
      
      const subreddit = post.subreddit.replace(/^r\//, '');
      
      try {
        // Post the content
        const result = await redditPost('/api/make_posts', {
          title: post.title.substring(0, 300),
          kind: 'c',
          text: post.body.substring(0, 10000),
          sr: subreddit,
          resubmit: true
        });
        
        if (result && result.kind === 't5') {
          posted++;
          console.log(`  ✅ Posted to r/${subreddit}: "${post.title.substring(0, 60)}..."`);
        } else {
          // Check for errors
          const errorMsg = result?.message || result?.raw || 'unknown error';
          console.log(`  ⏭️ r/${subreddit}: ${errorMsg.substring(0, 80)}`);
          failed++;
        }
      } catch (err) {
        console.log(`  ❌ r/${subreddit}: ${err.message.substring(0, 60)}`);
        failed++;
      }
      
      await new Promise(r => setTimeout(r, 1500)); // Rate limiting
    }
  }
  
  console.log(`\n✅ Done! Posted: ${posted}, Failed: ${failed}`);
  console.log('💡 Many posts may show "already posted" - that\'s fine for duplicate content.');
}

main().catch(console.error);
