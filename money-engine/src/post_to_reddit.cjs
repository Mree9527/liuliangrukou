const puppeteer = require('puppeteer');

async function postToReddit() {
  console.log('🚀 Starting Reddit auto-poster...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  // Go to Reddit login
  console.log('1. Logging into Reddit...');
  await page.goto('https://www.reddit.com/login', { waitUntil: 'networkidle0' });
  
  // Fill in credentials from .env (using sample values)
  const username = process.env.REDDIT_USERNAME || 'SmartBuyGuide2026';
  const password = process.env.REDDIT_PASSWORD || 'SmartBuy123!';
  
  // Wait for login form
  await page.waitForSelector('#loginUsername', { timeout: 15000 }).catch(() => {});
  await page.type('#loginUsername', username, { delay: 50 });
  await page.type('#loginPassword', password, { delay: 50 });
  
  // Click login button - try multiple selectors
  const loginBtn = await page.$('button[type="submit"]') || await page.$('#loginButton');
  if (loginBtn) {
    await loginBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
  }
  
  // Check if logged in (look for user avatar)
  const isLoggedIn = await page.$('#headerLoggedIn') !== null;
  console.log(`   Login status: ${isLoggedIn ? '✅ Logged in' : '⏳ May need manual login'}`);
  
  // Load Reddit posts data
  const fs = require('fs');
  const path = require('path');
  
  const redditDir = path.join(__dirname, '..', 'output', 'reddit-posts');
  const jsonFiles = fs.readdirSync(redditDir).filter(f => f.endsWith('.json'));
  
  let postsPosted = 0;
  
  for (const file of jsonFiles) {
    const filePath = path.join(redditDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Handle array format or single object
    const items = JSON.parse(content);
    const posts = Array.isArray(items) ? items : [items];
    
    for (const post of posts) {
      if (!post.readyToPost && !post.title) continue;
      
      const subreddit = post.subreddit || '';
      const title = post.title || '';
      const body = post.body || '';
      
      // Skip if no subreddit
      if (!subreddit || !title) continue;
      
      // Go to subreddit's submit page
      try {
        await page.goto(`https://www.reddit.com/r/${subreddit.replace('r/', '')}/submit`, { 
          waitUntil: 'networkidle0',
          timeout: 10000 
        }).catch(() => null);
        
        // Wait for title input and fill it
        await page.waitForSelector('#title', { timeout: 5000 }).catch(() => {
          // Some subs use different selectors
          console.log(`   ⏭️ Skipped ${subreddit} - couldn't find submit form`);
        });
        
        if (await page.$('#title')) {
          await page.type('#title', title, { delay: 30 });
          await page.waitForTimeout(500);
          
          // Switch to advanced editor for body content
          const advancedBtn = await page.$('button[class*="AdvancedEditorButton"]') || 
                             await page.$('[data-testid="advanced-editor-button"]');
          if (advancedBtn) {
            await advancedBtn.click();
            await page.waitForTimeout(1000);
          }
          
          // Fill body in markdown editor or rich text
          const textArea = await page.$('textarea') || await page.$('[data-testid="post-text"]');
          if (textArea) {
            await textArea.evaluate(el => el.value = '');
            await page.waitForTimeout(300);
            // Type the body content
            for (const char of body.substring(0, 500)) { // Limit to avoid timeout
              await page.keyboard.type(char, { delay: 1 });
            }
          } else {
            // Try the old-style post text area
            try {
              await page.click('[id*="post-text"]', { clickCount: 3 });
              await page.keyboard.press('Backspace');
              await page.keyboard.type(body.substring(0, 500), { delay: 1 });
            } catch (e) {
              console.log(`   ⏭️ Skipped ${subreddit} - couldn't fill body`);
              continue;
            }
          }
          
          // Click submit
          await page.waitForTimeout(1000);
          const submitBtn = await page.$('button[type="submit"]') || await page.$('[data-testid="submit-button"]');
          if (submitBtn) {
            await submitBtn.click();
            await page.waitForTimeout(2000);
            postsPosted++;
            console.log(`   ✅ Posted to ${subreddit}: "${title.substring(0, 50)}..."`);
          }
        }
      } catch (err) {
        console.log(`   ⏭️ Failed on ${subreddit}: ${err.message.substring(0, 60)}`);
      }
      
      // Small delay between posts
      await page.waitForTimeout(1500);
    }
  }
  
  await browser.close();
  console.log(`\n✅ Done! Posted ${postsPosted} posts to Reddit.`);
  console.log('💡 Tip: Check your Reddit account to confirm posts went through.');
}

postToReddit().catch(console.error);
