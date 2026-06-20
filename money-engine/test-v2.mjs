import { generateAllArticles } from './src/content/generator-v2.js';

const articles = generateAllArticles();
console.log('Total articles:', articles.length);

const byType = {};
articles.forEach(a => { byType[a.type] = (byType[a.type]||0)+1; });
console.log('By type:', JSON.stringify(byType));

console.log('\nSample SEO URLs:');
articles.slice(0, 12).forEach(a => console.log(`  ${a.seoUrl}`));
