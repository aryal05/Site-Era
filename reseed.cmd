@echo off
echo.
echo ========================================
echo   SITE ERA - DATABASE RESEED
echo ========================================
echo.
echo This will delete old database and create
echo a new one with 12 detailed projects.
echo.
echo IMPORTANT: Stop backend server first!
echo (Press Ctrl+C in backend terminal)
echo.
pause

echo.
echo [1/2] Deleting old database...
if exist server\db\siteera.db (
    del server\db\siteera.db
    echo ✅ Old database deleted
) else (
    echo ℹ️  No old database found
)

echo.
echo [2/2] Creating new database and seeding...
node server\db\seed.js

if errorlevel 1 (
    echo.
    echo ❌ ERROR: Seeding failed!
    echo Check error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ DATABASE RESEED COMPLETE!
echo ========================================
echo.
echo Now restart your backend server:
echo   npm run dev
echo.
echo Then refresh your browser.
echo.
echo Your database now has:
echo  ✅ 12 professional projects
echo  ✅ 4 featured projects
echo  ✅ Complete project details
echo  ✅ Client names and metrics
echo.
pause
