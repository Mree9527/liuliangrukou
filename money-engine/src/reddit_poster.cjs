const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const redditDir = path.join(__dirname, '..', 'output', 'reddit-posts');
const pendingDir = path.join(__dirname, '..', 'output', 'pending-posts');

// Load env
const envLines = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8').split('\n');
const env = {};
envLines.forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && !line.startsWith('#')) env[k.trim()] = v.join('=').trim();
});

async function main() {
  console.log('🚀 Reddit Auto-Poster — ONE browser session\n');
  
  // Get all JSON posts
  const jsonFiles = fs.readdirSync(redditDir).filter(f => f.endsWith('.json'));
  let allPosts = [];
  
  for (const file of jsonFiles) {
    try {
      const content = fs.readFileSync(path.join(redditDir, file), 'utf-8');
      const items = JSON.parse(content);
      const posts = Array.isArray(items) ? items : [items];
      allPosts.push(...posts.filter(p => p.title && p.body));
    } catch(e) {}
  }
  
  console.log(`Found ${allPosts.length} posts to post`);
  
  // Sort by subreddit (group same subs together for efficiency)
  const grouped = {};
  allPosts.forEach(p => {
    const sub = p.subreddit.replace(/^r\//, '');
    if (!grouped[sub]) grouped[sub] = [];
    grouped[sub].push(p);
  });
  
  console.log(`Across ${Object.keys(grouped).length} unique subreddits\n`);
  
  // Launch ONE browser session
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  let posted = 0;
  let failed = 0;
  let skipped = 0;
  
  for (const [subreddit, posts] of Object.entries(grouped)) {
    // For same subreddit, skip if already posted (Reddit rate limit)
    console.log(`\n📝 Posting to r/${subreddit} (${posts.length} posts)...`);
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      
      // Go to submit page
      const url = `https://www.reddit.com/r/${subreddit}/submit`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
      
      // Wait a moment for the page to load
      await new Promise(r => setTimeout(r, 2000));
      
      // Take screenshot for debugging
      await page.screenshot({ path: path.join(pendingDir, `reddit-${subreddit}.png`) }).catch(() => {});
      
      for (const post of posts) {
        try {
          // Fill title - check multiple selectors for Reddit's dynamic form
          let titleInput = null;
          
          const selectors = ['#title', 'input[name="title"]', '[id*="title"]', 'div[role="textbox"]'];
          for (const sel of selectors) {
            titleInput = await page.$(sel);
            if (titleInput) break;
          }
          
          if (!titleInput) {
            console.log(`  ⏭️ No title input found for r/${subreddit}`);
            failed++;
            continue;
          }
          
          // Type the title
          await titleInput.click();
          await page.waitForTimeout(100);
          const titleText = post.title.substring(0, 300);
          for (let i = 0; i < titleText.length; i += 5) {
            await page.keyboard.type(titleText.substring(i, Math.min(i+5, titleText.length)), { delay: 8 });
          }
          
          // Switch to advanced editor if available
          try {
            const advBtn = await page.evaluateHandle(() => {
              return document.querySelector('[data-testid="advanced-editor-button"]') ||
                      document.querySelector('button[aria-label*="Advanced"]') ||
                      Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Advanced'));
            });
            if (advBtn) await advBtn.click();
            await new Promise(r => setTimeout(r, 1000));
          } catch(e) {}
          
          // Find and fill text area for body content
          const textAreas = await page.$$('textarea');
          if (textAreas.length > 0) {
            await textAreas[0].click();
            await page.waitForTimeout(200);
            await page.keyboard.down('Control');
            await page.keyboard.press('a');
            await page.keyboard.up('Control');
            const bodyText = post.body.substring(0, 10000);
            for (let i = 0; i < Math.min(bodyText.length, 5000); i += 3) {
              await page.keyboard.type(bodyText.substring(i, Math.min(i+3, bodyText.length)), { delay: 2 });
            }
          } else {
            // Try to fill in the markdown editor
            const mdEditor = await page.$('div[data-testid="post-text"]') || 
                            await page.$('textarea[aria-label]');
            if (mdEditor) {
              await mdEditor.click();
              await new Promise(r => setTimeout(r, 200));
              const bodyText = post.body.substring(0, 10000);
              for (let i = 0; i < Math.min(bodyText.length, 5000); i += 3) {
                await page.keyboard.type(bodyText.substring(i, Math.min(i+3, bodyText.length)), { delay: 2 });
              }
            }
          }
          
          // Submit the post
          await new Promise(r => setTimeout(r, 1000));
          
          // Find and click submit button
          const submitBtns = await page.$$('button[type="submit"], button[data-testid*="submit"]');
          let clicked = false;
          
          for (const btn of submitBtns) {
            const text = await btn.evaluate(el => el.textContent.trim());
            if (text.toLowerCase().includes('submit') || text.toLowerCase().includes('post')) {
              await btn.click();
              clicked = true;
              break;
            }
          }
          
          // If no labeled button, try any visible submit button
          if (!clicked && submitBtns.length > 0) {
            await submitBtns[submitBtns.length - 1].click();
            clicked = true;
          }
          
          if (clicked) {
            posted++;
            console.log(`  ✅ Posted: "${post.title.substring(0,45)}..."`);
          } else {
            skipped++;
            console.log(`  ⏭️ No submit button found for this post`);
          }
          
          // Wait for page to refresh and clean up
          await new Promise(r => setTimeout(r, 2000));
          
        } catch(e) {
          failed++;
          console.log(`  ❌ Failed: ${e.message.substring(0,50)}`);
          // Try to go back to submit page
          try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});
          } catch(e2) {}
        }
      }
      
      await page.close();
    } catch(e) {
      console.log(`  ❌ r/${subreddit} browser error: ${e.message.substring(0,60)}`);
    }
    
    // Rate limit between subreddits
    if (Object.keys(grouped).indexOf(subreddit) < Object.keys(grouped).length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  await browser.close();
  
  console.log(`\n═══ RESULTS ═══`);
  console.log(`✅ Successfully posted: ${posted}`);
  console.log(`⏭️ Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\n📸 Debug screenshots saved to: pending-posts/reddit-*.png`);
}

main().catch(console.error);
