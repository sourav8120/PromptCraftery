# PromptCraftery Production Deployment Guide

Complete step-by-step guide to deploy your full-stack application to production.

---

## 📋 **DEPLOYMENT ARCHITECTURE**

```
┌─────────────────────────────────────────────────┐
│         PromptCraftery Production               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend (React)      → Vercel                │
│  Admin Panel (React)   → Vercel                │
│  Backend (Express)     → Render                │
│  Database (MongoDB)    → MongoDB Atlas ✅      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ **PREREQUISITES (Already Done!)**

- ✅ GitHub repository created
- ✅ Code pushed to main branch
- ✅ MongoDB Atlas cluster configured
- ✅ Environment variables set
- ✅ DNS configuration added

---

## 🌐 **PART 1: DEPLOY FRONTEND TO VERCEL**

### **Step 1.1: Sign Up / Login to Vercel**
1. Go to: https://vercel.com
2. Click **Sign Up** or **Login**
3. Choose **GitHub** as your provider
4. Authorize Vercel to access your GitHub account

### **Step 1.2: Import Frontend Project**
1. Click **New Project**
2. Select **Import Git Repository**
3. Find & select `PromptCraftery` repository
4. Click **Import**

### **Step 1.3: Configure Frontend Settings**
1. **Project Name:** `promptcraftery-frontend`
2. **Framework Preset:** Select **Create React App**
3. **Root Directory:** Click **Edit** and set to: `frontend`
4. **Build Command:** `npm run build`
5. **Output Directory:** `build`
6. **Install Command:** `npm install`

### **Step 1.4: Add Environment Variables**
1. Click **Environment Variables**
2. Add these variables:
   ```
   REACT_APP_API_URL = https://your-backend-render-url.com/api
   REACT_APP_RAZORPAY_KEY_ID = rzp_live_SgYjBLSs7L5T2Z
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_SgYjBLSs7L5T2Z
   REACT_APP_GOOGLE_CLIENT_ID = 218606597208-nvd5n2mvhns56tnfkpbh7g84q3nnepf9.apps.googleusercontent.com
   ```

### **Step 1.5: Deploy**
1. Click **Deploy**
2. Wait for build to complete (5-10 minutes)
3. Once done, you'll get your frontend URL:
   ```
   https://promptcraftery-frontend.vercel.app
   ```

---

## 🎯 **PART 2: DEPLOY ADMIN PANEL TO VERCEL**

### **Step 2.1: Create New Vercel Project**
1. Go to Vercel dashboard
2. Click **New Project**
3. Select same GitHub repository
4. Click **Import**

### **Step 2.2: Configure Admin Panel Settings**
1. **Project Name:** `promptcraftery-admin`
2. **Framework Preset:** Select **Create React App**
3. **Root Directory:** Click **Edit** and set to: `admin`
4. **Build Command:** `npm run build`
5. **Output Directory:** `build`
6. **Install Command:** `npm install`

### **Step 2.3: Add Environment Variables**
1. Click **Environment Variables**
2. Add these variables:
   ```
   REACT_APP_API_URL = https://your-backend-render-url.com/api
   PORT = 3001
   ```

### **Step 2.4: Deploy**
1. Click **Deploy**
2. Wait for build (5-10 minutes)
3. You'll get your admin URL:
   ```
   https://promptcraftery-admin.vercel.app
   ```

---

## ⚙️ **PART 3: DEPLOY BACKEND TO RENDER**

### **Step 3.1: Sign Up / Login to Render**
1. Go to: https://render.com
2. Click **Sign Up** or **Login**
3. Choose **GitHub** as provider
4. Authorize Render

### **Step 3.2: Create Backend Service**
1. Click **New +** → **Web Service**
2. Select **PromptCraftery** repository
3. Click **Connect**

### **Step 3.3: Configure Backend Settings**
```
Name:                promptcraftery-backend
Environment:         Node
Region:              Oregon (or closest to you)
Branch:              main
Build Command:       cd backend && npm install
Start Command:       cd backend && npm start
Plan:                Free
```

### **Step 3.4: Add Environment Variables**
Click **Environment** and add:

```
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://souravsingha502_db_user:Y9TwOpIVPl9eITVI@clusterpromptcraftery.n5mugkr.mongodb.net/?appName=Clusterpromptcraftery

