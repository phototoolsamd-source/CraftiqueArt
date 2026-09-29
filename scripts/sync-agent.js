#!/usr/bin/env node
/**
 * Creaftique Catalog Sync Agent (CLI & Desktop Helper)
 * Monitors the local product folder, detects image updates & Excel spreadsheets,
 * maps product metadata, and updates the Creaftique API database.
 */

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const DEFAULT_SOURCE = process.env.CATALOG_PATH || '/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products';
const API_URL = process.env.API_URL || 'http://localhost:5001/api';

console.log('============================================================');
console.log('       🎨 CREAFTIQUE LOCAL CATALOG SYNC AGENT               ');
console.log('============================================================');

async function performSync(sourceDir) {
  console.log(`[Agent] Checking catalog path: ${sourceDir}`);
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source folder not accessible: ${sourceDir}`);
    console.error(`   Please check if the external hard drive is connected.`);
    return;
  }

  console.log(`[Agent] Scanning directories & extracting product assets...`);
  try {
    const res = await fetch(`${API_URL}/catalog/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ custom_path: sourceDir })
    });

    if (res.ok) {
      const data = await res.json();
      console.log('✅ SYNC SUCCESSFUL!');
      console.log(`   Products Found:   ${data.products_found}`);
      console.log(`   New Products:     ${data.new_products}`);
      console.log(`   Updated Products: ${data.updated_products}`);
      console.log(`   Total Images:     ${data.images_count}`);
      console.log(`   Last Synced:      ${new Date().toLocaleTimeString()}`);
    } else {
      console.warn(`⚠️ API responded with HTTP status ${res.status}. Falling back to direct database sync...`);
    }
  } catch (err) {
    console.log(`ℹ️ API server not reachable on ${API_URL}, executing direct local sync...`);
    const catalogSync = require('../server/catalogSync');
    const result = await catalogSync.syncCatalog(sourceDir);
    console.log('✅ Local Sync Complete:', result);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const isWatchMode = args.includes('--watch') || args.includes('-w');
const customPathArg = args.find(a => a.startsWith('--path='))?.split('=')[1];
const targetPath = customPathArg || DEFAULT_SOURCE;

performSync(targetPath);

if (isWatchMode) {
  console.log(`\n👀 Watching for changes in: ${targetPath}`);
  let debounceTimeout = null;

  try {
    fs.watch(targetPath, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.startsWith('.') || filename.includes('DS_Store'))) return;
      console.log(`[Change Detected] ${eventType}: ${filename}`);
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        console.log('[Agent] Re-syncing catalog after file modifications...');
        performSync(targetPath);
      }, 3000);
    });
  } catch (err) {
    console.warn(`Watch mode notice: ${err.message}`);
  }
}
