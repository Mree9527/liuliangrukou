const puppeteer = require('puppeteer');

async function diagnose() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  
  // Try new Reddit submit
  console.log('=== NEW REDDIT r/mechanicalkeyboards/submit ===');
  await page.goto('https://www.reddit.com/r/mechanicalkeyboards/submit', { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  
  // Dump all input and textarea elements
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, textarea, [role="textbox"], [contenteditable="true"]')).map(el => ({
      tag: el.tagName,
      id: el.id,
      name: el.name,
      type: el.type || null,
      role: el.getAttribute('role'),
      placeholder: el.placeholder || el.textContent?.substring(0,50),
      class: el.className?.substring(0,100) || ''
    }));
  });
  console.log('\nFound elements:', inputs.length);
  inputs.slice(0, 10).forEach(el => console.log(JSON.stringify(el)));
  
  // Dump all buttons with submit-related text
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(el => ({
      text: el.textContent.trim().substring(0,30),
      type: el.type || 'no-type',
      class: el.className?.substring(0,80) || ''
    }));
  });
  console.log('\nButtons:', buttons.length);
  buttons.slice(0, 5).forEach(b => console.log(JSON.stringify(b)));
  
  // Dump page title to confirm we're on the right page
  console.log('\nPage URL:', await page.url());
  console.log('Page title:', await page.title());
  
  // Try old Reddit
  console.log('\n=== OLD REDDIT r/mechanicalkeyboards/submit ===');
  await page.goto('https://old.reddit.com/r/mechanicalkeyboards/submit', { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));
  
  const oldInputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, textarea')).map(el => ({
      tag: el.tagName,
      id: el.id,
      name: el.name,
      type: el.type || null
    }));
  });
  console.log('Old Reddit found elements:', oldInputs.length);
  oldInputs.forEach(el => console.log(JSON.stringify(el)));
  
  await browser.close();
}

diagnose().catch(console.error);
