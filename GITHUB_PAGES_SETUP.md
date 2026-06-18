# GitHub Pages Deployment Setup - Complete Guide

## ✅ What's Been Configured

Your project is now set up for **automatic GitHub Pages deployment**. Here's what was done:

### 1. Updated `vite.config.ts`
- Added dynamic `base` path configuration for GitHub Pages
- Optimized build settings with code splitting
- Ready to deploy to any GitHub Pages URL

### 2. Created GitHub Actions Workflow
- File: `.github/workflows/deploy.yml`
- Automatically builds on push to `main` or `master`
- Automatically deploys to GitHub Pages
- No manual steps needed!

### 3. Updated `package.json`
- Added `build:gh` script for local testing
- Kept all existing scripts intact

---

## 🚀 Deployment Instructions

### **Step 1: Enable GitHub Pages**

1. Go to your repository on GitHub: `https://github.com/monodipbhattacharyya-cpu/Sucyntra-DDI-Predictor-`
2. Click **Settings** (top right)
3. Scroll down to **Pages** section
4. Under **Build and deployment**:
   - **Source**: Select `GitHub Actions` (NOT "Deploy from a branch")
5. Click Save

### **Step 2: Push Your Code**

Simply push your code to the `main` or `master` branch:

```bash
git add .
git commit -m "chore: setup GitHub Pages deployment"
git push origin main
```

### **Step 3: Monitor Deployment**

1. Go to your repo on GitHub
2. Click **Actions** tab (top navigation)
3. Watch the "Deploy to GitHub Pages" workflow run
4. Once it shows ✅ (green check), your site is live!

### **Step 4: Access Your Site**

Your site will be available at:
- **If repo name is used**: `https://monodipbhattacharyya-cpu.github.io/Sucyntra-DDI-Predictor-/`
- **If root pages**: `https://monodipbhattacharyya-cpu.github.io/`

---

## 📋 How It Works

```
You Push Code → GitHub Actions Triggered
                ↓
            npm install
                ↓
            npm run build (generates dist/)
                ↓
            GitHub Pages Deploy
                ↓
            🌐 Site Live!
```

---

## ⚙️ Configuration Details

### **For Repository Subdirectory** (e.g., `/Sucyntra-DDI-Predictor-/`)

The `vite.config.ts` automatically handles this. Ensure the environment variable is set:

```bash
VITE_REPO_NAME=Sucyntra-DDI-Predictor-
```

The GitHub Actions workflow already sets this automatically.

### **For Root Domain** (e.g., `username.github.io`)

If you rename the repository to `monodipbhattacharyya-cpu.github.io`:
- No changes needed
- Site will automatically deploy to root

---

## 🔍 Troubleshooting

### Issue: Actions workflow doesn't appear

**Solution:**
1. Delete `.github/workflows/deploy.yml` from your local repo
2. Re-create it (it's already in your repo now)
3. Commit and push again

### Issue: Site shows 404

**Reasons & Solutions:**

1. **Workflow hasn't finished**
   - Wait for ✅ green check in Actions tab
   - Refresh GitHub Pages settings

2. **Wrong base path**
   - This is auto-configured now
   - Check Actions tab logs for errors

3. **Branch not set correctly**
   - Go to Settings → Pages
   - Ensure "GitHub Actions" is selected as source

### Issue: Styles/assets not loading

**Solution:**
- The base path is now automatically handled
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)

---

## 📝 Notes

- ✅ GitHub Actions runs on **every push** to main/master
- ✅ No need to manually build and push dist folder
- ✅ All assets are automatically versioned with content hashes
- ✅ Fast deployment (usually completes in 30-60 seconds)
- ✅ You'll see deployment status on GitHub

---

## 🎯 Next Steps

1. **Push the code** with these changes
2. **Check Actions tab** to see workflow run
3. **Wait for completion** (green ✅)
4. **Visit your GitHub Pages URL** to see live site

---

## 💡 Tips

- To test locally: `npm run build` then `npm run preview`
- To force re-run workflow: Make an empty commit: `git commit --allow-empty -m "trigger deploy"`
- Check workflow logs if something fails in Actions tab

**You're all set! 🚀 Just push and watch it deploy!**
