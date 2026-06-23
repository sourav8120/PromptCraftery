# 📁 **HOW TO DEPLOY A SINGLE FOLDER TO VERCEL**

## **The Secret: "Root Directory" Setting** 🔑

Vercel can deploy **any folder** from your GitHub repo. You just need to tell it where!

---

## **STEP-BY-STEP: Deploy Frontend Folder**

### **Step 1: Go to Vercel Dashboard**
- Website: https://vercel.com
- Click **"Dashboard"** (top right)
- Or go: https://vercel.com/dashboard

### **Step 2: Add New Project**
- Click **"New"** button (top left)
- Select **"Add New..."** → **"Project"**

### **Step 3: Import GitHub Repository**
- Choose repository: `PromptCraftery` (your GitHub repo)
- Click **"Import"**

### **Step 4: Configure Project Settings**
```
Project Name: promptcraftery-frontend
Framework Preset: Create React App

✅ ROOT DIRECTORY: frontend  ← THIS IS THE KEY!
   (Click "Edit" if not shown)

Build Command: npm run build
Output Directory: build
```

**IMPORTANT:** Make sure you set Root Directory to `frontend`

### **Step 5: Add Environment Variables**

Click **"Environment Variables"** section:

```
Variable Name: REACT_APP_API_URL
Value: http://localhost:5001/api  (for now)

Variable Name: REACT_APP_RAZORPAY_KEY_ID
Value: rzp_live_SgYjBLSs7L5T2Z

Variable Name: REACT_APP_GOOGLE_CLIENT_ID
Value: 218606597208-nvd5n2mvhns56tnfkpbh7g84q3nnepf9.apps.googleusercontent.com
```

Then click **"Add"** for each one.

### **Step 6: Deploy!**
- Click **"Deploy"** button
- Wait 2-5 minutes ⏳
- You get: `https://promptcraftery-frontend.vercel.app` ✅

---

## **STEP-BY-STEP: Deploy Admin Folder**

### **Repeat Same Process BUT:**

1. Click **"New"** → **"Project"**
2. Import same `PromptCraftery` repo
3. **Project Name:** `promptcraftery-admin`
4. **ROOT DIRECTORY:** `admin` ← Change this!
5. **Build Command:** `npm run build`
6. Add environment variables (same as above)
7. Click **"Deploy"** ✅

---

## **QUICK COMPARISON**

| What | Frontend | Admin |
|------|----------|-------|
| **Repo** | `PromptCraftery` | `PromptCraftery` (same) |
| **Root Directory** | `frontend` | `admin` |
| **Project Name** | promptcraftery-frontend | promptcraftery-admin |
| **URL** | yourname-frontend.vercel.app | yourname-admin.vercel.app |

---

## **⚠️ COMMON MISTAKES TO AVOID**

### ❌ WRONG: Forgetting to Set Root Directory
- If you don't set Root Directory, Vercel looks for `package.json` at root
- **Result:** Deploy fails with "Cannot find package.json"
- **Fix:** Always set Root Directory to your folder name

### ❌ WRONG: Wrong Build Command
- If you use wrong build command, production build fails
- **Result:** App is blank/broken in production
- **Fix:** Use `npm run build` for React apps

### ❌ WRONG: Forgetting Environment Variables
- If you forget `.env` variables, API calls fail
- **Result:** App can't reach backend
- **Fix:** Add all REACT_APP_* variables before deploying

### ❌ WRONG: Using localhost API URLs
- If you use `http://localhost:5001/api`, it won't work in production
- **Result:** Frontend can't talk to backend
- **Fix:** Update to production backend URL after backend deployment

---

## **VISUAL CHECKLIST**

When you see this screen on Vercel:

```
┌─────────────────────────────────────┐
│ Project Setup                       │
├─────────────────────────────────────┤
│                                     │
│ Project Name: [Field]               │
│ Framework: Create React App         │
│ Root Directory: [frontend]  ✅      │  ← MUST BE SET!
│ Build Command: npm run build ✅     │
│ Output Directory: build ✅          │
│                                     │
│ Environment Variables:              │
│ □ REACT_APP_API_URL                 │
│ □ REACT_APP_RAZORPAY_KEY_ID         │
│ □ REACT_APP_GOOGLE_CLIENT_ID        │
│                                     │
│              [Deploy]               │
│                                     │
└─────────────────────────────────────┘
```

**You're ready to deploy!** ✅

---

## **WHAT HAPPENS AFTER CLICKING DEPLOY**

### **Phase 1: Building (2-3 minutes)**
```
⏳ Cloning repository
⏳ Installing dependencies (npm install)
⏳ Building project (npm run build)
✅ Build complete
```

### **Phase 2: Deploying (30-60 seconds)**
```
⏳ Creating deployment
⏳ Configuring CDN
✅ Deployment complete
```

### **Result: You Get a Live URL!**
```
🎉 Your app is live at:
   https://promptcraftery-frontend.vercel.app
```

---

## **AFTER DEPLOYMENT**

### **Test Your Deployment:**
```bash
# 1. Visit your URL
https://promptcraftery-frontend.vercel.app

# 2. Check if it loads
# 3. Open DevTools (F12)
# 4. Check Console tab for errors
```

### **If Something's Wrong:**
1. Go to Vercel Dashboard
2. Click your project
3. Go to **"Deployments"** tab
4. Click the failed deployment
5. Check **"Build Logs"** for errors

---

## **DEPLOYING BACKEND?**

⚠️ **NOTE:** Backend is different! Use **Render.com** instead:

- **Vercel:** For React frontend apps (JavaScript/TypeScript frontend)
- **Render:** For Node.js backend (Express servers)

See: `DEPLOYMENT_QUICK_START.md` → Step 4

---

## **SUMMARY**

**3 Projects = 3 Deployments:**

```
1. Frontend:
   - Repo: PromptCraftery
   - Root: frontend
   - Deploy to: Vercel

2. Admin:
   - Repo: PromptCraftery
   - Root: admin
   - Deploy to: Vercel

3. Backend:
   - Repo: PromptCraftery
   - Root: backend
   - Deploy to: Render (NOT Vercel)
```

---

## **🎯 NEXT STEPS**

1. ✅ Go to https://vercel.com
2. ✅ New Project → Import GitHub repo
3. ✅ Set Root Directory to `frontend`
4. ✅ Add environment variables
5. ✅ Click Deploy
6. ✅ Repeat for `admin` folder
7. ✅ Deploy backend to Render (separate process)

**Total time: ~30 minutes for all three** ⏱️

---

## 💬 **STILL CONFUSED?**

The key concept:
- **Same repository** (`PromptCraftery`)
- **Different folders** (`frontend`, `admin`, `backend`)
- **Different Root Directory settings** on Vercel
- **Different deployment services** (Vercel for frontend/admin, Render for backend)

That's it! 🎉
