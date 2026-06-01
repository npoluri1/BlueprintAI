@echo off
cd /d "%~dp0"

:: BlueprintAI - 24/7 Enterprise Application Launcher
:: Supports: dev mode, production mode, Docker deployment

setlocal enabledelayedexpansion

:: === Configuration ===
set MODE=%1
if "%MODE%"=="" set MODE=dev

echo ========================================
echo   BlueprintAI - Enterprise AI Platform
echo   Mode: %MODE%
echo   Date: %date% %time%
echo ========================================
echo.

if /i "%MODE%"=="dev" goto :dev
if /i "%MODE%"=="prod" goto :prod
if /i "%MODE%"=="docker" goto :docker
if /i "%MODE%"=="docker-full" goto :dockerfull
if /i "%MODE%"=="hosts" goto :hosts
if /i "%MODE%"=="help" goto :help

goto :help

:: ---- Development Mode (Default) ----
:dev
echo [✓] Starting development server...
echo [i] URL:  https://blueprintai.local:3001
echo [i] URL:  http://blueprintai.local:3001
echo [i] Press Ctrl+C to stop
echo.
echo [!] For 24/7 operation, use: start.bat docker
echo.
npx next dev --hostname blueprintai.local -p 3001 --experimental-https
goto :end

:: ---- Production Mode (Node.js) ----
:prod
echo [✓] Building for production...
call npx next build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo [✓] Starting production server on port 3001...
echo [i] URL: http://localhost:3001
echo [i] Press Ctrl+C to stop
echo.
npx next start --hostname blueprintai.local -p 3001 --experimental-https --experimental-https-key ./blueprintai.local-key.pem --experimental-https-cert ./blueprintai.local.pem
goto :end

:: ---- Docker Production (24/7 Operation) ----
:docker
echo [✓] Starting Docker containers (app only)...
echo [i] URL: http://localhost:3001
echo [i] This runs 24/7 with auto-restart
echo.
docker-compose -f docker-compose.production.yml up -d --build
if %errorlevel% eq 0 (
    echo [✓] Application is running!
    echo [i] View logs: docker-compose -f docker-compose.production.yml logs -f app
    echo [i] Stop:     docker-compose -f docker-compose.production.yml down
) else (
    echo [ERROR] Docker failed to start. Is Docker installed?
    echo [i] Install Docker Desktop from https://www.docker.com/products/docker-desktop/
)
goto :end

:: ---- Docker Full Stack (With Vector DB + Redis) ----
:dockerfull
echo [✓] Starting full Docker stack (app + ChromaDB + Redis)...
echo [i] Requires Docker and docker-compose
echo [i] URL: http://localhost:3001
echo.
set COMPOSE_PROFILES=vector-db,full
docker-compose -f docker-compose.production.yml up -d --build
if %errorlevel% eq 0 (
    echo [✓] Full stack is running!
    echo [i] ChromaDB: http://localhost:8000
    echo [i] Redis:    localhost:6379
) else (
    echo [ERROR] Docker failed to start.
)
goto :end

:: ---- Add hosts entry ----
:hosts
echo Adding blueprintai.local to hosts file (admin required)...
powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c echo 127.0.0.1 blueprintai.local >> %windir%\System32\drivers\etc\hosts & echo ::1 blueprintai.local >> %windir%\System32\drivers\etc\hosts & echo [✓] Added!'" -WindowStyle Normal
goto :end

:: ---- Help ----
:help
echo Usage: start.bat [mode]
echo.
echo Modes:
echo   dev           Start development server (default)
echo   prod          Build and start production server
echo   docker        Start Docker containers for 24/7 operation
echo   docker-full   Start Docker with ChromaDB + Redis (full stack)
echo   hosts         Add blueprintai.local to hosts file
echo   help          Show this help
echo.
echo Examples:
echo   start.bat              - Development mode
echo   start.bat docker       - 24/7 Docker deployment
echo   start.bat docker-full  - Full enterprise stack
echo.
echo Quick Links:
echo   Dev:   https://blueprintai.local:3001
echo   Prod:  http://localhost:3001
echo   API:   http://localhost:3001/api/health
echo   MCP:   http://localhost:3001/api/mcp
echo.
echo Deployment:
echo   1. Build Docker image:  docker build -f Dockerfile.production -t blueprintai:latest .
echo   2. Run container:       docker run -p 3001:3001 blueprintai:latest
echo   3. Full stack:          start.bat docker-full
echo.
pause
goto :end

:end
echo.
echo [i] Exiting BlueprintAI launcher
endlocal
