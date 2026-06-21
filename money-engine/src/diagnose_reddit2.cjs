const puppeteer = require('puppeteer');

async function diagnose() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  // Test mobile Reddit which has simpler UI
  console.log('=== MOBILE REDDIT m.reddit.com/r/mechanicalkeyboards/submit ===');
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)');
  
  await page.goto('https://m.reddit.com/r/mechanicalkeyboards/submit/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('URL:', await page.url());
  console.log('Title:', await page.title());
  
  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, textarea, [role="textbox"]')).map(el => ({
      tag: el.tagName,
      id: el.id,
      name: el.name || 'no-name',
      type: el.type || 'text'
    }));
  });
  
  console.log('\nMobile found elements:', elements.length);
  elements.forEach(el => console.log(JSON.stringify(el)));
  
  // Check for iframes
  const iframes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('iframe')).map(f => f.src || 'no-src');
  });
  console.log('\nIframes:', iframes.length, iframes.slice(0,3));
  
  await browser.close();
}

diagnose().catch(console.error);
