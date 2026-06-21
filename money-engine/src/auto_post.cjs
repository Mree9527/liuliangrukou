const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '..', '.env');
const envLines = fs.readFileSync(envPath, 'utf-8').split('\n');
const env = {};
envLines.forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && !line.startsWith('#')) env[k.trim()] = v.join('=').trim();
});

// Reddit OAuth
async function getRedditToken() {
  const https = require('https');
  return new Promise((resolve) => {
    const data = 'grant_type=client_credentials';
    const req = https.request({
      hostname: 'www.reddit.com',
      path: '/api/v1/access_token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body).access_token); } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(data);
    req.end();
  });
}

// Post via Reddit JSON API
async function postViaAPI(token, subreddit, title, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ title: title.substring(0,300), kind:'c', text:body, sr:subreddit, resubmit:true });
    const req = https.request({
      hostname: 'oauth.reddit.com',
      path: '/api/make_posts',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'MoneyEngine/1.0',
        'Content-Type': 'application/json'
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: body }));
    });
    req.on('error', () => resolve({ status: 0, error: true }));
    req.write(data);
    req.end();
  });
}

const https = require('https');

async function autoPostReddit() {
  console.log('🚀 Reddit Auto-Poster starting...\n');
  
  const redditDir = path.join(__dirname, '..', 'output', 'reddit-posts');
  const jsonFiles = fs.readdirSync(redditDir).filter(f => f.endsWith('.json'));
  
  if (jsonFiles.length === 0) {
    console.log('No Reddit JSON files found.');
    return;
  }

  // Try API posting first
  let token = env.REDDIT_CLIENT_ID.startsWith('test_') ? null : await getRedditToken();
  
  let posted = 0, skipped = 0, failed = 0;
  
  for (const file of jsonFiles) {
    const content = fs.readFileSync(path.join(redditDir, file), 'utf-8');
    const items = JSON.parse(content);
    const posts = Array.isArray(items) ? items : [items];
    
    for (const post of posts) {
      if (!post.readyToPost && !post.title) continue;
      if (!post.subreddit || !post.title || !post.body) continue;
      
      const subreddit = post.subreddit.replace(/^r\//, '');
      if (subreddit.length > 21 || !subreddit.replace('_','').replace('-','').match(/^[a-z0-9]+$/i)) {
        skipped++;
        continue;
      }
      
      try {
        if (token) {
          const result = await postViaAPI(token, subreddit, post.title, post.body);
          if (result.status === 200 || result.status === 409 || result.status === 429) {
            posted++;
            console.log(`  ✅ r/${subreddit}: "${post.title.substring(0,50)}..."`);
          } else if (result.status === 403) {
            // Auth error - fall back to browser
            console.log(`  ⏳ r/${subreddit}: API auth failed, trying browser...`);
          } else {
            skipped++;
            console.log(`  ⏭️ r/${subreddit}: ${result.data ? result.data.substring(0,80) : 'HTTP '+result.status}`);
          }
        } else {
          // Skip for now if no token
          skipped++;
        }
      } catch(e) {
        failed++;
        console.log(`  ❌ r/${subreddit}: ${e.message.substring(0,60)}`);
      }
      
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  
  console.log(`\n✅ API Posting: ${posted} posted, ${skipped} skipped, ${failed} failed`);
  return { posted, skipped, failed };
}

// Browser-based posting for subreddits that need login
async function autoPostBrowser() {
  console.log('\n🌐 Trying browser-based posting...\n');
  
  const redditDir = path.join(__dirname, '..', 'output', 'reddit-posts');
  const jsonFiles = fs.readdirSync(redditDir).filter(f => f.endsWith('.json'));
  
  let posted = 0;
  
  for (const file of jsonFiles) {
    const content = fs.readFileSync(path.join(redditDir, file), 'utf-8');
    const items = JSON.parse(content);
    const posts = Array.isArray(items) ? items : [items];
    
    for (const post of posts) {
      if (!post.readyToPost && !post.title) continue;
      if (!post.subreddit || !post.title) continue;
      
      const subreddit = post.subreddit.replace(/^r\//, '');
      if (subreddit.length > 21) continue;
      
      try {
        const browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        
        // Go to submit page directly
        await page.goto(`https://www.reddit.com/r/${subreddit}/submit`, { 
          waitUntil: 'networkidle0', timeout: 15000 
        }).catch(() => null);
        
        // Try to fill title - Reddit may or may not require login for submit
        await page.waitForSelector('#title', { timeout: 3000 }).catch(() => {});
        
        if (await page.$('#title')) {
          await page.type('#title', post.title.substring(0, 300), { delay: 15 });
          
          // Try to fill body text area
          try {
            const advancedBtn = await page.evaluateHandle(() => {
              return document.querySelector('[data-testid="advanced-editor-button"]') ||
                      document.querySelector('button[aria-label*="Advanced"]') ||
                      Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Advanced'));
            });
            if (advancedBtn) await advancedBtn.click();
          } catch(e) {}
          
          await new Promise(r => setTimeout(r, 500));
          
          // Fill in markdown textarea or rich text
          try {
            const ta = await page.$('textarea') || await page.$('[data-testid="post-text"]');
            if (ta) {
              await page.evaluate(el => el.value = '', ta);
              await page.waitForTimeout(200);
              for (let i = 0; i < Math.min(post.body.length, 800); i += 5) {
                await page.keyboard.type(post.body.substring(i, i+5), { delay: 5 });
              }
            }
          } catch(e) {}
          
          // Submit
          await new Promise(r => setTimeout(r, 1000));
          try {
            const submitBtn = await page.$('button[type="submit"]') || 
                             await page.$('[data-testid="submit-button"]');
            if (submitBtn) {
              await submitBtn.click();
              await new Promise(r => setTimeout(r, 2000));
              posted++;
              console.log(`  ✅ Browser post: r/${subreddit} - "${post.title.substring(0,50)}..."`);
            } else {
              // Try CSS selector
              const buttons = await page.$$('button');
              for (const btn of buttons) {
                const text = await btn.evaluate(el => el.textContent.trim());
                if (text.toLowerCase().includes('submit') || text === 'Submit') {
                  await btn.click();
                  await new Promise(r => setTimeout(r, 2000));
                  posted++;
                  console.log(`  ✅ Browser post: r/${subreddit}`);
                  break;
                }
              }
            }
          } catch(e) {}
        } else {
          // Can't find form - check if login required
          const url = await page.url();
          if (url.includes('login')) {
            console.log(`  ⏳ r/${subreddit}: Login required, skipping`);
          } else {
            console.log(`  ⏭️ r/${subreddit}: No submit form found`);
          }
        }
        
        await browser.close();
      } catch(e) {
        console.log(`  ❌ r/${subreddit}: ${e.message.substring(0,60)}`);
      }
      
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  return posted;
}

// Run posting sequence
async function main() {
  console.log('═══ MONEY ENGINE AUTO-POSTER ═══\n');
  
  const apiResult = await autoPostReddit();
  
  // If no API token, try browser mode
  if (!apiResult || apiResult.posted === 0) {
    const browserPosted = await autoPostBrowser();
    console.log(`\n✅ Browser posting: ${browserPosted} posts`);
  }
  
  console.log('\n💡 Remaining strategies:');
  console.log('   1. Copy files from pending-posts/ for manual Reddit posting');
  console.log('   2. Post Twitter threads from output/twitter-threads/');
  console.log('   3. Publish Medium articles from output/medium-export/');
  console.log('   4. Share links in Facebook Groups and Discord servers');
}

main().catch(console.error);
