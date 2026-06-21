#!/usr/bin/env python3
"""Money Engine v2.0 — Live Publishing Pipeline"""
import json, os, sys, time, re
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / 'output'
SITE_URL = os.getenv('SITE_URL', 'https://mree9527.github.io/liuliangrukou')

def load_env():
    env_file = Path(__file__).parent.parent / '.env'
    env = {}
    if env_file.exists():
        for line in open(env_file):
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip()
    return env

ENV = load_env()

ASIN_MAP_FILE = OUTPUT_DIR / 'asin-product-map.json'
with open(ASIN_MAP_FILE) as f:
    ASIN_MAP = json.load(f)

CATEGORY_SUB = {
    'Laptops': ('r/laptops', 0.7, True),
    'Keyboards': ('r/mechanicalkeyboards', 0.95, True),
    'Headphones': ('r/headphones', 0.8, True),
    'Earbuds': ('r/headphones', 0.6, True),
    'Monitors': ('r/monitors', 0.7, True),
    'Mice': ('r/BudgetA11y', 0.85, True),
    'Webcams': ('r/webcams', 0.9, True),
    'Smart Speakers': ('r/smarthome', 0.6, False),
    'SSDs': ('r/datahoarding', 0.75, True),
    'Fitness Equipment': ('r/fitness', 0.5, False),
    'Kitchen Gadgets': ('r/cooking', 0.4, False),
    'Coffee Makers': ('r/Coffee', 0.85, True),
    'Security Cameras': ('r/homesecurity', 0.9, True),
    'Garden Tools': ('r/gardening', 0.85, True),
    'Office Supplies': ('r/BudgetA11y', 0.7, False),
    'Travel Gear': ('r/travel', 0.5, False),
    'Cameras': ('r/cameras', 0.8, True),
    'Speakers': ('r/audiophile', 0.7, False),
    'Fitness Trackers': ('r/fitness', 0.4, False),
    'Home Automation': ('r/smarthome', 0.6, False),
}

def log(level, msg):
    ts = time.strftime('%H:%M:%S')
    print(f'[{ts}] [{level}] {msg}')

def publish_reddit_posts(max_count=3):
    reddit_dir = OUTPUT_DIR / 'reddit-posts'
    saves_dir = OUTPUT_DIR / 'pending-posts'
    saves_dir.mkdir(exist_ok=True)
    
    use_praw = bool(ENV.get('REDDIT_CLIENT_ID') and ENV.get('REDDIT_CLIENT_SECRET'))
    published_count = 0
    saved_count = 0
    
    if use_praw:
        try:
            import praw
            reddit = praw.Reddit(
                client_id=ENV['REDDIT_CLIENT_ID'],
                client_secret=ENV['REDDIT_CLIENT_SECRET'],
                user_agent='MoneyEngine/1.0',
            )
            
            for json_file in sorted(reddit_dir.glob('*.json'))[:max_count]:
                try:
                    with open(json_file) as f:
                        post = json.load(f)
                    
                    asin = ''
                    seo = post.get('seoUrl', '')
                    m = re.search(r'B[0-9A-Z]{9}', seo)
                    if m:
                        asin = m.group(0)
                    
                    info = ASIN_MAP.get(asin, {})
                    cat = info.get('category', '')
                    sub_tuple = CATEGORY_SUB.get(cat, ('r/BudgetAesthetics', 0.3, False))
                    
                    submission = reddit.subreddit(sub_tuple[0].replace('r/', '')).submit(
                        title=post['title'],
                        selftext=post.get('body', ''),
                    )
                    
                    log("PUBLISHED", f"Reddit: {post['title'][:45]} -> {submission.url}")
                    published_count += 1
                    
                    # Rate limit
                    time.sleep(3)
                except Exception as e:
                    log("ERROR", f"Reddit publish failed: {e}")
                    
        except ImportError:
            log("INFO", "PRAW not installed. pip install praw")
            use_praw = False
    
    if not use_praw or published_count == 0:
        for json_file in sorted(reddit_dir.glob('*.json'))[:max_count - published_count]:
            try:
                with open(json_file) as f:
                    post = json.load(f)
                
                ts_str = time.strftime('%Y%m%d_%H%M%S')
                fname = f'reddit_{os.path.basename(json_file).replace(".json","")}_{ts_str}.txt'
                
                content = (
                    f"# Subreddit: {post.get('subreddit', 'r/BudgetAesthetics')}\n\n"
                    f"# Title:\n{post['title']}\n\n"
                    f"# Body:\n{post.get('body', '')}\n\n"
                    f"# Affiliate Link:\n{post.get('url', SITE_URL + post.get('seoUrl',''))}\n\n"
                    f"# ASIN:\n{re.search(r'B[0-9A-Z]{9}', post.get('seoUrl','') or '').group(0) if re.search(r'B[0-9A-Z]{9}', post.get('seoUrl','') or '') else 'N/A'}\n"
                )
                
                with open(saves_dir / fname, 'w') as f:
                    f.write(content)
                saved_count += 1
                    
            except Exception as e:
                log("ERROR", f"Failed to save {json_file}: {e}")
        
        if saved_count > 0:
            log("INFO", f"Saved {saved_count} Reddit posts for manual posting to pending-posts/")
    
    return published_count, saved_count

