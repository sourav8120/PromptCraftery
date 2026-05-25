# PromptCraftery - Google Authentication Setup Guide

## Changes Made

### 1. **Navbar Updates**
- ✅ Login and Sign Up buttons now **hide on login/register pages**
- ✅ Only shown on other pages for unauthenticated users
- File: `frontend/src/components/Navbar.js`

### 2. **Google Authentication Implementation**

#### Backend Setup
- Created Google token verification endpoint: `/api/google-auth/verify-google-token`
- Automatically creates new user on first Google login (free tier with 5 prompts)
- Returns JWT token for session management
- File: `backend/routes/google-auth.js`

#### Frontend Setup
- Added `googleLogin()` function to UserContext
- Updated Login and Register pages with Google Sign-In button
- Added divider between email and Google authentication
- File: `frontend/src/pages/LoginPage.js`
- File: `frontend/src/pages/RegisterPage.js`
- File: `frontend/src/context/UserContext.js`

#### Styling
- Added CSS for Google button container and divider
- Responsive design for mobile devices
- File: `frontend/src/pages/AuthPages.css`

#### HTML Setup
- Added Google Sign-In SDK script to public/index.html

## How to Configure Google Authentication

### Step 1: Create Google OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:3001` (admin panel)
   - Your production domain

7. Copy the **Client ID**

### Step 2: Add Client ID to Environment Variables

Edit `frontend/.env`:
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Replace `your_google_client_id_here` with the actual Client ID from Google Cloud Console.

## How Google Authentication Works

### Login Flow:
1. User clicks Google Sign-In button
2. Google SDK opens authentication dialog
3. User authenticates with Google account
4. Frontend receives credential token
5. Backend verifies token with Google
6. If user exists → Return JWT token
7. If new user → Create account (free tier) → Return JWT token
8. Frontend stores JWT and redirects to home page

### Key Features:
- ✅ **Automatic user creation** for first-time Google login
- ✅ **Free tier assigned** automatically (5 prompts)
- ✅ **Password-less login** via Google
- ✅ **Email verification** via Google
- ✅ **Seamless account linking** (if email already exists)

## Test Google Authentication Locally

1. Get Google Client ID from Google Cloud Console
2. Update `REACT_APP_GOOGLE_CLIENT_ID` in `.env`
3. Start frontend: `npm start`
4. Start backend: `npm start` (in backend folder)
5. Go to `http://localhost:3000/login` or `/register`
6. Click Google Sign-In button
7. Choose your Google account
8. You should be logged in automatically

## Troubleshooting

### "Google is not defined" error
- Make sure Google SDK script is loaded in `public/index.html`
- Check browser console for script loading errors
- Hard refresh the page (Ctrl+F5)

### Google button not rendering
- Verify `REACT_APP_GOOGLE_CLIENT_ID` is set correctly in `.env`
- Check that `window.google.accounts.id` is available
- Ensure Client ID has correct authorized origins

### "Invalid Google token" error
- Token may have expired (tokens valid for ~1 hour)
- Client ID may not match the project
- Backend couldn't verify with Google servers
- Check network tab in browser dev tools

### Backend not finding user
- Ensure User model has `copiedPrompts` field initialized
- Run migration if needed: `node fix-users.js`
- Check MongoDB connection

## Files Modified

### Backend
- `server.js` - Added Google auth route
- `routes/google-auth.js` - New Google token verification endpoint

### Frontend
- `components/Navbar.js` - Hide auth buttons on auth pages
- `pages/LoginPage.js` - Added Google login
- `pages/RegisterPage.js` - Added Google signup
- `context/UserContext.js` - Added googleLogin function
- `pages/AuthPages.css` - Added styles for divider and Google button
- `public/index.html` - Added Google SDK script
- `.env` - Added REACT_APP_GOOGLE_CLIENT_ID

## Next Steps

1. Get Google Client ID from Google Cloud Console
2. Update `.env` with Client ID
3. Test authentication flow
4. Deploy to production with production Google Client ID

## Production Checklist

- [ ] Get production Google Client ID
- [ ] Update `.env` with production Client ID
- [ ] Add production domain to Google authorized origins
- [ ] Test on production domain
- [ ] Monitor user creation and login events
