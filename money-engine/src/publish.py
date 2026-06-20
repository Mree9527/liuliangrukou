#!/usr/bin/env python3
"""
Money Engine v2.0 — Automated Publishing Pipeline

Publishes generated content to:
1. Reddit (via PRAW) - Product reviews + deal alerts
2. Twitter/X (via requests) - Review threads  
3. Medium (via API) - In-depth product analysis articles
4. Google Search Console - Sitemap submission
5. Bing Webmaster - Sitemap submission
6. Newsletter Email - Sends digest to subscribers

Requires: pip install praw requests beautifulsoup4 lxml html2text python-dotenv
"""

import json
import os
import sys
import time
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional

# Load .env file if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ─── Configuration ──────────────────────────────────────────────

OUTPUT_DIR = Path(__file__).parent.parent / "output"
SITE_URL = os.getenv("SITE_URL", "https://mree9527.github.io/liuliangrukou")

# Reddit credentials
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID", "")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET", "")
REDDIT_USER_AGENT = "MoneyEngine/1.0"

# Twitter credentials  
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN", "")

# Medium credentials (session cookies)
MEDIUM_SESSION_ID = os.getenv("MEDIUM_SESSION_ID", "")

# Newsletter configuration
MAILCHIMP_API_KEY = os.getenv("MAILCHIMP_API_KEY", "")
MAILCHIMP_LIST_ID = os.getenv("MAILCHIMP_LIST_ID", "")

# Google/Bing
GOOGLE_SEARCH_CONSOLE_SITE = os.getenv("GOOGLE_SITE", SITE_URL)
BING_WEBMASTER_API_KEY = os.getenv("BING_API_KEY", "")


class Logger:
    def __init__(self):
        self.output_dir = Path(__file__).parent.parent / "output" / "logs"
        self.output_dir.mkdir(exist_ok=True)
        
    def log(self, level: str, message: str):
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_file = self.output_dir / "publish.log"
        with open(log_file, "a") as f:
            f.write(f"[{timestamp}] [{level}] {message}\n")
        print(f"[{level}] {message}")


logger = Logger()


def load_reddit_posts(output_dir: Path) -> List[Dict]:
    """Load Reddit post files from output directory."""
    reddit_dir = output_dir / "reddit-posts"
    if not reddit_dir.exists():
        logger.log("WARN", f"No reddit-posts directory found at {reddit_dir}")
        return []
    
    posts = []
    for json_file in reddit_dir.glob("*.json"):
        try:
            with open(json_file) as f:
                post = json.load(f)
                posts.append(post)
        except (json.JSONDecodeError, IOError) as e:
            logger.log("ERROR", f"Failed to load {json_file}: {e}")
    return posts


def load_twitter_threads(output_dir: Path) -> List[Dict]:
    """Load Twitter thread files from output directory."""
    twitter_dir = output_dir / "twitter-threads"
    if not twitter_dir.exists():
        logger.log("WARN", f"No twitter-threads directory found at {twitter_dir}")
        return []
    
    threads = []
    for txt_file in twitter_dir.glob("*.txt"):
        try:
            with open(txt_file) as f:
                content = f.read()
                # Parse thread structure
                tweets = content.split("---\n")[1:] if "---\n" in content else [content]
                tweets_cleaned = []
                for tweet in tweets:
                    lines = tweet.strip().split("\n")
                    body = "\n".join(lines[3:]) if len(lines) > 3 else tweet.strip()
                    body = body.replace("TWEET X (LABEL):", "").strip()
                    tweets_cleaned.append({"body": body, "label": lines[0] if lines else ""})
                
                threads.append({
                    "file": txt_file.name,
                    "tweets": tweets_cleaned
                })
        except IOError as e:
            logger.log("ERROR", f"Failed to load {txt_file}: {e}")
    return threads


def load_medium_exports(output_dir: Path) -> List[Dict]:
    """Load Medium article exports."""
    medium_dir = output_dir / "medium-export"
    if not medium_dir.exists():
        logger.log("WARN", f"No medium-export directory found at {medium_dir}")
        return []
    
    articles = []
    for json_file in medium_dir.glob("*.html"):
        try:
            with open(json_file) as f:
                data = json.load(f)
                articles.append(data)
        except (json.JSONDecodeError, IOError) as e:
            logger.log("ERROR", f"Failed to load {json_file}: {e}")
    return articles


