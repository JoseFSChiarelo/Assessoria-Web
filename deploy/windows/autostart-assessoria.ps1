$ErrorActionPreference = "Stop"

$stateDir = Join-Path $env:LOCALAPPDATA "AssessoriaWeb"
$logDir = Join-Path $stateDir "logs"
$pidFile = Join-Path $stateDir "cloudflared-manual.pid"
$logFile = Join-Path $logDir "autostart.log"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

function Write-Log {
  param([string]$Message)
  Add-Content -Path $logFile -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
}

try {
  $pm2Path = (Get-Command pm2.exe -ErrorAction SilentlyContinue).Source
  if (-not $pm2Path) {
    throw "pm2.exe nao encontrado no PATH."
  }

  & $pm2Path resurrect | Out-Null
  Write-Log "PM2 resurrect executado."
} catch {
  Write-Log "Falha ao restaurar PM2: $($_.Exception.Message)"
}

try {
  $existingPid = $null
  if (Test-Path $pidFile) {
    $rawPid = Get-Content -Path $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($rawPid -match "^\d+$") {
      $existingPid = [int]$rawPid
    }
  }

  $alreadyRunning = $false
  if ($existingPid) {
    $proc = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq "cloudflared") {
      $alreadyRunning = $true
    }
  }

  if (-not $alreadyRunning) {
    $service = Get-CimInstance Win32_Service -Filter "Name='Cloudflared'"
    if (-not $service) {
      throw "Servico Cloudflared nao encontrado."
    }

    $tokenMatch = [regex]::Match($service.PathName, "--token\s+([^\s""]+)")
    if (-not $tokenMatch.Success) {
      throw "Token do Cloudflared nao encontrado no servico."
    }

    $token = $tokenMatch.Groups[1].Value
    $cloudflaredPath = (Get-Command cloudflared.exe -ErrorAction SilentlyContinue).Source
    if (-not $cloudflaredPath) {
      $cloudflaredPath = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
    }

    $started = Start-Process -FilePath $cloudflaredPath -ArgumentList @("tunnel", "run", "--token", $token) -WindowStyle Hidden -PassThru
    Set-Content -Path $pidFile -Value $started.Id
    Write-Log "Cloudflared manual iniciado. PID=$($started.Id)."
  } else {
    Write-Log "Cloudflared manual ja estava ativo. PID=$existingPid."
  }
} catch {
  Write-Log "Falha ao iniciar cloudflared manual: $($_.Exception.Message)"
}
