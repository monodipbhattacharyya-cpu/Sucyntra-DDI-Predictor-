# ⚡ Quick GitHub Pages Deployment Checklist

## ✅ Already Done For You

- [x] `vite.config.ts` - Updated with base path configuration
- [x] `.github/workflows/deploy.yml` - GitHub Actions workflow created
- [x] `package.json` - Build scripts added
- [x] Build tested and working ✓

## 📋 What You Need To Do

### Step 1️⃣ Enable GitHub Pages (One-time setup)

```
GitHub Repo → Settings → Pages → Source: "GitHub Actions"
```

### Step 2️⃣ Push Your Code

```bash
git add .
git commit -m "chore: setup GitHub Pages deployment"
git push origin main
```

### Step 3️⃣ Monitor Deployment

```
GitHub Repo → Actions tab → Watch "Deploy to GitHub Pages" workflow
```

### Step 4️⃣ Visit Your Site

Once workflow completes (✅ green check):
- **Subdirectory**: `https://monodipbhattacharyya-cpu.github.io/Sucyntra-DDI-Predictor-/`
- **Or Root**: Check your GitHub Pages URL in Settings

---

## 🎯 The Flow (What Happens Automatically)

1. You push code to `main` or `master` branch
2. GitHub Actions automatically:
   - Checks out code
   - Installs dependencies (`npm ci`)
   - Builds project (`npm run build`)
   - Creates `dist/` folder
   - Deploys to GitHub Pages
3. Your site is live! 🚀

---

## ❌ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| GitHub Pages settings don't show "GitHub Actions" | Repo might be private. Check Settings → Visibility |
| 404 error on site | Wait for workflow ✅, then hard refresh (Ctrl+Shift+R) |
| Workflow not running | Check it's push to `main` or `master` branch |
| Assets not loading | Already fixed! Base path is auto-configured |

---

## 💡 Useful Commands

```bash
# Build locally (creates dist/ folder)
npm run build

# Preview build locally
npm run preview

# Trigger workflow manually (if needed)
git commit --allow-empty -m "trigger deploy"
git push
```

---

## 📖 Full Details

See `GITHUB_PAGES_SETUP.md` for complete documentation.

---

**That's it! Just push and your site goes live! 🌐**
