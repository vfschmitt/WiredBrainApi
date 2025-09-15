<#!
Usage examples:
  ./run-dev.ps1               # Start API (http://localhost:5154) + React client (http://localhost:5173)
  ./run-dev.ps1 -InstallClient # Force npm install before starting
  ./run-dev.ps1 -NoBrowser     # Do not auto-open the browser

Stops: Press Enter in this window to stop both processes.
#>
[CmdletBinding()]
param(
  [switch]$InstallClient,
  [switch]$NoBrowser,
  [int]$ApiPort = 5154,
  [int]$ClientPort = 5173
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg){ Write-Host "[info ] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[warn ] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[error] $msg" -ForegroundColor Red }

$root = $PSScriptRoot
$apiProj = Join-Path $root 'WiredBrainApi.Web/WiredBrainApi.Web.csproj'
$clientDir = Join-Path $root 'wiredbrain-client'

if (-not (Test-Path $apiProj)) { Write-Err "API project not found at $apiProj"; exit 1 }
if (-not (Test-Path $clientDir)) { Write-Err "Client directory not found at $clientDir"; exit 1 }

# Basic tool checks
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) { Write-Err 'dotnet SDK not found in PATH'; exit 1 }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-Err 'npm (Node.js) not found in PATH'; exit 1 }

# Optionally install client dependencies
$nodeModules = Join-Path $clientDir 'node_modules'
if ($InstallClient -or -not (Test-Path $nodeModules)) {
  Write-Info 'Installing client dependencies (npm install)...'
  pushd $clientDir
  npm install | Write-Host
  popd
}

# Start API
Write-Info "Starting API (port $ApiPort)..."
$apiArgs = "run --project `"$apiProj`""
$apiProcess = Start-Process -FilePath dotnet -ArgumentList $apiArgs -WorkingDirectory $root -PassThru -WindowStyle Minimized

# Start Client
Write-Info "Starting React client (port $ClientPort)..."
$clientArgs = "run dev"  # Port is configured in vite.config.ts
$clientProcess = Start-Process -FilePath npm -ArgumentList $clientArgs -WorkingDirectory $clientDir -PassThru -WindowStyle Minimized

Write-Info "Launched API PID=$($apiProcess.Id), Client PID=$($clientProcess.Id)"

# Simple wait / warm-up loop for client (optional)
$clientUrl = "http://localhost:$ClientPort"
if (-not $NoBrowser) {
  Write-Info 'Waiting for client to respond...'
  $maxWait = 30
  for ($i=0; $i -lt $maxWait; $i++) {
    try {
      $resp = Invoke-WebRequest -Uri $clientUrl -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
      if ($resp.StatusCode -ge 200) { break }
    } catch { Start-Sleep -Milliseconds 800 }
  }
  Write-Info "Opening $clientUrl in default browser"
  Start-Process $clientUrl | Out-Null
}

Write-Host ''
Write-Info 'Press ENTER to stop both processes.'
[void][Console]::ReadLine()

Write-Info 'Stopping processes...'
foreach ($p in @($clientProcess, $apiProcess)) { if ($p -and -not $p.HasExited) { try { $p.Kill(); Write-Info "Stopped PID $($p.Id)" } catch { Write-Warn "Failed stopping PID $($p.Id): $_" } } }
Write-Info 'Done.'