def publish_twitter_threads(max_count=2):
    twitter_dir = OUTPUT_DIR / 'twitter-threads'
    saves_dir = OUTPUT_DIR / 'pending-posts'
    saves_dir.mkdir(exist_ok=True)
    
    use_api = bool(ENV.get('TWITTER_BEARER_TOKEN'))
    published_count = 0
    saved_count = 0
    
    if use_api:
        try:
            import requests
            
            headers = {
                'Authorization': f'Bearer {ENV["TWITTER_BEARER_TOKEN"]}',
                'Content-Type': 'application/json',
            }
            
            for tf in sorted(twitter_dir.glob('*.txt'))[:max_count]:
                with open(tf) as f:
                    content = f.read()
                
                # Extract hook tweet from thread
                lines = content.split('\n')
                hook_lines = []
                for line in lines:
                    if 'TWEET' in line or 'HOOK' in line:
                        continue
                    if '---' in line:
                        break
                    hook_lines.append(line)
                
                hook_text = '\n'.join(hook_lines).strip()[:280]
                
                try:
                    response = requests.post(
                        'https://api.twitter.com/2/tweets',
                        json={'text': hook_text},
                        headers=headers,
                    )
                    
                    if response.status_code == 201:
                        log("TWEETED", f"Twitter thread started: {tf.name}")
                        published_count += 1
                    else:
                        log("ERROR", f"Twitter failed {tf.name}: {response.status_code} - {response.text[:50]}")
                except Exception as e:
                    log("ERROR", f"Twitter error {tf.name[:30]}: {e}")
                    
                time.sleep(2)
                
        except ImportError:
            log("INFO", "requests not installed. pip install requests")
            use_api = False
    
    if not use_api or published_count == 0:
        for tf in sorted(twitter_dir.glob('*.txt'))[:max_count - published_count]:
            ts_str = time.strftime('%Y%m%d_%H%M%S')
            fname = f'twitter_{tf.stem}_{ts_str}.txt'
            
            with open(tf) as f:
                content = f.read()
            
            header = (f"# Twitter Thread: {tf.name}\n\n"
                      f"Copy-paste each section in sequence:\n\n{content}")
            
            with open(saves_dir / fname, 'w') as f:
                f.write(header)
            saved_count += 1
        
        if saved_count > 0:
            log("INFO", f"Saved {saved_count} Twitter threads for manual posting to pending-posts/")
    
    return published_count, saved_count

