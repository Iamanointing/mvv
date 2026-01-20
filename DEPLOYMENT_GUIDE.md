# 🚀 MyVesaVote Deployment Guide
## Step-by-Step: Frontend (Vercel) + Backend (Render/Railway)

---

## ⚡ **QUICK REFERENCE**

**What you'll need:**
- GitHub account
- Vercel account (free)
- Render or Railway account (free tier available)

**Time required:** 15-20 minutes

**What gets deployed:**
- **Frontend** → Vercel (React app)
- **Backend** → Render or Railway (Node.js + SQLite database)

---

## 📋 **PREPARATION**

### Step 1: Prepare Your Code
1. Make sure all changes are committed to Git
2. Ensure your code is working locally
3. Push your code to GitHub (create a repository if needed)

---

## 🔧 **PART A: DEPLOY BACKEND TO RENDER**

### Step 2: Sign Up for Render
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account (easiest option)
3. Verify your email if prompted

### Step 3: Create a New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository
   - If not connected, authorize Render to access your repositories
   - Select your `mvv` repository
   - Click **"Connect"**

### Step 4: Configure Backend Service
Fill in the following details:

- **Name**: `myvesavote-backend` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `leave empty` (default)
- **Build Command**: `npm install`
- **Start Command**: `node server/index.js`
- **Instance Type**: 
  - **Free**: Choose "Free" (has limitations but good for testing)
  - **Paid**: Choose "Starter" ($7/month) for better performance

### Step 5: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
```

**Important**: Replace `your-super-secret-jwt-key-change-this-to-something-random` with a random string (at least 32 characters).

Click **"Create Web Service"**

### Step 6: Wait for Deployment
- Render will automatically build and deploy your backend
- Watch the logs - it may take 3-5 minutes
- Once deployed, you'll see a URL like: `https://myvesavote-backend.onrender.com`
- **Copy this URL** - you'll need it for the frontend!

### Step 7: Verify Backend is Running
1. Visit your backend URL (e.g., `https://myvesavote-backend.onrender.com`)
2. You should see a JSON response with API endpoints
3. If it works, proceed to Part B

---

## 🎨 **PART B: DEPLOY FRONTEND TO VERCEL**

### Step 8: Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

### Step 9: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find and select your `mvv` repository
3. Click **"Import"**

### Step 10: Configure Frontend Project

In the configuration page:

- **Framework Preset**: `Vite`
- **Root Directory**: `client` (IMPORTANT: Change this!)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

### Step 11: Add Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_URL=https://myvesavote-backend.onrender.com
```

**Important**: Replace `https://myvesavote-backend.onrender.com` with YOUR actual Render backend URL from Step 6.

Click **"Deploy"**

### Step 12: Wait for Deployment
- Vercel will build and deploy your frontend
- Takes 1-3 minutes typically
- Once done, you'll get a URL like: `https://myvesavote.vercel.app`

---

## 🔄 **PART C: UPDATE BACKEND CORS**

### Step 13: Update Backend CORS Settings
1. Go back to Render dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Add a new environment variable:

```
FRONTEND_URL=https://myvesavote.vercel.app
```

**Important**: Replace with YOUR actual Vercel frontend URL.

5. Click **"Save Changes"** - Render will automatically redeploy

### Step 14: Update Server CORS Code (if needed)
The server code should already handle this via the `FRONTEND_URL` environment variable. If you see CORS errors, we may need to update the server code.

---

## ✅ **VERIFICATION & TESTING**

### Step 15: Test Your Deployment
1. Visit your Vercel frontend URL
2. Try to register a new user
3. Try to log in as admin
4. Test all functionalities

### Common Issues & Fixes:

**Issue 1: CORS Errors**
- Solution: Make sure `FRONTEND_URL` is set in Render environment variables
- Check that the server CORS configuration includes your Vercel URL

**Issue 2: "Cannot connect to API"**
- Solution: Verify `VITE_API_URL` in Vercel matches your Render backend URL
- Check that the backend is running (visit the Render URL directly)

**Issue 3: Database errors**
- Solution: Render's free tier may spin down after inactivity
- Wait 30-60 seconds and try again (first request wakes up the server)
- Consider upgrading to paid tier for always-on service

