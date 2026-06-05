# 🚀 CodeVerse Deployment Checklist

## Current Status: ✅ Code Ready - Needs Redeploy

All API routes have been fixed and code is pushed to GitHub. Follow these steps to complete deployment.

---

## Step 1: Verify Environment Variables in Vercel ⚙️

1. Go to: https://vercel.com/dashboard
2. Select your **CodeVerse** project (codeverse-eosin)
3. Click **Settings** → **Environment Variables**
4. Verify these 5 variables exist for **ALL ENVIRONMENTS** (Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
NEXT_PUBLIC_SITE_URL
```

**If any are missing**, copy from `vercel-env-import.txt` and add them.

---

## Step 2: Redeploy from Vercel 🔄

### Option A: Automatic (Recommended)
1. Vercel should **automatically deploy** when it detects the new GitHub commit
2. Check **Deployments** tab to see if a build is running
3. Wait for deployment to complete (usually 2-3 minutes)

### Option B: Manual Trigger
1. Go to **Deployments** tab
2. Find the most recent deployment
3. Click the **⋮** menu → **Redeploy**
4. Confirm and wait for completion

---

## Step 3: Test the Health Endpoint ✅

Once deployment completes, test the health check:

**Browser**: Open this URL
```
https://codeverse-eosin.vercel.app/api/health
```

**Command Line**:
```bash
curl https://codeverse-eosin.vercel.app/api/health
```

**Expected Response** (all `true`):
```json
{
  "status": "ok",
  "message": "All systems operational",
  "database": "connected",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": true,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": true,
    "SUPABASE_SERVICE_ROLE_KEY": true,
    "JWT_SECRET": true,
    "NEXT_PUBLIC_SITE_URL": true
  },
  "timestamp": "2026-06-05T..."
}
```

❌ **If any env value shows `false`**: Go back to Step 1 and add the missing variables.

---

## Step 4: Test API Endpoints 🧪

Test each API endpoint to ensure they return **JSON** (not HTML error pages):

### Test Projects
```bash
curl https://codeverse-eosin.vercel.app/api/projects
```
Expected: `[]` (empty array) or array of projects

### Test Services
```bash
curl https://codeverse-eosin.vercel.app/api/services
```
Expected: `[]` (empty array) or array of services

### Test Blog
```bash
curl https://codeverse-eosin.vercel.app/api/blog
```
Expected: `[]` (empty array) or array of blog posts

### Test Testimonials
```bash
curl https://codeverse-eosin.vercel.app/api/testimonials
```
Expected: `[]` (empty array) or array of testimonials

### Test Messages
```bash
curl https://codeverse-eosin.vercel.app/api/messages
```
Expected: `[]` (empty array) or array of messages

✅ **All should return valid JSON arrays** - NOT `<!DOCTYPE html>`

---

## Step 5: Test Frontend Homepage 🏠

1. Open: https://codeverse-eosin.vercel.app
2. Check for these sections:
   - ✅ Hero section loads
   - ✅ Services section (should show "No services available yet" if empty)
   - ✅ Portfolio section (should show "No projects to display" if empty)
   - ✅ Testimonials section
   - ✅ Contact form
3. Browser console should show **NO ERRORS** like:
   - ❌ `Failed to fetch services: SyntaxError: Unexpected token '<'`
   - ❌ `Failed to fetch projects: SyntaxError: Unexpected token '<'`

---

## Step 6: Test Contact Form 📧

1. Go to homepage or `/contact` page
2. Fill out the contact form:
   - Name: Test User
   - Email: test@example.com
   - Message: Test message
3. Click **Send Message**
4. Should show: ✅ **"Message sent successfully!"**
5. Should NOT show: ❌ **"Failed to send message"**

---

## Step 7: Seed Database via Admin Panel 🌱

Once APIs are working, add content:

1. Go to: https://codeverse-eosin.vercel.app/admin
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. Add content in order:
   - **Services**: Add 3-6 services (mark some as featured)
   - **Projects**: Add 3-6 projects (mark some as featured)
   - **Blog Posts**: Add 2-3 blog posts (mark some as featured)
   - **Testimonials**: Add 3-5 client testimonials
   - **Team Members**: Add your team (optional)

4. After adding content, refresh homepage to see it displayed

---

## Step 8: Final Verification ✨

Visit the live site and check:
- ✅ Homepage shows services in "Our Services" section
- ✅ Homepage shows projects in "Featured Projects" section
- ✅ Homepage shows testimonials
- ✅ Services page (`/services`) lists all services
- ✅ Portfolio page (`/portfolio`) lists all projects
- ✅ Blog page (`/blog`) lists all posts
- ✅ Contact form works and saves messages
- ✅ Admin panel allows editing content
- ✅ Theme toggle switches between light/dark (defaults to light)
- ✅ Site shows "CodeVerse" branding (not SiteEra)
- ✅ Favicon shows "CV" (not "SE")

---

## Troubleshooting 🔧

### Issue: APIs still return HTML error pages
**Solution**: 
1. Check environment variables are set for **Production** environment
2. Redeploy again
3. Wait 2-3 minutes for propagation
4. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)

### Issue: Health endpoint shows `false` for some env vars
**Solution**:
1. Go back to Vercel → Settings → Environment Variables
2. Make sure variables are set for **Production** environment (not just Development)
3. After adding, redeploy

### Issue: Database connection error
**Solution**:
1. Verify Supabase project is active at https://supabase.com/dashboard
2. Check `NEXT_PUBLIC_SUPABASE_URL` matches your project URL
3. Check `SUPABASE_SERVICE_ROLE_KEY` is the **service role** key (not anon key)

### Issue: "No data" showing on homepage
**Solution**:
1. This is expected if database is empty
2. Go to `/admin` and add content (Step 7)
3. Make sure to check **"Featured"** checkbox for items to show on homepage

---

## Quick Reference

| Resource | URL |
|----------|-----|
| Live Site | https://codeverse-eosin.vercel.app |
| Admin Panel | https://codeverse-eosin.vercel.app/admin |
| Health Check | https://codeverse-eosin.vercel.app/api/health |
| GitHub Repo | https://github.com/aryal05/Site-Era |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard/project/ymwavisoanxlayuqhehn |

| Credential | Value |
|------------|-------|
| Admin Username | admin |
| Admin Password | admin123 |

---

## Files to Reference

- `API_ROUTES_FIXED.md` - Detailed technical explanation of the fix
- `vercel-env-import.txt` - Exact environment variable values
- `VERCEL_DEPLOYMENT_STEPS.md` - Original deployment guide
- `HOW_TO_IMPORT_ENV_TO_VERCEL.md` - Guide for setting env vars

---

## Summary

1. ✅ Code is ready and pushed to GitHub
2. ⏳ Waiting for you to redeploy on Vercel
3. ⏳ Test the `/api/health` endpoint after deploy
4. ⏳ Test API endpoints return JSON
5. ⏳ Seed database via admin panel
6. ⏳ Verify frontend displays content

**Current Step**: Redeploy on Vercel (Step 2)
