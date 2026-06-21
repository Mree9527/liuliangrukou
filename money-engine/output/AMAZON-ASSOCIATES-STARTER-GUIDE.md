# 🚀 Amazon Associates Starter Guide

## Step 1: Register for Amazon Associates

**Go to**: https://affiliate-program.amazon.com/

### Requirements:
- Valid email address
- Website URL (your GitHub Pages site is ready!)
- Phone number for verification

### What to say when asked about your website:
```
I run a tech product review and deal comparison website that helps 
customers find the best gadgets at the right prices. 
My site features honest reviews, comparisons, and daily deals.
```

---

## Step 2: Get Your Amazon Affiliate Tag

After approval, you'll get a unique affiliate tag.

**Current configuration in settings.js:**
```javascript
affiliateTag: 'smarthome-20'  // Update this after registration!
```

### How to update:
1. Open `money-engine/src/config/settings.js`
2. Replace `'smarthome-20'` with your actual affiliate tag
3. Run: `cd money-engine && node src/distribute.js`
4. Redeploy to GitHub Pages

---

## Step 3: Start Posting (Already Set Up!)

### Reddit Posts Ready:
```
money-engine/output/pending-posts/reddit_*.txt
- 104 files ready to copy-paste
```

### Twitter Threads Ready:
```
twitter-threads/*.txt
- 62 files with countdown urgency
```

---

## Step 4: Track Your Earnings

**Amazon Associates Dashboard**: https://affiliate-program.amazon.com/earnings

### What to look for:
- **Click-through rate (CTR)**: How many people click your links
- **Conversion rate**: How many clicks turn into sales
- **Average order value**: How much customers spend per order

---

## Step 5: Optimize for More Earnings

### Monday-Friday Daily Posts:
```
Reddit: 3 posts/day across different subreddits
Twitter: 1 thread/day with countdown urgency

Files in money-engine/output/pending-posts/
```

### Weekly SEO Content:
- Blog posts targeting long-tail keywords
- Comparison pages for high-intent searches
- Medium articles for backlinks and SEO

---

## Important: Amazon Policies

✅ **Allowed**:
- Include affiliate links in reviews and comparisons
- Add disclosure statement: "I earn commission at no extra cost"
- Use countdown timers to create urgency

❌ **Not Allowed**:
- Click your own affiliate links (fraud)
- Pay for clicks (bidding on affiliate links)
- Hide disclosures from users

---

## Quick Start Checklist:

- [ ] Register at https://affiliate-program.amazon.com/
- [ ] Get your affiliate tag
- [ ] Update `settings.js` with your tag
- [ ] Regenerate content: `node src/distribute.js`
- [ ] Deploy to GitHub Pages: `git push origin gh-pages`
- [ ] Copy Reddit posts and post to subreddits (30min apart)
- [ ] Share Twitter threads daily
- [ ] Submit sitemap to Google Search Console

---

**Start posting now - your first commission is waiting!**
