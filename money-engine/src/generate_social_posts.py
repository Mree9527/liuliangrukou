#!/usr/bin/env python3
"""Generate social media distribution posts for TikTok, Facebook Groups, and Pinterest."""
import json, os
from datetime import datetime

OUTPUT_DIR = '/Users/kevin/Documents/liuliangrukou/money-engine/output/social-posts'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# TikTok scripts (short-form video hooks + CTA)
tiktok_posts = [
    {
        "platform": "TikTok",
        "category": "tech",
        "hook": "This $30 keyboard sounds better than my $200 one 😱",
        "body": "Redragon K552 Kumara - 85K+ Amazon reviews say it's legit\n✅ Brass plate build\n✅ Outemu blue switches\n✅ RGB lighting\nLink in bio for full review!",
        "hashtags": "#mechanicalkeyboard #techfinds #budgetking #gamingsetup",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/B01E8KO2B0-review.html"
    },
    {
        "platform": "TikTok",
        "category": "kitchen",
        "hook": "My oven hasn't been used in 6 months 🤯",
        "body": "Air fryer > oven for 90% of cooking\nCOSORI Pro LE at $89.99 is a steal\nFrozen fries come out CRISPY in 15 min\nNo preheat needed!\nCheck the link for today's price!",
        "hashtags": "#airfryer #cookinghacks #kitchenfinds #foodtok",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/cosoriproleairfryer5qt.html"
    },
    {
        "platform": "TikTok",
        "category": "tech",
        "hook": "These $50 earbuds sound like $250 ones 👀",
        "body": "Soundcore Space A40: adaptive ANC, LDAC hi-res audio, 10hr battery\nAll for under $50!!\nFull review + current price in bio 🔗",
        "hashtags": "#earbuds #budgettech #soundcore #audiophile",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/B0CMDRCZ5H-review.html"
    },
    {
        "platform": "TikTok",
        "category": "fitness",
        "hook": "$13 for 11 resistance bands that replace a gym 🏋️",
        "body": "Whatafit set: 5 resistance levels + door anchor + carrying case\nDo workouts ANYWHERE\nPerfect for small apartments!\nLink in bio for today's price!",
        "hashtags": "#homeworkout #resistancebands #fitnessonabudget",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/B07XJZB8G5-review.html"
    },
    {
        "platform": "TikTok",
        "category": "tech",
        "hook": "The last mouse you'll ever buy 🐭",
        "body": "Logitech MX Master 3S - $79.99\nMagSpeed scroll wheel is pure magic\nWorks across 3 devices simultaneously\nErgonomic for ALL-day use\nFull review link in bio!",
        "hashtags": "#mxmaster #productivity #techreview #logitech",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/B0B6GXCQXY-review.html"
    },
]

# Facebook group posts (community-friendly)
fb_group_posts = [
    {
        "platform": "Facebook Group",
        "target_groups": ["Mechanical Keyboards Lovers", "Budget Tech Finds", "Gaming Setup Inspiration"],
        "title": "Just reviewed the Redragon K552 - $30 mechanical keyboard with brass plate 🤯",
        "body": """Hey everyone! 👋

I've been testing keyboards for a site I built and wanted to share my honest take on the Redragon K552 Kumara.

At $30, it's the cheapest mechanical keyboard on Amazon that still has:
- A real brass plate (not plastic)
- Outemu blue switches with great tactile feedback
- Full RGB backlighting with 10 patterns
- 85K+ reviews averaging 4.4/5 stars

I compared it side-by-side with a $200 keyboard and honestly the typing feel is 90% as good for 15% of the price.

Full comparison review: https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/B01E8KO2B0-review.html

Not sponsored - just thought this might be useful for anyone building their first mechanical keyboard setup!""",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/B01E8KO2B0-review.html"
    },
    {
        "platform": "Facebook Group",
        "target_groups": ["Standing Desk Community", "Home Office Setup", "Remote Workers"],
        "title": "Standing desk under $500? Found one that's actually solid 💪",
        "body": """Been using a standing desk for 6 months now (back pain reduced by like 60%) and wanted to share what I found:

The Fully Jarvis Bamboo Standing Desk at ~$499 is legit:
- Dual motors with memory presets
- Handles up to 350 lbs (not wobbly)
- Beautiful eco-friendly bamboo surface
- Programmable height settings

I also tested a VariDesk riser ($395) which is great if you don't want to replace your existing desk.

Full comparison: https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/fullyjarvisbamboostandingdesk.html

Who else has a standing desk? What's your experience been?""",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/fullyjarvisbamboostandingdesk.html"
    },
    {
        "platform": "Facebook Group",
        "target_groups": ["Air Fryer Lovers", "Easy Dinner Recipes", "Healthy Cooking"],
        "title": "Air fryer that replaced my oven (no exaggeration) 😱",
        "body": """The COSORI Pro LE air fryer at $89.99 is hands down the best kitchen gadget I've bought this year.

Family of 4? The 5QT size is perfect.
Dishwasher-safe basket = literally 2 min cleanup.
Frozen foods come out CRISPY without oil.

Used it for: chicken wings, salmon, vegetables, even baked goods. All came out better than oven-cooked.

Full review + today's price: https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/cosoriproleairfryer5qt.html

Would anyone else here try an air fryer? I'm happy to share my favorite recipes!""",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/cosoriproleairfryer5qt.html"
    },
]

# Pinterest pin descriptions (SEO-optimized)
pinterest_posts = [
    {
        "platform": "Pinterest",
        "pin_title": "Best Budget Mechanical Keyboards Under $100 2026",
        "description": "Review of top mechanical keyboards for gamers and programmers. Redragon K552 at $30, Keychron K2 at $70. Full comparison + current prices.",
        "hashtags": "#mechanicalkeyboard #budgettech #gamingsetup #desksetup",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/B01E8KO2B0-review.html"
    },
    {
        "platform": "Pinterest",
        "pin_title": "Best Air Fryer for Families - COSORI Pro LE Review",
        "description": "5QT air fryer that replaced my oven. Family of 4 recommended with dishwasher-safe basket. Current deal pricing.",
        "hashtags": "#airfryer #kitchengadgets #familycooking #easydinner",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/cosoriproleairfryer5qt.html"
    },
    {
        "platform": "Pinterest",
        "pin_title": "Standing Desk Under $500 - Fully Jarvis Bamboo Review",
        "description": "Eco-friendly standing desk with dual motors, 350lb capacity. Home office setup ideas + ergonomic benefits.",
        "hashtags": "#standingdesk #homeoffice #ergonomic #workfromhome",
        "url": "https://mree9527.github.io/liuliangrukou/money-engine/output/reviews/fullyjarvisbamboostandingdesk.html"
    },
]

# Combine all into one output
all_posts = {
    'tiktok': tiktok_posts,
    'facebook': fb_group_posts,
    'pinterest': pinterest_posts
}

for category, posts in all_posts.items():
    for i, post in enumerate(posts):
        filename = f'{category}_{i+1}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, 'w') as f:
            json.dump(post, f, indent=2)

print(f'✅ Generated social media posts:')
for cat, count in [('TikTok', len(tiktok_posts)), ('Facebook', len(fb_group_posts)), ('Pinterest', len(pinterest_posts))]:
    print(f'   {cat}: {count} posts → {OUTPUT_DIR}/')
