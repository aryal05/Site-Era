# 🔧 FIX: No Projects Showing

## Problem
- Home page: No featured projects
- Portfolio page: "No projects found matching your criteria"
- Database is empty or has old schema

## ✅ SOLUTION (3 Steps)

### Step 1: Stop Backend Server
In the terminal running the backend (where you see "Server running on port 5000"):
- Press `Ctrl + C` to stop it

### Step 2: Reseed Database
```cmd
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
reseed.cmd
```

**You should see:**
```
[1/2] Deleting old database...
✅ Old database deleted

[2/2] Creating new database and seeding...
🌱 Seeding database...
✅ Admin user created
✅ Projects seeded
✅ Testimonials seeded
✅ Settings seeded
✅ Blog posts seeded
✅ Services seeded
✅ Team members seeded
🎉 Database seeding completed!
```

### Step 3: Restart Backend
```cmd
npm run dev
```

### Step 4: Refresh Browser
- Go to http://localhost:5173
- Hard refresh: `Ctrl + Shift + R` or `Ctrl + F5`

---

## ✅ VERIFY IT WORKED

### Check 1: API Endpoint
Open in browser: http://localhost:5000/api/projects

**Should return JSON with 12 projects** like:
```json
[
  {
    "id": 1,
    "title": "NepalPay Dashboard",
    "category": "web",
    "featured": 1,
    "tech_stack": ["React", "Node.js", "PostgreSQL"],
    ...
  },
  ...
]
```

### Check 2: Featured Projects
Open: http://localhost:5000/api/projects?featured=true

**Should return 4 projects** (NepalPay, ShopKo, TrekNepal, MedConnect)

### Check 3: Home Page
Open: http://localhost:5173

**Scroll to Portfolio section**
- Should see 4 featured projects with images

### Check 4: Portfolio Page
Open: http://localhost:5173/portfolio

**Should see:**
- 12 projects in grid
- Filters at top (All, Web, Mobile, etc.)
- Search bar

---

## 🚨 IF STILL NOT WORKING

### Option 1: Use Full Restart Script
```cmd
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
FULL_RESTART.cmd
```

This will:
1. Delete database
2. Reseed with 12 projects
3. Start backend automatically
4. Start frontend automatically

### Option 2: Manual Deep Clean
```cmd
REM 1. Stop all servers (Ctrl+C in both terminals)

REM 2. Delete database file
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
del server\db\siteera.db

REM 3. Delete any journal files
del server\db\siteera.db-journal

REM 4. Reseed
node server\db\seed.js

REM 5. Start backend
npm run dev

REM 6. In another terminal, start frontend
cd client
npm run dev
```

### Option 3: Check Database File Size
```cmd
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era\server\db
dir siteera.db
```

**Expected**: File size should be **100+ KB**

**If it's < 10 KB**: Database is empty, reseed again!

---

## 🔍 TROUBLESHOOTING

### Error: "Cannot find module"
```cmd
npm install
cd client && npm install
```

### Error: "Port 5000 already in use"
```cmd
REM Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <number> /F
```

### Error: "Database locked"
1. Stop ALL servers
2. Delete database: `del server\db\siteera.db`
3. Reseed: `node server\db\seed.js`
4. Restart

### Projects Still Not Showing?

**Check backend terminal for errors:**
- Look for red error messages
- Check if server started successfully
- Should see "Server running on port 5000"

**Check frontend console (F12):**
- Open browser DevTools (F12)
- Go to Console tab
- Look for errors like "Failed to fetch" or "Network error"
- Should see successful API calls

**Check browser Network tab (F12):**
- Go to Network tab
- Refresh page
- Look for call to `/api/projects?featured=true`
- Click on it → Preview tab should show 4 projects

---

## ✅ EXPECTED RESULTS

After reseeding, you should have:

### Featured Projects (Home Page):
1. **NepalPay Dashboard** - Fintech payment platform
2. **ShopKo Mobile** - E-commerce mobile app
3. **TrekNepal** - Tourism booking platform
4. **MedConnect** - Healthcare telemedicine

### All Projects (Portfolio Page):
1. NepalPay Dashboard ⭐
2. ShopKo Mobile ⭐
3. TrekNepal ⭐
4. MedConnect ⭐
5. CloudERP
6. FoodRush
7. EduLearn Platform
8. AgriMarket
9. RealEstate Pro
10. FitLife Tracker
11. EventHub Nepal
12. NepalStock Tracker

---

## 🎯 QUICK TEST

After reseeding, test this URL in browser:
```
http://localhost:5000/api/projects?featured=true
```

**If you see JSON with 4 projects** = Database is working! ✅

**If you see error or empty array** = Need to reseed again ❌

---

## ⚡ FASTEST FIX

```cmd
REM Stop backend (Ctrl+C)
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
del server\db\siteera.db
node server\db\seed.js
npm run dev
REM Refresh browser (Ctrl+Shift+R)
```

**Done!** Projects should appear! 🎉
