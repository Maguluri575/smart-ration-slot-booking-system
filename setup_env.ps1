# Environment Setup Script for Smart Ration Slot Booking & PDS Management System
# Downloads local portable Node.js, installs dependencies, and prepares Python libraries.

$ErrorActionPreference = "Stop"

# Define paths
$workDir = "C:\Users\venky\OneDrive\Documents\Smart Ration Slot Booking System"
$nodeBinDir = Join-Path $workDir ".node-bin"
$zipFile = Join-Path $workDir "node_portable.zip"
$tempExtractDir = Join-Path $workDir "node_temp"

Write-Output "=== Starting Environment Setup ==="

# 1. Setup local Node.js if not present
if (-not (Test-Path (Join-Path $nodeBinDir "node.exe"))) {
    Write-Output "Node.js not detected in $nodeBinDir."
    Write-Output "Downloading Node.js v20.11.1 portable..."
    
    # Enable TLS 1.2
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
    
    # Download zip using WebClient (faster than Invoke-WebRequest)
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile("https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip", $zipFile)
    
    Write-Output "Extracting Node.js archive..."
    if (Test-Path $tempExtractDir) { Remove-Item $tempExtractDir -Recurse -Force }
    New-Item -ItemType Directory -Path $tempExtractDir | Out-Null
    
    Expand-Archive -Path $zipFile -DestinationPath $tempExtractDir
    
    Write-Output "Configuring local directories..."
    if (-not (Test-Path $nodeBinDir)) { New-Item -ItemType Directory -Path $nodeBinDir | Out-Null }
    
    # Copy files from extracted subdir to .node-bin
    $extractedFolder = Get-ChildItem $tempExtractDir | Select-Object -First 1
    Copy-Item -Path "$($extractedFolder.FullName)\*" -Destination $nodeBinDir -Recurse -Force
    
    # Clean up
    Remove-Item $zipFile -Force
    Remove-Item $tempExtractDir -Recurse -Force
    Write-Output "Node.js successfully configured at: $(Join-Path $nodeBinDir 'node.exe')"
} else {
    Write-Output "Local portable Node.js already configured at: $(Join-Path $nodeBinDir 'node.exe')"
}

# Add local node-bin path to current shell environment path for setup tasks
$env:PATH = "$nodeBinDir;" + $env:PATH

# Verify node and npm
$nodeVersion = & (Join-Path $nodeBinDir "node.exe") -v
$npmVersion = & (Join-Path $nodeBinDir "npm.cmd") -v
Write-Output "Node version: $nodeVersion"
Write-Output "Npm version: $npmVersion"

# 2. Install Python dependencies
Write-Output "=== Configuring Python Environment ==="
Write-Output "Installing Flask, Flask-CORS, Scikit-Learn, Joblib, Pandas, Numpy..."

python -m pip install flask flask-cors scikit-learn joblib pandas numpy --quiet

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Python pip installation finished with exit code: $LASTEXITCODE. Verify packages manually if needed."
} else {
    Write-Output "Python packages successfully installed!"
}

# 3. Create folders for Backend, ML Service, and Frontend
Write-Output "=== Creating Project Subdirectories ==="
$dirs = @("backend", "ml_service", "frontend")
foreach ($dir in $dirs) {
    $path = Join-Path $workDir $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
        Write-Output "Created directory: $dir"
    }
}

Write-Output "=== Environment Setup Complete! ==="
