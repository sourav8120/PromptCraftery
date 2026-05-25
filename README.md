# PromptVault — AI Prompt Library (MERN Stack)

A full-stack AI prompt discovery platform with:
- 🌐 **Public Frontend** — Browse, search, filter, copy prompts
- 🔐 **Admin Panel** — Create, edit, manage prompts & categories
- ⚙️ **REST API** — Express + MongoDB backend

---

## 📁 Project Structure

```
promptvault/
├── backend/         ← Express API + MongoDB
├── frontend/        ← Public React website (port 3000)
├── admin/           ← Admin React panel (port 3001)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn

---

### 1. Backend Setup

```bash
cd backend
npm install

# Copy the env file and fill in your values
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/promptvault
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
```

**Seed the database** (creates categories, sample prompts, and default admin):
```bash
npm run seed
```

**Start the server:**
```bash
npm run dev       # development (with nodemon)
npm start         # production
```

Server runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

### 3. Admin Panel Setup

```bash
cd admin
npm install
npm start
```

Admin panel runs at: `http://localhost:3001`

**Default admin login (after seeding):**
- Email: `admin@promptvault.com`
- Password: `Admin@123456`

> ⚠️ **Change the default password** after your first login!

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/promptvault` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `your_secret_key_here` |
| `JWT_EXPIRE` | Token expiry duration | `7d` |
| `FRONTEND_URL` | Allowed CORS origin for frontend | `http://localhost:3000` |
| `ADMIN_URL` | Allowed CORS origin for admin | `http://localhost:3001` |

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Admin (`admin/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🌐 API Endpoints

### Public Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/categories` | List all active categories |
| GET | `/api/categories/:slug` | Get single category |
| GET | `/api/prompts` | List prompts (supports `search`, `category`, `difficulty`, `aiModel`, `featured`, `page`, `limit`, `sort`) |
| GET | `/api/prompts/:slug` | Get single prompt |
| POST | `/api/prompts/:id/copy` | Increment copy count |
| POST | `/api/prompts/:id/like` | Like a prompt |

### Admin Endpoints (require JWT Bearer token)

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current admin |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/prompts` | All prompts (including inactive) |
| POST | `/api/prompts` | Create prompt |
| PUT | `/api/prompts/:id` | Update prompt |
| DELETE | `/api/prompts/:id` | Delete prompt |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |
| GET | `/api/admin/admins` | List admins (superadmin only) |
| POST | `/api/admin/admins` | Create admin (superadmin only) |
| DELETE | `/api/admin/admins/:id` | Delete admin (superadmin only) |

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Frontend | React 18, React Router v6 |
| State/Data | TanStack Query (React Query) |
| Styling | CSS Modules (custom design system) |
| Fonts | Syne (display) + Inter (body) |
| Notifications | React Hot Toast |

---

## 🔧 Running All Three Simultaneously

Use three terminal windows, or install `concurrently`:

```bash
npm install -g concurrently

# From project root
concurrently \
  "cd backend && npm run dev" \
  "cd frontend && npm start" \
  "cd admin && npm start"
```

---

## 🚢 Production Deployment

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend & Admin (build)
```bash
cd frontend && npm run build
cd admin && npm run build
```

Serve the `build/` folders with Nginx, Vercel, Netlify, or any static host.

Update `REACT_APP_API_URL` in `.env` to your production API URL before building.

---

## 📧 Support & Customization

- Add more prompts via the admin panel at `http://localhost:3001`
- Bulk import via the `/api/admin/prompts/bulk` endpoint
- Customize colors/fonts in `frontend/src/index.css`
- The design system uses CSS variables for easy theming

---

**Built with ❤️ using the MERN Stack**
