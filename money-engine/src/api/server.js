import express from 'express';
import cors from 'cors';
import { runFullPipeline, getStats } from '../scheduler/jobs.js';
import * as contentGen from '../content/generator.js';

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

// Get all articles metadata
app.get('/api/articles', (req, res) => {
  const articles = contentGen.generateAllArticles();
  res.json({ 
    success: true, 
    count: articles.length,
    articles: articles.map(a => ({
      topic: a.topic,
      title: a.seoMeta.title,
      keywords: a.seoMeta.keywords,
    }))
  });
});

// Run one article generation
app.get('/api/generate/:topic', (req, res) => {
  const result = contentGen.generateArticle(req.params.topic);
  if (result) {
    res.json({ success: true, article: result });
  } else {
    res.status(404).json({ success: false, error: 'Topic not found' });
  }
});

export function startAPI(port = 3456) {
  app.listen(port, () => {
    console.log(`\n🌐 API Server running at http://localhost:${port}`);
    console.log(`   GET  /api/stats       - View engine stats`);
    console.log(`   POST /api/run         - Trigger full pipeline`);
    console.log(`   GET  /api/articles    - List all articles`);
    console.log(`   GET  /api/generate/:topic - Generate single article`);
  });
}

export default app;
