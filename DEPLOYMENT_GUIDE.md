# 🚀 Deployment Guide - PromptCraftery

## Overview
This project consists of 3 separate services that need to be deployed to different platforms:
- **Frontend** → Vercel
- **Admin Panel** → Vercel
- **Backend** → Railway (or Oracle Cloud)
- **Database** → MongoDB Atlas

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or login
3. Create a new organization and project

### Step 2: Create a Cluster
1. Click "Create" → Select **M0 (Free)** tier
2. Choose region closest to you
3. Create cluster

### Step 3: Set up Database Access
1. Go to **Database Access** → **Add New Database User**
2. Username: `singhasourav454_db_user`
3. Password: `kLlz2RWhYi89G3zd` (or use your generated password)
4. Database User Privileges: **Read and Write to Any Database**
5. Click **Add User**

### Step 4: Set up Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (for development)
   - Production: Add specific IP addresses
3. Click **Confirm**

### Step 5: Get Connection String
1. Click **Databases** → **Connect**
2. Select **Connect your application**
3. Choose **Node.js** driver
4. Copy the connection string:
   ```
   mongodb+srv://singhasourav454_db_user:kLlz2RWhYi89G3zd@cluster0.sjemgoz.mongodb.net/?appName=Cluster0
   ```

✅ **MongoDB Atlas is Ready!**

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. **Framework Preset:** React
5. **Root Directory:** `./frontend`
6. **Build Command:** `npm run build` (auto-detected)
7. **Output Directory:** `build` (auto-detected)

### Step 2: Add Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

```
REACT_APP_API_URL = https://your-backend-railway-url.com/api
REACT_APP_RAZORPAY_KEY_ID = rzp_live_SgYjBLSs7L5T2Z
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_SgYjBLSs7L5T2Z
REACT_APP_GOOGLE_CLIENT_ID = 218606597208-nvd5n2mvhns56tnfkpbh7g84q3nnepf9.apps.googleusercontent.com
```

### Step 3: Deploy
Click **Deploy** and wait for completion

✅ **Frontend is live at:** https://your-frontend.vercel.app

---

## 🔧 Admin Panel Deployment (Vercel)

### Step 1: Deploy to Vercel (New Project)
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. **Framework Preset:** React
5. **Root Directory:** `./admin`

### Step 2: Add Environment Variables
```
REACT_APP_API_URL = https://your-backend-railway-url.com/api
```

### Step 3: Deploy
Click **Deploy** and wait for completion

✅ **Admin Panel is live at:** https://your-admin.vercel.app

---

## ⚙️ Backend Deployment (Railway)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### Step 2: Create New Project
1. Click **Create New Project**
2. Select **Deploy from GitHub repo**
3. Select your repository `PromptCraftery`
4. Select branch: `main`

### Step 3: Configure Service
1. Click **Add Service** → **GitHub Repo**
2. **Root Directory:** `./backend`
3. Click **Deploy**

### Step 4: Add Environment Variables
In Railway Dashboard → Variables, add:

```
MONGODB_URI = mongodb+srv://singhasourav454_db_user:kLlz2RWhYi89G3zd@cluster0.sjemgoz.mongodb.net/?appName=Cluster0

JWT_SECRET = generate-with: openssl rand -base64 32

RAZORPAY_KEY_ID = rzp_live_SgYjBLSs7L5T2Z

RAZORPAY_KEY_SECRET = (get from Razorpay dashboard)

FRONTEND_URL = https://your-frontend.vercel.app

ADMIN_URL = https://your-admin.vercel.app

NODE_ENV = production

PORT = 5001
```

### Step 5: Get Backend URL
1. In Railway Dashboard → Deployments
2. Copy the generated URL (e.g., `https://yourapp-production.up.railway.app`)
3. Your API URL will be: `https://yourapp-production.up.railway.app/api`

### Step 6: Update Frontend/Admin
Go back to Vercel projects and update:
```
REACT_APP_API_URL = https://yourapp-production.up.railway.app/api
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads at `https://your-frontend.vercel.app`
- [ ] Admin panel loads at `https://your-admin.vercel.app`
- [ ] Backend health check: `https://your-backend.up.railway.app/api/health`
- [ ] Can login with admin credentials
- [ ] Categories show correct prompt counts
- [ ] Can browse prompts

---

## 🔐 Environment Variables Summary

### Frontend (.env)
```
REACT_APP_API_URL=https://backend-url.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_live_...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
REACT_APP_GOOGLE_CLIENT_ID=...
```

### Admin (.env)
```
REACT_APP_API_URL=https://backend-url.com/api
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=...
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=rzp_live_...
FRONTEND_URL=https://frontend.vercel.app
ADMIN_URL=https://admin.vercel.app
NODE_ENV=production
PORT=5001
```

---

## 📱 Database Statistics
- **Prompts:** 210,210+ (16,170 per category)
- **Categories:** 13
- **Admins:** 2 (admin@promptvault.com, admin@promptcraftery.com)
- **Storage Used:** ~200-220 MB
- **Free Tier Limit:** 512 MB ✅

---

## 💡 Tips & Troubleshooting

### Frontend/Admin not connecting to backend
- Verify `REACT_APP_API_URL` is correct
- Check CORS is enabled in backend
- Verify backend is running

### MongoDB connection fails
- Check username/password in URI
- Verify IP whitelist includes your Railway IP
- Test connection string locally first

### Build failures
- Clear `node_modules` and reinstall
- Check Node.js version compatibility
- Review build logs for specific errors

---

## 🆘 Support
For detailed documentation:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

**Last Updated:** June 3, 2026
**Version:** 1.0
