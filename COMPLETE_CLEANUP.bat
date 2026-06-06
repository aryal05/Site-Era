@echo off
echo ========================================
echo COMPLETE PROJECT CLEANUP
echo ========================================
echo.
echo This will:
echo - Kill all Node processes
echo - Delete .next folder
echo - Clear npm cache
echo - Reinstall dependencies
echo - Restart dev server
echo.
pause

echo.
echo [1/5] Killing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/5] Deleting .next folder...
if exist .next (
    rmdir /s /q .next
    echo     ✓ .next deleted
) else (
    echo     ✓ .next already clean
)

echo [3/5] Deleting node_modules...
if exist node_modules (
    echo     This may take a minute...
    rmdir /s /q node_modules
    echo     ✓ node_modules deleted
) else (
    echo     ✓ node_modules already clean
)

echo [4/5] Clearing npm cache...
npm cache clean --force
echo     ✓ Cache cleared

echo [5/5] Installing dependencies...
npm install
echo     ✓ Dependencies installed

echo.
echo ========================================
echo CLEANUP COMPLETE!
echo ========================================
echo.
echo Starting dev server...
echo Visit: http://localhost:3000
echo.
echo IMPORTANT: 
echo 1. Clear your browser cache (Ctrl+Shift+Delete)
echo 2. Hard refresh (Ctrl+Shift+R)
echo 3. Or use Incognito mode
echo.
echo ========================================
echo.

npm run dev
