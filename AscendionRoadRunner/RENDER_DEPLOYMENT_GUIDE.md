# Deploy RoadRunner to Render - Complete Guide 🚀

## Prerequisites
- GitHub account
- Render account (free at render.com)
- RoadRunner files extracted

## Step 1: Prepare Your Files

### 1.1 Extract RoadRunner
```bash
# Extract the RoadRunner-FINAL-WITH-CORRECT-A.zip
# You should have this structure:
RoadRunner/
├── viewer.html
├── driver.html
├── index.html
├── ss.png
├── ascendion-logo.png
└── js/
    ├── viewer.js
    ├── driver.js
    └── firebase.js
```

### 1.2 Create Required Files for Render

Create these 3 new files in the RoadRunner folder:

**File 1: `package.json`**
```json
{
  "name": "roadrunner",
  "version": "1.0.0",
  "description": "Leadership Surface Movement Tracking",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**File 2: `server.js`**
```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(__dirname));

// Route for viewer page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

app.get('/viewer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

// Route for driver page
app.get('/driver.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'driver.html'));
});

// Route for index/home
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RoadRunner running on port ${PORT}`);
});
```

**File 3: `.gitignore`**
```
node_modules/
.env
.DS_Store
*.log
```

## Step 2: Create GitHub Repository

### 2.1 Create New Repository on GitHub
1. Go to https://github.com
2. Click **"New repository"** (green button)
3. Repository name: `roadrunner` (or any name you want)
4. Description: "Leadership Surface Movement Tracking System"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README
7. Click **"Create repository"**

### 2.2 Push Code to GitHub

Open terminal/command prompt in your RoadRunner folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - RoadRunner deployment"

# Add remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johnsmith/roadrunner.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Render

### 3.1 Sign Up / Log In to Render
1. Go to https://render.com
2. Click **"Get Started"** or **"Sign In"**
3. Sign in with GitHub (recommended)

### 3.2 Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** to link your GitHub
4. Find your `roadrunner` repository
5. Click **"Connect"**

### 3.3 Configure Web Service

Fill in these details:

**Basic Settings:**
- **Name:** `roadrunner` (this will be your URL)
- **Region:** Choose closest to you (e.g., Singapore, Oregon)
- **Branch:** `main`
- **Root Directory:** Leave blank
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **"Free"** (or choose paid if you need)

**Environment Variables:**
- Click **"Add Environment Variable"**
- Add if you have any API keys (optional)
- Example: 
  - Key: `FIREBASE_API_KEY`
  - Value: `your-firebase-key`

### 3.4 Deploy
1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait 2-5 minutes for deployment

### 3.5 Get Your URL
Once deployed, your URL will be:
```
https://roadrunner.onrender.com
```
(or whatever name you chose)

## Step 4: Access Your Application

### Main URLs:
- **Viewer Dashboard:** `https://roadrunner.onrender.com/`
- **Driver Page:** `https://roadrunner.onrender.com/driver.html`
- **Index Page:** `https://roadrunner.onrender.com/index.html`

## Step 5: Update Firebase Configuration (if needed)

If you're using Firebase, make sure to:

1. Go to Firebase Console
2. Add your Render domain to authorized domains:
   - `roadrunner.onrender.com`
3. Update CORS settings if needed

## Troubleshooting

### Issue 1: Build Fails
**Solution:**
- Check `package.json` is correct
- Verify `server.js` exists
- Check logs in Render dashboard

### Issue 2: App Shows "Not Found"
**Solution:**
- Verify `Start Command` is `npm start`
- Check `server.js` has correct routes
- Verify files are in root directory

### Issue 3: Static Files Not Loading
**Solution:**
- Check `express.static(__dirname)` in server.js
- Verify file paths don't have `/` at start
- Check browser console for errors

### Issue 4: Firebase Not Connecting
**Solution:**
- Add Render domain to Firebase authorized domains
- Check Firebase config in `js/firebase.js`
- Verify API keys are correct

## Free Tier Limitations

Render Free Tier:
- ✅ 750 hours/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Cold start (30-60 sec wake time)

**Tip:** Keep app awake using UptimeRobot (free):
1. Go to uptimerobot.com
2. Add monitor for your Render URL
3. Check every 5 minutes
4. Free tier allows 50 monitors

## Update Your Deployment

When you make changes:

```bash
# Make your changes to files
# Then:

git add .
git commit -m "Updated features"
git push origin main

# Render will auto-deploy!
```

## Custom Domain (Optional)

### Add Custom Domain:
1. Go to Render dashboard
2. Select your service
3. Click **"Settings"**
4. Scroll to **"Custom Domain"**
5. Click **"Add Custom Domain"**
6. Enter your domain: `roadrunner.yourdomain.com`
7. Add CNAME record in your DNS:
   - Type: `CNAME`
   - Name: `roadrunner`
   - Value: `roadrunner.onrender.com`

## Environment Variables

If you need to add secrets:

1. Go to Render dashboard
2. Select your service
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   ```
   FIREBASE_API_KEY=your_api_key
   GOOGLE_MAPS_KEY=your_maps_key
   ```

## Complete File Structure

Your final structure should be:
```
RoadRunner/
├── package.json          # NEW - npm config
├── server.js            # NEW - Express server
├── .gitignore           # NEW - Git ignore file
├── viewer.html          # Main dashboard
├── driver.html          # Driver tracking page
├── index.html           # Home page
├── ss.png              # Background logo
├── ascendion-logo.png  # Header logo
└── js/
    ├── viewer.js       # Dashboard logic
    ├── driver.js       # Driver page logic
    └── firebase.js     # Firebase config
```

## Success Checklist

- [ ] GitHub repository created
- [ ] Files pushed to GitHub
- [ ] Render account created
- [ ] Web service connected to GitHub
- [ ] Build completed successfully
- [ ] Application accessible at URL
- [ ] Firebase connected (if using)
- [ ] All features working
- [ ] Background "A" visible
- [ ] Trajectory lines showing
- [ ] Deviation alerts working

## Your Live URL

After deployment, share this URL:
```
🚀 https://roadrunner.onrender.com
```

## Support

If you have issues:
1. Check Render logs: Dashboard → Logs tab
2. Check browser console (F12)
3. Verify all files uploaded to GitHub
4. Check Firebase authorized domains

---

**DEPLOYMENT COMPLETE! 🎉**

Your RoadRunner is now live and accessible to anyone with the URL!
