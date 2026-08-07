@echo off
title AI Customer Support - Startup
color 0A

echo.
echo  ============================================================
echo    AI Customer Support Chatbot - Starting All Services
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

:: Kill any processes using port 8080 or 5173
echo  [..] Checking ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080 "') do (
    taskkill /F /PID %%a > nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo  [..] Starting Backend (Spring Boot on port 8080)...
start "Backend - Spring Boot" cmd /k "cd /d C:\Users\vishnu reddy\ai-customer-support\backend && mvn spring-boot:run"

echo  [..] Waiting 15 seconds for backend to initialize...
timeout /t 15 /nobreak > nul

echo  [..] Starting Frontend (Vite on port 5173)...
start "Frontend - Vite" cmd /k "cd /d C:\Users\vishnu reddy\ai-customer-support\frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo  ============================================================
echo    All services started!
echo  ============================================================
echo.
echo   Frontend:   http://localhost:5173
echo   Backend:    http://localhost:8080
echo   Swagger:    http://localhost:8080/swagger-ui.html
echo.
echo   Admin Login:  admin@aisupport.com  /  (see README)
echo   User Login:   test@example.com     /  Test@1234
echo.
echo  ============================================================
echo.

:: Open browser
start "" "http://localhost:5173"

pause
