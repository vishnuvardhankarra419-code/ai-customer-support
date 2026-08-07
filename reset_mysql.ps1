$ErrorActionPreference = 'Stop'
$mysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$mysqlExe = "$mysqlBin\mysql.exe"
$mysqldExe = "$mysqlBin\mysqld.exe"
$mysqlAdminExe = "$mysqlBin\mysqladmin.exe"
$sqlFile = "$PSScriptRoot\reset_mysql_password.sql"

Write-Host "=== Resetting MySQL root password to '12345' ==="

# Step 1: Stop MySQL service
Write-Host "Stopping MySQL service..."
Stop-Service -Name "MySQL80" -Force
Start-Sleep -Seconds 3

# Step 2: Start mysqld with --skip-grant-tables in background
Write-Host "Starting MySQL in skip-grant-tables mode..."
$job = Start-Job -ScriptBlock {
    param($exe)
    & $exe --skip-grant-tables --skip-networking
} -ArgumentList $mysqldExe
Start-Sleep -Seconds 5

# Step 3: Apply the password reset SQL
Write-Host "Applying password reset..."
& $mysqlExe -u root --skip-password -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345'; FLUSH PRIVILEGES;"

# Step 4: Kill the skip-grant mysqld and restart service
Write-Host "Stopping temporary mysqld..."
Stop-Job $job -PassThru | Remove-Job
Get-Process mysqld -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Step 5: Restart the real MySQL service
Write-Host "Restarting MySQL service..."
Start-Service -Name "MySQL80"
Start-Sleep -Seconds 4

# Step 6: Verify
Write-Host "Verifying connection..."
& $mysqlExe -u root -p12345 -e "SHOW DATABASES;"
Write-Host "`nDone! MySQL root password is now '12345'."
