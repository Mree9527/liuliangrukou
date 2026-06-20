export const CONFIG = {
  // Output directory for generated content
  outputDir: '../../output',
  
  // Website URL (update before deploying)
  siteUrl: 'https://your-money-site.github.io',
  
  // Affiliate settings - replace with your actual IDs
  affiliate: {
    amazonTag: 'mysite-20',           // Amazon Associates tag
    commissionRate: 0.04,            // ~4% average Amazon commission
  },
  
  // Social media
  social: {
    twitterBearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    mediumApiKey: process.env.MEDIUM_API_KEY || '',
    mediumMemberId: process.env.MEDIUM_MEMBER_ID || '',
  },
  
  // Schedule settings (in minutes)
  schedule: {
    contentGeneration: 60,           // Generate new content every hour
    socialPosting: 30,               // Post to social every 30 min
    sitemapRefresh: 120,             // Refresh sitemap every 2 hours
  },

  // Blog categories for content generation
  categories: [
    'best-laptops-for-students',
    'budget-gaming-keyboards',
    'smart-home-devices-under-50',
    'productivity-apps-review',
    'wireless-earbuds-comparison',
    'desk-setup-inspiration',
    'portable-monitors-guide',
    'mechanical-keyboard-switches',
    'usb-c-hubs-review',
    'standing-desks-compared',
    'webcam-quality-comparison',
    'noise-cancelling-headphones',
  ],

  // Content settings
  content: {
    minWordCount: 1200,
    targetKeywordLength: 3,
    autoInternalLink: true,
    addComparisonTable: true,
    includeProsCons: true,
  }
};