JWT_SECRET=[Generate with: openssl rand -base64 32]
JWT_EXPIRE=7d

FRONTEND_URL=https://promptcraftery-frontend.vercel.app
ADMIN_URL=https://promptcraftery-admin.vercel.app

RAZORPAY_KEY_ID=rzp_live_SgYjBLSs7L5T2Z
RAZORPAY_KEY_SECRET=YxkBH2sd1VriqAH1VeAYIwHd

GOOGLE_CLIENT_ID=218606597208-nvd5n2mvhns56tnfkpbh7g84q3nnepf9.apps.googleusercontent.com
```

### **Step 3.5: Deploy**
1. Click **Create Web Service**
2. Wait for deployment (10-15 minutes)
3. Get your backend URL:
   ```
   https://promptcraftery-backend.onrender.com
   ```

---

## 🔄 **STEP 4: UPDATE FRONTEND/ADMIN WITH BACKEND URL**

Once backend is deployed, update your frontend/admin:

### **In Vercel Frontend Settings:**
1. Go to **Settings** → **Environment Variables**
2. Update: `REACT_APP_API_URL = https://promptcraftery-backend.onrender.com/api`
3. Click **Save**
4. Trigger **Redeploy** to update

### **In Vercel Admin Settings:**
1. Go to **Settings** → **Environment Variables**
2. Update: `REACT_APP_API_URL = https://promptcraftery-backend.onrender.com/api`
3. Click **Save**
4. Trigger **Redeploy** to update

---

## 🔐 **STEP 5: VERIFY DEPLOYMENTS**

### **Test Frontend:**
```
✅ Visit: https://promptcraftery-frontend.vercel.app
✅ Check if homepage loads
✅ Browse categories
✅ Click on a prompt
```

### **Test Admin:**
```
✅ Visit: https://promptcraftery-admin.vercel.app
✅ Login with: admin@promptvault.com / Admin@123456
✅ Check dashboard
```

### **Test Backend API:**
```
✅ Visit: https://promptcraftery-backend.onrender.com/api/health
✅ Should return: {"status":"ok","timestamp":"..."}
```

---

## 📊 **YOUR PRODUCTION URLS**

Once deployed, you'll have:

```
Frontend:     https://promptcraftery-frontend.vercel.app
Admin:        https://promptcraftery-admin.vercel.app
Backend:      https://promptcraftery-backend.onrender.com
Database:     MongoDB Atlas (already configured)
```

---

## 🆘 **TROUBLESHOOTING**

### **If Frontend Build Fails:**
```
❌ Check: Root directory set to 'frontend'
❌ Check: .vercelignore exists
❌ Check: package.json exists in frontend/
✅ Solution: Redeploy after fixes
```

### **If Backend Deployment Fails:**
```
❌ Check: Render.yaml configured correctly
❌ Check: Environment variables set
❌ Check: MongoDB URI is correct
✅ Solution: Check build logs in Render dashboard
```

### **If Prompts Don't Load:**
```
❌ Check: REACT_APP_API_URL is correct
❌ Check: Backend is running
❌ Check: MongoDB connection working
✅ Solution: Check browser console for errors
```

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Frontend deployed to Vercel
- [ ] Admin deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] MongoDB Atlas connected
- [ ] Frontend can fetch data from backend
- [ ] Admin panel login works
- [ ] All 210,210 prompts accessible
- [ ] Categories loading correctly
- [ ] Copy limit enforcement working

---

## 🎉 **SUCCESS!**

Your PromptCraftery application is now live in production with:
- ✅ Scalable cloud infrastructure
- ✅ 210,210+ prompts available
- ✅ Subscription system working
- ✅ Admin management panel
- ✅ Global MongoDB database
- ✅ Google OAuth integration

---

## 📞 **SUPPORT**

For issues:
1. Check Vercel/Render deployment logs
2. Verify environment variables
3. Check MongoDB connection
4. Review browser console for errors
