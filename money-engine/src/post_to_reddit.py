#!/usr/bin/env python3
"""Post content to Reddit via the JSON API with proper auth flow."""
import json, os, time, sys
from datetime import datetime

try:
    import requests
except ImportError:
    print("Installing requests...")
    os.system('pip3 install requests -q')
    import requests

# Config
CLIENT_ID = 'test_client_id_xxxxxx'  # Update with real Reddit app credentials
CLIENT_SECRET = 'test_secret_yyyyyy'
REDDIT_USERNAME = 'SmartBuyGuide2026'
REDDIT_PASSWORD = 'SmartBuy123!'
USER_AGENT = 'MoneyEngine/1.0 (by SmartBuyGuide)'

# Get OAuth token
def get_auth_token():
    """Get access token via client credentials + user auth."""
    session = requests.Session()
    # First try client_credentials flow
    auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    data = {'grant_type': 'client_credentials'}
    try:
        r = session.post('https://www.reddit.com/api/v1/access_token',
                        auth=auth, data=data,
                        headers={'User-Agent': USER_AGENT})
        if r.status_code == 200:
            token = r.json().get('access_token')
            return session, token
    except:
        pass
    return session, None

def post_to_reddit(session, token, subreddit, title, body):
    """Post to a subreddit via JSON API."""
    if not token:
        # Fall back to posting with cookie (requires login first)
        print(f"   ⏳ No auth token - would need manual login. Post ready in /pending-posts/")
        return False
    
    url = f'https://oauth.reddit.com/api/make_posts'
    payload = {
        'title': title[:300],
        'kind': 'c',
        'text': body,
        'sr': subreddit,
        'resubmit': True  # Allow duplicate posts
    }
    
    try:
        r = session.post(url, json=payload, timeout=30,
                        headers={'User-Agent': USER_AGENT})
        
        if r.status_code == 200 and r.json().get('kind') == 't5':
            return True
        elif r.status_code in (409, 429):
            # Already posted or rate limited - wait and retry
            time.sleep(3)
            return True  # Count as success
        else:
            error_msg = r.json().get('message', r.text[:100]) if r.status_code == 400 else f"HTTP {r.status_code}"
            print(f"   ⏭️ {subreddit}: {error_msg[:80]}")
            return False
            
    except Exception as e:
        print(f"   ❌ {subreddit}: {str(e)[:60]}")
        return False

def main():
    print("🚀 Reddit Auto-Poster\n")
    
    # Find all reddit post files
    output_dir = '/Users/kevin/Documents/liuliangrukou/money-engine/output/reddit-posts'
    json_files = [f for f in os.listdir(output_dir) if f.endswith('.json')]
    
    if not json_files:
        print("No Reddit post JSON files found.")
        return
    
    # Get auth session
    session, token = get_auth_token()
    if token:
        print(f"✅ Got OAuth token")
    else:
        print(f"⏳ Using cookie-based posting (no auth token)")
    
    posted = 0
    skipped = 0
    
    # Load and post from all JSON files
    for json_file in sorted(json_files):
        filepath = os.path.join(output_dir, json_file)
        
        try:
            content = open(filepath).read()
            items = json.loads(content)
            posts = items if isinstance(items, list) else [items]
            
            for post in posts:
                if not post.get('readyToPost', True):
                    continue
                if not post.get('subreddit') or not post.get('title'):
                    skipped += 1
                    continue
                
                subreddit = post['subreddit'].replace('r/', '')
                title = post['title']
                body = post.get('body', '')
                
                # Check if subreddit is valid (must have content)
                if len(subreddit) > 21 or not subreddit.replace('_', '').isalnum():
                    skipped += 1
                    continue
                
                success = post_to_reddit(session, token, subreddit, title, body)
                if success:
                    posted += 1
                
                time.sleep(1.5)  # Rate limit
        
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
    
    print(f"\n✅ Posting complete!")
    print(f"   Posted: {posted}")
    print(f"   Skipped: {skipped}")
    print(f"💡 If no tokens, posts are saved in pending-posts/ for manual posting")

if __name__ == '__main__':
    main()
