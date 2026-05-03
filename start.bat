@echo off
echo ========================================================
echo         PlacementIQ — Development Server Startup
echo ========================================================
echo.

REM ── Check for .env file in backend ───────────────────────
if not exist "backend\.env" (
    echo [WARNING] backend\.env not found.
    echo           Copying .env.example to .env — please fill in GROQ_API_KEY.
    copy "backend\.env.example" "backend\.env" >nul 2>&1
)

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "PlacementIQ Backend" cmd /k "cd backend && python -m venv venv 2>nul & venv\Scripts\activate && pip install -r requirements.txt -q && uvicorn app.main:app --reload --port 8000"

echo [2/2] Launching Next.js Frontend on http://localhost:3000 ...
start "PlacementIQ Frontend" cmd /k "cd frontend && npm install --silent && npm run dev"

echo.
echo Waiting 8 seconds for servers to boot...
timeout /t 8 /nobreak >nul

echo Opening PlacementIQ in your default browser...
start http://localhost:3000

echo.
echo ✓ Both servers are running!
echo   Backend API:    http://localhost:8000/docs
echo   Frontend App:   http://localhost:3000
echo.
echo You can close this window — the server windows will keep running.
pause
