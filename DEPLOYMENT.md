# 🚀 Vercel Deployment Guide for SolarCredits India

## ✅ Files Ready for Deployment

I've created the necessary configuration files:
- ✅ `vercel.json` - SPA routing configuration
- ✅ `.vercelignore` - Deployment optimization

## 🎯 Recommended: Deploy via Vercel Dashboard (Easiest Method)

### Step 1: Push to GitHub (if not already done)

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Deploy on Vercel Dashboard

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**:
   - Click "Import Project"
   - Select "Import Git Repository"
   - Choose your GitHub account
   - Select `solar-credits-india` repository

3. **Configure Project**:
   - **Project Name**: `solarcredits-india` (or your preferred name)
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)

4. **Add Environment Variables**:
   Click "Environment Variables" and add these 3 variables:
   
   ```
   Name: VITE_SUPABASE_URL
   Value: https://ynteusxiebkgcczovjtl.supabase.co
   
   Name: VITE_SUPABASE_PUBLISHABLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludGV1c3hpZWJrZ2Njem92anRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNDEyNDUsImV4cCI6MjA4MzgxNzI0NX0.DZYladg_trTPtd_6Y1i5Us5SwUHWDiDApsm87UxfUzA
   
   Name: VITE_SUPABASE_PROJECT_ID
   Value: ynteusxiebkgcczovjtl
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a live URL like: `https://solarcredits-india.vercel.app`

---

## 🔧 Alternative: Deploy via CLI (Manual Steps)

If you prefer CLI deployment, run these commands in your terminal:

```bash
# 1. Login to Vercel (opens browser)
vercel login

# 2. Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? solarcredits-india
# - Directory? ./
# - Override settings? No
```

Then add environment variables:

```bash
vercel env add VITE_SUPABASE_URL production
# Paste: https://ynteusxiebkgcczovjtl.supabase.co

vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
# Paste the key from .env

vercel env add VITE_SUPABASE_PROJECT_ID production
# Paste: ynteusxiebkgcczovjtl

# Redeploy with environment variables
vercel --prod
```

---

## ✅ After Deployment

### 1. Test Your Deployment

Visit your deployment URL and test:
- ✅ Landing page loads
- ✅ Connect MetaMask wallet
- ✅ Navigate to Dashboard
- ✅ Navigate to Marketplace
- ✅ Check ESG Portal

### 2. Update README

Once deployed, update the README.md with your live URL:

```markdown
[🚀 Live Demo](https://your-deployment-url.vercel.app)
```

---

## 🔍 Troubleshooting

### Issue: "Module not found" errors
**Solution**: Ensure all dependencies are in `package.json` (already done ✅)

### Issue: 404 on page refresh
**Solution**: `vercel.json` handles this with rewrites (already configured ✅)

### Issue: Environment variables not working
**Solution**: Make sure all variables start with `VITE_` prefix (already correct ✅)

### Issue: Build fails
**Solution**: Test locally first:
```bash
npm run build
npm run preview
```

---

## 📊 Expected Build Output

```
✓ Building for production...
✓ 1250 modules transformed
✓ Built in 15s
✓ Deployment ready
```

Your app will be live at: `https://[your-project-name].vercel.app`

---

## 🎉 Next Steps After Deployment

1. Share your live URL
2. Test all features with MetaMask
3. Monitor analytics in Vercel dashboard
4. Set up custom domain (optional)
5. Enable automatic deployments from GitHub

---

**Need Help?** Let me know if you encounter any issues during deployment!