def publish_medium_articles(max_count=2):
    medium_dir = OUTPUT_DIR / 'medium-export'
    saves_dir = OUTPUT_DIR / 'pending-posts'
    saves_dir.mkdir(exist_ok=True)
    
    use_api = bool(ENV.get('MEDIUM_SESSION_ID'))
    published_count = 0
    saved_count = 0
    
    if use_api:
        try:
            import requests
            
            headers = {
                'Content-Type': 'application/json',
                'X-Medium-Secret': ENV['MEDIUM_SESSION_ID'],
            }
            
            for af in sorted(medium_dir.glob('*.html'))[:max_count]:
                with open(af) as f:
                    data = json.load(f)
                
                title = data.get('title', '')[:120]
                body = data.get('body', str(data))[:50000]
                tags = data.get('tags', [])[:3]
                
                payload = {
                    'title': title,
                    'contentFormat': 'html',
                    'content': body,
                    'tags': tags,
                    'publishStatus': 'public',
                    'canonicalUrl': SITE_URL,
                }
                
                try:
                    response = requests.post(
                        'https://medium.com/m/developers/publish',
                        json=payload,
                        headers=headers,
                    )
                    
                    if response.status_code in (200, 201):
                        log("MEDIUM PUBLISHED", f"{title[:45]}")
                        published_count += 1
                    else:
                        log("ERROR", f"Medium failed {title[:30]}: HTTP {response.status_code}")
                except Exception as e:
                    log("ERROR", f"Medium error {af.name[:20]}: {e}")
                
                time.sleep(2)
                
        except ImportError:
            log("INFO", "requests not installed. pip install requests")
            use_api = False
    
    if not use_api or published_count == 0:
        for af in sorted(medium_dir.glob('*.html'))[:max_count - published_count]:
            ts_str = time.strftime('%Y%m%d_%H%M%S')
            fname = f'medium_{os.path.basename(af).replace(".html","")}_{ts_str}.json'
            
            with open(af) as f:
                data = json.load(f)
            
            data['site_url'] = SITE_URL
            data['publish_date'] = time.strftime('%Y-%m-%d %H:%M')
            data['note'] = 'Copy body content to Medium editor and paste as HTML'
            
            with open(saves_dir / fname, 'w') as f:
                json.dump(data, f, indent=2)
            saved_count += 1
        
        if saved_count > 0:
            log("INFO", f"Saved {saved_count} Medium articles for manual publishing to pending-posts/")
    
    return published_count, saved_count

def run_live_pipeline(dry_run=True):
    log("INFO", "=" * 60)
    log("INFO", "Money Engine v2.0 — Live Publishing Pipeline")
    log("INFO", f"Site: {SITE_URL} | Dry Run: {'Yes' if dry_run else 'No'}")
    log("INFO", "=" * 60)
    
    # Show available credentials
    for k in ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET']:
        val = ENV.get(k, '')
        log("INFO", f"  {k}: {'<set>' if val else '<empty - will save for manual posting>'}")
    
    for k in ['TWITTER_BEARER_TOKEN']:
        val = ENV.get(k, '')
        log("INFO", f"  {k}: {'<set>' if val else '<empty - will save for manual posting>'}")
    
    for k in ['MEDIUM_SESSION_ID']:
        val = ENV.get(k, '')
        log("INFO", f"  {k}: {'<set>' if val else '<empty - will save for manual posting>'}")
    
    log("INFO", "=" * 60)
    log("INFO", "PHASE 1: Reddit Posts")
    log("INFO", "=" * 60)
    pub, saved = publish_reddit_posts(max_count=3)
    
    log("INFO", "=" * 60)
    log("INFO", "PHASE 2: Twitter Threads")
    log("INFO", "=" * 60)
    pub_t, saved_t = publish_twitter_threads(max_count=2)
    
    log("INFO", "=" * 60)
    log("INFO", "PHASE 3: Medium Articles")
    log("INFO", "=" * 60)
    pub_m, saved_m = publish_medium_articles(max_count=2)
    
    total_saved = saved + saved_t + saved_m
    total_pub = pub + pub_t + pub_m
    
    log("INFO", "=" * 60)
    log("INFO", "RESULT")
    log("INFO", "=" * 60)
    log("INFO", f"Published via API: {total_pub}")
    log("INFO", f"Saved for manual posting: {total_saved}")
    
    if total_saved > 0:
        save_dir = OUTPUT_DIR / 'pending-posts'
        log("INFO", f"\nCheck {save_dir} for files to post manually")
    
    log("INFO", "\nRun with --live flag: python3 publish_live.py --live")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Money Engine Live Publisher')
    parser.add_argument('--live', action='store_true', help='Publish using API credentials')
    args = parser.parse_args()
    run_live_pipeline(dry_run=not args.live)
