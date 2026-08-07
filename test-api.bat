@echo off
echo ========================================
echo   Full API Integration Test
echo ========================================

echo.
echo [1] Login to get JWT token...
curl -s -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test@1234\"}" > token_response.json
type token_response.json

echo.
echo.
echo [2] Get current user (GET /auth/me)...
for /f "tokens=2 delims=:," %%a in ('findstr /r "\"token\"" token_response.json') do (
  set RAWTOKEN=%%a
)
set TOKEN=%RAWTOKEN:"=%
set TOKEN=%TOKEN: =%
echo Using token: %TOKEN:~0,30%...
curl -s http://localhost:8080/api/auth/me -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo [3] Test chat sessions endpoint...
curl -s http://localhost:8080/api/chat/sessions -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo [4] Test analytics overview (admin)...
curl -s http://localhost:8080/api/analytics/overview -H "Authorization: Bearer %TOKEN%"

echo.
echo Done!
