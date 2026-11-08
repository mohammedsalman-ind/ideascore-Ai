@echo off
echo ========================================================
echo IdeaScore AI - Don't Just Build Ideas. Validate Them.
echo Starting Production Backend and Development Server...
echo ========================================================

start "IdeaScore AI Backend" cmd /k "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 2 /nobreak >nul

start "IdeaScore AI Frontend (Vite Dev)" cmd /k "cd frontend && npm run dev"

echo.
echo IdeaScore AI is launching:
echo   - Web Terminal (Full Application): http://localhost:8000
echo   - Vite Frontend Dev Server:        http://localhost:5173
echo   - Backend Swagger API Docs:        http://localhost:8000/docs
echo.
pause

