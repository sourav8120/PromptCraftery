# 🚀 **DEPLOYMENT QUICK START (5-STEP PROCESS)**

## **STEP 1️⃣: Prepare Backend (2 minutes)**

Create file: `backend/render.yaml`
```yaml
services:
  - type: web
    name: promptcraftery-backend
    runtime: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 5001
      - key: MONGODB_URI
        sync: false
```

Then push to GitHub:
```bash
git add -A
git commit -m "Ready for production deployment"
git push origin main
```

---

## **STEP 2️⃣: Deploy Frontend to Vercel (10 minutes)**

1. Go to: **https://vercel.com**
2. Click **New Project**
3. Import `PromptCraftery` GitHub repository
4. **Root Directory:** `frontend`
5. **Build Command:** `npm run build`
6. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url/api
   REACT_APP_RAZORPAY_KEY_ID=rzp_live_SgYjBLSs7L5T2Z
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SgYjBLSs7L5T2Z
   REACT_APP_GOOGLE_CLIENT_ID=218606597208-nvd5n2mvhns56tnfkpbh7g84q3nnepf9.apps.googleusercontent.com
   ```
7. Click **Deploy**
8. ✅ Wait 5-10 minutes → You get: `https://promptcraftery-frontend.vercel.app`

---

## **STEP 3️⃣: Deploy Admin Panel to Vercel (10 minutes)**

1. Go to: **https://vercel.com/dashboard**
2. Click **New Project**
3. Import same repository
4. **Root Directory:** `admin`
5. **Build Command:** `npm run build`
6. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url/api
   PORT=3001
   ```
7. Click **Deploy**
8. ✅ Wait 5-10 minutes → You get: `https://promptcraftery-admin.vercel.app`

---

## **STEP 4️⃣: Deploy Backend to Render (15 minutes)**

1. Go to: **https://render.com**
2. Click **New +** → **Web Service**
3. Select `PromptCraftery` GitHub repo
4. **Settings:**
   ```
   Name: promptcraftery-backend
   Region: Oregon
   Branch: main
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```
5. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://souravsingha502_db_user:Y9TwOpIVPl9eITVI@clusterpromptcraftery.n5mugkr.mongodb.net/?appName=Clusterpromptcraftery
   FRONTEND_URL=https://promptcraftery-frontend.vercel.app
   ADMIN_URL=https://promptcraftery-admin.vercel.app
   RAZORPAY_KEY_ID=rzp_live_SgYjBLSs7L5T2Z
   RAZORPAY_KEY_SECRET=YxkBH2sd1VriqAH1VeAYIwHd
   JWT_SECRET=[Generate new: openssl rand -base64 32]
   NODE_ENV=production
   ```
6. Click **Create Web Service**
7. ✅ Wait 10-15 minutes → You get: `https://promptcraftery-backend.onrender.com`

---

## **STEP 5️⃣: Update URLs & Redeploy (5 minutes)**

Once Backend is deployed:

### **Update Vercel Frontend:**
1. Go to `promptcraftery-frontend` project
2. **Settings** → **Environment Variables**
3. Update: `REACT_APP_API_URL=https://promptcraftery-backend.onrender.com/api`
4. Click **Redeploy**

### **Update Vercel Admin:**
1. Go to `promptcraftery-admin` project
2. **Settings** → **Environment Variables**
3. Update: `REACT_APP_API_URL=https://promptcraftery-backend.onrender.com/api`
4. Click **Redeploy**

---

## ✅ **YOUR LIVE PRODUCTION URLS**

| Service | URL |
|---------|-----|
| **Frontend** | https://promptcraftery-frontend.vercel.app |
| **Admin** | https://promptcraftery-admin.vercel.app |
| **Backend** | https://promptcraftery-backend.onrender.com |
| **API Health** | https://promptcraftery-backend.onrender.com/api/health |

---

## 🧪 **VERIFY EVERYTHING WORKS**

```bash
# Test Frontend
✅ Visit: https://promptcraftery-frontend.vercel.app
✅ Should load homepage with all prompts
✅ Try clicking a category

# Test Admin
✅ Visit: https://promptcraftery-admin.vercel.app
✅ Login: admin@promptvault.com / Admin@123456
✅ Should show dashboard

# Test Backend
✅ Visit: https://promptcraftery-backend.onrender.com/api/health
✅ Should return: {"status":"ok",...}
```

---

## ⏱️ **TOTAL TIME: ~40 minutes**

---

## 🎉 **YOU'RE LIVE!**

Your production stack is now deployed globally with:
- ✅ 210,210+ prompts available
- ✅ Full subscription system
- ✅ Admin management panel
- ✅ Global MongoDB database
- ✅ Auto-scaling infrastructure
