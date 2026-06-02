@echo off
echo.
echo ============================================
echo    FIX: No Projects Showing
echo ============================================
echo.
echo This will fix the "No projects found" issue
echo.
echo IMPORTANT: Stop the backend server first!
echo (Press Ctrl+C in the backend terminal)
echo.
pause

echo.
echo [1/3] Deleting old database...
if exist server\db\siteera.db (
    del server\db\siteera.db
    echo ✅ Database deleted
)
if exist server\db\siteera.db-journal (
    del server\db\siteera.db-journal
    echo ✅ Journal file deleted
)

echo.
echo [2/3] Creating database with 12 projects...
node server\db\seed.js

if errorlevel 1 (
    echo.
    echo ❌ ERROR: Failed to create database!
    echo.
    echo Make sure you're in the site-era directory
    echo Run: cd c:\Users\aryal\Desktop\SITEERA-OWN-COMPANY\site-era
    pause
    exit /b 1
)

echo.
echo [3/3] Verifying database...
if exist server\db\siteera.db (
    echo ✅ Database created successfully!
) else (
    echo ❌ Database file not found!
    pause
    exit /b 1
)

echo.
echo ============================================
echo    ✅ FIX COMPLETE!
echo ============================================
echo.
echo Database now has:
echo  ✅ 12 professional projects
echo  ✅ 4 featured projects for home page
echo  ✅ All project details (client, challenge, solution, results)
echo.
echo Next steps:
echo  1. Start backend: npm run dev
echo  2. Refresh browser (Ctrl+Shift+R)
echo  3. Check home page - should see 4 featured projects
echo  4. Go to /portfolio - should see all 12 projects
echo.
pause
