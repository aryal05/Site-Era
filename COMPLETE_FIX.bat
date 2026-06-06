@echo off
cls
echo ================================================================================
echo               COMPLETE FIX FOR CHUNK LOAD ERROR
echo ================================================================================
echo.
echo This will:
echo   1. Kill all Node processes
echo   2. Completely remove .next folder
echo   3. Clear npm cache
echo   4. Start fresh dev server
echo.
echo ================================================================================
pause
echo.

echo [Step 1/5] Killing Node processes...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL%==0 (
    echo     ✓ Node processes killed
) else (
    echo     ✓ No Node processes running
)
timeout /t 2 /nobreak >nul

echo [Step 2/5] Removing .next folder...
if exist .next (
    takeown /F .next /R /D Y >nul 2>&1
    icacls .next /grant Everyone:F /T >nul 2>&1
    rmdir /s /q .next
    if exist .next (
        echo     ✗ Failed to remove .next folder
        echo.
        echo     Try manually: Close all apps, then delete .next folder
        pause
        exit /b 1
    ) else (
        echo     ✓ .next folder removed
    )
) else (
    echo     ✓ .next folder doesn't exist
)

echo [Step 3/5] Clearing npm cache...
call npm cache clean --force >nul 2>&1
echo     ✓ Cache cleared

echo [Step 4/5] Verifying environment...
if not exist package.json (
    echo     ✗ package.json not found!
    echo     Make sure you're in the site-era folder
    pause
    exit /b 1
)
echo     ✓ Environment OK

echo [Step 5/5] Starting dev server...
echo.
echo ================================================================================
echo                    DEV SERVER STARTING
echo ================================================================================
echo.
echo IMPORTANT: After server starts, you MUST:
echo.
echo   1. Clear Browser Cache:
echo      - Press: Ctrl + Shift + Delete
echo      - Select: "All time" 
echo      - Check: "Cached images and files"
echo      - Click: "Clear data"
echo.
echo   2. Hard Refresh:
echo      - Press: Ctrl + Shift + R
echo.
echo   3. Or Use Incognito:
echo      - Press: Ctrl + Shift + N
echo      - Go to: http://localhost:3000
echo.
echo ================================================================================
echo.
echo Server URL: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ================================================================================
echo.

call npm run dev

echo.
echo ================================================================================
echo                         Server Stopped
echo ================================================================================
pause
