@echo off
cls
echo ================================================================================
echo                      SERVER HEALTH CHECK
echo ================================================================================
echo.

echo [1] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL%==0 (
    node --version
    echo     ✓ Node.js is installed
) else (
    echo     ✗ Node.js not found
    echo     Install from: https://nodejs.org
)
echo.

echo [2] Checking npm...
where npm >nul 2>&1
if %ERRORLEVEL%==0 (
    npm --version
    echo     ✓ npm is installed
) else (
    echo     ✗ npm not found
)
echo.

echo [3] Checking port 3000...
netstat -ano | findstr :3000 >nul 2>&1
if %ERRORLEVEL%==0 (
    echo     ⚠ Port 3000 is IN USE
    echo     Kill Node processes: taskkill /F /IM node.exe
) else (
    echo     ✓ Port 3000 is available
)
echo.

echo [4] Checking .next folder...
if exist .next (
    echo     ⚠ .next folder EXISTS
    echo     Should be deleted before starting
) else (
    echo     ✓ .next folder doesn't exist (good!)
)
echo.

echo [5] Checking node_modules...
if exist node_modules (
    echo     ✓ node_modules exists
) else (
    echo     ✗ node_modules missing
    echo     Run: npm install
)
echo.

echo [6] Checking package.json...
if exist package.json (
    echo     ✓ package.json exists
) else (
    echo     ✗ package.json missing
    echo     You're in the wrong folder!
)
echo.

echo [7] Checking environment file...
if exist .env.local (
    echo     ✓ .env.local exists
) else (
    echo     ⚠ .env.local missing
    echo     Copy from .env.example
)
echo.

echo ================================================================================
echo                         RECOMMENDATIONS
echo ================================================================================
echo.

if exist .next (
    echo NEXT STEP: Delete .next folder
    echo   Command: rmdir /s /q .next
    echo   Or run:  COMPLETE_FIX.bat
    echo.
)

netstat -ano | findstr :3000 >nul 2>&1
if %ERRORLEVEL%==0 (
    echo NEXT STEP: Kill Node processes on port 3000
    echo   Command: taskkill /F /IM node.exe
    echo.
)

if not exist node_modules (
    echo NEXT STEP: Install dependencies
    echo   Command: npm install
    echo.
)

echo Ready to start? Run: COMPLETE_FIX.bat
echo.
echo ================================================================================
pause
