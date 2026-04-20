@echo off
echo ========================================================
echo         Starting PlacementIQ Development Servers
echo ========================================================

echo [1/2] Launching Python FastAPI Backend on Port 8000...
start "PlacementIQ Backend" cmd /k "cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000"

echo [2/2] Launching Next.js Frontend on Port 3000...
start "PlacementIQ Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Waiting 5 seconds for servers to boot up...
timeout /t 5 /nobreak >nul

echo Opening PlacementIQ in your default browser...
start http://localhost:3000

echo.
echo Both servers are starting up!
echo You can close this window at any time.
