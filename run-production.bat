@echo off
title AI Customer Support - Production Launch
color 0B

echo.
echo  ============================================================
echo    AI Customer Support Chatbot - Starting Production Server
echo  ============================================================
echo.

:: Check if MySQL is running
sc query MySQL80 | findstr "RUNNING" > nul
if errorlevel 1 (
    echo  [!] MySQL80 is not running. Starting it...
    net start MySQL80
    timeout /t 3 /nobreak > nul
) else (
    echo  [OK] MySQL80 is already running
)

:: Kill any processes using port 8080
echo  [..] Checking port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080 "') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo  [..] Starting Standalone Application JAR...
start "AI Customer Support - Production Server" cmd /k "java -jar C:\Users\vishnu reddy\ai-customer-support\backend\target\ai-customer-support-1.0.0.jar"

echo  [..] Waiting 10 seconds for server to initialize...
timeout /t 10 /nobreak > nul

echo.
echo  ============================================================
echo    Server started!
echo  ============================================================
echo.
echo   URL:          http://localhost:8080
echo   Swagger:      http://localhost:8080/swagger-ui.html
echo.
echo   Admin Login:  admin@aisupport.com / (see README)
echo   User Login:   test@example.com    / Test@1234
echo  ============================================================
echo.

:: Open browser
start "" "http://localhost:8080"

pause
