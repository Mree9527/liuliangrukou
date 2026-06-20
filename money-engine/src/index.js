#!/usr/bin/env node
import { runFullPipeline, getStats, runQuickBuild } from './scheduler/jobs.js';
import { startAPI } from './api/server.js';
import fs from 'fs/promises';
import path from 'path';

const args = process.argv.slice(2);
const command = args[0];

console.log('\n╔══════════════════════════════════════╗');
console.log('║  🤖 Money Engine v2.0               ║');
console.log('║  Automated Zero-Cost Revenue System  ║');
console.log('╚══════════════════════════════════════╝\n');

async function main() {
  if (command === 'build') {
    const result = await runQuickBuild();
    console.log(`\n✅ Site built: ${result.outputDir}`);
    process.exit(0);
  } else if (command === 'stats') {
    const stats = getStats();
    console.log('\n📊 Money Engine Stats:\n', JSON.stringify(stats, null, 2));
    process.exit(0);
  }

  // Default: Run full pipeline + start API + schedule future runs
  try {
    const result = await runFullPipeline();
    
    if (result.success) {
      console.log('\n🚀 Starting automated services...\n');
      
      // Start API server
      startAPI();
      
      // Schedule content regeneration every hour
      const INTERVAL_MINUTES = 60;
      console.log(`⏰ Scheduled: Next full pipeline in ${INTERVAL_MINUTES} minutes\n`);
      
      setInterval(async () => {
        await runFullPipeline();
      }, INTERVAL_MINUTES * 60 * 1000);
    } else {
      console.log('\n❌ Pipeline failed:', result.error);
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
}

main();
