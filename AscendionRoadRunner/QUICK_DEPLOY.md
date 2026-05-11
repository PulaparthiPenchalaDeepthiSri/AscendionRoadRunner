# RoadRunner - Quick Deployment Commands

## 1️⃣ First Time Setup (One-time only)

### Create GitHub Repo (On GitHub.com):
1. Go to https://github.com/new
2. Repository name: roadrunner
3. Public or Private (your choice)
4. Do NOT initialize with README
5. Click "Create repository"

### Push to GitHub (In your terminal):
```bash
cd RoadRunner
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/YOUR_USERNAME/roadrunner.git
git branch -M main
git push -u origin main
```

## 2️⃣ Deploy on Render (On render.com)

### Steps:
1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - **Name:** roadrunner
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance:** Free
6. Click "Create Web Service"
7. Wait 3-5 minutes
8. Done! Your URL: `https://roadrunner.onrender.com`

## 3️⃣ Update Later (When you make changes)

```bash
git add .
git commit -m "Updated features"
git push origin main
```

Render will auto-deploy! ✅

## 🎯 That's It!

Three simple steps:
1. Push to GitHub
2. Connect to Render
3. Auto-deploy!

Your RoadRunner will be live at:
**https://roadrunner.onrender.com** 🚀
