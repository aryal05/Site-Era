# Site Era - Deployment Guide

## Overview
Your project is now configured for **Vercel deployment** with **MongoDB Atlas** as the database.

## What's Changed
- ✅ SQLite → MongoDB Atlas (cloud database)
- ✅ Express server → Vercel Serverless Functions
- ✅ Everything deploys on Vercel (no Render needed!)

---

## Step 1: Create MongoDB Atlas Database

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up / Sign in
3. Create a new cluster (free tier M0 is fine)
4. Create a database user (remember username & password)
5. Add your IP to Network Access (or allow all IPs with `0.0.0.0/0`)
6. Click **Connect** → **Drivers** → **Node.js**
7. Copy your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/siteera?retryWrites=true&w=majority
   ```

---

## Step 2: Create GitHub Repository

```bash
# Create repo on GitHub named "siteera"
git remote add origin https://github.com/YOUR_USERNAME/siteera.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd site-era
vercel

# When prompted:
# - Link to existing project? No
# - Project name? siteera
```

### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repo
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: (leave empty - project root)
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/dist`
5. Add Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/siteera?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key
   ```
6. Click **Deploy**

---

## Step 4: Add Custom Domain (siteera.com)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add `siteera.com`
4. Follow DNS instructions:
   - Add A record: `76.76.21.21` (Vercel's IP)
   - Or add CNAME: `cname.vercel-dns.com`

---

## API Endpoints Available

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check API status |
| `/api/projects` | GET/POST | List/Create projects |
| `/api/projects/[id]` | GET/PUT/DELETE | Project operations |
| `/api/services` | GET/POST | List/Create services |
| `/api/services/[slug]` | GET/PUT/DELETE | Service operations |
| `/api/blog` | GET/POST | List/Create blog posts |
| `/api/blog/[slug]` | GET/PUT/DELETE | Blog operations |
| `/api/team` | GET/POST | List/Create team members |
| `/api/team/[id]` | GET/PUT/DELETE | Team operations |
| `/api/testimonials` | GET/POST | List/Create testimonials |
| `/api/testimonials/[id]` | GET/PUT/DELETE | Testimonial operations |
| `/api/messages` | GET/POST | List/Create messages |
| `/api/messages/[id]` | GET/PUT/DELETE | Message operations |
| `/api/auth/login` | POST | Admin login |
| `/api/auth/register` | POST | Create admin user |
| `/api/newsletter` | POST | Subscribe to newsletter |

---

## First Admin User

After deployment, create your first admin:

```bash
curl -X POST https://siteera.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "yourpassword"}'
```

---

## Local Development (Optional)

```bash
# Root level - runs both client and old server
npm run dev

# Or just client (API won't work without MongoDB)
cd client
npm run dev
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Database connection failed" | Check `MONGODB_URI` env var |
| API 404 errors | Check `/api` folder exists with `.js` files |
| Build fails | Check `client/dist` is set as output directory |
| CORS errors | Vercel handles this automatically |

---

## Files Changed
- `vercel.json` - Vercel configuration
- `netlify.toml` - Netlify configuration (backup)
- `api/` - Serverless functions directory
- `api/models/` - MongoDB models
- `client/src/utils/api.js` - Updated API URL

---

**You're ready to deploy! 🚀**
