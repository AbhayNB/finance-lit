@echo off
setlocal enabledelayedexpansion

echo Checking Node.js version...
node -v > tmp.txt
set /p current_version=<tmp.txt
del tmp.txt

echo Current Node.js version: %current_version%
echo Required version: v18.18.0 or higher

where nvm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo NVM for Windows is not installed.
    echo Please install NVM for Windows from: https://github.com/coreybutler/nvm-windows/releases
    echo After installing, run this script again.
    pause
    exit /b 1
)

echo Installing and using Node.js v18.18.0...
call nvm install 18.18.0
call nvm use 18.18.0

echo Cleaning up node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f package-lock.json
call npm cache clean --force

echo Done! Now run 'npm install'
pause
endlocal
