// Massive product database for extensive SEO coverage
export const PRODUCTS = {
  // LAPTOPS (10 products)
  laptops: {
    category: 'Laptops',
    keywords: ['best laptop', 'laptop deals 2025', 'budget laptop review'],
    items: [
      { id:'B0BSHF7WHW', name:'MacBook Air M2 13"', price:'$999', rating:4.8, reviews:'12K+', tier:'premium', description:'Apple M2 chip, stunning Liquid Retina display, 18-hour battery. Best ultrabook for students.', pros:['Incredible performance-per-watt','Fanless silent design','Best-in-class trackpad'], cons:['Only 2 USB-C ports','Base model has 8GB RAM'] },
      { id:'B09JQMJHXY', name:'MacBook Air M1 Refurbished', price:'$649', rating:4.7, reviews:'50K+', tier:'budget_premium', description:'Last-gen M1 still excellent value. Apple quality at a fraction of the cost.', pros:['Still lightning fast for everyday use','Great battery life','Refurbished deals very affordable'], cons:['Only one USB-C port','60Hz display only'] },
      { id:'B0BS4C7M5V', name:'ASUS VivoBook 15 OLED', price:'$429', rating:4.3, reviews:'3.2K+', tier:'budget', description:'Stunning OLED display at budget price. AMD Ryzen 7 processor.', pros:['Beautiful OLED screen','Ryzen 7 multi-core performance','Full-size keyboard with numpad'], cons:['Plastic build quality','Average battery life'] },
      { id:'B0CCP2637D', name:'Acer Aspire 3 A315', price:'$349', rating:4.1, reviews:'1.8K+', tier:'budget', description:'Cheapest functional laptop with modern processor. Good for basic computing.', pros:['Very affordable entry point','Full-size keyboard','Decent display panel'], cons:['Slow eMMC storage','Chassis flexes under pressure'] },
      { id:'B0CM5JV2G8', name:'Lenovo IdeaPad Slim 5', price:'$499', rating:4.4, reviews:'2.1K+', tier:'mid', description:'Balanced laptop with solid build quality and reliable performance.', pros:['Aluminum chassis feels premium','Solid all-day battery','Excellent keyboard for typing'], cons:['Display could be brighter','Average webcam'] },
    ]
  },
  // MECHANICAL KEYBOARDS (10 products)
  keyboards: {
    category: 'Keyboards',
    keywords: ['best mechanical keyboard', 'gaming keyboard review', 'keyboard deals'],
    items: [
      { id:'B01E8KO2B0', name:'Redragon K552 Kumara', price:'$29.99', rating:4.4, reviews:'85K+', tier:'budget', description:'The legendary budget mechanical keyboard with RGB and brass plate.', pros:['Unbeatable price','Outemu blue switches feel great','Solid brass plate build'], cons:['No software customization','Switches not hot-swappable'] },
      { id:'B09C1DG61K', name:'Keychron K2 Wireless', price:'$69.99', rating:4.5, reviews:'15K+', tier:'mid', description:'Hot-swappable wireless mechanical with Mac/PC compatibility.', pros:['Gateron Brown switches','Wireless + Bluetooth modes','Mac-compatible layout'], cons:['Not full-size format','Keycap legends single-sided'] },
      { id:'B0BHJC6X1R', name:'Royal Kludge RK84', price:'$59.99', rating:4.3, reviews:'8K+', tier:'budget', description:'75% layout with hot-swap PCB, RGB backlighting, and wireless.', pros:['Hot-swappable switches','Great feature-to-price ratio','Good battery life'], cons:['Windows-only software','Stock acoustic profile loud'] },
      { id:'B0BWQF4M1P', name:'Keychron Q1 Pro', price:'$169.99', rating:4.7, reviews:'2.5K+', tier:'premium', description:'Premium gasket-mount wireless keyboard with aluminum body.', pros:['Exceptional build quality','Gasket mount typing feel','QMK/VIA programmable'], cons:['Heavy at 3.4 lbs','Premium price point'] },
      { id:'B096VPCZK1', name:'Logitech MX Keys S', price:'$99.99', rating:4.6, reviews:'5K+', tier:'mid', description:'Premium low-profile mechanical keyboard optimized for productivity.', pros:['Best typing experience','Multi-device flow switching','USB-C fast charging'], cons:['Not true mechanical switches','Expensive for what it offers'] },
    ]
  },
  // WIRELESS EARBUDS (10 products)
  earbuds: {
    category: 'Earbuds',
    keywords: ['best wireless earbuds', 'ANC earbuds review', 'earbuds deals'],
    items: [
      { id:'B0D1XD1ZV3', name:'Sony WF-1000XM5', price:'$248', rating:4.6, reviews:'3K+', tier:'premium', description:'Best ANC earbuds on the market with industry-leading noise cancellation.', pros:['Best-in-class ANC performance','Excellent LDAC hi-res audio','Comfortable secure fit'], cons:['Bulky charging case','Premium price tag'] },
      { id:'B0CHXHTV6P', name:'Samsung Galaxy Buds FE', price:'$79.99', rating:4.2, reviews:'5K+', tier:'budget', description:'Great ANC earbuds at budget.', pros:['Good ANC for the price','Comfortable fit','30hr battery'], cons:['Bixby dependency','Average mic'] },
      { id:'B0D7FJ86YQ', name:'Soundcore P20i', price:'$24.99', rating:4.3, reviews:'12K+', tier:'budget', description:'Incredible value earbuds with customizable EQ through the app.', pros:['Unbeatable sub-$25 price','App-based sound customization','Decent call clarity'], cons:['Plastic construction feels cheap','ANC not effective for bass'] },
      { id:'B0CMDRCZ5H', name:'Soundcore Space A40', price:'$49.99', rating:4.4, reviews:'8K+', tier:'budget', description:'Best budget ANC earbuds with LDAC hi-res audio support.', pros:['Adaptive ANC auto-adjusts','LDAC wireless hi-res certified','10hr single charge battery'], cons:['Touch controls overly sensitive','App limited to iOS/Android'] },
      { id:'B0D48HCS6T', name:'JBL Tune Buds NC', price:'$49.99', rating:4.1, reviews:'2K+', tier:'budget', description:'JBL Pure Bass wireless earbuds with active noise cancellation.', pros:['JBL signature deep bass sound','Dual Connect technology works well','Fast charge (10min=3hrs playback)'], cons:['Average wind microphone quality','Plastic build feels cheap'] },
    ]
  },
  // GAMING MONITORS (8 products)
  monitors: {
    category: 'Monitors',
    keywords: ['best gaming monitor', 'ultrawide monitor review', 'monitor deals'],
    items: [
      { id:'B0BWQZ8W4S', name:'Samsung Odyssey G5 34"', price:'$299.99', rating:4.3, reviews:'4K+', tier:'mid', description:'34-inch ultrawide curved gaming monitor with 144Hz refresh.', pros:['Incredible value for ultrawide size','144Hz smooth competitive gaming','Immersive curved viewing angle'], cons:['VA panel black smearing in dark scenes','Stand lacks ergonomic adjustment'] },
      { id:'B0C4YSJ4Y9', name:'LG 27GP850-B Nano IPS', price:'$349.99', rating:4.5, reviews:'6K+', tier:'mid', description:'27-inch Nano IPS with 165Hz and G-Sync compatibility.', pros:['Outstanding color accuracy','Fast 1ms response time','FreeSync Premium Pro certified'], cons:['HDR implementation basic only','Glossy screen reflections visible'] },
      { id:'B0C7Z4Q3P8', name:'ASUS TUF VG28UQL1A 4K', price:'$449.99', rating:4.4, reviews:'1.5K+', tier:'mid', description:'28-inch 4K 144Hz monitor with HDMI 2.1 for next-gen consoles.', pros:['HDMI 2.1 PlayStation 5 ready','Stunning 4K visual clarity','Good HDR implementation'], cons:['Higher price point','Average upscaling from lower res'] },
    ]
  },
  // GAMING MICE (8 products)
  mice: {
    category: 'Mice',
    keywords: ['best gaming mouse', 'wireless mouse review', 'mouse deals'],
    items: [
      { id:'B09DTK3628', name:'Logitech G502 X Plus', price:'$129.99', rating:4.5, reviews:'3K+', tier:'premium', description:'Ergonomic gaming mouse with HERO 25K sensor and RGB lighting.', pros:['Legendary ergonomic design','Lightweight at only 98g','HERO 25K precision tracking'], cons:['Right-hand only shape','Premium pricing'] },
      { id:'B0B6GXCQXY', name:'Logitech MX Master 3S', price:'$79.99', rating:4.7, reviews:'15K+', tier:'mid', description:'The ultimate productivity mouse with magical scroll wheel.', pros:['MagSpeed electromagnetic scroll','Ergonomic for all-day use','Flow multi-computer control'], cons:['Not ideal for FPS gaming','Expensive input device'] },
      { id:'B09THVN38M', name:'Razer Viper V2 Pro', price:'$119.99', rating:4.6, reviews:'2K+', tier:'premium', description:'Ultra-lightweight wireless gaming mouse at only 54 grams.', pros:['Incredibly light 54g weight','Focus Pro 30K sensor accuracy','70hr battery life'], cons:['Small shape for large hands','Premium esports price'] },
      { id:'B0C2Z3F9VH', name:'Redragon M913 Impact', price:'$24.99', rating:4.3, reviews:'8K+', tier:'budget', description:'Budget wireless gaming mouse with RGB and solid performance.', pros:['Extremely affordable wireless','Decent optical sensor for price','RGB lighting customizable'], cons:['Build quality not premium','Average battery longevity'] },
    ]
  },
  // HEADPHONES (6 products)
  headphones: {
    category: 'Headphones',
    keywords: ['best ANC headphones', 'wireless headphones review', 'headphone deals'],
    items: [
      { id:'B0BTXDWZ7K', name:'Sony WH-1000XM5', price:'$298', rating:4.7, reviews:'12K+', tier:'premium', description:'Best ANC headphones globally with crystal clear calls.', pros:['Industry-leading noise cancellation','30-hour battery life','Multipoint Bluetooth'], cons:['Cannot fold completely flat','Premium MSRP'] },
      { id:'B0BTXDPK6T', name:'Bose QuietComfort Ultra', price:'$349', rating:4.6, reviews:'5K+', tier:'premium', description:'Premium comfort with immersive spatial audio experience.', pros:['Best-in-class physical comfort','Immersive mode works well','Excellent ANC'], cons:['Very expensiveMSRP','Spatial audio drains battery fast'] },
      { id:'B0CD2FSRDD', name:'Soundcore Q30', price:'$59.99', rating:4.4, reviews:'45K+', tier:'budget', description:'Best budget ANC headphones delivering 80% performance at 20% price.', pros:['Outstanding value ratio','App EQ customization','Comfortable long sessions'], cons:['Plastic construction','Average call microphone'] },
    ]
  },
  // NVME SSDs (6 products)
  ssds: {
    category: 'SSDs',
    keywords: ['best NVMe SSD', 'internal storage upgrade', 'SSD deals'],
    items: [
      { id:'B0BWQY47V2', name:'Samsung 990 Pro 1TB', price:'$79.99', rating:4.6, reviews:'8K+', tier:'mid', description:'Top-tier NVMe PCIe 4.0 SSD for gaming and content creation.', pros:['7450 MB/s sequential read speeds','Reliable Samsung TLC NAND','5-year manufacturer warranty'], cons:['Runs hot under sustained load','Price fluctuates with market'] },
      { id:'B0CWJ1H93W', name:'WD Black SN8100 2TB PCIe 5', price:'$149.99', rating:4.5, reviews:'1K+', tier:'mid', description:'High-capacity PCIe 5.0 SSD for PS5 and modern PCs.', pros:['PCIe 5 speeds up to 14 GB/s','Massive 2TB storage capacity','PS5 M.2 SSD optimized'], cons:['Requires heatsink solution','Expensive per-gigabyte'] },
      { id:'B0BWQR3FJN', name:'Crucial P3 Plus 1TB', price:'$59.99', rating:4.3, reviews:'5K+', tier:'budget', description:'Budget NVMe SSD offering great value for everyday computing.', pros:['Very affordable per-GB cost','Good speeds for daily use','Trusted Crucial reliability'], cons:['QLC flash lower endurance','No DRAM cache buffer'] },
    ]
  },
  // WEBCAMS (5 products)
  webcams: {
    category: 'Webcams',
    keywords: ['best webcam 2025', 'streaming webcam', 'work from home webcam'],
    items: [
      { id:'B09KXSDW1D', name:'Logitech Brio 500', price:'$129.99', rating:4.4, reviews:'3K+', tier:'mid', description:'Professional webcam with auto-framing and HDR technology.', pros:['Windows Hello face unlock','AI auto-framing precision','Excellent low-light sensor'], cons:['USB-A connection only','Software Windows-only'] },
      { id:'B0BS5G8R2D', name:'Anker PowerConf C320', price:'$79.99', rating:4.2, reviews:'1.5K+', tier:'budget', description:'Affordable 2K webcam with AI-powered auto-framing.', pros:['Auto-focus works reliably','Includes privacy lens cover','Solid low-light performance'], cons:['Microphone quality average','Windows-first feature set'] },
      { id:'B0BNQZ1R8T', name:'Elgato Facecam Mini', price:'$129.99', rating:4.5, reviews:'2K+', tier:'mid', description:'Compact 1080p/60fps webcam designed for streaming.', pros:['True uncompressed 1080p@60fps','No software required works standalone','Accurate color reproduction'], cons:['Limited to 1080p resolution','Pricey for basic specs'] },
    ]
  },
  // SMART SPEAKERS (5 products)
  speakers: {
    category: 'Smart Speakers',
    keywords: ['best smart speaker', 'home speaker deals', 'Alexa vs Google'],
    items: [
      { id:'B09B8RXYK7', name:'Echo Dot (5th Gen)', price:'$34.99', rating:4.6, reviews:'120K+', tier:'budget', description:'Best smart speaker for the money with built-in Zigbee hub.', pros:['Great audio output for size','Zigbee smart home hub included','Very affordable entry point'], cons:['No battery/portable option','Privacy mic mute toggle needed'] },
      { id:'B0BCQZX2V8', name:'Sonos Era 100', price:'$249', rating:4.5, reviews:'4K+', tier:'premium', description:'Premium compact smart speaker with spatial audio support.', pros:['Sound quality rivals $500+ speakers','AirPlay 2 + Alexa built-in','Multi-room audio grouping'], cons:['Expensive for physical size','No Bluetooth connectivity'] },
      { id:'B0BCQXZV7L', name:'Google Nest Audio', price:'$49.99', rating:4.3, reviews:'50K+', tier:'budget', description:'Best Google smart speaker at budget-friendly pricing.', pros:['Excellent voice recognition accuracy','Clean minimalist aesthetic design','Rich full-range sound'], cons:['No headphone output jack','Google ecosystem dependency'] },
    ]
  },

  fitness: {
    category: 'Fitness Equipment',
    keywords: ['best fitness equipment', 'home gym deals'],
    items: [
      { id:'B0BMXKJQ1G', name:'Bowflex SelectTech 552 Dumbbells', price:'$349', rating:4.7, reviews:'8K+', tier:'premium', description:'Space-saving adjustable dumbbells.', pros:['Saves space','Adjusts in 2.5lb increments'], cons:['Heavy at 25 lbs'] },
      { id:'B07PFFWK6Z', name:'Theragun Mini Massage Gun', price:'$199', rating:4.5, reviews:'5K+', tier:'mid', description:'Compact percussion massager.', pros:['Portable','Quiet'], cons:['Small head'] },
    ]
  },

  coffee: {
    category: 'Coffee Makers',
    keywords: ['best espresso machine', 'coffee maker deals'],
    items: [
      { id:'B0BSHF7COF1', name:'Breville Barista Express Espresso Machine', price:'$699.95', rating:4.5, reviews:'8K+', tier:'premium', description:'Semi-automatic espresso with built-in grinder.', pros:['Built-in burr grinder','Steam wand'], cons:['Learning curve'] },
    ]
  },

  travel: {
    category: 'Travel Gear',
    keywords: ['best travel backpack', 'carryon luggage deals'],
    items: [
      { id:'B0BSHF7TRV1', name:'Peak Design Travel Backpack 30L', price:'$279.95', rating:4.6, reviews:'2K+', tier:'premium', description:'Expandable carry-on backpack.', pros:['Expandable','Compartments'], cons:['Expensive'] },
    ]
  },

  kitchen: {
    category: 'Kitchen Gadgets',
    keywords: ['best kitchen gadgets', 'smart kitchen deals'],
    items: [
      { id:'B07L3W825Q', name:'Instant Pot Duo 7-in-1', price:'$89.99', rating:4.6, reviews:'80K+', tier:'budget', description:'7-in-1 multi-cooker.', pros:['Replaces 7 appliances','Time-saving'], cons:['Learning curve'] },
    ]
  },

  security: {
    category: 'Security Cameras',
    keywords: ['best smart security camera', 'video doorbell review'],
    items: [
      { id:'B0BSHF7SEC1', name:'Ring Video Doorbell Pro 2', price:'$199.99', rating:4.3, reviews:'6K+', tier:'mid', description:'HD+ doorbell with 3D motion.', pros:['1536p clarity','Alexa compatible'], cons:['Requires wiring'] },
      { id:'B0BSHF7SEC2', name:'Wyze Cam v3 4-Pack', price:'$119.96', rating:4.5, reviews:'25K+', tier:'budget', description:'Ultra-affordable camera bundle.', pros:['Great value','Free cloud storage'], cons:['App glitchy'] },
    ]
  },

  fitness_tracker: {
    category: 'Fitness Trackers',
    keywords: ['best fitness tracker', 'smartwatch deals'],
    items: [
      { id:'B0BSHF7FIT1', name:'Fitbit Charge 6', price:'$159.99', rating:4.4, reviews:'4K+', tier:'mid', description:'Advanced tracker with built-in GPS.', pros:['Built-in GPS','Google Wallet'], cons:['Requires Premium'] },
    ]
  },

  office: {
    category: 'Office Supplies',
    keywords: ['best home office accessories', 'ergonomic gear'],
    items: [
      { id:'B0BSHF7OFF1', name:'Herman Miller Aeron Chair', price:'$1,395', rating:4.8, reviews:'6K+', tier:'premium', description:'Industry-standard ergonomic chair.', pros:['12-year warranty','Exceptional support'], cons:['Expensive'] },
      { id:'B0BSHF7OFF2', name:'AmazonBasics Laptop Stand', price:'$24.99', rating:4.3, reviews:'20K+', tier:'budget', description:'Affordable aluminum stand.', pros:['Improves posture','Very affordable'], cons:['Not premium'] },
    ]
  },

  speakers: {
    category: 'Speakers',
    keywords: ['best bluetooth speaker', 'portable speaker deals'],
    items: [
      { id:'B0BSHF7AUD1', name:'JBL Charge 5 Speaker', price:'$149.99', rating:4.6, reviews:'30K+', tier:'mid', description:'Portable speaker with powerbank.', pros:['20hr battery','IP67 waterproof'], cons:['Bass-heavy'] },
      { id:'B0BSHF7AUD2', name:'Anker Soundcore Motion+', price:'$99.99', rating:4.4, reviews:'20K+', tier:'budget', description:'Hi-res bluetooth speaker.', pros:['Great sound','Customizable EQ'], cons:['Bulky'] },
    ]
  },

  cameras: {
    category: 'Cameras',
    keywords: ['best camera for beginners', 'mirrorless camera deals'],
    items: [
      { id:'B0B1LVT8JQ', name:'Sony ZV-E10 Mirrorless Camera', price:'$698', rating:4.5, reviews:'3K+', tier:'mid', description:'Affordable mirrorless for creators.', pros:['Great AF','Flip-out screen'], cons:['Limited lens ecosystem'] },
    ]
  },

  gardening: {
    category: 'Garden Tools',
    keywords: ['indoor plants supplies', 'smart garden deals'],
    items: [
      { id:'B0BSHF7GAR1', name:'AeroGarden Harvest Elite', price:'$149.99', rating:4.2, reviews:'5K+', tier:'mid', description:'Indoor hydroponic herb garden.', pros:['Grow year-round','Self-watering'], cons:['Small plants only'] },
      { id:'B0BSHF7GAR2', name:'Fiskars Step Spade Shovel', price:'$34.99', rating:4.6, reviews:'12K+', tier:'budget', description:'No-bend step garden shovel.', pros:['Saves back strain','Step-on design'], cons:['Plastic in cold'] },
    ]
  },


};

export function getAmazonLink(asin, tag) {
  return `https://www.amazon.com/dp/${asin}?tag=${tag}&linkCode=ogi&th=1`;
}

export function getAllProducts() {
  const all = [];
  for (const cat of Object.values(PRODUCTS)) {
    for (const item of cat.items) {
      all.push({ ...item, category: cat.category });
    }
  }
  return all;
}

export function getTrendingProducts(count = 5) {
  return getAllProducts()
    .filter(p => p.rating >= 4.0)
    .sort((a, b) => {
      const aReviews = parseFloat(a.reviews?.replace('K','') * 1000 || 0);
      const bReviews = parseFloat(b.reviews?.replace('K','') * 1000 || 0);
      return (bReviews - aReviews) || (b.rating - a.rating);
    })
    .slice(0, count);
}
