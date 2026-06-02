# 🔧 TROUBLESHOOTING GUIDE

## Problem: Featured Projects Not Showing

### Quick Fix (Try This First):

1. **Stop both servers** (Ctrl+C in both terminals)

2. **Run the full restart script**:
   ```cmd
   cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
   FULL_RESTART.cmd
   ```
   
   This will:
   - Delete old database
   - Create new database with 12 projects (4 featured)
   - Start backend server automatically
   - Start frontend server automatically

3. **Wait 10 seconds** for servers to start

4. **Open browser**: http://localhost:5173

5. **Check home page** - Should see 4 featured projects in Portfolio section

---

## If That Didn't Work:

### Check 1: Is Backend Running?
Open: http://localhost:5000/api/projects?featured=true

**Expected**: JSON with 4 projects
**If error**: Backend not running or database issue

### Check 2: Is Frontend Running?
Open: http://localhost:5173

**Expected**: Site loads
**If error**: Frontend not running

### Check 3: Check Browser Console
Press F12 → Console tab

**Look for errors like**:
- "Failed to fetch"
- "Network error"  
- "Cannot GET /api/projects"

---

## Manual Step-by-Step Fix:

### Step 1: Stop Everything
- Close ALL terminals running npm/node
- Check Task Manager → End any node.exe processes

### Step 2: Delete Old Database
```cmd
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
del server\db\siteera.db
```

### Step 3: Reseed Database
```cmd
node server\db\seed.js
```

**You should see**:
```
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

**If you see errors**: Read the error message carefully, might be missing npm packages.

### Step 4: Start Backend
**Terminal 1**:
```cmd
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
npm run dev
```

**You should see**:
```
Server running on port 5000
✅ Database initialized
```

### Step 5: Start Frontend
**Terminal 2**:
```cmd
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era\client
npm run dev
```

**You should see**:
```
VITE v... ready in ...ms

➜  Local:   http://localhost:5173/
```

### Step 6: Test
1. Open http://localhost:5173
2. Scroll to Portfolio section on home page
3. Should see 4 featured projects:
   - NepalPay Dashboard
   - ShopKo Mobile
   - TrekNepal
   - MedConnect

---

## Common Issues:

### Issue: "Port 5000 already in use"
**Solution**:
```cmd
REM Kill process on port 5000
netstat -ano | findstr :5000
REM Note the PID (last number)
taskkill /PID <number> /F
```

### Issue: "Port 5173 already in use"
**Solution**:
```cmd
REM Kill process on port 5173
netstat -ano | findstr :5173
REM Note the PID (last number)
taskkill /PID <number> /F
```

### Issue: "Module not found"
**Solution**:
```cmd
REM Reinstall dependencies
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
npm install

cd client
npm install
```

### Issue: Database locked
**Solution**:
1. Stop all servers
2. Delete database: `del server\db\siteera.db`
3. Reseed: `node server\db\seed.js`
4. Restart servers

### Issue: Projects array is empty
**Solution**: Database not seeded or API not returning data
1. Check backend terminal for errors
2. Visit: http://localhost:5000/api/projects?featured=true
3. Should return JSON with 4 projects
4. If empty, reseed database

### Issue: "tech_stack.slice is not a function"
**Solution**: tech_stack is a string, not parsed as array
- This is fixed in the updated controller
- Reseed database to ensure clean data

---

## Verify Database Has Projects:

### Option 1: Test API Directly
Open in browser:
- All projects: http://localhost:5000/api/projects
- Featured only: http://localhost:5000/api/projects?featured=true
- Single project: http://localhost:5000/api/projects/1

### Option 2: Use SQLite Browser
1. Download DB Browser for SQLite
2. Open: `server/db/siteera.db`
3. Browse Data → projects table
4. Check:
   - Should have 12 rows
   - featured column: rows 1-4 should have value `1`
   - tech_stack: should be JSON strings like `["React","Node.js"]`
   - client, challenge, solution, results: should have text

---

## Expected Results:

### Home Page:
- Portfolio section shows 4 featured projects
- Each project has image, title, description
- Hover shows gold "View Case Study →" text
- Click takes you to detail page

### Portfolio Page (/portfolio):
- Shows all 12 projects
- Filters work (All, Web, Mobile, etc.)
- Search works
- Click any project shows detail page

### Project Detail Page (/portfolio/1):
- Shows project title, client, description
- Challenge section
- Solution section
- Results section
- Tech stack badges
- 3 metric cards
- Previous/Next navigation

---

## Still Not Working?

### Check These Files Exist:
```
server/db/schema.sql ✓
server/db/seed.js ✓
server/db/database.js ✓
server/controllers/projectsController.js ✓
server/routes/projects.js ✓
client/src/components/sections/Portfolio.jsx ✓
client/src/pages/Portfolio.jsx ✓
client/src/pages/ProjectDetail.jsx ✓
```

### Check Database File:
```cmd
dir server\db\siteera.db
```
Should show file size > 100 KB

If file is tiny (< 10 KB), database is empty - reseed!

---

## Nuclear Option (Start Fresh):

If nothing works:

```cmd
REM 1. Stop all servers

REM 2. Delete everything related to database
cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
del server\db\siteera.db
del server\db\siteera.db-journal

REM 3. Reinstall node modules
del /s /q node_modules
del package-lock.json
npm install

cd client
del /s /q node_modules  
del package-lock.json
npm install

REM 4. Reseed database
cd ..
node server\db\seed.js

REM 5. Use full restart script
FULL_RESTART.cmd
```

---

## Get Help:

If still not working, check:
1. Node.js version: `node --version` (should be 16+)
2. NPM version: `npm --version` (should be 8+)
3. Backend terminal errors
4. Frontend terminal errors
5. Browser console errors (F12)

---

## Success Checklist:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] No errors in backend terminal
- [ ] No errors in frontend terminal
- [ ] No errors in browser console (F12)
- [ ] http://localhost:5000/api/projects returns JSON with 12 projects
- [ ] http://localhost:5000/api/projects?featured=true returns 4 projects
- [ ] Home page loads
- [ ] Portfolio section on home shows 4 projects
- [ ] Gold "View Case Study" text visible on hover
- [ ] Click project → Goes to detail page (not 404)
- [ ] Detail page shows all sections (client, challenge, solution, results)

**All checked?** = Everything working! 🎉
