$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

# Microsoft OpenJDK 21 (more reliable download)
$jdkUrl = "https://aka.ms/download-jdk/microsoft-jdk-21.0.7-windows-x64.zip"
$mvnUrl = "https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"

Write-Host "Downloading Microsoft OpenJDK 21..."
curl.exe -L -o "jdk.zip" $jdkUrl --retry 3 --retry-delay 5

Write-Host "Extracting JDK 21..."
Expand-Archive -Path "jdk.zip" -DestinationPath "." -Force

# Find extracted folder (name may vary)
$jdkFolder = Get-ChildItem -Directory | Where-Object { $_.Name -like "jdk-21*" -or $_.Name -like "microsoft-jdk*" } | Select-Object -First 1
if ($jdkFolder) {
    Rename-Item -Path $jdkFolder.FullName -NewName "jdk-21" -Force
}
Remove-Item "jdk.zip" -Force

Write-Host "Downloading Apache Maven 3.9.9..."
curl.exe -L -o "mvn.zip" $mvnUrl --retry 3 --retry-delay 5

Write-Host "Extracting Maven..."
Expand-Archive -Path "mvn.zip" -DestinationPath "." -Force
$mvnFolder = Get-ChildItem -Directory | Where-Object { $_.Name -like "apache-maven*" } | Select-Object -First 1
if ($mvnFolder) {
    Rename-Item -Path $mvnFolder.FullName -NewName "maven" -Force
}
Remove-Item "mvn.zip" -Force

$javaExe = ".\jdk-21\bin\java.exe"
if (Test-Path $javaExe) {
    Write-Host "SUCCESS! Java version:"
    & $javaExe -version
} else {
    Write-Host "ERROR: Java not found after extraction."
}

Write-Host "Setup complete!"
