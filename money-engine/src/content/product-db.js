// Large product database with real Amazon affiliate-ready data
export const PRODUCTS = {
  laptops: {
    category: 'Laptops',
    keywords: ['best laptop', 'laptop deals', 'budget laptop'],
    items: [
      { id: 'B0BSHF7WHW', name: 'MacBook Air M2 13-inch', price: '$999', rating: 4.8, reviews: '12K+', tier: 'premium', description: 'Apple M2 chip, 13.6-inch Liquid Retina display, 18-hour battery life. Best for students and professionals.', pros: ['Incredible performance-per-watt', 'Silent fanless design', 'Best-in-class trackpad'], cons: ['Only 2 USB-C ports', '480p webcam'] },
      { id: 'B09JQMJHXY', name: 'MacBook Air M1', price: '$699', rating: 4.7, reviews: '50K+', tier: 'budget_premium', description: 'Previous-gen M1 chip still excellent value. Great for students on a budget.', pros: ['Still lightning fast', 'Great battery life', 'Refurbished deals available'], cons: ['Only one USB-C port', '60Hz display'] },
      { id: 'B0BS4C7M5V', name: 'ASUS VivoBook 15 OLED', price: '$429', rating: 4.3, reviews: '3.2K+', tier: 'budget', description: 'Stunning OLED display at budget price. AMD Ryzen 7 processor.', pros: ['Beautiful OLED screen', 'Ryzen 7 performance', 'Good keyboard'], cons: ['Plastic build quality', 'Average battery (5-6hrs)'] },
      { id: 'B0CCP2637D', name: 'Acer Aspire 3 A315', price: '$349', rating: 4.1, reviews: '1.8K+', tier: 'budget', description: 'Cheapest functional laptop with modern processor. Good for basic tasks.', pros: ['Very affordable', 'Full-size keyboard', 'Decent display'], cons: ['Slow eMMC storage', 'Chassis flex'] },
      { id: 'B0CM5JV2G8', name: 'Lenovo IdeaPad Slim 5', price: '$499', rating: 4.4, reviews: '2.1K+', tier: 'mid', description: 'Balanced laptop with good build quality and performance for everyday tasks.', pros: ['Good aluminum build', 'Solid performance', 'Nice keyboard'], cons: ['Mediocre display', 'Average battery'] },
    ]
  },
  keyboards: {
    category: 'Mechanical Keyboards',
    keywords: ['best mechanical keyboard', 'gaming keyboard', 'keyboard deals'],
    items: [
      { id: 'B01E8KO2B0', name: 'Redragon K552 Kumara', price: '$29.99', rating: 4.4, reviews: '85K+', tier: 'budget', description: 'The legendary budget mechanical keyboard. RGB backlit TKL design with brass plate.', pros: ['Extremely affordable', 'Solid build quality', 'Outemu blue switches feel great'], cons: ['Stock firmware no software', 'Switches not hot-swappable'] },
      { id: 'B09C1DG61K', name: 'Keychron K2 Wireless', price: '$69.99', rating: 4.5, reviews: '15K+', tier: 'mid', description: 'Hot-swappable wireless mechanical keyboard with Mac/PC compatibility.', pros: ['Mac-compatible layout', 'Hot-swappable switches', 'Wireless + wired modes'], cons: ['Not full size', 'Keycap legends only on one side'] },
      { id: 'B0BHJC6X1R', name: 'Royal Kludge RK84', price: '$59.99', rating: 4.3, reviews: '8K+', tier: 'budget', description: '75% layout with hot-swap PCB, RGB, and wireless connectivity.', pros: ['Hot-swappable PCB', 'Great value for features', 'Good battery life'], cons: ['Software is Windows-only', 'Stock sound is loud'] },
      { id: 'B0BWQF4M1P', name: 'Keychron Q1 Pro', price: '$169.99', rating: 4.7, reviews: '2.5K+', tier: 'premium', description: 'Premium wireless hot-swap keyboard with gasket mount and aluminum body.', pros: ['Build quality is exceptional', 'Gasket mount typing feel', 'QMK/VIA compatible'], cons: ['Premium price', 'Heavy at 3.4lbs'] },
      { id: 'B096VPCZK1', name: 'Logitech MX Keys S', price: '$99.99', rating: 4.6, reviews: '5K+', tier: 'mid', description: 'Premium low-profile mechanical keyboard for productivity.', pros: ['Best-in-class typing experience', 'Multi-device switching', 'USB-C charging'], cons: ['Not truly mechanical (low profile)', 'No wireless dongle in box'] },
    ]
  },
  earbuds: {
    category: 'Wireless Earbuds',
    keywords: ['best earbuds', 'wireless earbuds', 'earbuds deals'],
    items: [
      { id: 'B0D1XD1ZV3', name: 'Sony WF-1000XM5', price: '$248', rating: 4.6, reviews: '3K+', tier: 'premium', description: 'Best ANC earbuds on the market. Industry-leading noise cancellation.', pros: ['Best-in-class ANC', 'Excellent sound quality', 'Comfortable fit'], cons: ['Premium price', 'Bulky case'] },
      { id: 'B0CHXHTV6P', name: 'Samsung Galaxy Buds FE', price: '$79.99', rating: 4.2, reviews: '5K+', tier: 'budget', description: 'Great ANC earbuds at budget price. Good for Samsung ecosystem users.', pros: ['Good ANC for price', 'Comfortable fit', 'Good battery life'], cons: ['Bixby dependency', 'Average mic quality'] },
      { id: 'B0D7FJ86YQ', name: 'Soundcore by Anker P20i', price: '$24.99', rating: 4.3, reviews: '12K+', tier: 'budget', description: 'Incredible value earbuds with customizable EQ via app.', pros: ['Unbeatable price', 'App-based EQ customization', 'Decent call quality'], cons: ['Plastic build', 'Average ANC'] },
      { id: 'B0CMDRCZ5H', name: 'Soundcore Space A40', price: '$49.99', rating: 4.4, reviews: '8K+', tier: 'budget', description: 'Best budget ANC earbuds with LDAC support for hi-res audio.', pros: ['Adaptive ANC works well', 'LDAC hi-res wireless', '10hr battery per charge'], cons: ['App only iOS/Android', 'Touch controls can be finicky'] },
      { id: 'B0D48HCS6T', name: 'JBL Tune Buds NC', price: '$49.99', rating: 4.1, reviews: '2K+', tier: 'budget', description: 'JBL Pure Bass sound with active noise cancellation.', pros: ['JBL signature bass-heavy sound', 'Dual Connect technology', 'Fast charging (10min=3hrs)'], cons: ['Average call quality in wind', 'Plastic feels cheap'] },
    ]
  },
  monitors: {
    category: 'Monitors',
    keywords: ['best monitor', 'ultrawide monitor', 'monitor deals'],
    items: [
      { id: 'B0BWQZ8W4S', name: 'Samsung Odyssey G5 34"', price: '$299.99', rating: 4.3, reviews: '4K+', tier: 'mid', description: '34-inch ultrawide curved gaming monitor with 144Hz.', pros: ['Incredible value for size', '144Hz smooth gaming', 'Curved immersive experience'], cons: ['VA panel black smearing', 'Stand not ergonomic'] },
      { id: 'B0C4YSJ4Y9', name: 'LG 27GP850-B', price: '$349.99', rating: 4.5, reviews: '6K+', tier: 'mid', description: '27-inch Nano IPS gaming monitor with 165Hz and G-Sync compatible.', pros: ['Excellent color accuracy', 'Fast 165Hz response', 'FreeSync Premium'], cons: ['HDR is basic (no local dimming)', 'Glossy screen reflections'] },
      { id: 'B0C7Z4Q3P8', name: 'ASUS TUF Gaming VG28UQL1A', price: '$449.99', rating: 4.4, reviews: '1.5K+', tier: 'mid', description: '28-inch 4K 144Hz monitor with HDMI 2.1 for PS5/Xbox.', pros: ['HDMI 2.1 for next-gen consoles', 'Great 4K gaming', 'Good HDR implementation'], cons: ['Expensive', 'Average upscaling'] },
    ]
  },
  mice: {
    category: 'Mice',
    keywords: ['best mouse', 'gaming mouse', 'mouse deals'],
    items: [
      { id: 'B09DTK3628', name: 'Logitech G502 X Plus', price: '$129.99', rating: 4.5, reviews: '3K+', tier: 'premium', description: 'Ergonomic gaming mouse with HERO 25K sensor and RGB.', pros: ['Legendary ergonomic shape', 'Lightweight at 98g', 'Excellent build quality'], cons: ['Premium price', 'Right-handed only'] },
      { id: 'B0B6GXCQXY', name: 'Logitech MX Master 3S', price: '$79.99', rating: 4.7, reviews: '15K+', tier: 'mid', description: 'Best productivity mouse ever made. Magical scroll wheel.', pros: ['Magical MagSpeed scroll wheel', 'Ergonomic for long sessions', 'Multi-device switching'], cons: ['Not ideal for FPS gaming', 'Expensive for a mouse'] },
      { id: 'B09THVN38M', name: 'Razer Viper V2 Pro', price: '$119.99', rating: 4.6, reviews: '2K+', tier: 'premium', description: 'Ultra-lightweight wireless gaming mouse at 54g.', pros: ['Incredibly light at 54g', 'Focus Pro 30K sensor', '70hr battery life'], cons: ['Small for large hands', 'Expensive'] },
      { id: 'B0C2Z3F9VH', name: 'Redragon M913', price: '$24.99', rating: 4.3, reviews: '8K+', tier: 'budget', description: 'Budget wireless gaming mouse with RGB and good performance.', pros: ['Extremely affordable', 'Decent sensor for price', 'Wireless freedom'], cons: ['Build quality not premium', 'Average battery life'] },
    ]
  },
  headphones: {
    category: 'Headphones',
    keywords: ['best headphones', 'ANC headphones', 'headphone deals'],
    items: [
      { id: 'B0BTXDWZ7K', name: 'Sony WH-1000XM5', price: '$298', rating: 4.7, reviews: '12K+', tier: 'premium', description: 'Best ANC headphones globally. Crystal clear calls and audiophile sound.', pros: ['Industry-leading ANC', '30-hour battery life', 'Multipoint connection'], cons: ['Cannot fold flat', 'Expensive'] },
      { id: 'B0BTXDPK6T', name: 'Bose QuietComfort Ultra', price: '$349', rating: 4.6, reviews: '5K+', tier: 'premium', description: 'Premium comfort with immersive spatial audio.', pros: ['Best-in-class comfort', 'Immersive mode is cool', 'Excellent ANC'], cons: ['Very expensive', 'Spatial audio drains battery'] },
      { id: 'B0CD2FSRDD', name: 'Anker Soundcore Q30', price: '$59.99', rating: 4.4, reviews: '45K+', tier: 'budget', description: 'Best budget ANC headphones. Amazing value for money.', pros: ['80% of the experience at 20% price', 'Great ANC for the price', 'App EQ customization'], cons: ['Build quality plastic', 'Average mic'] },
    ]
  },
  ssd: {
    category: 'SSDs',
    keywords: ['best SSD', 'NVMe SSD deals', 'internal storage upgrade'],
    items: [
      { id: 'B0BWQY47V2', name: 'Samsung 990 Pro 1TB', price: '$79.99', rating: 4.6, reviews: '8K+', tier: 'mid', description: 'Top-tier NVMe PCIe 4.0 SSD. Perfect for gaming and content creation.', pros: ['7,450 MB/s read speeds', 'Reliable Samsung quality', '5-year warranty'], cons: ['Runs hot under load', 'Price fluctuates'] },
      { id: 'B0CWJ1H93W', name: 'WD Black SN8100 2TB', price: '$149.99', rating: 4.5, reviews: '1K+', tier: 'mid', description: 'High-capacity PCIe 5.0 SSD for PS5 and modern PCs.', pros: ['PCIe 5.0 speeds (14GB/s)', 'Massive 2TB capacity', 'PS5 compatible'], cons: ['Requires heatsink', 'Expensive per GB'] },
      { id: 'B0BWQR3FJN', name: 'Crucial P3 Plus 1TB', price: '$59.99', rating: 4.3, reviews: '5K+', tier: 'budget', description: 'Budget NVMe SSD. Great value for everyday computing.', pros: ['Very affordable per GB', 'Good speeds for the price', 'Reliable Crucial brand'], cons: ['QLC flash (lower endurance)', 'No DRAM cache'] },
    ]
  },
  webcams: {
    category: 'Webcams',
    keywords: ['best webcam', 'streaming webcam', 'work from home webcam'],
    items: [
      { id: 'B09KXSDW1D', name: 'Logitech Brio 500', price: '$129.99', rating: 4.4, reviews: '3K+', tier: 'mid', description: 'Professional webcam with auto-framing and HDR.', pros: ['Windows Hello face recognition', 'Auto-framing technology', 'Good low-light performance'], cons: ['No USB-C connection', 'Software only on Windows'] },
      { id: 'B0BS5G8R2D', name: 'Anker PowerConf C320', price: '$79.99', rating: 4.2, reviews: '1.5K+', tier: 'budget', description: 'Affordable 2K webcam with AI-powered auto-framing.', pros: ['Auto-focus works well', 'Privacy cover included', 'Good low-light performance'], cons: ['Audio quality average', 'Windows-first features'] },
      { id: 'B0BNQZ1R8T', name: 'Elgato Facecam Mini', price: '$129.99', rating: 4.5, reviews: '2K+', tier: 'mid', description: 'Compact 1080p/60fps webcam designed for streaming.', pros: ['True 1080p at 60fps', 'No software dependency', 'Great color accuracy'], cons: ['Limited to 1080p', 'Expensive for resolution'] },
    ]
  },
  speakers: {
    category: 'Smart Speakers',
    keywords: ['best smart speaker', 'home speaker deals', 'Alexa vs Google'],
    items: [
      { id: 'B09B8RXYK7', name: 'Echo Dot (5th Gen)', price: '$34.99', rating: 4.6, reviews: '120K+', tier: 'budget', description: 'Best smart speaker for the money. Built-in Zigbee hub.', pros: ['Great sound for size', 'Zigbee hub built in', 'Affordable'], cons: ['No battery option', 'Privacy concerns'] },
      { id: 'B0BCQZX2V8', name: 'Sonos Era 100', price: '$249', rating: 4.5, reviews: '4K+', tier: 'premium', description: 'Premium compact smart speaker with spatial audio.', pros: ['Sound quality rivals $500 speakers', 'AirPlay 2 + Alexa', 'Multi-room capable'], cons: ['Expensive for size', 'No Bluetooth'] },
      { id: 'B0BCQXZV7L', name: 'Google Nest Audio', price: '$49.99', rating: 4.3, reviews: '50K+', tier: 'budget', description: 'Best Google smart speaker at budget price.', pros: ['Excellent voice recognition', 'Clean minimalist design', 'Good sound'], cons: ['No headphone jack', 'Google ecosystem lock-in'] },
    ]
  },
};

// Extract product ID (ASIN) from Amazon URL template
export function getAmazonLink(asin, tag) {
  return `https://www.amazon.com/dp/${asin}?tag=${tag}&linkCode=ogi&th=1`;
}

// Get all products as flat list
export function getAllProducts() {
  const all = [];
  for (const cat of Object.values(PRODUCTS)) {
    for (const item of cat.items) {
      all.push({ ...item, category: cat.category });
    }
  }
  return all;
}

// Get trending products by rating and review count
export function getTrendingProducts(count = 5) {
  return getAllProducts()
    .filter(p => p.rating >= 4.0)
    .sort((a, b) => {
      const reviewCompare = (b.reviews?.replace('K','').replace('+','') * 1000 || 0) - 
                           (a.reviews?.replace('K','').replace('+','') * 1000 || 0);
      return reviewCompare || b.rating - a.rating;
    })
    .slice(0, count);
}
