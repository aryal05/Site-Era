@echo off
echo.
echo ============================================
echo   SITE ERA - FULL RESTART SCRIPT
echo ============================================
echo.
echo This will:
echo  1. Delete old database
echo  2. Create new database with 12 projects
echo  3. Start backend server
echo  4. Start frontend server
echo.
echo Make sure NO servers are currently running!
echo Close any npm/node terminals before proceeding.
echo.
pause

echo.
echo [1/4] Deleting old database...
if exist server\db\siteera.db (
    del server\db\siteera.db
    echo ✅ Old database deleted
) else (
    echo ℹ️  No old database found
)

echo.
echo [2/4] Creating new database with 12 projects...
node server\db\seed.js
if errorlevel 1 (
    echo ❌ Database seeding failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Starting backend server...
echo.
start "Site Era Backend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [4/4] Starting frontend server...
echo.
start "Site Era Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ============================================
echo   ✅ ALL DONE!
echo ============================================
echo.
echo Two new windows should have opened:
echo  - Backend: http://localhost:5000
echo  - Frontend: http://localhost:5173
echo.
echo Wait a few seconds for servers to start,
echo then open: http://localhost:5173
echo.
echo Admin login: admin@siteera.com / admin123
echo.
pause