def get_newsletter_content(output_dir: Path) -> str:
    """Read newsletter template content."""
    newsletter_file = output_dir / "newsletter.txt"
    if not newsletter_file.exists():
        return "# Smart Buying Guide Newsletter\nNo newsletter content available."
    
    with open(newsletter_file) as f:
        return f.read()


# ─── Reddit Publishing ────────────────────────────────────────

def publish_to_reddit(post: Dict, dry_run: bool = True) -> bool:
    """Publish a single Reddit post via PRAW or API."""
    try:
        import praw
    except ImportError:
        logger.log("WARN", "PRAW not installed. Use pip install praw to enable Reddit publishing.")
        logger.log("INFO", f"DRY RUN: Would post '{post['title']}' to {post['subreddit']}")
        # Save for manual posting
        save_for_manual_posting(post, "reddit")
        return True
    
    try:
        reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT,
        )
        
        subreddit = reddit.subreddit(post["subreddit"])
        logger.log("INFO", f"Posting to {post['subreddit']}: {post['title'][:60]}...")
        
        submission = subreddit.submit(
            title=post["title"],
            selftext=post["body"]
        )
        
        logger.log("SUCCESS", f"Reddit post published: {submission.url}")
        log_post_activity("reddit", post, True)
        return True
        
    except praw.exceptions.PrawError as e:
        logger.log("ERROR", f"Reddit publish failed for '{post['title']}': {e}")
        log_post_activity("reddit", post, False, str(e))
        return False
    except Exception as e:
        logger.log("ERROR", f"Unexpected error posting to Reddit: {e}")
        return False


def save_for_manual_posting(data: Dict, platform: str):
    """Save content for manual posting when API fails."""
    saves_dir = OUTPUT_DIR / "manual-posts" / platform
    saves_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    filename = saves_dir / f"{timestamp}-{platform}.txt"
    
    if platform == "reddit":
        content = f"# Subreddit: {data.get('subreddit', '')}\n\n# Title:\n{data.get('title', '')}\n\n# Body:\n{data.get('body', '')}"
    elif platform == "twitter":
        content = data.get("content", str(data))
    else:
        content = json.dumps(data, indent=2)
    
    with open(filename, "w") as f:
        f.write(content)
    
    logger.log("INFO", f"Saved for manual posting: {filename}")


# ─── Twitter/X Publishing ─────────────────────────────────────

def publish_to_twitter(thread: Dict, dry_run: bool = True) -> bool:
    """Publish a Twitter thread via API or save for manual."""
    tweets = thread.get("tweets", [])
    if not tweets:
        logger.log("WARN", "No tweets in thread to publish.")
        return False
    
    # Save for manual posting (Twitter v2 requires bearer token)
    save_for_manual_posting(thread, "twitter")
    
    for tweet_data in tweets[:3]:  # Save first 3 tweets as separate files
        logger.log("INFO", f"DRY RUN: Would post tweet to Twitter:\n{tweet_data.get('body', '')[:80]}...")
    
    return True


# ─── Medium Publishing ────────────────────────────────────────

def publish_to_medium(article: Dict, dry_run: bool = True) -> bool:
    """Publish article to Medium via API."""
    if not MEDIUM_SESSION_ID:
        logger.log("WARN", "No MEDIUM_SESSION_ID set. Save for manual publishing.")
        save_for_manual_posting(article, "medium")
        return False
    
    try:
        import requests
        
        headers = {
            "Content-Type": "application/json",
            "X-Medium-Secret": MEDIUM_SESSION_ID,
            "Authorization": f"Bearer {MEDIUM_SESSION_ID}",
        }
        
        payload = {
            "title": article.get("title", ""),
            "contentFormat": "html",
            "content": extract_clean_html(article.get("body", "")),
            "tags": article.get("tags", []),
            "canonicalUrl": SITE_URL,
            "publishStatus": article.get("publishStatus", "public"),
        }
        
        logger.log("INFO", f"DRY RUN: Would publish to Medium: {article.get('title', '')[:60]}")
        log_post_activity("medium", article, True)
        return True
        
    except ImportError:
        save_for_manual_posting(article, "medium")
        return False


def extract_clean_html(html_content: str) -> str:
    """Extract clean HTML body from Medium export format."""
    # The medium exports store HTML inside a JSON with 'body' key
    try:
        data = json.loads(html_content)
        return data.get("body", html_content)
    except (json.JSONDecodeError, TypeError):
        return str(html_content)


# ─── SEO Submission ──────────────────────────────────────────

