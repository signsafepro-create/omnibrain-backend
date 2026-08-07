@echo off
echo ========================================
echo   X-SOVERIGN.COM (Futuristic Version)
echo ========================================
cd /d C:\Users\wjhmo\X-SOVERIGN-BRAIN

:: Set UTF-8 to prevent emoji print crashes on Windows console
set PYTHONIOENCODING=utf-8

echo [1/2] Starting Express + Vite Unified Server on port 3000...
set RUN_SERVER=true
start cmd /k "cd /d C:\Users\wjhmo\X-SOVERIGN-BRAIN && set RUN_SERVER=true&& npx tsx server.ts"

echo [2/2] Starting Python Brain on port 5000...
start cmd /k "cd /d C:\Users\wjhmo\X-SOVERIGN-BRAIN && set PORT=5000&& set DATABASE_PATH=C:\Users\wjhmo\X-SOVERIGN-BRAIN\data\brain.db&& python api\main.py"

echo Launching web interface...
ping 127.0.0.1 -n 6 > nul
start http://localhost:3000
