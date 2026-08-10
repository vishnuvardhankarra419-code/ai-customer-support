@echo off
echo Testing with promoted test user as admin...
curl -s -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test@1234\"}" > admin_token.json
type admin_token.json

echo.
echo.
echo [2] Get all users (admin only)...
for /f "tokens=2 delims=:," %%a in ('findstr /r "\"token\"" admin_token.json') do (
  set RAWTOKEN=%%a
)
set TOKEN=%RAWTOKEN:"=%
set TOKEN=%TOKEN: =%
curl -s http://localhost:8080/api/admin/users -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo [3] Analytics overview...
curl -s http://localhost:8080/api/analytics/overview -H "Authorization: Bearer %TOKEN%"

echo.
echo Done!
