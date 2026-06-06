@echo off
echo ================================
echo Cleaning and Restarting Dev Server
echo ================================
echo.

echo Step 1: Stopping any running processes...
taskkill /F /IM node.exe >nul 2>&1

echo Step 2: Cleaning build cache...
if exist .next rmdir /s /q .next
if exist .next\cache rmdir /s /q .next\cache

echo Step 3: Clearing npm cache...
npm cache clean --force

echo Step 4: Installing dependencies...
npm install

echo Step 5: Starting development server...
echo.
echo ================================
echo Server starting...
echo Visit: http://localhost:3000
echo ================================
echo.
npm run dev