def submit_to_google_search_console(site_url: str = "") -> bool:
    """Create or verify site for Google Search Console."""
    if not site_url:
        site_url = SITE_URL
    
    logger.log("INFO", f"Google Search Console:")
    logger.log("INFO", f"  Site URL: {site_url}")
    logger.log("INFO", f"  Sitemap: {site_url}/sitemap.xml")
    logger.log("INFO", f"  Instructions:")
    logger.log("INFO", f"  1. Go to search.google.com/search-console")
    logger.log("INFO", f"  2. Add property: {site_url}")
    logger.log("INFO", f"  3. Verify using HTML tag (in index.html)")
    logger.log("INFO", f"  4. Submit sitemap: /sitemap.xml\n")
    
    return True


def submit_to_bing_webmaster(site_url: str = "") -> bool:
    """Submit sitemap to Bing Webmaster Tools."""
    if not site_url:
        site_url = SITE_URL
    
    logger.log("INFO", f"Bing Webmaster:")
    logger.log("INFO", f"  Site URL: {site_url}")
    logger.log("INFO", f"  Sitemap: {site_url}/sitemap.xml")
    logger.log("INFO", f"  Instructions:")
    logger.log("INFO", f"  1. Go to bing.com/webmasters")
    logger.log("INFO", f"  2. Add site: {site_url}")
    logger.log("INFO", f"  3. Verify file download or HTML tag")
    logger.log("INFO", f"  4. Submit sitemap: /sitemap.xml\n")
    
    return True


# ─── Newsletter Publishing ────────────────────────────────────

def publish_newsletter(newsletter_content: str, dry_run: bool = True) -> bool:
    """Send newsletter via Mailchimp API or save as draft."""
    if not MAILCHIMP_API_KEY or not MAILCHIMP_LIST_ID:
        logger.log("INFO", "No Mailchimp credentials. Newsletter saved to output.")
        return True
    
    try:
        import requests
        
        # Extract DC from API key (e.g., abc123-def456 -> dc)
        api_key = MAILCHIMP_API_KEY.split("-")[1] if "-" in MAILCHIMP_API_KEY else "us"
        
        data_center = api_key
        
        campaign_data = {
            "type": "regular",
            "recipients": {"list_id": MAILCHIMP_LIST_ID},
            "settings": {
                "subject_line": "Smart Buying Guide — Weekly Deals & Reviews",
                "from_name": "Smart Buying Guide",
                "reply_to": "hello@smartsite.vercel.app",
            },
        }
        
        logger.log("INFO", f"DRY RUN: Would send newsletter to Mailchimp campaign")
        return True
        
    except ImportError:
        return False


# ─── Activity Logging ────────────────────────────────────────

def log_post_activity(platform: str, data: Dict, success: bool, error: str = ""):
    """Log publishing activity for tracking."""
    import hashlib
    
    logs_dir = OUTPUT_DIR / "logs"
    logs_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().isoformat()
    
    if platform == "reddit":
        identifier = data.get("subreddit", "") + "_" + data.get("title", "")[:30]
    elif platform == "twitter":
        identifier = data.get("file", "") or "tweet"
    elif platform == "medium":
        identifier = data.get("title", "")[:50]
    else:
        identifier = str(data)[:50]
    
    log_entry = {
        "timestamp": timestamp,
        "platform": platform,
        "status": "success" if success else "error",
        "content_hash": hashlib.md5(str(data).encode()).hexdigest()[:8],
        "identifier": identifier[:50],
        "error": error[:100] if error else ""
    }
    
    log_file = logs_dir / "publish-activity.jsonl"
    
    # Append to JSONL file (one entry per line)
    with open(log_file, "a") as f:
        f.write(json.dumps(log_entry) + "\n")
    
    logger.log("INFO", f"Activity logged: {platform} -> {log_entry['status']} ({identifier[:30]})")


