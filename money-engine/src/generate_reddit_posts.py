#!/usr/bin/env python3
"""Generate Reddit posts targeting diverse, high-traffic subreddits."""
import json, os, sys
from datetime import datetime

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'output', 'reddit-posts')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Product data with specific subreddit targeting
PRODUCTS = [
    {
        "id": "B01E8KO2B0",
        "name": "Redragon K552 Kumara",
        "price": "$29.99",
        "rating": 4.4,
        "category": "keyboard",
        "pros": ["Unbeatable $30 price", "Outemu blue switches feel great", "Solid brass plate build"],
        "cons": ["No software customization", "Switches not hot-swappable"],
        "subreddit": "r/mechanicalkeyboards",
        "alt_subreddit": "r/BudgetAesthetics",
    },
    {
        "id": "B09C1DG61K",
        "name": "Keychron K2 Wireless",
        "price": "$69.99",
        "rating": 4.5,
        "category": "keyboard",
        "pros": ["Hot-swappable switches", "Mac + PC compatible", "Gateron Brown switches"],
        "cons": ["Not full-size format", "Single-sided keycap legends"],
        "subreddit": "r/MechanicalKeyboards",
        "alt_subreddit": "r/keychron",
    },
    {
        "id": "B0BSHF7WHW",
        "name": "MacBook Air M2 13\"",
        "price": "$999",
        "rating": 4.8,
        "category": "laptop",
        "pros": ["Incredible performance-per-watt", "Fanless silent design", "Best-in-class trackpad"],
        "cons": ["Only 2 USB-C ports", "Base model has 8GB RAM"],
        "subreddit": "r/MacBookAir",
        "alt_subreddit": "r/laptops",
    },
    {
        "id": "B0BS4C7M5V",
        "name": "ASUS VivoBook 15 OLED",
        "price": "$429",
        "rating": 4.3,
        "category": "laptop",
        "pros": ["Beautiful OLED screen for $429", "Ryzen 7 multi-core beast", "Full-size keyboard with numpad"],
        "cons": ["Plastic build quality", "Average battery life"],
        "subreddit": "r/ASUS",
        "alt_subreddit": "r/buildapcsales",
    },
    {
        "id": "B0D1XD1ZV3",
        "name": "Sony WF-1000XM5",
        "price": "$248",
        "rating": 4.6,
        "category": "earbuds",
        "pros": ["Best-in-class ANC", "Excellent LDAC hi-res audio", "Comfortable secure fit"],
        "cons": ["Bulky charging case", "Premium price tag"],
        "subreddit": "r/headphones",
        "alt_subreddit": "r/sony",
    },
    {
        "id": "B0CM5JV2G8",
        "name": "Lenovo IdeaPad Slim 5",
        "price": "$499",
        "rating": 4.4,
        "category": "laptop",
        "pros": ["Aluminum chassis feels premium", "Solid all-day battery", "Excellent typing experience"],
        "cons": ["Display could be brighter", "Average webcam"],
        "subreddit": "r/Lenovo",
        "alt_subreddit": "r/ideapad",
    },
    {
        "id": "B0C2Z3F9VH",
        "name": "Redragon M913 Impact Wireless Mouse",
        "price": "$24.99",
        "rating": 4.3,
        "category": "mouse",
        "pros": ["Extremely affordable wireless gaming", "Decent optical sensor for price", "RGB lighting"],
        "cons": ["Build quality not premium", "Average battery longevity"],
        "subreddit": "r/GamingSetup",
        "alt_subreddit": "r/budgetGamingPC",
    },
    {
        "id": "B0B6GXCQXY",
        "name": "Logitech MX Master 3S",
        "price": "$79.99",
        "rating": 4.7,
        "category": "mouse",
        "pros": ["MagSpeed electromagnetic scroll wheel", "Ergonomic for all-day use", "Flow multi-computer control"],
        "cons": ["Not ideal for FPS gaming", "Expensive input device"],
        "subreddit": "r/buyitforlife",
        "alt_subreddit": "r/logitech",
    },
    {
        "id": "B0D7FJ86YQ",
        "name": "Soundcore P20i Earbuds",
        "price": "$24.99",
        "rating": 4.3,
        "category": "earbuds",
        "pros": ["Unbeatable sub-$25 price", "App-based sound customization via EQ", "Decent call clarity"],
        "cons": ["Plastic construction feels cheap", "ANC not effective for bass frequencies"],
        "subreddit": "r/BudgetAudiophile",
        "alt_subreddit": "r/soundcore",
    },
    {
        "id": "B0BWQZ8W4S",
        "name": "Samsung Odyssey G5 34\" Ultrawide",
        "price": "$299.99",
        "rating": 4.3,
        "category": "monitor",
        "pros": ["Incredible value for ultrawide size", "144Hz smooth competitive gaming", "Immersive curved viewing"],
        "cons": ["VA panel black smearing in dark scenes", "Stand lacks ergonomic adjustment"],
        "subreddit": "r/UltrawidenGaming",
        "alt_subreddit": "r/gamingmonitors",
    },
]

today = datetime.now().strftime("%Y-%m-%d")
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

posts = []

for product in PRODUCTS:
    # Main review post for primary subreddit
    reddit_post = {
        "subreddit": product["subreddit"],
        "title": f"Is the {product['name']} worth it in 2026? Here's my honest take.",
        "body": f"Just spent a few weeks with the **{product['name']}** and wanted to share my thoughts.\n\n"
                f"**TL;DR:** {product['pros'][0]} at ${product['price']} makes this solid pick.\n\n"
                f"**What I like:**\n"
                f"- " + "\n- ".join(product["pros"]) + f"\n\n"
                f"**Downsides:**\n"
                f"- " + "\n- ".join(product["cons"]) + f"\n\n"
                f"**Full review + current price check:** https://mree9527.github.io/liuliangrukou/reviews/{product['id']}-review.html\n\n"
                f"*(Disclosure: I earn a small commission if you buy through the link, at no extra cost to you)*",
        "url": f"https://mree9527.github.io/liuliangrukou/reviews/{product['id']}-review.html",
        "readyToPost": True,
    }
    posts.append(reddit_post)

    # Deal post for secondary subreddit (deal-focused communities)
    deal_post = {
        "subreddit": product.get("alt_subreddit", product["subreddit"]),
        "title": f"Found {product['name']} at {product['price']} - Detailed review inside",
        "body": f"**{product['name']} @ ${product['price']}**\n\n"
                f"Rating: {'⭐' * int(product['rating'])} {product['rating']}/5.0\n\n"
                f"**Pros:**\n" + "\n".join(f"- {p}" for p in product["pros"]) + f"\n\n"
                f"**Cons:**\n" + "\n".join(f"- {c}" for c in product["cons"]) + f"\n\n"
                f"**Full breakdown:** https://mree9527.github.io/liuliangrukou/reviews/{product['id']}-deal.html\n\n"
                f"(Link is affiliate - helps keep the site running)\n",
        "url": f"https://mree9527.github.io/liuliangrukou/reviews/{product['id']}-deal.html",
        "readyToPost": True,
    }
    posts.append(deal_post)

output_path = os.path.join(OUTPUT_DIR, f"multi_reddit_{timestamp}.json")
with open(output_path, 'w') as f:
    json.dump(posts, f, indent=2)

print(f"✅ Generated {len(posts)} Reddit posts for {len(PRODUCTS)} products")
print(f"📍 Saved to: {output_path}")
print("\n📋 Posting targets:")
for p in posts[:5]:
    print(f"  → {p['subreddit']}: {p['title'][:60]}")
print("  ...")
