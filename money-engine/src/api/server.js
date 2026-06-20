import express from 'express';
import cors from 'cors';
import { runFullPipeline, getStats } from '../scheduler/jobs.js';
import * as contentGen from '../content/generator.js';
import { PRODUCTS } from '../content/product-db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Get stats endpoint
app.get('/api/stats', (req, res) => {
  const stats = getStats();
  res.json({ success: true, data: stats });
});

// Trigger full pipeline run
app.post('/api/run', async (req, res) => {
  try {
    const result = await runFullPipeline();
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get all article metadata
app.get('/api/articles', (req, res) => {
  const articles = contentGen.generateAllArticles();
  res.json({ 
    success: true, 
    count: articles.length,
    categories: articles.filter(a => a.type === 'category').map(a => ({
      title: a.title || a.seoUrl,
      seoUrl: a.seoUrl,
    })),
    reviews: articles.filter(a => a.type === 'product').slice(0, 15).map(a => ({
      title: a.title,
      seoUrl: a.seoUrl,
    }))
  });
});

// Generate single article dynamically
app.get('/api/generate/:key', (req, res) => {
  // Find product by ID
  let product = null;
  for (const cat of Object.values(PRODUCTS)) {
    const found = cat.items.find(p => p.id === req.params.key);
    if (found) { product = found; break; }
  }
  
  if (product) {
    const html = contentGen.generateProductArticle(product, 1);
    res.json({ success: true, type: 'product', html });
  } else if (PRODUCTS[req.params.key]) {
    const html = contentGen.generateCategoryArticle(req.params.key);
    res.json({ success: true, type: 'category', html });
  } else {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

export function startAPI(port = 3456) {
  app.listen(port, () => {
    console.log(`\n🌐 API Server running at http://localhost:${port}`);
    console.log(`   GET  /api/stats       - View engine stats`);
    console.log(`   POST /api/run         - Trigger full pipeline`);
    console.log(`   GET  /api/articles    - List all articles`);
    console.log(`   GET  /api/generate/:key - Generate single article`);
  });
}

export default app;
