$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
if (-not (Test-Path $JAVA_HOME)) {
    # Try alternate path
    $JAVA_HOME = (Get-ChildItem "C:\Program Files\Microsoft" -Filter "jdk-21*" -Directory | Select-Object -First 1).FullName
}

$env:JAVA_HOME = $JAVA_HOME
$env:PATH = "$JAVA_HOME\bin;$env:PATH"

Write-Host "Using JAVA_HOME: $JAVA_HOME"
java -version

# Download Maven 3.9.9 using curl
$mvnUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"
$installDir = "$HOME\maven"

Write-Host "Downloading Maven..."
curl.exe -L -o "$env:TEMP\mvn.zip" $mvnUrl --retry 5 --retry-delay 3

Write-Host "Extracting Maven to $installDir ..."
if (-not (Test-Path $installDir)) { New-Item -ItemType Directory -Path $installDir | Out-Null }
Expand-Archive -Path "$env:TEMP\mvn.zip" -DestinationPath $installDir -Force
Remove-Item "$env:TEMP\mvn.zip" -Force

$mvnPath = "$installDir\apache-maven-3.9.9\bin"
Write-Host "Maven installed at: $mvnPath"

# Persist to user PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*apache-maven*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$mvnPath", "User")
    Write-Host "Maven added to PATH."
}

Write-Host "`nAll tools installed! Restart your terminal and run:"
Write-Host "  java -version"
Write-Host "  mvn -version"
