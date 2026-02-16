# Run WTP app locally (PowerShell)
# Usage: .\run-local.ps1
# Keeps both servers in same window; for separate windows use RUN_LOCAL.md

$root = $PSScriptRoot
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

if (-not (Test-Path (Join-Path $backend "node_modules"))) {
    Write-Host "Installing backend dependencies..."
    Set-Location $backend
    npm install
    Set-Location $root
}
if (-not (Test-Path (Join-Path $frontend "node_modules"))) {
    Write-Host "Installing frontend dependencies..."
    Set-Location $frontend
    npm install
    Set-Location $root
}

Write-Host "Starting backend on http://localhost:5000 ..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backend'; npm run dev"
Start-Sleep -Seconds 3
Write-Host "Starting frontend on http://localhost:5173 ..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontend'; npm run dev"
Write-Host "Open in browser: http://localhost:5173"