**Issue 4: File uploads not working**
- Solution: On Render, uploads are stored in ephemeral storage
- For production, consider using cloud storage (AWS S3, Cloudinary)

---

## 🔐 **SECURITY CHECKLIST**

Before going live:
- [ ] Change default admin password
- [ ] Use a strong `JWT_SECRET` (random 32+ character string)
- [ ] Update CORS to only allow your frontend URL
- [ ] Consider enabling HTTPS (already included on Render & Vercel)

---

## 🚂 **ALTERNATIVE: USING RAILWAY INSTEAD OF RENDER**

### Option: Deploy Backend to Railway

**Step 2A: Sign Up for Railway**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

**Step 3A: Create New Project**
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository

**Step 4A: Configure Service**
1. Railway auto-detects Node.js
2. Set **Start Command**: `node server/index.js`
3. Set **Root Directory**: `./` (default)

**Step 5A: Add Environment Variables**
Click **"Variables"** tab and add:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://myvesavote.vercel.app
```

**Step 6A: Deploy**
- Railway will auto-deploy
- Get your URL from the **"Settings"** → **"Domains"** section
- Use this URL as `VITE_API_URL` in Vercel

**Railway Advantages:**
- More generous free tier
- Faster cold starts
- Better for databases

---

## 📝 **MAINTENANCE**

### Updating Your App
1. Push changes to GitHub
2. Both platforms auto-deploy on git push
3. Monitor deployment logs in both dashboards

### Accessing Logs
- **Render**: Dashboard → Your Service → "Logs" tab
- **Vercel**: Dashboard → Your Project → "Deployments" → Click deployment → "View Build Logs"
- **Railway**: Dashboard → Your Project → "Deployments" → Click deployment → "View Logs"

### Database Access
- Database file is stored in Render/Railway's file system
- For backup, use the admin panel or SSH (paid plans only)
- For production, consider migrating to PostgreSQL (Render/Railway offer managed databases)

---

## 🆘 **NEED HELP?**

If you encounter issues:
1. Check the deployment logs in both platforms
2. Verify all environment variables are set correctly
3. Test the backend URL directly (should return JSON)
4. Check browser console for frontend errors

---

## 🎉 **YOU'RE ALL SET!**

Your MyVesaVote application is now live and accessible worldwide!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Share the frontend URL with your users to start voting!

---

## ✅ **DEPLOYMENT CHECKLIST**

Use this checklist to ensure everything is set up correctly:

### Backend (Render/Railway)
- [ ] Service is deployed and accessible
- [ ] Environment variables are set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000` (Render) or auto-assigned (Railway)
  - [ ] `JWT_SECRET` (strong random string)
  - [ ] `FRONTEND_URL` (your Vercel URL)
- [ ] Backend URL returns JSON when visited directly
- [ ] Logs show no errors

### Frontend (Vercel)
- [ ] Project is deployed
- [ ] Root directory is set to `client`
- [ ] Environment variable `VITE_API_URL` is set to backend URL
- [ ] Build completed successfully
- [ ] Frontend URL loads without errors

### Testing
- [ ] Can access frontend in browser
- [ ] Can register a new user
- [ ] Can log in as admin
- [ ] Can navigate between pages
- [ ] API calls work (check browser console Network tab)
- [ ] No CORS errors in browser console

---

## 📞 **GETTING HELP**

If something doesn't work:
1. **Check Logs First**: Both platforms provide detailed logs
   - Render: Dashboard → Service → "Logs" tab
   - Vercel: Dashboard → Project → "Deployments" → Click deployment
2. **Verify Environment Variables**: Make sure all are set correctly
3. **Test Backend Directly**: Visit backend URL to see if it responds
4. **Browser Console**: Check for JavaScript errors
5. **Network Tab**: Check if API calls are reaching the backend

---

## 🚀 **NEXT STEPS AFTER DEPLOYMENT**

1. **Change Default Admin Password** (Security!)
2. **Add Students to Database** via admin panel
3. **Create Positions** for the election
4. **Add Contestants** for each position
5. **Test Voting Flow** as a regular user
6. **Share Frontend URL** with voters

Happy Voting! 🗳️

