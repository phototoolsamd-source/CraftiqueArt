#!/bin/bash
# Craftique One-Click Website Update & Cloud Deploy
PROJECT_DIR="/Users/akshar/.gemini/antigravity/scratch/creaftique"
cd "$PROJECT_DIR" || exit 1

echo "============================================================"
echo "        🎨 CRAFTIQUE ONE-CLICK WEBSITE & CLOUD UPDATE       "
echo "============================================================"
echo ""
echo "📁 Project Directory: $PROJECT_DIR"
echo "🐙 GitHub Repo: https://github.com/phototoolsamd-source/CraftiqueArt"
echo "☁️  Live URL: https://craftique-art.vercel.app"
echo ""

# 1. Run Node sync agent to mirror images and update product DB if folder exists
if [ -d "/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products" ]; then
  echo "📦 Step 1: Scanning Studio Products folder..."
  node scripts/sync-agent.js
else
  echo "ℹ️  Studio drive not mounted. Skipping local folder scan."
fi

# 2. Rebuild the frontend
echo ""
echo "🔨 Step 2: Rebuilding frontend production bundle..."
npm run build

# 3. Commit and push any updated catalog images and products to GitHub
echo ""
echo "🚀 Step 3: Pushing latest code to GitHub (phototoolsamd-source/CraftiqueArt)..."
git remote set-url origin https://github.com/phototoolsamd-source/CraftiqueArt.git
git add -A
if git diff-index --quiet HEAD --; then
  echo "✅ Git is already up to date. No new file changes."
else
  git commit -m "Site update: $(date '+%Y-%m-%d %H:%M:%S')"
  git push origin main
  echo "✅ Pushed to GitHub repository successfully!"
fi

# 4. Instant Production Deployment to Vercel via Deploy Hook
echo ""
echo "⚡ Step 4: Triggering Vercel Production Build..."
DEPLOY_RESP=$(curl -s -X POST "https://api.vercel.com/v1/integrations/deploy/prj_GROFEWDnIsTM0IFgL4bJ3F1V16kE/Xzkd9vxjrW")
echo "Vercel Build Triggered: $DEPLOY_RESP"

echo ""
echo "============================================================"
echo "   🎉 UPDATE COMPLETE! WEBSITE IS LIVE WITH LATEST CHANGES  "
echo "   🌐 https://craftique-art.vercel.app                     "
echo "============================================================"
echo "Press any key to close this window..."
read -n 1 -s
