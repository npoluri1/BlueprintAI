@echo off
cd /d "%~dp0"

:: Try to add hosts entry (requires admin)
echo Checking hosts entry for blueprintai.local...
findstr /I "blueprintai.local" "%windir%\System32\drivers\etc\hosts" >nul 2>&1
if %errorlevel% neq 0 (
    echo Adding blueprintai.local to hosts file (admin required)...
    powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c echo 127.0.0.1 blueprintai.local >> %windir%\System32\drivers\etc\hosts & echo ::1 blueprintai.local >> %windir%\System32\drivers\etc\hosts & echo Added!'" -WindowStyle Normal
    timeout /t 3 /nobreak >nul
)

echo.
echo ========================================
echo   BlueprintAI - Local Development
echo ========================================
echo.
echo   HTTPS: https://blueprintai.local:3001
echo   HTTP:  http://blueprintai.local:3001
echo.
echo   First run will generate a self-signed cert.
echo   You may be prompted for admin password to trust it.
echo.
echo ========================================
echo.
npx next dev --hostname blueprintai.local -p 3001 --experimental-https
pause