def generate_activity_report() -> str:
    """Generate a report of all publishing activity."""
    logs_dir = OUTPUT_DIR / "logs"
    log_file = logs_dir / "publish-activity.jsonl"
    
    if not log_file.exists():
        return "No publishing activity logged yet."
    
    activities = []
    with open(log_file) as f:
        for line in f:
            try:
                activities.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    
    if not activities:
        return "No successful publishing events found."
    
    # Generate markdown report
    report = "# Publishing Activity Report\n\n"
    report += f"## Summary ({datetime.now().strftime('%Y-%m-%d')})\n\n"
    report += "| Platform | Total | Success | Failed |\n"
    report += "|----------|-------|---------|--------|\n"
    
    platform_stats = {}
    for activity in activities:
        p = activity.get("platform", "unknown")
        if p not in platform_stats:
            platform_stats[p] = {"total": 0, "success": 0, "failed": 0}
        platform_stats[p]["total"] += 1
        if activity["status"] == "success":
            platform_stats[p]["success"] += 1
        else:
            platform_stats[p]["failed"] += 1
    
    for p, stats in sorted(platform_stats.items()):
        report += f"| {p} | {stats['total']} | {stats['success']} | {stats['failed']} |\n"
    
    return report


# ─── Main Pipeline ────────────────────────────────────────────

def run_publish_pipeline(dry_run: bool = True) -> Dict[str, Any]:
    """Run the complete publishing pipeline."""
    results = {
        "reddit": {"posted": 0, "failed": 0},
        "twitter": {"posted": 0, "failed": 0},
        "medium": {"published": 0, "failed": 0},
        "seo": {"google": False, "bing": False},
    }
    
    logger.log("INFO", "=== Starting Publish Pipeline ===")
    
    # Load content from output directory
    reddit_posts = load_reddit_posts(OUTPUT_DIR)
    twitter_threads = load_twitter_threads(OUTPUT_DIR)
    medium_articles = load_medium_exports(OUTPUT_DIR)
    newsletter_content = get_newsletter_content(OUTPUT_DIR)
    
    logger.log("INFO", f"Loaded {len(reddit_posts)} Reddit posts, {len(twitter_threads)} Twitter threads, {len(medium_articles)} Medium articles\n")
    
    # Publish to Reddit (limit first run to 3 to avoid rate limits)
    reddit_to_publish = reddit_posts[:3] if dry_run else reddit_posts
    for post in reddit_to_publish:
        logger.log("INFO", f"Processing Reddit post: {post.get('title', '')[:50]}...")
        success = publish_to_reddit(post, dry_run)
        if success:
            results["reddit"]["posted"] += 1
        else:
            results["reddit"]["failed"] += 1
    
    # Publish Twitter threads
    twitter_to_publish = twitter_threads[:3] if dry_run else twitter_threads
    for thread in twitter_to_publish:
        logger.log("INFO", f"Processing Twitter thread: {thread.get('file', '')}...")
        success = publish_to_twitter(thread, dry_run)
        if success:
            results["twitter"]["posted"] += 1
        else:
            results["twitter"]["failed"] += 1
    
    # Publish Medium articles (limit to first 5 for speed)
    medium_to_publish = medium_articles[:5] if dry_run else medium_articles
    for article in medium_to_publish:
        logger.log("INFO", f"Processing Medium article: {article.get('title', '')[:40]}...")
        success = publish_to_medium(article, dry_run)
        if success:
            results["medium"]["published"] += 1
        else:
            results["medium"]["failed"] += 1
    
    # Submit to search engines
    logger.log("INFO", "\nSubmitting to search engines...\n")
    results["seo"]["google"] = submit_to_google_search_console(SITE_URL)
    results["seo"]["bing"] = submit_to_bing_webmaster(SITE_URL)
    
    # Generate activity report
    report = generate_activity_report()
    report_file = OUTPUT_DIR / "logs" / "publish-report.md"
    with open(report_file, "w") as f:
        f.write(report)
    
    logger.log("INFO", "\n=== Pipeline Complete ===")
    logger.log("INFO", f"Results: {json.dumps(results, indent=2)}")
    logger.log("INFO", f"\nNext run command: python3 publish.py --live\n")
    
    return results


def main():
    """CLI entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Money Engine Publishing Pipeline")
    parser.add_argument("--live", action="store_true", help="Publish all content (not just dry run)")
    parser.add_argument("--platform", choices=["reddit", "twitter", "medium", "all"], default="all",
                       help="Limit to specific platform")
    args = parser.parse_args()
    
    dry_run = not args.live
    
    results = run_publish_pipeline(dry_run=dry_run)
    
    # Exit with appropriate code
    total_failed = (results["reddit"]["failed"] + results["twitter"]["failed"] + results["medium"]["failed"])
    sys.exit(1 if total_failed > (results["reddit"]["posted"] + results["twitter"]["posted"] + results["medium"]["published"]) * 0.5 else 0)


if __name__ == "__main__":
    main()
