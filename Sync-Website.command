#!/bin/bash
# Creaftique One-Click Website Catalog Sync & GitHub Push
cd "$(dirname "$0")"

echo "============================================================"
echo "       🎨 CREAFTIQUE INSTANT CATALOG SYNC & CLOUD UPDATE   "
echo "============================================================"
echo ""
echo "Source: /Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products"
echo "GitHub: https://github.com/Akshar3375/Craftique"
echo ""

# 1. Run Node sync agent to mirror images and update product DB
node scripts/sync-agent.js

# 2. Rebuild the frontend
echo ""
echo "🔨 Rebuilding frontend production bundle..."
npm run build

# 3. Commit and push any updated catalog images and products to private GitHub repository
echo ""
echo "🚀 Pushing changes to GitHub (Akshar3375/Craftique)..."
git add .
if git diff-index --quiet HEAD --; then
  echo "✅ Already up to date. No new file changes."
else
  git commit -m "Catalog sync update: $(date '+%Y-%m-%d %H:%M:%S')"
  git push origin main
  echo "✅ Pushed to GitHub repository successfully!"
fi

echo ""
echo "============================================================"
echo "       🎉 SYNC COMPLETE! WEBSITE IS FULLY UPDATED          "
echo "============================================================"
echo "Press any key or close this window."
read -n 1 -s
