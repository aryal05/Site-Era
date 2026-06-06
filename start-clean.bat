@echo off
echo ========================================
echo Starting Fresh Dev Server
echo ========================================
echo.

echo [1/4] Killing old Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2/4] Cleaning .next folder...
if exist .next (
    takeown /F .next /R /D Y >nul 2>&1
    icacls .next /grant Everyone:F /T >nul 2>&1
    rmdir /s /q .next >nul 2>&1
)
echo     ✓ Clean

echo [3/4] Creating .next with permissions...
mkdir .next >nul 2>&1
icacls .next /grant Everyone:F >nul 2>&1
echo     ✓ Ready

echo [4/4] Starting dev server...
echo.
echo ========================================
echo Server will start on http://localhost:3000
echo ========================================
echo.
echo AFTER SERVER STARTS:
echo 1. Clear browser cache (Ctrl+Shift+Delete)
echo 2. Hard refresh (Ctrl+Shift+R)
echo 3. Or use Incognito (Ctrl+Shift+N)
echo.
echo ========================================
echo.

npm run dev
